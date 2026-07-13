import { getProducts } from "@/lib/fetch";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProducts(id);

  if (!product || product.message) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 font-medium">Product not found.</p>
      </div>
    );
  }

  return <CheckoutClient product={product} />;
}
