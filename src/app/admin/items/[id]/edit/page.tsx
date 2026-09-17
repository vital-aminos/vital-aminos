import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateItem } from "@/actions/items";
import ItemForm from "@/components/admin/ItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  const boundUpdate = updateItem.bind(null, item.id);

  return (
    <div>
      <h1 className="text-[1.6rem] mb-6">Edit item</h1>
      <ItemForm
        action={boundUpdate}
        submitLabel="Save changes"
        initial={{
          name: item.name,
          slug: item.slug,
          description: item.description,
          note: item.note ?? "",
          price: (item.priceCents / 100).toFixed(2),
          imageUrl: item.imageUrl ?? "",
          active: item.active,
        }}
      />
    </div>
  );
}
