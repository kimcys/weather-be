import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryLocationDto } from './dto/query-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly svc: LocationsService) {}

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryLocationDto) {
    return this.svc.findAll(query);
  }
  @Get('by-name/:name')
  findByName(@Param('name') name: string) {
    return this.svc.findOneByNameFuzzy(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

}
