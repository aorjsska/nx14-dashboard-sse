// src/components/app/dashboard/project-overview/[chartType]/recharts-dashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import VerificationCard from "@/components/verifiction-card";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

interface RechartsDoashboardProps {
  realtimeData: any;  // 실제 데이터 타입에 맞게 정의해야 합니다
  qualityMetrics: any[];  // 실제 데이터 타입에 맞게 정의해야 합니다
  verificationHistory: {
    timestamp: string;
    staticAnalysis: number;
    unitTesting: number;
    sil: number;
    hil: number;
    integrationTesting: number;
    vehicleTesting: number;
  }[];
}


const RechartsDoashboard: React.FC<RechartsDoashboardProps> = ({ realtimeData, qualityMetrics, verificationHistory }) => {
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

   // 현재 시간을 "YYYY-MM-DD HH:MM" 형식의 문자열로 반환하는 함수
   const getCurrentTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <>
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

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Verification Overview</CardTitle>
        </CardHeader>
        <CardContent>
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={verificationHistory}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="staticAnalysis" stroke={colors[0]} activeDot={{ r: 8 }} name="Static Analysis" />
              <Line type="monotone" dataKey="unitTesting" stroke={colors[1]} activeDot={{ r: 8 }} name="Unit Testing" />
              <Line type="monotone" dataKey="sil" stroke={colors[2]} activeDot={{ r: 8 }} name="SIL" />
              <Line type="monotone" dataKey="hil" stroke={colors[3]} activeDot={{ r: 8 }} name="HIL" />
              <Line type="monotone" dataKey="integrationTesting" stroke={colors[4]} activeDot={{ r: 8 }} name="Integration Testing" />
              <Line type="monotone" dataKey="vehicleTesting" stroke={colors[5]} activeDot={{ r: 8 }} name="Vehicle Testing" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <VerificationCard 
        title="Static Analysis" 
        data={{
          ...realtimeData.staticAnalysis,
          lastUpdated: getCurrentTime(),
          criticalIssues: 2,
          averageTestDuration: 45
        }}
        detailPageUrl="/dashboard/verification/static"
        trend="improving"
      />
      <VerificationCard 
        title="Unit Testing" 
        data={{
          ...realtimeData.unitTesting,
          lastUpdated: getCurrentTime(),
          criticalIssues: 1,
          averageTestDuration: 30
        }}
        detailPageUrl="/dashboard/verification/unit"
        trend="stable"
      />
      <VerificationCard 
        title="SIL Testing" 
        data={{
          ...realtimeData.sil,
          lastUpdated: getCurrentTime(),
          criticalIssues: 0,
          averageTestDuration: 60
        }}
        detailPageUrl="/dashboard/verification/sil"
        trend="improving"
      />
      <VerificationCard 
        title="HIL Testing" 
        data={{
          ...realtimeData.hil,
          lastUpdated: getCurrentTime(),
          criticalIssues: 3,
          averageTestDuration: 120
        }}
        detailPageUrl="/dashboard/verification/hil"
        trend="declining"
      />
      <VerificationCard 
        title="Integration Testing" 
        data={{
          ...realtimeData.integrationTesting,
          lastUpdated: getCurrentTime(),
          criticalIssues: 1,
          averageTestDuration: 90
        }}
        detailPageUrl="/dashboard/verification/integration"
        trend="stable"
      />
      <VerificationCard 
        title="Vehicle Testing" 
        data={{
          ...realtimeData.vehicleTesting,
          lastUpdated: getCurrentTime(),
          criticalIssues: 2,
          averageTestDuration: 180
        }}
        detailPageUrl="/dashboard/verification/field"
        trend="improving"
      />

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
    </>
  );
};

export default RechartsDoashboard;