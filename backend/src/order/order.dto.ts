import { IsString, IsEmail, IsOptional, IsArray, ValidateNested, IsNumber, Min, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeliveryAddressDto {
  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City name', example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Postal/ZIP code', example: '10001' })
  @IsString()
  postalCode: string;

  @ApiPropertyOptional({ description: 'Delivery instructions', example: 'Leave at door' })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CustomerDto {
  @ApiPropertyOptional({ description: 'Customer email address', example: 'customer@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Customer phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class OrderItemDto {
  @ApiProperty({ description: 'Menu item ID', example: 'clx123abc' })
  @IsString()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity of items', minimum: 1, example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Item customizations', example: { spiceLevel: 'medium', extraToppings: ['cheese'] } })
  @IsOptional()
  @IsObject()
  customizations?: Record<string, any>;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer contact information', type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ description: 'Delivery address details', type: DeliveryAddressDto })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiProperty({ description: 'List of items to order', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ description: 'Special instructions for the order', example: 'No onions please' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ description: 'Discount code to apply', example: 'SAVE10' })
  @IsOptional()
  @IsString()
  discountCode?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    description: 'New order status', 
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    example: 'CONFIRMED'
  })
  @IsString()
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
}
