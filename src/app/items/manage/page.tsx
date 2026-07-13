import { auth } from "@/lib/auth";
import ManageItems from "./Manage";
import { getMyProducts } from "@/lib/fetch";
import { headers } from "next/headers";

export default async function ManageItemsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  const items = user?.email ? await getMyProducts(user.email) : [];

  return <ManageItems items={items} />;
}
