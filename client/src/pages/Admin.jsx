import { useEffect, useState } from 'react';
import api from '../api/axios';

const Admin = () => {
  // Placeholder for Admin functionality. 
  // In a real app, this would fetch users and allow verification toggling.
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded shadow">
        <p>User management and Company verification features would go here.</p>
        <p className="text-sm text-slate-500 mt-2">Currently restricted to manually editing the database or using the seed script for this MVP.</p>
      </div>
    </div>
  );
};

export default Admin;
