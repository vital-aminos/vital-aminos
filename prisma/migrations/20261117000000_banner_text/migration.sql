-- AlterTable: editable top-of-site banner text (existing rows keep the original copy)
ALTER TABLE "SiteSettings" ADD COLUMN "bannerText" TEXT NOT NULL DEFAULT 'Free shipping on orders $150+';
