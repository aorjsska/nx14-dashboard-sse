// components/HighchartsDashboard.tsx

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BadgeCheck, Briefcase, Bug, Car, Clock, Code, Cpu, FileText, Info, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VerificationCard from '@/components/verifiction-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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


interface HighchartsDashboardProps {
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

// 타입 정의 확장
declare module 'highcharts' {
  interface ChartOptions {
    zoomType?: 'x' | 'y' | 'xy';
  }
}

// Highcharts 타입 정의 확장
declare module 'highcharts' {
  interface TooltipOptions {
    crosshairs?: boolean | [boolean, boolean] | Highcharts.AxisCrosshairOptions;
  }
}

const HighchartsDashboard: React.FC<HighchartsDashboardProps> = ({ realtimeData, qualityMetrics, verificationHistory }) => {
  const verificationOverviewOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      zoomType: 'x'
    },
    title: {
      text: 'Verification Overview'
    },
    xAxis: {
      categories: verificationHistory.map(entry => entry.timestamp),
      title: {
        text: 'Time'
      }
    },
    yAxis: {
      title: {
        text: 'Number of Passed Tests'
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueSuffix: ' tests passed'
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666'
        }
      }
    },
    series: [{
      name: 'Static Analysis',
      data: verificationHistory.map(entry => entry.staticAnalysis),
      type: 'line'
    }, {
      name: 'Unit Testing',
      data: verificationHistory.map(entry => entry.unitTesting),
      type: 'line'
    }, {
      name: 'SIL',
      data: verificationHistory.map(entry => entry.sil),
      type: 'line'
    }, {
      name: 'HIL',
      data: verificationHistory.map(entry => entry.hil),
      type: 'line'
    }, {
      name: 'Integration Testing',
      data: verificationHistory.map(entry => entry.integrationTesting),
      type: 'line'
    }, {
      name: 'Vehicle Testing',
      data: verificationHistory.map(entry => entry.vehicleTesting),
      type: 'line'
    }]
  };

  const qualityMetricsOptions: Highcharts.Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Quality Metrics Trend'
    },
    xAxis: {
      categories: qualityMetrics.map(metric => metric.name)
    },
    yAxis: [{
      title: {
        text: 'Active Bugs'
      }
    }, {
      title: {
        text: 'Code Coverage (%)'
      },
      opposite: true
    }],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 120,
      verticalAlign: 'top',
      y: 100,
      floating: true,
      backgroundColor: Highcharts.defaultOptions?.legend?.backgroundColor || 'white'
    },
    series: [{
      name: 'Active Bugs',
      type: 'line',
      data: qualityMetrics.map(metric => metric.bugs)
    }, {
      name: 'Code Coverage (%)',
      type: 'line',
      yAxis: 1,
      data: qualityMetrics.map(metric => metric.coverage)
    }]
  };

  // 현재 시간을 "YYYY-MM-DD HH:MM" 형식의 문자열로 반환하는 함수
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // 전체 테스트 수, 통과한 테스트 수, 실패한 테스트 수 계산
  const totalTests = Object.values(realtimeData)
    .filter((value): value is VerificationData => (value as VerificationData).total !== undefined)
    .reduce((sum, stage) => sum + stage.total, 0);

  const passedTests = Object.values(realtimeData)
    .filter((value): value is VerificationData => (value as VerificationData).passed !== undefined)
    .reduce((sum, stage) => sum + stage.passed, 0);

  const failedTests = Object.values(realtimeData)
    .filter((value): value is VerificationData => (value as VerificationData).failed !== undefined)
    .reduce((sum, stage) => sum + stage.failed, 0);

  return (
    <>
      <ProjectOverviewCard
        projectName="Autonomous Driving System V2.0"
        projectDescription="Next-generation autonomous driving software with enhanced safety features and improved real-time decision making."
        currentPhase="Integration Testing"
        totalTestCases={1000}
        passedTestCases={850}
        failedTestCases={100}
        blockedTestCases={50}
        criticalIssues={5}
        codeCoverage={87}
        staticAnalysisIssues={23}
        simulationPassed={92}
        hardwareIntegrationProgress={75}
        requirementsCoverage={95}
        regressionTestSuccess={98}
        lastUpdated={new Date().toLocaleString()}
      />

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Verification Overview Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <HighchartsReact highcharts={Highcharts} options={verificationOverviewOptions} />
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
        testType='static'
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
        testType='unit'
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
        testType='sil'
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
        testType='hil'
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
        testType='integration'
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
        testType='field'
      />

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Verification Overview Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <HighchartsReact highcharts={Highcharts} options={verificationOverviewOptions} />
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Quality Metrics Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <HighchartsReact highcharts={Highcharts} options={qualityMetricsOptions} />
        </CardContent>
      </Card>
    </>
  );
};

interface ProjectOverviewProps {
  projectName: string;
  projectDescription: string;
  currentPhase: string;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  blockedTestCases: number;
  criticalIssues: number;
  codeCoverage: number;
  staticAnalysisIssues: number;
  simulationPassed: number;
  hardwareIntegrationProgress: number;
  requirementsCoverage: number;
  regressionTestSuccess: number;
  lastUpdated: string;
}

const ProjectOverviewCard: React.FC<ProjectOverviewProps> = ({
  projectName,
  projectDescription,
  currentPhase,
  totalTestCases,
  passedTestCases,
  failedTestCases,
  blockedTestCases,
  criticalIssues,
  codeCoverage,
  staticAnalysisIssues,
  simulationPassed,
  hardwareIntegrationProgress,
  requirementsCoverage,
  regressionTestSuccess,
  lastUpdated
}) => {
  const [clientSideDate, setClientSideDate] = React.useState<string>('');
  const passRate = (passedTestCases  / totalTestCases) * 100;

  React.useEffect(() => {
    setClientSideDate(new Date().toLocaleString());
  }, []);

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressStatus = (rate: number) => {
    if (rate >= 80) return "Normal";
    if (rate >= 60) return "Caution";
    return "Critical";
  };

  const verificationMetrics = [
    {
      icon: <FileText className="w-6 h-6 text-green-500" />,
      value: `${requirementsCoverage}%`,
      label: "Requirements Coverage",
      tooltip: "Percentage of requirements covered by tests"
    },
    {
      icon: <Code className="w-6 h-6 text-blue-500" />,
      value: `${codeCoverage}%`,
      label: "Code Coverage",
      tooltip: "Percentage of code covered by tests"
    },
    {
      icon: <Bug className="w-6 h-6 text-yellow-500" />,
      value: staticAnalysisIssues,
      label: "Static Analysis Issues",
      tooltip: "Number of issues identified by static code analysis"
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-500" />,
      value: `${simulationPassed}%`,
      label: "Simulation Passed",
      tooltip: "Percentage of simulations passed successfully"
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-indigo-500" />,
      value: `${regressionTestSuccess}%`,
      label: "Regression Test Success",
      tooltip: "Success rate of regression tests"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      value: criticalIssues,
      label: "Critical Issues",
      tooltip: "Number of critical issues identified during testing"
    }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Car className="w-6 h-6 mr-2" />
          {projectName}
        </CardTitle>
      </CardHeader>
      <CardContent>
      <p className="text-sm text-gray-600 mb-4">{projectDescription}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Verification Status</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Current Phase</TableCell>
                    <TableCell>{currentPhase}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Test Cases</TableCell>
                    <TableCell>{totalTestCases}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Passed</TableCell>
                    <TableCell>{passedTestCases}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Failed</TableCell>
                    <TableCell>{failedTestCases}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Blocked</TableCell>
                    <TableCell>{blockedTestCases}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-auto">
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Last updated: {clientSideDate}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Verification Progress</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{passRate.toFixed(1)}%</span>
                <span className="text-sm text-gray-500">Pass Rate</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                  <div className="w-full h-2 rounded-full bg-muted-foreground overflow-hidden">
                    <div 
                      className={`${getProgressColor(passRate)} h-full`} 
                      style={{ width: `${passRate}%` }}
                    ></div>
                  </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status: {getProgressStatus(passRate)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>              
              <div className="grid grid-cols-2 gap-4">
                {verificationMetrics.map((metric, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center space-x-2">
                          {metric.icon}
                          <div className="text-left">
                            <div className="text-lg font-semibold">{metric.value}</div>
                            <div className="text-sm text-gray-500">{metric.label}</div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{metric.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default HighchartsDashboard;