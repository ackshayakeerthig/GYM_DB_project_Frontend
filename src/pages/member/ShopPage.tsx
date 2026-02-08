import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, IndianRupee, Loader2, CheckCircle } from 'lucide-react';

export function ShopPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: Toast state for the popup
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  const loadItems = async () => {
    try {
      const data = await api.inventory.getAll();
      setItems(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleBuy = async (item: any) => {
    if (item.current_stock <= 0) return;
    
    setIsProcessing(item.item_id);
    try {
      await api.inventory.purchaseItem(user!.id, item.item_id, 1);
      
      // SHOW TOAST INSTEAD OF ALERT
      setToast({ show: true, message: `Successfully bought ${item.item_name}!` });
      
      // Auto-hide toast after 2 seconds
      setTimeout(() => setToast(null), 2000);
      
      await loadItems();
    } catch (err: any) {
      setToast({ show: true, message: "Purchase failed. Try again." });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="relative space-y-6">
        
        {/* --- UI TOAST POPUP --- */}
        {toast && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl shadow-emerald-500/40 flex items-center gap-3 border border-emerald-400">
              <CheckCircle size={20} className="animate-bounce" />
              <span className="font-bold">{toast.message}</span>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gym Shop</h1>
          <p className="text-slate-400">Premium fuel for your workouts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.item_id} className="flex flex-col h-full border-slate-800 hover:border-emerald-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Package size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  item.current_stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {item.current_stock > 0 ? `${item.current_stock} In Stock` : 'Out of Stock'}
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-1">{item.item_name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <p className="text-2xl font-black text-white flex items-center gap-1">
                  <IndianRupee size={18} />
                  {item.unit_selling_price}
                </p>
                
                <button 
                  onClick={() => handleBuy(item)}
                  disabled={isProcessing !== null || item.current_stock <= 0}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  {isProcessing === item.item_id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <><ShoppingCart size={18} /> Buy Now</>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}