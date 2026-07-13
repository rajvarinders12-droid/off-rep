"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createProduct, updateProduct } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X, AlertCircle, Plus, Layers, Package, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

// A color variant holds its name, hex, and its own set of images
interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];

// ─── Shared uploader helper ───────────────────────────────────────────────────
async function uploadToSupabase(file: File): Promise<string | null> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `products/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (error) { alert(`Upload failed: ${error.message}`); return null; }
  return supabase.storage.from("product-images").getPublicUrl(fileName).data.publicUrl;
}

async function uploadSizeChart(file: File): Promise<string | null> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `size-charts/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (error) { alert(`Size chart upload failed: ${error.message}`); return null; }
  return supabase.storage.from("product-images").getPublicUrl(fileName).data.publicUrl;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductForm({ categories, initialData }: { categories: Category[]; initialData?: any }) {
  // Step 1: pick mode
  const [mode, setMode] = useState<"pick" | "simple" | "variants">(
    initialData 
      ? (initialData.colors?.length > 0 || initialData.sizes?.length > 0 ? "variants" : "simple")
      : "pick"
  );

  return (
    <div className="space-y-8">
      {mode === "pick" && <VariantPicker onSelect={setMode} />}
      {mode === "simple" && <SimpleForm categories={categories} onBack={() => setMode("pick")} initialData={initialData} />}
      {mode === "variants" && <VariantForm categories={categories} onBack={() => setMode("pick")} initialData={initialData} />}
    </div>
  );
}

// ─── Step 1: Pick form type ───────────────────────────────────────────────────
function VariantPicker({ onSelect }: { onSelect: (m: "simple" | "variants") => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Does this product have variants?</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Variants are different colours and sizes of the same product.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        {/* No variants */}
        <button
          type="button"
          onClick={() => onSelect("simple")}
          className="group flex flex-col items-center gap-4 rounded-xl border-2 border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-50"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-900 dark:bg-zinc-800 dark:group-hover:bg-zinc-50 transition-colors">
            <Package className="h-7 w-7 text-zinc-600 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">No, Simple Product</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">One image set, no colours or sizes.</p>
          </div>
        </button>

        {/* Has variants */}
        <button
          type="button"
          onClick={() => onSelect("variants")}
          className="group flex flex-col items-center gap-4 rounded-xl border-2 border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-50"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-900 dark:bg-zinc-800 dark:group-hover:bg-zinc-50 transition-colors">
            <Layers className="h-7 w-7 text-zinc-600 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Yes, Has Variants</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Multiple colours, each with their own images.</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Shared inventory / wholesale sidebar ─────────────────────────────────────
function InventorySidebar({
  categories,
  wholesaleEnabled,
  setWholesaleEnabled,
  onBack,
  isPending,
  uploading,
  initialData,
}: {
  categories: { id: string; name: string }[];
  wholesaleEnabled: boolean;
  setWholesaleEnabled: (v: boolean) => void;
  onBack: () => void;
  isPending: boolean;
  uploading: boolean;
  initialData?: any;
}) {
  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader><CardTitle>Inventory & Status</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="compareAtPrice">Actual Price (MRP) - ₹</Label>
            <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" min="0" placeholder="0.00" defaultValue={initialData?.compareAtPrice || ""} className="border-zinc-200/80 dark:border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Discounted Price (Selling Price) - ₹</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" defaultValue={initialData?.price || ""} required className="border-zinc-200/80 dark:border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input id="stock" name="stock" type="number" min="0" placeholder="0" defaultValue={initialData?.stock || ""} required className="border-zinc-200/80 dark:border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select id="categoryId" name="categoryId" defaultValue={initialData?.categoryId || ""}
              className="flex h-9 w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800">
              <option value="">No Category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id} className="text-zinc-900">{cat.name}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="isFeatured" name="isFeatured" value="true" defaultChecked={initialData?.isFeatured} className="h-4 w-4 rounded border-zinc-300" />
            <Label htmlFor="isFeatured" className="text-sm font-normal">Feature this product on homepage</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader><CardTitle>Wholesale Options</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isWholesaleEnabled" checked={wholesaleEnabled}
              onChange={(e) => setWholesaleEnabled(e.target.checked)} className="h-4 w-4 rounded border-zinc-300" />
            <Label htmlFor="isWholesaleEnabled" className="text-sm font-normal">Enable Wholesale Pricing</Label>
          </div>
          {wholesaleEnabled && (
            <div className="space-y-4 border-t pt-4 dark:border-zinc-800">
              <div className="space-y-2">
                <Label htmlFor="wholesalePrice">Wholesale Price (₹)</Label>
                <Input id="wholesalePrice" name="wholesalePrice" type="number" step="0.01" min="0" placeholder="0.00" defaultValue={initialData?.wholesalePrice || ""} required className="border-zinc-200/80 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moq">Minimum Order Quantity</Label>
                <Input id="moq" name="moq" type="number" min="1" placeholder="10" defaultValue={initialData?.moq || ""} required className="border-zinc-200/80 dark:border-zinc-800" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending || uploading}
          className="flex-1 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
          {isPending ? "Saving..." : "Save Product"}
        </Button>
        <button type="button" onClick={onBack}
          className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-2.5 h-9 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
          ← Back
        </button>
      </div>
    </div>
  );
}

// ─── Simple (no variants) form ────────────────────────────────────────────────
function SimpleForm({ categories, onBack, initialData }: { categories: Category[]; onBack: () => void; initialData?: any }) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [wholesaleEnabled, setWholesaleEnabled] = useState(!!initialData?.wholesalePrice);
  
  const action = initialData ? updateProduct.bind(null, initialData.id) : createProduct;
  const [state, formAction, isPending] = useActionState<any, FormData>(action as any, null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const url = await uploadToSupabase(file);
      if (url) setImages((prev) => [...prev, url]);
    }
    setUploading(false);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /><span>{state.error}</span>
        </div>
      )}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="colors" value="[]" />
      <input type="hidden" name="sizes" value="[]" />
      <input type="hidden" name="sizeChart" value="" />
      <input type="hidden" name="hasVariants" value="false" />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" type="text" placeholder="e.g. Classic Cotton T-Shirt" defaultValue={initialData?.name || ""} required className="border-zinc-200/80 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" name="description" rows={5} placeholder="Describe your product..." defaultValue={initialData?.description || ""}
                  className="flex w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (Optional)</Label>
                <textarea id="features" name="features" rows={4} placeholder="Key features, materials, care instructions..." defaultValue={initialData?.features || ""}
                  className="flex w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400" />
                <p className="text-xs text-zinc-500">Formatting is preserved. Use line breaks as needed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchKeywords">Search Keywords</Label>
                <Input id="searchKeywords" name="searchKeywords" type="text" placeholder="e.g. t-shirt, summer, oversize (comma separated)" defaultValue={initialData?.searchKeywords || ""} className="border-zinc-200/80 dark:border-zinc-800" />
                <p className="text-xs text-zinc-500">Keywords to help customers find this product in the search bar.</p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-950">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <span className="mt-1 text-xs text-zinc-500">Upload</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
                {images.map((url, idx) => (
                  <div key={idx} className="group relative h-24 rounded-md border border-zinc-100 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full rounded-md object-cover" />
                    <button type="button" onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                      className="absolute right-1.5 top-1.5 rounded-full bg-zinc-900/80 p-1 text-white opacity-0 group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {uploading && <div className="flex h-24 items-center justify-center rounded-md border border-zinc-100 dark:border-zinc-800"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>}
              </div>
            </CardContent>
          </Card>
        </div>

        <InventorySidebar categories={categories} wholesaleEnabled={wholesaleEnabled}
          setWholesaleEnabled={setWholesaleEnabled} onBack={onBack} isPending={isPending} uploading={uploading} initialData={initialData} />
      </div>
    </form>
  );
}

// ─── Variants form ────────────────────────────────────────────────────────────
function VariantForm({ categories, onBack, initialData }: { categories: Category[]; onBack: () => void; initialData?: any }) {
  const [colors, setColors] = useState<ColorVariant[]>(initialData?.colors || []);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
  const [sizeChart, setSizeChart] = useState(initialData?.sizeChart || "");
  const [uploadingSizeChart, setUploadingSizeChart] = useState(false);
  const [uploadingColorIdx, setUploadingColorIdx] = useState<number | null>(null);
  const [wholesaleEnabled, setWholesaleEnabled] = useState(!!initialData?.wholesalePrice);
  
  const action = initialData ? updateProduct.bind(null, initialData.id) : createProduct;
  const [state, formAction, isPending] = useActionState<any, FormData>(action as any, null);

  // Compute images: all images from all colors (first color's first image = cover)
  const allImages = colors.flatMap((c) => c.images);

  const addColor = () => {
    if (!newColorName.trim()) {
      alert("Please enter a colour name (e.g. Black, Red, etc.) before clicking Add Colour.");
      return;
    }
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex, images: [] }]);
    setNewColorName("");
    setNewColorHex("#000000");
  };

  const removeColor = (i: number) => setColors((prev) => prev.filter((_, idx) => idx !== i));

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorIdx: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingColorIdx(colorIdx);
    for (const file of Array.from(files)) {
      const url = await uploadToSupabase(file);
      if (url) {
        setColors((prev) => prev.map((c, i) => i === colorIdx ? { ...c, images: [...c.images, url] } : c));
      }
    }
    setUploadingColorIdx(null);
  };

  const removeColorImage = (colorIdx: number, imgIdx: number) => {
    setColors((prev) => prev.map((c, i) => i === colorIdx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c));
  };

  const handleSizeChartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSizeChart(true);
    const url = await uploadSizeChart(file);
    if (url) setSizeChart(url);
    setUploadingSizeChart(false);
  };

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

  const isUploading = uploadingColorIdx !== null || uploadingSizeChart;

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /><span>{state.error}</span>
        </div>
      )}
      <input type="hidden" name="images" value={JSON.stringify(allImages)} />
      <input type="hidden" name="colors" value={JSON.stringify(colors)} />
      <input type="hidden" name="sizes" value={JSON.stringify(selectedSizes)} />
      <input type="hidden" name="sizeChart" value={sizeChart} />
      <input type="hidden" name="hasVariants" value="true" />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">

          {/* Product Details */}
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" type="text" placeholder="e.g. Classic Cotton T-Shirt" defaultValue={initialData?.name || ""} required className="border-zinc-200/80 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" name="description" rows={4} placeholder="Describe your product..." defaultValue={initialData?.description || ""}
                  className="flex w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (Optional)</Label>
                <textarea id="features" name="features" rows={4} placeholder="Key features, materials, care instructions..." defaultValue={initialData?.features || ""}
                  className="flex w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400" />
                <p className="text-xs text-zinc-500">Formatting is preserved. Use line breaks as needed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchKeywords">Search Keywords</Label>
                <Input id="searchKeywords" name="searchKeywords" type="text" placeholder="e.g. t-shirt, summer, oversize (comma separated)" defaultValue={initialData?.searchKeywords || ""} className="border-zinc-200/80 dark:border-zinc-800" />
                <p className="text-xs text-zinc-500">Keywords to help customers find this product in the search bar.</p>
              </div>
            </CardContent>
          </Card>

          {/* Size Chart */}
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader><CardTitle>Size Chart <span className="text-sm font-normal text-zinc-400">(optional)</span></CardTitle></CardHeader>
            <CardContent>
              {sizeChart ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sizeChart} alt="Size chart" className="max-h-48 rounded-md border border-zinc-200 dark:border-zinc-700 object-contain" />
                  <button type="button" onClick={() => setSizeChart("")}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-950">
                  {uploadingSizeChart ? <Loader2 className="h-6 w-6 animate-spin text-zinc-400" /> : (
                    <><Upload className="h-6 w-6 text-zinc-400" /><span className="mt-2 text-sm text-zinc-500">Upload Size Chart Image</span></>
                  )}
                  <input type="file" accept="image/*" onChange={handleSizeChartUpload} disabled={uploadingSizeChart} className="hidden" />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader><CardTitle>Available Sizes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-zinc-500">Select all sizes this product comes in:</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => (
                  <button key={size} type="button" onClick={() => toggleSize(size)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors
                      ${selectedSizes.includes(size)
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}`}>
                    {size}
                  </button>
                ))}
              </div>
              {selectedSizes.length > 0 && <p className="text-xs text-zinc-500">Selected: {selectedSizes.join(", ")}</p>}
            </CardContent>
          </Card>

          {/* Color Variants with images */}
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Colour Variants & Images</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Add each colour and upload images for it. The first image of the first colour will be the product cover.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new color row */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950">
                <div className="flex items-center gap-2 shrink-0">
                  <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-zinc-200 p-0.5 dark:border-zinc-700" />
                  <span className="text-xs font-mono text-zinc-500 w-16">{newColorHex}</span>
                </div>
                <Input type="text" placeholder="Colour name (e.g. Midnight Black)"
                  value={newColorName} onChange={(e) => setNewColorName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                  className="flex-1 border-zinc-200/80 dark:border-zinc-800" />
                <Button type="button" onClick={addColor} variant="outline" className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> Add Colour
                </Button>
              </div>

              {/* Existing color blocks */}
              {colors.length === 0 && (
                <p className="text-center text-sm text-zinc-400 py-4">No colours added yet. Add at least one colour above.</p>
              )}

              {colors.map((color, colorIdx) => (
                <div key={colorIdx} className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  {/* Color header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0" style={{ backgroundColor: color.hex }} />
                      <div>
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{color.name}</span>
                        <span className="ml-2 text-xs font-mono text-zinc-400">{color.hex}</span>
                      </div>
                      {colorIdx === 0 && color.images.length > 0 && (
                        <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">Cover Image</span>
                      )}
                    </div>
                    <button type="button" onClick={() => removeColor(colorIdx)}
                      className="text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Image upload for this color */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-950">
                        {uploadingColorIdx === colorIdx
                          ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                          : <><Upload className="h-5 w-5 text-zinc-400" /><span className="mt-1 text-xs text-zinc-500">Add Image</span></>
                        }
                        <input type="file" accept="image/*" multiple
                          onChange={(e) => handleColorImageUpload(e, colorIdx)}
                          disabled={uploadingColorIdx !== null} className="hidden" />
                      </label>
                      {color.images.map((url, imgIdx) => (
                        <div key={imgIdx} className="group relative h-24 rounded-md border border-zinc-100 dark:border-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="h-full w-full rounded-md object-cover" />
                          {colorIdx === 0 && imgIdx === 0 && (
                            <span className="absolute bottom-1 left-1 text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-medium">Cover</span>
                          )}
                          <button type="button" onClick={() => removeColorImage(colorIdx, imgIdx)}
                            className="absolute right-1.5 top-1.5 rounded-full bg-zinc-900/80 p-1 text-white opacity-0 group-hover:opacity-100">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {color.images.length === 0 && (
                      <p className="mt-2 text-xs text-zinc-400">Upload at least one image for this colour.</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <InventorySidebar categories={categories} wholesaleEnabled={wholesaleEnabled}
          setWholesaleEnabled={setWholesaleEnabled} onBack={onBack} isPending={isPending} uploading={isUploading} initialData={initialData} />
      </div>
    </form>
  );
}


