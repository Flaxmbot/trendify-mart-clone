"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  inStock: boolean;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('sessionId', sessionId);
        }

      try {
        setLoading(true);
        const response = await fetch(`/api/cart-items?sessionId=${sessionId}`);
        const items = await response.json();

        const detailedItems = await Promise.all(items.map(async (item) => {
            const productResponse = await fetch(`/api/products?id=${item.productId}`);
            const product = await productResponse.json();
            return { ...item, name: product.name, price: product.price, image: product.imageUrl, inStock: product.stockQuantity > 0 };
        }));

        setCartItems(detailedItems);

        const subtotal = detailedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 1000 ? 0 : 99;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;
        const itemCount = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

        setCartSummary({ subtotal, shipping, tax, total, itemCount });

      } catch (err) {
        setError("Failed to load cart items.");
        toast.error("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      const sessionId = localStorage.getItem('sessionId');
      await fetch(`/api/cart-items?sessionId=${sessionId}&id=${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
      });
      
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);

      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 1000 ? 0 : 99;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      setCartSummary({ subtotal, shipping, tax, total, itemCount });

      toast.success("Quantity updated successfully");
    } catch (err) {
      toast.error("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      const sessionId = localStorage.getItem('sessionId');
      await fetch(`/api/cart-items?sessionId=${sessionId}&id=${itemId}`, { method: 'DELETE' });
      
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);

      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 1000 ? 0 : 99;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      setCartSummary({ subtotal, shipping, tax, total, itemCount });

      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link href="/collections">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartSummary?.itemCount || 0} {cartSummary?.itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {updating === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Size and Color */}
                        <div className="flex gap-4 mb-3">
                          {item.size && (
                            <div className="text-sm text-gray-600">
                              Size: <span className="font-medium">{item.size}</span>
                            </div>
                          )}
                          {item.color && (
                            <div className="text-sm text-gray-600">
                              Color: <span className="font-medium">{item.color}</span>
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                Rs. {item.originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-lg font-semibold">
                              Rs. {item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <Badge variant="secondary" className="bg-blue-500 text-white">
                                Sale
                              </Badge>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updating === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value > 0) {
                                  updateQuantity(item.id, value);
                                }
                              }}
                              className="w-16 text-center h-8"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Stock Status */}
                        {!item.inStock && (
                          <Badge variant="destructive" className="mt-2">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {index < cartItems.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {cartSummary && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartSummary.itemCount} items)</span>
                    <span>Rs. {cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {cartSummary.shipping === 0 ? 'Free' : `Rs. ${cartSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs. {cartSummary.tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>Rs. {cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Link href="/checkout">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link href="/collections">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Secure Checkout
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}