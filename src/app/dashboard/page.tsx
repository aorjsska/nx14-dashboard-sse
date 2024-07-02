"use client"

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// 타입 정의
interface VerificationData {
  staticAnalysis: { passed: number; failed: number; total: number };
  unitTesting: { passed: number; failed: number; total: number };
  sil: { passed: number; failed: number; total: number };
  hil: { passed: number; failed: number; total: number };
  integrationTesting: { passed: number; failed: number; total: number };
  vehicleTesting: { passed: number; failed: number; total: number };
}

interface RealtimeData extends VerificationData {
  activeBugs: number;
  codeCoverage: number;
  activeProjects: number;
}

interface QualityMetric {
  name: string;
  bugs: number;
  coverage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const initialVerificationData = {
  passed: 0,
  failed: 0,
  total: 0,
};

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    activeBugs: 0,
    codeCoverage: 0,
    activeProjects: 0,
    staticAnalysis: initialVerificationData,
    unitTesting: initialVerificationData,
    sil: initialVerificationData,
    hil: initialVerificationData,
    integrationTesting: initialVerificationData,
    vehicleTesting: initialVerificationData,
  });
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as RealtimeData;
      setRealtimeData(data);
      setIsLoading(false);
      
      setQualityMetrics(prevMetrics => {
        const newMetric: QualityMetric = {
          name: new Date().toLocaleTimeString(),
          bugs: data.activeBugs,
          coverage: data.codeCoverage
        };
        return [...prevMetrics.slice(-9), newMetric];
      });
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      setIsLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const updateData = async (newData: Partial<RealtimeData>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // 예시: 새로운 버그 보고 함수
  const reportNewBug = () => {
    updateData({ activeBugs: realtimeData.activeBugs + 1 });
  };

  // 예시: 단위 테스트 결과 업데이트 함수
  const updateUnitTestResult = (passed: number, failed: number) => {
    const currentUnitTesting = realtimeData.unitTesting;
    updateData({
      unitTesting: {
        passed: currentUnitTesting.passed + passed,
        failed: currentUnitTesting.failed + failed,
        total: currentUnitTesting.total + passed + failed,
      }
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderVerificationCard = (title: string, data: { passed: number; failed: number; total: number } | undefined) => {
    // 데이터가 undefined인 경우 초기값 사용
    const safeData = data || initialVerificationData;
    const progressPercentage = ((safeData.passed / (safeData.total || 1)) * 100).toFixed(1);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span>Progress:</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={parseFloat(progressPercentage)} className="mb-4" />
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>Passed: {safeData.passed}</div>
            <div>Failed: {safeData.failed}</div>
            <div>Total: {safeData.total}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const verificationOverviewData = [
    { name: 'Static Analysis', value: realtimeData.staticAnalysis?.passed ?? 0 },
    { name: 'Unit Testing', value: realtimeData.unitTesting?.passed ?? 0 },
    { name: 'SIL', value: realtimeData.sil?.passed ?? 0 },
    { name: 'HIL', value: realtimeData.hil?.passed ?? 0 },
    { name: 'Integration', value: realtimeData.integrationTesting?.passed ?? 0 },
    { name: 'Vehicle', value: realtimeData.vehicleTesting?.passed ?? 0 },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Car SW Lifecycle Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        <aside className={`w-64 h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
          <nav>
            <ul className="space-y-2">
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Dashboard</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Project Overview</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Verification Status</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Quality Metrics</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Release Management</a></li>
              <li><a href="#" className="block py-2 px-4 rounded hover:bg-blue-500 hover:text-white">Risk Management</a></li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Active Projects: {realtimeData.activeProjects}</p>
                <p>Active Bugs: {realtimeData.activeBugs}</p>
                <p>Code Coverage: {realtimeData.codeCoverage}%</p>
              </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report New Bug</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={reportNewBug}>Report Bug</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Update Unit Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => updateUnitTestResult(5, 1)}>
                Add 5 Passed, 1 Failed Tests
              </Button>
            </CardContent>
          </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Verification Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={verificationOverviewData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {verificationOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {renderVerificationCard("Static Analysis", realtimeData.staticAnalysis)}
            {renderVerificationCard("Unit Testing", realtimeData.unitTesting)}
            {renderVerificationCard("SIL Testing", realtimeData.sil)}
            {renderVerificationCard("HIL Testing", realtimeData.hil)}
            {renderVerificationCard("Integration Testing", realtimeData.integrationTesting)}
            {renderVerificationCard("Vehicle Testing", realtimeData.vehicleTesting)}

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quality Metrics Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={qualityMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="bugs" stroke="#8884d8" name="Active Bugs" />
                    <Line yAxisId="right" type="monotone" dataKey="coverage" stroke="#82ca9d" name="Code Coverage (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;