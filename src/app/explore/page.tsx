import { getProducts } from "@/lib/fetch";
import Explore from "./Explore";

export default async function ExplorePage() {
  const products = await getProducts();
  return <Explore products={products} />;
}
