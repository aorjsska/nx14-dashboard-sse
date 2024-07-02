// src/app/dashboard/project-overview/[chartType]/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import RechartsDoashboard from '@/components/app/dashboard/project-overview/[chartType]/recharts-dashboard';
import HighchartsDashboard from '@/components/app/dashboard/project-overview/[chartType]/highcharts-dashboard';


// 타입 정의
interface VerificationData {
  passed: number;
  failed: number;
  total: number;
}

interface RealtimeData {
  activeBugs: number;
  codeCoverage: number;
  activeProjects: number;
  staticAnalysis: VerificationData;
  unitTesting: VerificationData;
  sil: VerificationData;
  hil: VerificationData;
  integrationTesting: VerificationData;
  vehicleTesting: VerificationData;
}

interface QualityMetric {
  name: string;
  bugs: number;
  coverage: number;
}

interface VerificationHistoryEntry {
  timestamp: string;
  staticAnalysis: number;
  unitTesting: number;
  sil: number;
  hil: number;
  integrationTesting: number;
  vehicleTesting: number;
}

const Dashboard = () => {
  const params = useParams();
  const chartType = params.chartType as string;

  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    activeBugs: 0,
    codeCoverage: 0,
    activeProjects: 0,
    staticAnalysis: { passed: 0, failed: 0, total: 0 },
    unitTesting: { passed: 0, failed: 0, total: 0 },
    sil: { passed: 0, failed: 0, total: 0 },
    hil: { passed: 0, failed: 0, total: 0 },
    integrationTesting: { passed: 0, failed: 0, total: 0 },
    vehicleTesting: { passed: 0, failed: 0, total: 0 },
  });
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryEntry[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as RealtimeData;
      setRealtimeData(data);
      
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
    };

    // 예시 verificationHistory 데이터 생성
    const generateVerificationHistory = () => {
      const history: VerificationHistoryEntry[] = [];
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        history.push({
          timestamp: date.toISOString().split('T')[0],
          staticAnalysis: Math.floor(Math.random() * 100) + 50,
          unitTesting: Math.floor(Math.random() * 100) + 50,
          sil: Math.floor(Math.random() * 100) + 50,
          hil: Math.floor(Math.random() * 100) + 50,
          integrationTesting: Math.floor(Math.random() * 100) + 50,
          vehicleTesting: Math.floor(Math.random() * 100) + 50,
        });
      }
      setVerificationHistory(history);
    };

    generateVerificationHistory();

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chartType === 'recharts' ? (
        <RechartsDoashboard 
          realtimeData={realtimeData} 
          qualityMetrics={qualityMetrics} 
          verificationHistory={verificationHistory}
        />
      ) : (
        <HighchartsDashboard 
          realtimeData={realtimeData} 
          qualityMetrics={qualityMetrics}
          verificationHistory={verificationHistory}
        />
      )}
    </div>
  );
};

export default Dashboard;