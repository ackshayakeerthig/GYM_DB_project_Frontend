import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { InventoryItem } from '../../types';
import { Package, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Track both stock and price in one edit object
  const [tempEdit, setTempEdit] = useState({ stock: '', price: '' });
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  const loadInventory = async () => {
    try {
      const data = await api.inventory.getAll();
      setInventory(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateItem = async (itemId: number) => {
    try {
      const updated = await api.inventory.update(itemId, {
        current_stock: parseInt(tempEdit.stock, 10),
        unit_selling_price: parseFloat(tempEdit.price)
      });
      
      if (updated) {
        setInventory(inventory.map((i) => (i.item_id === itemId ? updated : i)));
        setToast({ show: true, message: 'Inventory updated successfully!' });
        setTimeout(() => setToast(null), 2000);
      }
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update inventory');
    }
  };

  const lowStockItems = inventory.filter((i) => i.low_stock).length;
  const totalValue = inventory.reduce((sum, i) => sum + i.current_stock * i.unit_selling_price, 0);

  if (isLoading) return <DashboardLayout><div className="p-8 text-emerald-500 animate-pulse">Loading Inventory...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="relative space-y-6">
        {/* Success Toast */}
        {toast && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400">
              <CheckCircle size={20} className="animate-bounce" />
              <span className="font-bold">{toast.message}</span>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-slate-400">Manage stock levels and unit pricing</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center bg-slate-800/50">
            <p className="text-slate-400 text-sm mb-2 font-bold uppercase">Items Catalog</p>
            <p className="text-3xl font-black text-white">{inventory.length}</p>
          </Card>
          <Card className="text-center bg-slate-800/50">
            <p className="text-slate-400 text-sm mb-2 font-bold uppercase">Low Stock</p>
            <p className="text-3xl font-black text-yellow-500">{lowStockItems}</p>
          </Card>
          <Card className="text-center bg-emerald-500/10 border-emerald-500/20">
            <p className="text-emerald-500/70 text-sm mb-2 font-bold uppercase">Inventory Value</p>
            <p className="text-3xl font-black text-emerald-400">₹{(totalValue / 1000).toFixed(1)}K</p>
          </Card>
        </div>

        <Card className="overflow-hidden border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-700/30 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase text-xs">Product Details</th>
                  <th className="px-6 py-4 font-bold uppercase text-xs">Stock Level</th>
                  <th className="px-6 py-4 font-bold uppercase text-xs">Unit Price</th>
                  <th className="px-6 py-4 font-bold uppercase text-xs">Status</th>
                  <th className="px-6 py-4 font-bold uppercase text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.item_id} className="border-t border-slate-800 hover:bg-slate-700/10 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Package className="text-emerald-500" size={20} />
                        <div>
                          <p className="text-white font-bold">{item.item_name}</p>
                          <p className="text-slate-500 text-xs italic">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.item_id ? (
                        <input
                          type="number"
                          value={tempEdit.stock}
                          onChange={(e) => setTempEdit({ ...tempEdit, stock: e.target.value })}
                          className="bg-slate-900 text-white text-sm rounded px-3 py-1 border border-emerald-500 w-24 outline-none"
                        />
                      ) : (
                        <span className="font-mono text-white text-lg">{item.current_stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.item_id ? (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <span>₹</span>
                          <input
                            type="number"
                            value={tempEdit.price}
                            onChange={(e) => setTempEdit({ ...tempEdit, price: e.target.value })}
                            className="bg-slate-900 text-white text-sm rounded px-3 py-1 border border-emerald-500 w-24 outline-none"
                          />
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-bold">₹{item.unit_selling_price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.low_stock ? 'error' : 'success'}>
                        {item.low_stock ? 'Critical Stock' : 'Stable'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === item.item_id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateItem(item.item_id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-lg text-xs font-bold transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1 rounded-lg text-xs font-bold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item.item_id);
                            setTempEdit({ 
                              stock: item.current_stock.toString(), 
                              price: item.unit_selling_price.toString() 
                            });
                          }}
                          className="text-emerald-500 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest transition"
                        >
                          Edit Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}