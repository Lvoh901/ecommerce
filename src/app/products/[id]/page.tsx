import { prisma } from "@/lib/db";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!product) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <ProductDetailsClient product={product} />
      <Footer />
    </div>
  );
}
