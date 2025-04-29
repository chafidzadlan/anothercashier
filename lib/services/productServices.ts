import { supabase, handleSupabaseError } from "@/lib/supabase";
import { Product, Category } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .order("name");

  if (error) {
    return handleSupabaseError(error, "getProducts") || [];
  }

  return data as Product[];
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .eq("category_id", categoryId)
    .order("name");

  if (error) {
    return handleSupabaseError(error, "getProductsByCategory") || [];
  }

  return data as Product[];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data: barcodeMatch, error: barcodeError } = await supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .eq("barcode", query);

  if (barcodeError) {
    handleSupabaseError(barcodeError, "searchProducts - barcode");
  } else if (barcodeMatch && barcodeMatch.length > 0) {
    return barcodeMatch as Product[];
  }

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .ilike("name", `%${query}%`);

  if (error) {
    return handleSupabaseError(error, "searchProducts - name") || [];
  }

  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return handleSupabaseError(error, "getProductById");
  }

  return data as Product;
}

export async function updateProductStock(productId: string, newStock: number): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (error) {
    handleSupabaseError(error, "updateProductStock");
    return false;
  }

  return true;
}

export async function decreaseProductStock(productId: string, quantity: number): Promise<boolean> {
  const { error } = await supabase
    .rpc("decrease_product_stock", {
      p_id: productId,
      quantity: quantity
    });

  if (error) {
    handleSupabaseError(error, "decreaseProductStock");
    return false;
  }

  return true;
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    return handleSupabaseError(error, "getAllCategories") || [];
  }

  return data as Category[];
}