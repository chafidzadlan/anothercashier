"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package2, BarChart3, ShoppingCart, Clock, User } from "lucide-react";
import { isAuthenticated } from "@/lib/services/authService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/pos");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-slate-50">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col items-center my-8 space-y-4">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
            <ShoppingCart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center text-primary">Supermarket POS</h1>
          <p className="text-xl text-slate-600 text-center">Modern POS System for better Retail Management</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <Card className="shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingCart size={64} className="text-white/90" />
              </div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Point of Sale</h2>
              <p className="text-slate-600 mb-4">Access our modern cashier system with an intuitive interface for quick and efficient transactions.</p>
              <Button
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Start Cashier <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-indigo-500 to-indigo-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 size={64} className="text-white/90" />
              </div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Administration</h2>
              <p className="text-slate-600 mb-4">Manage inventory, view reports, and configure system settings (for manager access only).</p>
              <Button
                className="w-full"
                onClick={() => router.push("/login")}
                variant="outline"
              >
                Admin Panel <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Package2 size={24} className="text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium">Inventory Management</h3>
              <p className="text-sm text-slate-500">Track stock levels</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Clock size={24} className="text-green-700" />
            </div>
            <div>
              <h3 className="font-medium">Real-time Updates</h3>
              <p className="text-sm text-slate-500">Instant sync with database</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <User size={24} className="text-purple-700" />
            </div>
            <div>
              <h3 className="font-medium">Employee Management</h3>
              <p className="text-sm text-slate-500">Control access rights</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 mb-6">
          <h2 className="text-xl font-bold mb-4">About Supermarket POS</h2>
          <p className="text-slate-600 mb-2">
            This modern point-of-sale system is designed to simplify the retail operations at Supermarket.
            With an intuitive interface and powerful features, it helps manage inventory, process transactions,
            and maintain business records efficiently.
          </p>
          <p className="text-slate-600">
            Built with the latest web technologies to ensure speed, reliability, and ease of use for all staff member
          </p>
        </div>
        <footer className="text-center text-slate-500 py-4">
          <p>© {new Date().getFullYear()} Supermarket POS System</p>
        </footer>
      </div>
    </main>
  );
}
