import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) redirect(callbackUrl || "/");

  return (
    <div className="max-w-[440px] mx-auto px-6 py-20 md:py-28 text-center">
      <p className="inline-block uppercase tracking-[0.22em] text-[0.68rem] text-accent mb-3 font-bold">
        Research access
      </p>
      <h1 className="text-[1.9rem] mb-3">Sign in to Vital Aminos</h1>
      <p className="text-muted text-[0.95rem] mb-9">
        Sign in with Google to view pricing, place orders, and track your order history.
      </p>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl || "/" });
        }}
      >
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full font-semibold text-[0.95rem] border border-line-strong bg-white/[0.03] hover:border-accent hover:bg-accent-soft transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.07-1.67-.21-2.45H12v4.63h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.997 11.997 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11Z" />
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className="text-muted text-[0.78rem] mt-8">
        Access is limited to qualified researchers per our research use policy.
      </p>
    </div>
  );
}
