import Link from "next/link";
import { getMyOrders } from "@/actions/orders";
import { formatCents } from "@/lib/money";

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

export default async function OrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="max-w-[800px] mx-auto px-6 py-14 md:py-20">
      <h1 className="text-[1.9rem] mb-8">My orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/#shop" className="text-accent hover:underline">
            Browse products →
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-panel border border-line rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Order #{order.id.slice(-8)}</span>
                <span className="text-[0.78rem] font-semibold text-accent border border-line-strong bg-accent-soft rounded-full px-3 py-1">
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-muted text-[0.82rem] mb-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul className="text-[0.9rem] text-muted mb-3">
                {order.items.map((oi) => (
                  <li key={oi.id}>
                    {oi.quantity}× {oi.item.name} — {formatCents(oi.priceCents * oi.quantity)}
                  </li>
                ))}
              </ul>
              <div className="text-right font-semibold text-accent">{formatCents(order.totalCents)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
