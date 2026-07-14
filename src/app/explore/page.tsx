import { getProducts } from "@/lib/fetch";
import Explore from "./Explore";
export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const products = await getProducts();
  return <Explore products={products} />;
}
