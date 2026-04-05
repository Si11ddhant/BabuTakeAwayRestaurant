import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Restaurant Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Settings and configuration options will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;