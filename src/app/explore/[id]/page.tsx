import { getProductDetails } from "@/lib/fetch";
import ProductDetails from "./ProductDetails";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { id } = await params;
  const product = await getProductDetails(id);
  return (
    <div>
      <ProductDetails pet={product} />
    </div>
  );
};

export default ProductDetailsPage;
