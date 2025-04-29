import { supabase } from "@/lib/supabase";
import { Product } from ".";

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,barcode.eq.${query}`);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data as Product[];
}