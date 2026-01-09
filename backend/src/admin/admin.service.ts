import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './admin.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createMenuItem(dto: CreateMenuItemDto) {
    const { options, ...itemData } = dto;
    
    return this.prisma.menuItem.create({
      data: {
        ...itemData,
        price: new Decimal(dto.price),
        options: options ? {
          create: options.map(opt => ({
            name: opt.name,
            choices: JSON.stringify(opt.choices),
            isRequired: opt.isRequired ?? false,
            maxChoices: opt.maxChoices,
          })),
        } : undefined,
      },
      include: { options: true },
    });
  }

  async updateMenuItem(id: string, dto: UpdateMenuItemDto) {
    const existing = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...dto,
        price: dto.price !== undefined ? new Decimal(dto.price) : undefined,
      },
      include: { options: true },
    });
  }

  async deleteMenuItem(id: string) {
    const existing = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Menu item not found');
    }

    // Soft delete by marking as unavailable
    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false },
    });
  }

  async getOrders(status?: string, page: number = 1, limit: number = 20) {
    const where = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: { include: { menuItem: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => ({
        ...order,
        deliveryAddress: JSON.parse(order.deliveryAddress),
        items: order.items.map(item => ({
          ...item,
          customizations: JSON.parse(item.customizations),
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async getAnalyticsSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, totalRevenue, ordersByStatus] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    return {
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
