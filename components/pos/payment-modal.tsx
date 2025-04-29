"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Banknote, CheckCircle2, CreditCard, Smartphone, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Numpad from "./numpad";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: { id: string; name: string; quantity: number; price: number; total: number }[];
  totalAmount: number;
  onFinishPayment: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  items,
  totalAmount,
  onFinishPayment
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const amountPaidValue = amountPaid ? parseInt(amountPaid) : 0;
  const change = amountPaidValue - totalAmount;

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    setAmountPaid("");
    setIsPaymentComplete(false);
  };

  const handleNumpadInput = (value: string) => {
    if (value === "clear") {
      setAmountPaid("");
      return;
    }

    if (value === "backspace") {
      setAmountPaid(prev => prev.slice(0, -1));
      return;
    }

    setAmountPaid(prev => prev + value);
  };

  const handleExactAmount = () => {
    setAmountPaid(totalAmount.toString());
  };

  const handleQuickAmount = (amount: number) => {
    setAmountPaid(amount.toString());
  };

  const handleFinishPayment = () => {
    setIsPaymentComplete(true);
    setTimeout(() => {
      onFinishPayment();
      setIsPaymentComplete(false);
      setAmountPaid("");
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Payment</DialogTitle>
        </DialogHeader>
        {isPaymentComplete ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 size={64} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-slate-500 mb-6">The receipt is being printed...</p>
            <Button onClick={onFinishPayment} className="px-8">
              Return to Cashier
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Tabs defaultValue="cash" value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="cash">
                    <Wallet className="mr-2" size={16} /> Cash
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <CreditCard className="mr-2" size={16} /> Card
                  </TabsTrigger>
                  <TabsTrigger value="ewallet">
                    <Smartphone className="mr-2" size={16} /> E-Wallet
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cash" className="space-y-4">
                  <Card className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button variant="outline" onClick={() => handleQuickAmount(100000)}>
                        Rp 100.000
                      </Button>
                      <Button variant="outline" onClick={() => handleQuickAmount(50000)}>
                        Rp 50.000
                      </Button>
                      <Button variant="outline" onClick={() => handleQuickAmount(20000)}>
                        Rp 20.000
                      </Button>
                      <Button variant="outline" onClick={() => handleQuickAmount(10000)}>
                        Rp 10.000
                      </Button>
                      <Button variant="outline" onClick={handleExactAmount} className="col-span-2">
                        Exact Money (Rp {totalAmount.toLocaleString('id-ID')})
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-grow">
                        <p className="text-sm text-slate-500 mb-1">Amount Paid</p>
                        <div className="flex items-center">
                          <Banknote size={20} className="mr-2 text-slate-400" />
                          <Input
                            value={amountPaid ? `Rp ${parseInt(amountPaid).toLocaleString('id-ID')}` : ""}
                            placeholder="Rp 0"
                            readOnly
                            className="text-lg font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Numpad onInput={handleNumpadInput} />
                </TabsContent>
                <TabsContent value="card">
                  <Card className="p-4 flex flex-col items-center justify-center space-y-4">
                    <CreditCard size={48} className="text-slate-400" />
                    <p>Please use the EDC machine to process card payments.</p>
                    <div className="w-full">
                      <Button
                        className="w-full"
                        onClick={handleFinishPayment}
                      >
                        Card Payment Confirmation
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="ewallet">
                  <Card className="p-4 flex flex-col items-center justify-center space-y-4">
                    <div className="grid grid-cols-2 gap-4 w-full mb-4">
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Image src="#" alt="QRIS" className="mb-2" /> QRIS
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Image src="#" alt="OVO" className="mb-2" /> OVO
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Image src="#" alt="GoPay" className="mb-2" /> GoPay
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Image src="#" alt="Dana" className="mb-2" /> Dana
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleFinishPayment}
                    >
                      E-Wallet Payment Confirmation
                    </Button>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-bold m-2">Shopping Summary</h3>
                <div className="max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-slate-100">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-slate-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <p className="font-medium">Rp {item.total.toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax (0%)</span>
                    <span>Rp 0</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rp ${totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  {paymentMethod === "cash" && amountPaid && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Paid</span>
                        <span>Rp {parseInt(amountPaid).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Back</span>
                        <span className={change < 0 ? "text-red-500" : ""}>
                          Rp {change.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>
              <Button
                className="w-full py-6 text-lg"
                disabled={
                  (paymentMethod === "cash" && (amountPaidValue < totalAmount || !amountPaid))
                }
                onClick={handleFinishPayment}
              >
                Complete Payment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}