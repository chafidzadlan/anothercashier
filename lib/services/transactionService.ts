import { supabase, handleSupabaseError } from "@/lib/supabase";
import { Transaction, PaymentResult } from "@/lib/types";
import { decreaseProductStock } from "@/lib/services/productServices";

export async function saveTransaction(transaction: Omit<Transaction, "id" | "created_at">): Promise<PaymentResult> {
  try {
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        customer_name: transaction.customer_name || null,
        total_amount: transaction.total_amount,
        payment_method: transaction.payment_method,
        cashier_id: transaction.cashier_id,
        note: transaction.note || null
      })
      .select()
      .single();

    if (transactionError) {
      return {
        success: false,
        message: "Failed to create transaction",
        error: transactionError
      };
    }

    const transactionItems = transaction.items.map(item => ({
      transaction_id: transactionData.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from("transaction_items")
      .insert(transactionItems);

    if (itemsError) {
      return {
        success: false,
        message: "Failed to create transaction items",
        error: itemsError
      };
    }

    const stockResults = await Promise.all(
      transaction.items.map(item => decreaseProductStock(item.product_id, item.quantity))
    );

    if (stockResults.some(result => !result)) {
      console.warn("Some product stocks were not updated correctly");
    }

    return {
      success: true,
      transactionId: transactionData.id,
      message: "Transaction completed successfully"
    };
  } catch (error) {
    console.error("Transaction error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error
    };
  }
}

export async function getTransactionHistory(
  cashierId?: string,
  startDate?: string,
  endDate?: string
): Promise<Transaction[]> {
  let query = supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (cashierId) {
    query = query.eq("cashier_id", cashierId);
  }

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  if (endDate) {
    query = query.lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    return handleSupabaseError(error, "getTransactionHistory") || [];
  }

  const transactionsWithItems = await Promise.all(
    data.map(async (transaction) => {
      const { data: items, error: itemsError } = await supabase
        .from("transaction_items")
        .select("*")
        .eq("transaction_id", transaction.id);

      if (itemsError) {
        console.error("Error fetching transaction items:", itemsError);
        return { ...transaction, items: [] };
      }

      return { ...transaction, items };
    })
  );

  return transactionsWithItems as Transaction[];
}

export async function getTransactionById(transactionId: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (error) {
    return handleSupabaseError(error, "getTransactionById");
  }

  const { data: items, error: itemsError } = await supabase
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", transactionId);

  if (itemsError) {
    console.error("Error fetching transaction items:", itemsError);
    return { ...data, items: [] };
  }

  return { ...data, items } as Transaction;
}

export async function getDailySales(date: string): Promise<number> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("transactions")
    .select("total_amount")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  if (error) {
    handleSupabaseError(error, "getDailySales");
    return 0;
  }

  return data.reduce((sum, transaction) => sum + transaction.total_amount, 0);
}