import ManageItems from "./Manage";
import { getProducts } from "@/lib/fetch";

export default async function ManageItemsPage() {
  const items = await getProducts();
  return <ManageItems items={items} />;
}
