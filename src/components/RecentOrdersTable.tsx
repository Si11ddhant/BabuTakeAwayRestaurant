import React, { useState } from 'react';
import { useAdmin, Order } from '@/context/AdminContext';
import { ChevronDown, MapPin, Package, Check } from 'lucide-react';

const statusConfig = {
  'New Order': { color: 'bg-blue-100', textColor: 'text-blue-700', badge: 'bg-blue-50' },
  'Preparing': { color: 'bg-orange-100', textColor: 'text-orange-700', badge: 'bg-orange-50' },
  'Dispatched': { color: 'bg-purple-100', textColor: 'text-purple-700', badge: 'bg-purple-50' },
  'Completed': { color: 'bg-green-100', textColor: 'text-green-700', badge: 'bg-green-50' },
  'Ready for Pickup': { color: 'bg-purple-100', textColor: 'text-purple-700', badge: 'bg-purple-50' },
};

interface DisplayOrder extends Order {
  itemName?: string;
  itemImage?: string;
}

const RecentOrdersTable: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const displayOrders: DisplayOrder[] = orders.map(order => ({
    ...order,
    itemName: order.items[0]?.name || 'N/A',
    itemImage: undefined,
  }));

  const totalPages = Math.ceil(displayOrders.length / itemsPerPage);
  const paginatedOrders = displayOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setExpandedOrder(null);
  };

  const getStatusDisplay = (status: Order['status']) => {
    const statusMap = {
      'New': 'New Order',
      'Accepted': 'Preparing',
      'Preparing': 'Preparing',
      'Dispatched': 'Dispatched',
      'Ready for Pickup': 'Ready for Pickup',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Item</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Price</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => {
                const config = statusConfig[getStatusDisplay(order.status) as keyof typeof statusConfig];
                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-900">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg mr-3 flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="line-clamp-1">{order.itemName}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">#{order.id}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className="flex items-center text-slate-600">
                        {order.type === 'Delivery' ? (
                          <>
                            <MapPin className="w-4 h-4 mr-1" />
                            Delivery
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 mr-1" />
                            Takeaway
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${config.color} ${config.textColor} hover:shadow-sm`}
                        >
                          <span>{getStatusDisplay(order.status)}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                        </button>

                        {expandedOrder === order.id && (
                          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max">
                            {['New Order', 'Preparing', 'Dispatched', 'Completed'].map((status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  const statusMap: Record<string, Order['status']> = {
                                    'New Order': 'New',
                                    'Preparing': 'Preparing',
                                    'Dispatched': 'Dispatched',
                                    'Completed': 'Dispatched',
                                  };
                                  handleStatusChange(order.id, statusMap[status]);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-slate-700 first:rounded-t-lg last:rounded-b-lg"
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersTable;