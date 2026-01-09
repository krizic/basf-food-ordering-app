import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './admin.dto';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Menu Item Management
  @Post('menu-items')
  @ApiOperation({ summary: 'Create menu item', description: 'Add a new item to the menu' })
  @ApiBody({ type: CreateMenuItemDto })
  @ApiResponse({ status: 201, description: 'Menu item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid menu item data' })
  async createMenuItem(@Body() dto: CreateMenuItemDto) {
    return this.adminService.createMenuItem(dto);
  }

  @Put('menu-items/:id')
  @ApiOperation({ summary: 'Update menu item', description: 'Update an existing menu item' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiBody({ type: UpdateMenuItemDto })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async updateMenuItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.adminService.updateMenuItem(id, dto);
  }

  @Delete('menu-items/:id')
  @ApiOperation({ summary: 'Delete menu item', description: 'Remove a menu item' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async deleteMenuItem(@Param('id') id: string) {
    return this.adminService.deleteMenuItem(id);
  }

  // Order Management
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders', description: 'Retrieve orders with optional filtering and pagination' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ status: 200, description: 'Orders returned successfully' })
  async getOrders(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getOrders(status, Number(page) || 1, Number(limit) || 20);
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Update order status', description: 'Change the status of an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateOrderStatus(id, status);
  }

  // Analytics
  @Get('analytics/summary')
  @ApiOperation({ summary: 'Get analytics summary', description: 'Retrieve summary analytics for orders and revenue' })
  @ApiResponse({ status: 200, description: 'Analytics summary returned successfully' })
  async getAnalyticsSummary() {
    return this.adminService.getAnalyticsSummary();
  }
}
