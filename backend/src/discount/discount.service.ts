import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscountValidationResponse } from './discount.dto';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  async validateDiscount(code: string, subtotal: number): Promise<DiscountValidationResponse> {
    const discount = await this.prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    // Code doesn't exist
    if (!discount) {
      return {
        valid: false,
        message: 'Invalid discount code',
      };
    }

    // Code is not active
    if (!discount.isActive) {
      return {
        valid: false,
        message: 'This discount code is no longer active',
      };
    }

    // Code has expired
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return {
        valid: false,
        message: 'This discount code has expired',
      };
    }

    // Code has reached max uses
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return {
        valid: false,
        message: 'This discount code has reached its maximum usage limit',
      };
    }

    // Minimum order value not met
    if (discount.minOrderValue && subtotal < Number(discount.minOrderValue)) {
      return {
        valid: false,
        message: `Minimum order value of $${Number(discount.minOrderValue).toFixed(2)} required`,
      };
    }

    // Calculate discount amount
    let discountAmount: number;
    if (discount.discountType === 'percentage') {
      discountAmount = (subtotal * Number(discount.discountValue)) / 100;
    } else {
      discountAmount = Math.min(Number(discount.discountValue), subtotal);
    }

    return {
      valid: true,
      discountType: discount.discountType,
      discountValue: Number(discount.discountValue),
      discountAmount: Math.round(discountAmount * 100) / 100,
      description: discount.description || undefined,
    };
  }

  async useDiscount(code: string): Promise<void> {
    await this.prisma.discountCode.update({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } },
    });
  }
}
