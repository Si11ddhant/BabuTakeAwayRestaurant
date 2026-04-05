import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Phone } from 'lucide-react';

const Customers: React.FC = () => {
  const { customers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.phone.includes(searchTerm) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 border-slate-300 focus:border-indigo-500"
          />
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Customer Database</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-700">Customer Name</TableHead>
                <TableHead className="text-slate-700">Phone Number</TableHead>
                <TableHead className="text-slate-700">Total Orders</TableHead>
                <TableHead className="text-slate-700">Last Ordered</TableHead>
                <TableHead className="text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{customer.name}</TableCell>
                  <TableCell className="text-slate-600">{customer.phone}</TableCell>
                  <TableCell className="text-slate-600">{customer.totalOrders}</TableCell>
                  <TableCell className="text-slate-600">{customer.lastOrdered.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <button
                      className="text-indigo-600 hover:text-indigo-800 hover:shadow-sm transition-shadow rounded px-2 py-1"
                      onClick={() => {
                        // In a real app, this would open a modal or navigate to customer details
                        alert(`Call ${customer.name} at ${customer.phone}`);
                      }}
                    >
                      <Phone className="h-4 w-4 mr-1 inline" />
                      Contact
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No customers found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;