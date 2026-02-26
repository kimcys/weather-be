import { PrismaClient } from "@prisma/client";
import locations from "./seed-data/locations.json";

const prisma = new PrismaClient();

type LocationRow = {
  name: string;
  lat: number;
  lng: number;
  type?: string | null;
};

async function main() {
  const data = (locations as LocationRow[]).map((l) => ({
    name: String(l.name).trim(),
    lat: Number(l.lat),
    lng: Number(l.lng),
    type: l.type ?? null,
  }));

  const result = await prisma.location.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Seeded. Inserted: ${result.count}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });