import BannerForm from "@/components/admin/BannerForm";
import { getBannerText } from "@/lib/settings";

export default async function AdminBannerPage() {
  const text = await getBannerText();
  return (
    <div>
      <h1 className="text-[1.6rem] mb-1">Top banner</h1>
      <p className="text-muted text-[0.9rem] mb-8">
        The message shown in the bar at the very top of every page.
      </p>
      <BannerForm text={text} />
    </div>
  );
}
