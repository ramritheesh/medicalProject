import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { ShoppingCart, Plus, Check, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = () => {
    const { medications, cart, addToCart, removeFromCart, clearCart } = useMedication();
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price || 15) * item.cartQuantity, 0);

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            clearCart();
            alert("Order placed successfully! (Mock)");
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Pharmacy Shop</h1>
                    <p className="text-slate-500 mt-2">Order refills and health essentials.</p>
                </div>
                <div className="relative">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                        <ShoppingCart className="w-6 h-6 text-slate-600" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {cart.length}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-slate-800">Your Prescriptions</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {medications.map((med) => (
                            <div key={med.id} className="glass-panel p-4 rounded-xl flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800">{med.name}</h3>
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">$15.00</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{med.dosage} • {med.quantity} count</p>
                                </div>
                                <button
                                    onClick={() => addToCart({ ...med, price: 15 })}
                                    className="mt-4 w-full btn-secondary flex items-center justify-center gap-2 text-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Order Summary</h2>

                        {cart.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium text-slate-800">{item.name}</p>
                                            <p className="text-slate-500">Qty: {item.cartQuantity}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-slate-800">${(item.price * item.cartQuantity).toFixed(2)}</span>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t border-slate-200 pt-4 mt-4">
                                    <div className="flex justify-between items-center font-bold text-lg text-slate-800">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
                                >
                                    {isCheckingOut ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Checkout
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper X icon since I missed importing it
const X = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

export default Shop;
