import { supabase, handleSupabaseError } from "@/lib/supabase";
import { Employee } from "@/lib/types";
import { toast } from "sonner";

export async function authenticationEmployee(pin: string): Promise<Employee | null> {
  if (!pin || pin.length < 4) {
    toast.error("PIN must be at least 4 characters");
    return null;
  }

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("pin_code", pin)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      toast.error("Invalid PIN");
    } else {
      toast.error("Login failed, please try again");
      handleSupabaseError(error, "authenticationEmployee");
    }
    return null;
  }

  sessionStorage.setItem("employee", JSON.stringify(data));

  return data as Employee;
}

export function getCurrentEmployee(): Employee | null {
  const employeeData = sessionStorage.getItem("employee");

  if (!employeeData) {
    return null;
  }

  try {
    return JSON.parse(employeeData) as Employee;
  } catch (error) {
    console.error("Error parsing employee data:", error);
    return null;
  }
}

export function logoutEmployee(): void {
  sessionStorage.removeItem("employee");
}

export function isAuthenticated(): boolean {
  return getCurrentEmployee() !== null;
}

export function requireAuthentication(redirectTo: string = "/"): Employee | null {
  const employee = getCurrentEmployee();

  if (!employee) {
    window.location.href = redirectTo;
    return null;
  }

  return employee;
}