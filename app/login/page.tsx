"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authenticationEmployee, isAuthenticated } from "@/lib/services/authService";
import { X } from "lucide-react";

export default function Login() {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/pos");
    }
  }, [router]);

  const handlePinInput = (value: string) => {
    if (value === "clear") {
      setPin("");
      setError("");
      return;
    }

    if (value === "backspace") {
      setPin(prev => prev.slice(0, -1));
      setError("");
      return;
    }

    if (pin.length < 6 && /^\d+$/.test(value)) {
      setPin(prev => prev + value);
      setError("");
    }
  };

  const handleLogin = async () => {
    if (pin.length < 4) {
      setError("PIN minimum 4 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const employee = await authenticationEmployee(pin);

      if (employee) {
        toast.success(`Welcome, ${employee.name}`);
        router.push("/pos");
      } else {
        setError("Invalid PIN")
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Supermarket POS</h1>
          <p className="text-slate-500">Modern Cashier System</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Employee Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="password"
                value={pin}
                placeholder="Enter PIN"
                readOnly
                className="text-center text-2xl tracking-widest h-12"
              />
              {error && (
                <div className="text-red-500 text-sm mt-1 text-center">{error}</div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-16 text-xl"
                  onClick={() => handlePinInput(num.toString())}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-16"
                onClick={() => handlePinInput("clear")}
              >
                <X size={20} />
              </Button>
              <Button
                variant="outline"
                className="h-16 text-xl"
                onClick={() => handlePinInput("0")}
              >
                0
              </Button>
              <Button
                variant="outline"
                className="h-16"
                onClick={() => handlePinInput("backspace")}
              >
                ⌫
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full h-12 text-lg"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}