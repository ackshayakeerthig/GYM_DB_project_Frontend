import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card, StatCard, Badge } from '../../components/Card';
import { AlertCircle, Calendar, Package, Wrench } from 'lucide-react';
import { Class, EquipmentAsset, InventoryItem } from '../../types';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [equipment, setEquipment] = useState<EquipmentAsset[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cls, equip, inv] = await Promise.all([
          api.class.getAll(),
          api.equipment.getAll(),
          api.inventory.getAll(),
        ]);
        setClasses(cls);
        setEquipment(equip);
        setInventory(inv);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const brokenEquipment = equipment.filter(
  (e) => e.status === 'Needs Repair' || e.status === 'Under Maintenance' || e.status === 'Maintainance'
).length;
  const lowStockItems = inventory.filter((i) => i.low_stock).length;
  const myClasses = classes.filter((c) => c.trainer_id === user?.id).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h1>
        <p className="text-slate-400 mt-2">Employee Dashboard - {user?.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="My Classes"
          value={myClasses}
          icon={<Calendar />}
        />
        <StatCard
          label="Broken Equipment"
          value={brokenEquipment}
          icon={<Wrench />}
          trend={{ value: brokenEquipment > 0 ? 5 : 0, direction: brokenEquipment > 0 ? 'down' : 'up' }}
        />
        <StatCard
          label="Low Stock Items"
          value={lowStockItems}
          icon={<Package />}
          trend={{ value: lowStockItems > 0 ? 15 : 0, direction: lowStockItems > 0 ? 'down' : 'up' }}
        />
        <StatCard
          label="Total Equipment"
          value={equipment.length}
          icon={<Wrench />}
        />
      </div>

      {(brokenEquipment > 0 || lowStockItems > 0) && (
        <Card className="border-red-500/30 bg-red-500/5">
          <div className="flex gap-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="text-red-400 font-semibold">Alerts</h3>
              {brokenEquipment > 0 && (
                <p className="text-red-300/80 text-sm mt-1">
                  {brokenEquipment} equipment items need maintenance attention
                </p>
              )}
              {lowStockItems > 0 && (
                <p className="text-red-300/80 text-sm">
                  {lowStockItems} inventory items are running low on stock
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Equipment Status Overview">
          <div className="space-y-3">
            {equipment.slice(0, 5).map((item) => (
              <div key={item.asset_id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                <div>
                  <p className="text-white font-medium text-sm">{item.asset_name}</p>
                  <p className="text-slate-500 text-xs">Added: {new Date(item.purchase_date).toLocaleDateString()}</p>
                </div>
                <Badge
                  variant={
                    item.status === 'Functional' ? 'success' : item.status === 'Maintenance' ? 'warning' : 'error'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Low Stock Inventory">
          <div className="space-y-3">
            {inventory.filter((i) => i.low_stock).slice(0, 5).map((item) => (
              <div key={item.item_id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                <div>
                  <p className="text-white font-medium text-sm">{item.item_name}</p>
                  <p className="text-slate-500 text-xs">Stock: {item.current_stock} units</p>
                </div>
                <Badge variant="warning">Low Stock</Badge>
              </div>
            ))}
            {inventory.filter((i) => i.low_stock).length === 0 && (
              <p className="text-slate-400 text-center py-6">All items well-stocked</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <a
            href="/employee/classes"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">My Classes</p>
          </a>
          <a
            href="/employee/equipment"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <Wrench className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Equipment</p>
          </a>
          <a
            href="/employee/inventory"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <Package className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Inventory</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
