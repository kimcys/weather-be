// src/seed.ts
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, DeepPartial } from 'typeorm';
import locations from './seed-data/locations.json';
import { LocationEntity, LocationType } from './locations/entities/location.entity';

const ds = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: [LocationEntity],
});

type LocationRow = { name: string; lat: number; lng: number; type?: string | null };

const isLocationTypeCode = (t: any): t is LocationType =>
    t === 'St' || t === 'Rc' || t === 'Ds' || t === 'Dv' || t === 'Tn';

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is missing. Put it in .env');
    }

    await ds.initialize();
    const repo = ds.getRepository(LocationEntity);

    const data: DeepPartial<LocationEntity>[] = (locations as LocationRow[]).map((l) => ({
        name: String(l.name).trim(),
        lat: Number(l.lat),
        lng: Number(l.lng),
        type: isLocationTypeCode(l.type) ? l.type : null,
    }));

    const chunkSize = 500;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await repo.upsert(chunk, ['name', 'type']);
        console.log(`Upserted ${Math.min(i + chunkSize, data.length)}/${data.length}`);
    }

    await ds.destroy();
    console.log('Seed done.');
}

main().catch(async (e) => {
    console.error(e);
    try {
        if (ds.isInitialized) await ds.destroy();
    } finally {
        process.exit(1);
    }
});