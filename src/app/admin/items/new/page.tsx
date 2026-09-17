import { createItem } from "@/actions/items";
import ItemForm from "@/components/admin/ItemForm";

export default function NewItemPage() {
  return (
    <div>
      <h1 className="text-[1.6rem] mb-6">Add item</h1>
      <ItemForm action={createItem} submitLabel="Create item" />
    </div>
  );
}
