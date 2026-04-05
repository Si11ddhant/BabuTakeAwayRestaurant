import React from 'react';
import LiveOrdersFeed from '@/components/LiveOrdersFeed';

const Orders = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer orders in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-semibold mb-1">New Orders</p>
          <p className="text-2xl font-bold text-blue-900">--</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-600 text-sm font-semibold mb-1">Being Prepared</p>
          <p className="text-2xl font-bold text-purple-900">--</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-semibold mb-1">Ready</p>
          <p className="text-2xl font-bold text-green-900">--</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-semibold mb-1">Completed</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>

      {/* Live Orders Feed */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <LiveOrdersFeed />
      </div>
    </div>
  );
};

export default Orders;
