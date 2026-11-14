
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  rating: number;
  inStock: boolean;
};

type ProductForm = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: string;
  inStock: boolean;
};

const initialForm: ProductForm = {
  name: "",
  slug: "",
  brand: "",
  category: "",
  price: "",
  image: "",
  description: "",
  rating: "0",
  inStock: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    const response = await fetch("/api/products");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to load products.");
    }

    return result.products;
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const data = await fetchProducts();

        if (!ignore) {
          setProducts(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      ignore = true;
    };
  }, [fetchProducts]);

  function updateField(
    field: keyof ProductForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddForm() {
    setEditingProduct(null);
    setForm(initialForm);
    setImageFile(null);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setImageFile(null);
    setFormError("");
    setSuccessMessage("");

    setForm({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      image: product.image,
      description: product.description,
      rating: String(product.rating),
      inStock: product.inStock,
    });

    setShowForm(true);
  }

  async function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProduct && !imageFile) {
      setFormError("Please select a product image.");
      return;
    }

    if (
      imageFile &&
      !["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)
    ) {
      setFormError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      setFormError("Image size must be 5 MB or less.");
      return;
    }

    setSaving(true);
    setFormError("");
    setSuccessMessage("");

    const supabase = createClient();
    let uploadedImagePath = "";
    let finalImageUrl = form.image;

    try {
      // Upload a new image if one was selected.
      if (imageFile) {
        const fileExtension = imageFile.name.split(".").pop()?.toLowerCase();
        const filePath = `${crypto.randomUUID()}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        uploadedImagePath = uploadData.path;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const isEditing = editingProduct !== null;

      const response = await fetch(
        isEditing
          ? `/api/admin/products/${editingProduct.id}`
          : "/api/admin/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            rating: Number(form.rating),
            image: finalImageUrl,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save product.");
      }

      // The database operation succeeded, so keep the uploaded image.
      uploadedImagePath = "";

      setShowForm(false);
      setForm(initialForm);
      setImageFile(null);
      setEditingProduct(null);

      setSuccessMessage(
        isEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );

      // Refresh the product list without treating a refresh failure
      // as a failure of the successful save operation.
      try {
        setProducts(await fetchProducts());
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    } catch (err) {
      // Clean up the newly uploaded image if the database operation fails.
      if (uploadedImagePath) {
        await supabase.storage
          .from("product-images")
          .remove([uploadedImagePath]);
      }

      setFormError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct() {
    if (!productToDelete) return;

    try {
      setDeletingId(productToDelete.id);
      setDeleteError("");

      const response = await fetch(
        `/api/admin/products/${productToDelete.id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        setDeleteError(
          result.error || "Could not delete the product."
        );
        return;
      }

      // Refresh the list after the product has been deleted.
      try {
        setProducts(await fetchProducts());
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }

      setProductToDelete(null);
      setDeleteError("");
      setSuccessMessage("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);
      setDeleteError("Something went wrong while deleting the product.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your store products, prices, images, and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {successMessage && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {!loading && !error && (
        <div className="mb-5 flex items-center gap-2 text-sm text-gray-600">
          <Package size={18} />
          <span>{products.length} products in your store</span>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Package className="mx-auto text-gray-400" size={35} />
          <h2 className="mt-4 font-semibold text-gray-900">
            No products found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your products will appear here once added.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${product.inStock
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                          }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          title="Edit product"
                          className="cursor-pointer rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setProductToDelete(product);
                          }}
                          title="Delete product"
                          className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the details of your new product.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. Gaming Desktop"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. gaming-desktop"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    required
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. ASUS"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select category</option>
                    <option value="Gaming PCs">Gaming PCs</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Keyboards">Keyboards</option>
                    <option value="Gaming Mouse">Gaming Mouse</option>
                    <option value="Headsets">Headsets</option>
                    <option value="Gaming Chairs">Gaming Chairs</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. 1299.99"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => updateField("rating", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required={!editingProduct}
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, or WebP. Maximum file size: 5 MB.
                </p>

                {imageFile && (
                  <p className="mt-2 text-sm text-green-700">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Describe the product..."
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => updateField("inStock", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Product is in stock
              </label>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingProduct
                      ? "Saving Changes..."
                      : "Adding Product..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={24} className="text-red-600" />
            </div>

            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Confirm Deletion
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                &quot;{productToDelete.name}&quot;
              </span>
              ?
            </p>

            {deleteError && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteError("");
                }}
                disabled={deletingId !== null}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deletingId !== null}
                className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === productToDelete.id
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
