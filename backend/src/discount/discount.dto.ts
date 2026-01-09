import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateDiscountDto {
  @ApiProperty({ description: 'Discount code to validate', example: 'SAVE10' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Order subtotal to check minimum order value', example: 25.99 })
  @IsNumber()
  @Min(0)
  subtotal: number;
}

export class DiscountValidationResponse {
  @ApiProperty({ description: 'Whether the discount code is valid' })
  valid: boolean;

  @ApiPropertyOptional({ description: 'Error message if invalid' })
  message?: string;

  @ApiPropertyOptional({ description: 'Discount type: percentage or fixed' })
  discountType?: string;

  @ApiPropertyOptional({ description: 'Discount value' })
  discountValue?: number;

  @ApiPropertyOptional({ description: 'Calculated discount amount' })
  discountAmount?: number;

  @ApiPropertyOptional({ description: 'Discount code description' })
  description?: string;
}
