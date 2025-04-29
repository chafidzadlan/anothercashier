import { supabase } from "../supabase";
import { Transaction } from ".";

export async function saveTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      customer_name: transaction.customer_name,
      total_amount: transaction.total_amount,
      payment_method: transaction.payment_method,
      cashier_id: transaction.cashier_id,
      note: transaction.note
    })
    .select()
    .single();

  if (transactionError) {
    console.error('Error saving transaction:', transactionError);
    return null;
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
    .from('transaction_items')
    .insert(transactionItems);

  if (itemsError) {
    console.error('Error saving transaction items:', itemsError);
    return null;
  }

  for (const item of transaction.items) {
    const { error: stockError } = await supabase
      .rpc('decrease_product_stock', {
        p_id: item.product_id,
        quantity: item.quantity
      });

    if (stockError) {
      console.error(`Error updating stock for product ${item.product_id}:`, stockError);
    }
  }

  return transactionData;
}