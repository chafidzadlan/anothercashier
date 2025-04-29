"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Supermarket POS</h1>
          <p className="text-slate-500">Modern Cashier System</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Employee Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Enter PIN"
                readOnly
                className="text-center text-2xl tracking-widest"
              />
              {/* Error handling */}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-16 text-xl"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-16"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                className="h-16 text-xl"
              >
                0
              </Button>
              <Button
                variant="outline"
                className="h-16"
              >
                ⌫
              </Button>
            </div>
            <Button
              className="w-full h-12"
            >
              Processing...
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
