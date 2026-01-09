import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@ApiTags('orders')
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order', description: 'Submit a new food order with delivery details' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':orderNumber')
  @ApiOperation({ summary: 'Get order by order number', description: 'Retrieve order details using the order number' })
  @ApiParam({ name: 'orderNumber', description: 'Unique order number' })
  @ApiQuery({ name: 'email', required: false, description: 'Customer email for verification' })
  @ApiResponse({ status: 200, description: 'Order details returned successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(
    @Param('orderNumber') orderNumber: string,
    @Query('email') email?: string,
  ) {
    return this.orderService.getOrder(orderNumber, email);
  }
}
