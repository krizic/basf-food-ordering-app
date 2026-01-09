import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get menu items', description: 'Retrieve all menu items, optionally filtered by category' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category name' })
  @ApiResponse({ status: 200, description: 'List of menu items returned successfully' })
  async getMenu(@Query('category') category?: string) {
    return this.menuService.getMenu(category);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories', description: 'Retrieve list of all available menu categories' })
  @ApiResponse({ status: 200, description: 'List of categories returned successfully' })
  async getCategories() {
    return this.menuService.getCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search menu items', description: 'Search menu items by name or description' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query string' })
  @ApiResponse({ status: 200, description: 'Search results returned successfully' })
  async searchMenu(@Query('q') query: string) {
    return this.menuService.searchMenu(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID', description: 'Retrieve a single menu item by its ID' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiResponse({ status: 200, description: 'Menu item returned successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async getMenuItem(@Param('id') id: string) {
    return this.menuService.getMenuItem(id);
  }
}
