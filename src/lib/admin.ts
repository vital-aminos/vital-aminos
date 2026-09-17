import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Use in server components/actions that must only run for signed-in users. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return session.user;
}

/** Use in server components/actions that must only run for admins. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.isAdmin) redirect("/");
  return session.user;
}
