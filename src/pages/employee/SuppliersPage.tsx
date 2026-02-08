import React, { useState, useEffect } from 'react';
import { Truck, Phone, Mail, MapPin, Tag, PackageSearch } from 'lucide-react';
import { api } from '../../services/api';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Supplier } from '../../types';

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await api.employee.getSuppliers();
        setSuppliers(data || []);
      } catch (err) {
        console.error('Failed to load suppliers');
      } finally {
        setLoading(false);
      }
    };
    loadSuppliers();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <Truck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Partner Suppliers</h1>
            <p className="text-slate-400 text-sm">Manage procurement and vendor contacts</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-48 bg-slate-800/50" children={undefined} />
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <Card className="text-center py-12">
            <PackageSearch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No suppliers found in the database.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((vendor) => (
            <Card key={vendor.supplier_id} className="hover:border-emerald-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {/* FIX: Use company_name */}
                  {vendor.company_name}
                </h3>
                <span className="px-2 py-1 bg-slate-700 text-slate-300 text-[10px] rounded uppercase font-bold tracking-wider border border-slate-600">
                  {vendor.category}
                </span>
              </div>
                      
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span>Contact: {vendor.contact_person}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {/* FIX: Use phone_number */}
                  <span>{vendor.phone_number}</span>
                </div>
                {/* <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span className="truncate text-slate-500">
                    {vendor.email || 'No email registered'}
                  </span>
                </div> */}
                <div className="flex items-start gap-3 text-sm text-slate-400 pt-2 border-t border-slate-700">
                  <MapPin className="w-4 h-4 mt-0.5 text-slate-500" />
                  <span className="leading-tight whitespace-pre-line">{vendor.address}</span>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}