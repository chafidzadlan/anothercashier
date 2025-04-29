"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const dummyProducts = [
  {
    id: "1",
    name: "Beras Pandan Wangi",
    price: 70000,
    image: "/api/placeholder/80/80",
    category: "groceries",
    stock: 50
  },
  {
    id: "2",
    name: "Minyak Goreng Bimoli",
    price: 45000,
    image: "/api/placeholder/80/80",
    category: "groceries",
    stock: 30
  },
  {
    id: "3",
    name: "Teh Pucuk Harum",
    price: 5000,
    image: "/api/placeholder/80/80",
    category: "beverages",
    stock: 100
  },
  {
    id: "4",
    name: "Chitato Rasa Sapi Panggang",
    price: 12000,
    image: "/api/placeholder/80/80",
    category: "snacks",
    stock: 45
  },
  {
    id: "5",
    name: "Indomie Goreng",
    price: 3500,
    image: "/api/placeholder/80/80",
    category: "groceries",
    stock: 200
  },
  {
    id: "6",
    name: "Sabun Lifebuoy",
    price: 4500,
    image: "/api/placeholder/80/80",
    category: "personal_care",
    stock: 80
  },
  {
    id: "7",
    name: "Rinso Detergen",
    price: 20000,
    image: "/api/placeholder/80/80",
    category: "household",
    stock: 40
  },
  {
    id: "8",
    name: "Aqua Botol 600ml",
    price: 4000,
    image: "/api/placeholder/80/80",
    category: "beverages",
    stock: 150
  },
  {
    id: "9",
    name: "Pocari Sweat",
    price: 7500,
    image: "/api/placeholder/80/80",
    category: "beverages",
    stock: 75
  },
  {
    id: "10",
    name: "Oreo Original",
    price: 10000,
    image: "/api/placeholder/80/80",
    category: "snacks",
    stock: 60
  },
  {
    id: "11",
    name: "Pasta Gigi Pepsodent",
    price: 15000,
    image: "/api/placeholder/80/80",
    category: "personal_care",
    stock: 65
  },
  {
    id: "12",
    name: "Sunlight Pencuci Piring",
    price: 18000,
    image: "/api/placeholder/80/80",
    category: "household",
    stock: 55
  }
];

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface ProductListProps {
  category: string;
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ category, searchQuery, onAddToCart }: ProductListProps) {
  const [filteredProducts, setFilteredProducts] = useState(dummyProducts);

  useEffect(() => {
    let products = dummyProducts;

    if (category !== "all") {
      products = products.filter(product => product.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product => product.name.toLowerCase().includes(query));
    }

    setFilteredProducts(products);
  }, [category, searchQuery]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 flex flex-col h-full">
            <div className="flex items-center justify-center mb-3 bg-slate-100 rounded-md p-2">
              <Image
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium line-clamp-2">{product.name}</h3>
              <p className="text-slate-500 text-sm">Stock: {product.stock}</p>
              <p className="font-bold text-lg mt-1">Rp {product.price.toLocaleString("id-ID")}</p>
            </div>
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full mt-2"
              size="sm"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
        </Card>
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-500 mb-2">No products found</p>
          <p className="text-sm text-slate-400">Try changing your search keywords or category.</p>
        </div>
      )}
    </div>
  );
}