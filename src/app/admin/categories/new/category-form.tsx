"use client";

import React, { useState, useActionState } from "react";
import { createCategory } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CategoryForm() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [state, formAction, isPending] = useActionState(createCategory, null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0]; // Category only needs one image
    const supabase = createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
  };

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Hidden input to pass image URL to server action */}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Footwear"
              required
              className="border-zinc-200/80 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-350"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Provide a brief description of what this category contains..."
              className="flex w-full rounded-md border border-zinc-200/80 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-350"
            />
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="flex items-center gap-4">
              {!imageUrl && !uploading && (
                <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900/50">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <span className="mt-1 text-xs text-zinc-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}

              {imageUrl && (
                <div className="group relative h-28 w-28 rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Category preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-1.5 top-1.5 rounded-full bg-zinc-900/80 p-1 text-white opacity-0 transition-opacity hover:bg-zinc-950 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {uploading && (
                <div className="flex h-28 w-28 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 max-w-xs">
        <Button
          type="submit"
          disabled={isPending || uploading}
          className="flex-1 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? "Saving..." : "Save Category"}
        </Button>
        <Link
          href="/admin/categories"
          className="flex-1 inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-9 text-sm font-medium hover:bg-muted hover:text-foreground transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
