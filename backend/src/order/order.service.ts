import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscountService } from '../discount/discount.service';
import { CreateOrderDto } from './order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  private readonly TAX_RATE = 0.08;
  private readonly DELIVERY_FEE = 3.99;

  constructor(
    private prisma: PrismaService,
    private discountService: DiscountService,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(dto: CreateOrderDto) {
    if (!dto.customer.email && !dto.customer.phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    // Fetch menu items to calculate prices
    const menuItemIds = dto.items.map(item => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
      include: { options: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items are not available');
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = dto.items.map(orderItem => {
      const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId)!;
      let itemPrice = Number(menuItem.price);

      // Add customization price deltas
      if (orderItem.customizations && menuItem.options) {
        menuItem.options.forEach(option => {
          const choices = JSON.parse(option.choices);
          const selectedChoice = orderItem.customizations?.[option.name];
          if (selectedChoice && choices) {
            const choice = choices.find((c: any) => c.name === selectedChoice);
            if (choice?.priceDelta) {
              itemPrice += Number(choice.priceDelta);
            }
          }
        });
      }

      const totalPrice = itemPrice * orderItem.quantity;
      subtotal += totalPrice;

      return {
        menuItemId: orderItem.menuItemId,
        quantity: orderItem.quantity,
        unitPrice: new Decimal(itemPrice),
        totalPrice: new Decimal(totalPrice),
        customizations: JSON.stringify(orderItem.customizations || {}),
      };
    });

    const tax = subtotal * this.TAX_RATE;
    
    // Validate and apply discount if provided
    let discountAmount = 0;
    let appliedDiscountCode: string | null = null;
    
    if (dto.discountCode) {
      const discountResult = await this.discountService.validateDiscount(dto.discountCode, subtotal);
      if (discountResult.valid && discountResult.discountAmount) {
        discountAmount = discountResult.discountAmount;
        appliedDiscountCode = dto.discountCode.toUpperCase();
        // Increment usage count
        await this.discountService.useDiscount(dto.discountCode);
      }
    }
    
    const total = subtotal + tax + this.DELIVERY_FEE - discountAmount;

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        customerEmail: dto.customer.email,
        customerPhone: dto.customer.phone,
        deliveryAddress: JSON.stringify(dto.deliveryAddress),
        subtotal: new Decimal(subtotal),
        tax: new Decimal(tax),
        deliveryFee: new Decimal(this.DELIVERY_FEE),
        discount: new Decimal(discountAmount),
        discountCode: appliedDiscountCode,
        total: new Decimal(total),
        specialInstructions: dto.specialInstructions,
        items: {
          create: orderItems,
        },
      },
      include: { items: { include: { menuItem: true } } },
    });

    // Calculate estimated delivery time (30-45 mins from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 40);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      estimatedDelivery: estimatedDelivery.toISOString(),
    };
  }

  async getOrder(orderNumber: string, email?: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: { include: { menuItem: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Simple email verification if provided
    if (email && order.customerEmail && order.customerEmail !== email) {
      throw new NotFoundException('Order not found');
    }

    return {
      ...order,
      deliveryAddress: JSON.parse(order.deliveryAddress),
      items: order.items.map(item => ({
        ...item,
        customizations: JSON.parse(item.customizations),
      })),
    };
  }
}
