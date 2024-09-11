"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { FaUser, FaMoneyBill, FaSignOutAlt, FaTachometerAlt, FaCog, FaHistory } from 'react-icons/fa';
import { useUserStore } from '@/stores/userStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const logout = useAuthStore(state => state.logout);

  const { profile } = useUserStore();

  return (
    <div className="w-64 bg-white p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <FaUser className="text-white" />
        </div>
        <h2 className="text-xl font-bold ml-4">{profile?.name}</h2>
      </div>
      <nav className="flex-1">
        <Link href="/dashboard" passHref>
          <Button
            variant={pathname === '/dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start mb-2 flex items-center"
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/employees" passHref>
          <Button
            variant={pathname.includes('/employees') ? 'default' : 'ghost'}
            className="w-full justify-start mb-2 flex items-center"
          >
            <FaUser className="mr-2" />
            Employees
          </Button>
        </Link>
        <Link href="/dashboard/salaries" passHref>
          <Button
            variant={pathname.includes('/salaries') ? 'default' : 'ghost'}
            className="w-full justify-start mb-2 flex items-center"
          >
            <FaMoneyBill className="mr-2" />
            Salaries
          </Button>
        </Link>
        <Link href="/dashboard/payment-history" passHref>
          <Button
            variant={pathname.includes('/payment-history') ? 'default' : 'ghost'}
            className="w-full justify-start mb-2 flex items-center"
          >
            <FaHistory className="mr-2" />
            Payment History
          </Button>
        </Link>
        <Link href="/dashboard/settings" passHref>
          <Button
            variant={pathname.includes('/settings') ? 'default' : 'ghost'}
            className="w-full justify-start mb-2 flex items-center"
          >
            <FaCog className="mr-2" />
            Settings
          </Button>
        </Link>
      </nav>
      <Button variant="outline" className="w-full flex items-center justify-center" onClick={logout}>
        <FaSignOutAlt className="mr-2" />
        Logout
      </Button>
    </div>
  );
};