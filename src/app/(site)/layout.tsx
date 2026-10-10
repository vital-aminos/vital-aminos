import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Everything in this group requires a signed-in user. This is the real,
// session-validated check; proxy.ts only does a cheap cookie-presence redirect.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return <>{children}</>;
}
