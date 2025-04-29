"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Clock, Database, Grid3X3, Loader2, LogOut, Search, Settings, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";
import Cart from "@/components/pos/cart";
import PaymentModal from "@/components/pos/payment-modal";
import ProductList from "@/components/pos/product-list";
import { isAuthenticated, getCurrentEmployee, logoutEmployee } from "@/lib/services/authService";
import { getAllCategories } from "@/lib/services/productServices";
import { Category } from "@/lib/types";
import { useRouter as useNavigationRouter } from "next/navigation";

export default function POSPage() {
  const router = useNavigationRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEmployee, setCurrentEmployee] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        toast.error("Please login to access this page");
        router.push("/login");
        return;
      }

      const employee = getCurrentEmployee();
      if (employee) {
        setCurrentEmployee({
          name: employee.name,
          role: employee.role
        });
      }

      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleAddToCart = (product: { id: string; name: string; price: number; total: number }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item );
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.total
        }];
      }
    });

    toast.success(`${product.name} added to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => prevItems.map(item => item.id === productId ? { ...item, quantity, total: quantity * item.price } : item));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.info("Item removed from cart");
  };

  const handleLogout = () => {
    logoutEmployee();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleFinishPayment = () => {
    setIsPaymentModalOpen(false);
    setCartItems([]);
    toast.success("Transaction completed successfully");
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-16 bg-slate-900 text-white flex flex-col items-center py-4 space-y-8">
        <div className="p-2 rounded-full bg-slate-700">
          <ShoppingCart size={24} />
        </div>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700" title="Products">
          <Grid3X3 size={24} />
        </Button>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700" title="Transactions">
          <Clock size={24} />
        </Button>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700" title="Inventory">
          <Database size={24} />
        </Button>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700" title="Settings">
          <Settings size={24} />
        </Button>
        <div className="flex-grow" />
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700 hover:text-red-400" onClick={handleLogout} title="Logout">
          <LogOut size={24} />
        </Button>
      </div>
      <div className="flex-1 flex">
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Supermarket POS</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search Product...."
                  className="pl-10 pr-4 h-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 p-4">
                    <h2 className="text-xl font-bold">Cashier Profile</h2>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-medium">{currentEmployee?.name || "User"}</p>
                        <p className="text-sm text-slate-500">{currentEmployee?.role || "Cashier"}</p>
                      </div>
                    </div>
                    <Button className="mt-4" variant="outline">Change Shift</Button>
                    <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <Tabs defaultValue="all" value={currentCategory} onValueChange={setCurrentCategory} className="flex-1 flex flex-col">
            <TabsList className="flex mb-4 bg-slate-100 p-1 overflow-x-auto">
              <TabsTrigger value="all" className="px-4">
                All Products
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="px-4">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="all" className="m-0 h-full">
                <ProductList
                  category="all"
                  searchQuery={searchQuery}
                  onAddToCart={handleAddToCart}
                />
              </TabsContent>
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="m-0 h-full">
                  <ProductList
                    category={category.id}
                    searchQuery={searchQuery}
                    onAddToCart={handleAddToCart}
                  />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        <div className="w-1/3 bg-white border-l border-slate-200 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Cart
              items={cartItems}
              totalAmount={totalAmount}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
          <div className="p-4 border-t border-slate-200">
            <Button
              className="w-full py-6 text-lg"
              onClick={() => {
                if (cartItems.length === 0) {
                  toast.error("Your cart is empty");
                  return;
                }
                setIsPaymentModalOpen(true);
              }}
              disabled={cartItems.length === 0}
            >
              {cartItems.length === 0 ? (
                <>
                  <ShoppingCart size={20} className="mr-2" /> Cart is Empty
                </>
              ) : (
                <>
                  Pay Now (Rp {totalAmount.toLocaleString("id-ID")})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={cartItems}
        totalAmount={totalAmount}
        onFinishPayment={handleFinishPayment}
      />
    </div>
  );
}