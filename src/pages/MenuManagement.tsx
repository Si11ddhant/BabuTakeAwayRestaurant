import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MenuManagement: React.FC = () => {
  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-slate-900">Menu Management</h1>
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Menu management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;