import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Starter catalog carried over from the original landing page copy —
// edit freely in the admin panel once signed in, or edit this file and
// re-run `npm run db:seed` before launch.
const items = [
  {
    slug: "va-rt3",
    name: "VA-RT3",
    description:
      "Multi-strength research blend. Batch-specific COA included. For laboratory research use only.",
    note: "Blend • multi-strength",
    priceCents: 10000,
  },
  {
    slug: "wolverine-bpc-157-tb-500",
    name: "Wolverine — BPC-157 / TB-500",
    description:
      "Recovery-focused research blend combining BPC-157 and TB-500. For laboratory research use only.",
    note: "Recovery research blend",
    priceCents: 5000,
  },
  {
    slug: "mots-c",
    name: "MOTS-C",
    description:
      "Mitochondrial-derived peptide for laboratory research. Batch-specific COA included.",
    note: "Mitochondrial-derived peptide",
    priceCents: 5500,
  },
  {
    slug: "bpc-157-10mg",
    name: "BPC-157 10MG",
    description: "Single vial, 10 mg. Batch-specific COA included. For laboratory research use only.",
    note: "Single vial • 10 mg",
    priceCents: 6000,
  },
  {
    slug: "glow-combined-formulation",
    name: "GLOW Combined Formulation",
    description: "Multi-peptide research kit. Batch-specific COA included.",
    note: "Multi-peptide research kit",
    priceCents: 12000,
  },
  {
    slug: "tesamorelin-tesa-variants",
    name: "Tesamorelin — Tesa Variants",
    description: "Growth-factor research series. Batch-specific COA included.",
    note: "Growth-factor research series",
    priceCents: 5500,
  },
];

async function main() {
  for (const item of items) {
    await prisma.item.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }
  console.log(`Seeded ${items.length} items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
