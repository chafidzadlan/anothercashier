import { supabase } from "../supabase";
import { Employee } from ".";

export async function authenticateEmployee(pin: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('pin_code', pin)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error authenticating employee:', error);
    return null;
  }

  return data as Employee;
}