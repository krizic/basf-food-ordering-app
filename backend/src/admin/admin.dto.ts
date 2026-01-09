import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuOptionChoiceDto {
  @ApiProperty({ description: 'Choice name', example: 'Extra Cheese' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price adjustment for this choice', example: 1.50 })
  @IsNumber()
  priceDelta: number;
}

export class CreateMenuOptionDto {
  @ApiProperty({ description: 'Option name', example: 'Toppings' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Available choices for this option', type: [MenuOptionChoiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuOptionChoiceDto)
  choices: MenuOptionChoiceDto[];

  @ApiPropertyOptional({ description: 'Whether this option is required', default: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Maximum number of choices allowed', example: 3 })
  @IsOptional()
  @IsNumber()
  maxChoices?: number;
}

export class CreateMenuItemDto {
  @ApiProperty({ description: 'Menu item name', example: 'Margherita Pizza' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Item description', example: 'Classic pizza with tomato sauce and mozzarella' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Item price', minimum: 0, example: 12.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Menu category', example: 'Pizza' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ description: 'URL to item image', example: 'https://example.com/pizza.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Whether item is available for ordering', default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Customization options for this item', type: [CreateMenuOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuOptionDto)
  options?: CreateMenuOptionDto[];
}

export class UpdateMenuItemDto {
  @ApiPropertyOptional({ description: 'Menu item name', example: 'Margherita Pizza' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Item description', example: 'Classic pizza with tomato sauce and mozzarella' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Item price', minimum: 0, example: 12.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Menu category', example: 'Pizza' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'URL to item image', example: 'https://example.com/pizza.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Whether item is available for ordering', default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
