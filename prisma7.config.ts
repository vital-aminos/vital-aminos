import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Used by `prisma migrate` / `prisma db push` (direct, non-pooled connection).
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
