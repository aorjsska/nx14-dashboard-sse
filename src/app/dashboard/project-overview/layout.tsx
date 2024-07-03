// app/dashboard/project-overview/layout.tsx

import React from 'react';
import Link from 'next/link';
import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 flex w-full justify-between items-center p-4 bg-blue-600 text-white z-10">
        <h1 className="text-2xl font-bold">Car SW Lifecycle Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="fixed left-0 top-16  w-64 h-[calc(100vh-4rem)] bg-white p-4 overflow-y-auto">
          <nav>
            <ul className="space-y-2">
              <li><Link href="/dashboard/recharts" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Recharts Dashboard</Link></li>
              <li><Link href="/dashboard/highcharts" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Highcharts Dashboard</Link></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Project Overview</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Verification Status</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Quality Metrics</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Release Management</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Risk Management</a></li>
            </ul>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}