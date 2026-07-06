import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";
import AddToCartButton from "./add-to-cart-button";
import ProductGallery from "./product-gallery";
import VariantSelector from "./variant-selector";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — OFF-REP`,
    description: product.description || `Shop ${product.name} at OFF-REP`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      stock: { gt: 0 },
    },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-50">{product.name}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Images — replaced with interactive gallery */}
          <ProductGallery
            initialImages={product.images}
            colors={(product.colors as any[]) ?? []}
            productName={product.name}
            isFeatured={product.isFeatured}
          />

          {/* Product Info */}
          <div className="flex flex-col py-2">
            <div>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-xs font-medium uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {product.category.name}
              </Link>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {product.stock > 10 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In Stock
                  </span>
                ) : product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                  Description
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants — Color & Size */}
            {((product.colors as any[])?.length > 0 || (product.sizes as string[])?.length > 0) && (
              <div className="mt-8">
                <VariantSelector
                  colors={(product.colors as any[]) ?? []}
                  sizes={(product.sizes as string[]) ?? []}
                  sizeChartUrl={product.sizeChart}
                />
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : null,
                  moq: product.moq,
                  images: product.images,
                  stock: product.stock,
                }}
              />
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Shield, label: "Secure Pay" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-100 p-3 text-center dark:border-zinc-800"
                >
                  <badge.icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-100 bg-zinc-50 py-20 dark:border-zinc-800/50 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              You may also like
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/product/${relProduct.slug}`}
                  className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {relProduct.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={relProduct.images[0]}
                        alt={relProduct.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-600">
                        <Sparkles className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {relProduct.category.name}
                    </p>
                    <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {relProduct.name}
                    </h3>
                    <p className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
                      ₹{Number(relProduct.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
