import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';
import { ILike, Repository } from 'typeorm';
import { QueryLocationDto } from './dto/query-location.dto';

@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(LocationEntity)
    private readonly repo: Repository<LocationEntity>,
  ) { }

  async create(dto: CreateLocationDto): Promise<LocationEntity> {
    const entity = this.repo.create({
      name: dto.name.trim(),
      lat: dto.lat,
      lng: dto.lng,
      type: dto.type ?? null,
    });
    return this.repo.save(entity);
  }

  async findAll(query: QueryLocationDto): Promise<{ items: LocationEntity[]; total: number }> {
    const type = (query.type ?? 'all') as any;
    const limit = query.limit ?? 100;
    const offset = query.offset ?? 0;
    const q = (query.q ?? '').trim();

    const where: any = {};
    if (type !== 'all') where.type = type;
    if (q) where.name = ILike(`%${q}%`);
    const [items, total] = await this.repo.findAndCount({
      where,
      order: { name: 'ASC' },
      take: limit,
      skip: offset,
    });

    return { items, total };
  }

  async findOne(id: string): Promise<LocationEntity> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Location not found: ${id}`);
    return entity;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<LocationEntity> {
    const entity = await this.findOne(id);

    if (dto.name !== undefined) entity.name = dto.name.trim();
    if (dto.lat !== undefined) entity.lat = dto.lat;
    if (dto.lng !== undefined) entity.lng = dto.lng;
    if (dto.type !== undefined) entity.type = dto.type ?? null;

    return this.repo.save(entity);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { deleted: true };
  }

  async findOneByNameFuzzy(name: string): Promise<LocationEntity> {
    const input = (name ?? '').trim();
    if (!input) throw new NotFoundException('Name is required');

    const exact = await this.repo.findOne({ where: { name: input } });
    if (exact) return exact;

    const ci = await this.repo.findOne({ where: { name: ILike(input) } });
    if (ci) return ci;

    const partial = await this.repo.findOne({ where: { name: ILike(`%${input}%`) } });
    if (partial) return partial;

    throw new NotFoundException(`Location not found for name: ${input}`);
  }
}
