import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { ValidateDiscountDto, DiscountValidationResponse } from './discount.dto';

@ApiTags('discounts')
@Controller('api/discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate discount code', description: 'Check if a discount code is valid and calculate the discount amount' })
  @ApiBody({ type: ValidateDiscountDto })
  @ApiResponse({ status: 200, description: 'Discount validation result', type: DiscountValidationResponse })
  async validateDiscount(@Body() dto: ValidateDiscountDto): Promise<DiscountValidationResponse> {
    return this.discountService.validateDiscount(dto.code, dto.subtotal);
  }
}
