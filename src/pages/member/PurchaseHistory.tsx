import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ShoppingBag, Calendar, IndianRupee, Tag, ReceiptText } from 'lucide-react';
import { format } from 'date-fns';

export function PurchaseHistory() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      if (!user?.id) return;
      try {
        const data = await api.member.getPurchases(user.id);
        setPurchases(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    loadPurchases();
  }, [user?.id]);

  // FIX: Use total_amount instead of total_price
  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0);

  if (isLoading) return <DashboardLayout><div className="p-8 text-white animate-pulse">Loading orders...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Purchase History</h1>
          <p className="text-slate-400">View your supplement and merchandise orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-slate-900 border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg text-white">
                <IndianRupee size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Total Spent</p>
                {/* FIX: Ensure totalSpent is correctly displayed */}
                <p className="text-2xl font-black text-white">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600/20 to-slate-900 border-purple-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-lg text-white">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Total Items</p>
                <p className="text-2xl font-black text-white">{purchases.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ReceiptText className="text-emerald-500" size={20} /> Past Transactions
          </h2>
          
          <div className="grid gap-4">
            {purchases.map((sale) => (
              <Card key={sale.transaction_id} className="hover:border-slate-600 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 border border-slate-700">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{sale.item_name}</h3>
                      <div className="flex items-center gap-3 text-slate-500 text-xs">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(sale.sale_timestamp), 'PPP p')}</span>
                        <span>•</span>
                        <span>Qty: {sale.quantity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex justify-between md:flex-col items-center md:items-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <span className="text-slate-500 text-xs md:hidden uppercase font-bold">Total Paid</span>
                    {/* FIX: Use sale.total_amount instead of total_price */}
                    <span className="text-xl font-mono font-bold text-emerald-400">₹{Number(sale.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}

            {purchases.length === 0 && (
              <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                <ShoppingBag className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500">You haven't made any purchases yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}