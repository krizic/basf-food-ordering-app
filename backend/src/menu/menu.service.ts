import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  private parseMenuItemOptions(item: any) {
    if (!item) return item;
    return {
      ...item,
      options: item.options?.map((option: any) => ({
        ...option,
        choices: typeof option.choices === 'string' 
          ? JSON.parse(option.choices) 
          : option.choices,
      })),
    };
  }

  private parseMenuItems(items: any[]) {
    return items.map(item => this.parseMenuItemOptions(item));
  }

  async getMenu(category?: string) {
    const where = category ? { category, isAvailable: true } : { isAvailable: true };
    
    const items = await this.prisma.menuItem.findMany({
      where,
      include: { options: true },
      orderBy: { category: 'asc' },
    });

    const categories = [...new Set(items.map(item => item.category))];
    
    return { categories, items: this.parseMenuItems(items) };
  }

  async getCategories() {
    const items = await this.prisma.menuItem.findMany({
      where: { isAvailable: true },
      select: { category: true },
      distinct: ['category'],
    });
    return items.map(item => item.category);
  }

  async getMenuItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { options: true },
    });
    return this.parseMenuItemOptions(item);
  }

  async searchMenu(query: string) {
    if (!query) return { items: [] };
    
    const items = await this.prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
        ],
      },
      include: { options: true },
    });
    
    return { items: this.parseMenuItems(items) };
  }
}
