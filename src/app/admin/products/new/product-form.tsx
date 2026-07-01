"use client";

import React, { useState, useTransition, useActionState } from "react";
import { createProduct } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

export default function ProductForm({ categories }: { categories: Category[] }) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [state, formAction, isPending] = useActionState(createProduct, null);
  const [wholesaleEnabled, setWholesaleEnabled] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          alert(`Upload failed: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        setImages((prev) => [...prev, publicUrl]);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    setUploading(false);
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Hidden input to pass image array to server action */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Product Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  required
                  className="border-zinc-200/80 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Tell your customers about this product..."
                  className="flex w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-350"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Uploader */}
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* Upload Trigger Box */}
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900/50">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <span className="mt-1 text-xs text-zinc-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {/* Previews */}
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative h-24 rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Upload preview ${idx}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-zinc-900/80 p-1 text-white opacity-0 transition-opacity hover:bg-zinc-950 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {uploading && (
                  <div className="flex h-24 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Price, Stock, Category, Featured */}
        <div className="space-y-6">
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Inventory & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (in INR - ₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  className="border-zinc-200/80 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  className="border-zinc-200/80 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  className="flex h-9 w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
                >
                  <option value="" disabled selected>
                    Select category...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-zinc-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  value="true"
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 dark:border-zinc-700 dark:text-zinc-50"
                />
                <Label htmlFor="isFeatured" className="text-sm font-normal">
                  Feature this product on homepage
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Wholesale Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isWholesaleEnabled"
                  checked={wholesaleEnabled}
                  onChange={(e) => setWholesaleEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 dark:border-zinc-700 dark:text-zinc-50"
                />
                <Label htmlFor="isWholesaleEnabled" className="text-sm font-normal">
                  Enable Wholesale Pricing
                </Label>
              </div>

              {wholesaleEnabled && (
                <div className="space-y-4 border-t border-zinc-150 pt-4 dark:border-zinc-800">
                  <div className="space-y-2">
                    <Label htmlFor="wholesalePrice">Wholesale Price (per pc in INR - ₹)</Label>
                    <Input
                      id="wholesalePrice"
                      name="wholesalePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                      className="border-zinc-200/80 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                    <Input
                      id="moq"
                      name="moq"
                      type="number"
                      min="1"
                      placeholder="10"
                      required
                      className="border-zinc-200/80 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isPending || uploading}
              className="flex-1 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isPending ? "Saving..." : "Save Product"}
            </Button>
            <Link
              href="/admin/products"
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium hover:bg-muted hover:text-foreground transition-all"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
