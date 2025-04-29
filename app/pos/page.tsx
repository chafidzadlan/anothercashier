"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Clock, Database, Grid3X3, LogOut, Search, Settings, ShoppingCart, User } from "lucide-react";

export default function POSPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-16 bg-slate-900 text-white flex flex-col items-center py-4 space-y-8">
        <div className="p-2 rounded-full bg-slate-700">
          <ShoppingCart size={24} />
        </div>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700">
          <Grid3X3 size={24} />
        </Button>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700">
          <Clock size={24} />
        </Button>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700">
          <Database size={24} />
        </Button>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700">
          <Settings size={24} />
        </Button>
        <div className="flex-grow" />
        <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-700">
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
                  className="pl-10 pr-4 h-10"
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
                    <h2 className="text-xl font-bold">Cashier</h2>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-medium">User</p>
                        <p className="text-sm text-slate-500">Shift Morning</p>
                      </div>
                    </div>
                    <Button className="mt-4">Change Shift</Button>
                    <Button variant="outline">Sign Out</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <TabsList className="flex mb-4 bg-slate-100 p-1 overflow-x-auto">
              Category Name
            </TabsList>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="--" className="m-0 h-full">
                Product List
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="w-1/3 bg-white border-l border-slate-200 flex flex-col">
          Cart
          <div className="p-4 border-t border-slate-200">
            <Button
              className="w-full py-6 text-lg"
            >
              Credit Card
              Pay (Rp TotalAmount)
            </Button>
          </div>
        </div>
      </div>
      Payment Modal
    </div>
  );
}