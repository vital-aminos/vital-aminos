import { prisma } from "@/lib/prisma";
import { markMessageRead } from "@/actions/contact";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div>
      <h1 className="text-[1.6rem] mb-6">Contact messages</h1>
      {messages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className={`bg-panel border rounded-2xl p-5 ${m.read ? "border-line opacity-70" : "border-accent/40"}`}
            >
              <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                <div>
                  <span className="font-semibold">{m.name}</span>{" "}
                  <a href={`mailto:${m.email}`} className="text-accent text-[0.85rem]">
                    {m.email}
                  </a>
                </div>
                <span className="text-muted text-[0.78rem]">{m.createdAt.toLocaleString("en-US")}</span>
              </div>
              <p className="text-muted whitespace-pre-line text-[0.92rem] mb-3">{m.message}</p>
              <form action={markMessageRead.bind(null, m.id, !m.read)}>
                <button type="submit" className="text-[0.8rem] text-muted hover:text-accent">
                  Mark as {m.read ? "unread" : "read"}
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
