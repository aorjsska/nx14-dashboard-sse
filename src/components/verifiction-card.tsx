"use client"

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Info, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, Code, Box, Zap, Car, FileText, Activity } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';

interface VerificationData {
  passed: number;
  failed: number;
  total: number;
  lastUpdated?: string;
  criticalIssues?: number;
  averageTestDuration?: number;
  coveragePercentage?: number;
  blockers?: number;
}

interface VerificationCardProps {
  title: string;
  data: VerificationData;
  detailPageUrl: string;
  trend: 'improving' | 'declining' | 'stable';
  testType: 'static' | 'unit' | 'sil' | 'hil' | 'integration' | 'field';
}

const VerificationCard: React.FC<VerificationCardProps> = ({ title, data, detailPageUrl, trend, testType }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const passRate = (data.passed / (data.total || 1)) * 100;
  const formattedPassRate = passRate.toFixed(1);

  const getTestTypeIcon = () => {
    switch (testType) {
      case 'static':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'unit':
        return <Code className="h-5 w-5 text-green-500" />;
      case 'sil':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'hil':
        return <Activity className="h-5 w-5 text-purple-500" />;
      case 'integration':
        return <Box className="h-5 w-5 text-indigo-500" />;
      case 'field':
        return <Car className="h-5 w-5 text-red-500" />;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg font-semibold flex justify-center items-center gap-2">
              {getTestTypeIcon()}
              {title}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className='m-0 p-0'>
                        <Info className="h-4 w-4"/>
                      </Button>       
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>{title} Detailed Report</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Passed</TableCell>
                                    <TableCell>{data.passed}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Failed</TableCell>
                                    <TableCell>{data.failed}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell>{data.total}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Pass Rate</TableCell>
                                    <TableCell>{formattedPassRate}%</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                          </div>
                        <div>
                        <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Last Updated</TableCell>
                              <TableCell>{data.lastUpdated || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Critical Issues</TableCell>
                              <TableCell>{data.criticalIssues || 0}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Avg. Test Duration</TableCell>
                              <TableCell>{data.averageTestDuration ? `${data.averageTestDuration}s` : 'N/A'}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                  </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Test Progress</h3>
                      <Progress value={passRate} className="h-4" />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                </DialogContent>
              </Dialog>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>View detailed information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold">{formattedPassRate}%</span>
          <span className="text-sm text-gray-500">Pass Rate</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  {passRate >= 90 ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : passRate < 70 ? (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  ) : (
                    <Info className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {passRate >= 90
                    ? 'Excellent pass rate'
                    : passRate < 70
                    ? 'Low pass rate, needs attention'
                    : 'Moderate pass rate'}
                  <br />
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="w-full bg-red-500 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${passRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{data.passed} passed</span>
          <span>{data.failed} failed</span>
        </div>
        {isExpanded && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>Total Tests: {data.total}</div>
            <div>Critical Issues: {data.criticalIssues || 0}</div>
            <div>Avg. Duration: {data.averageTestDuration ? `${data.averageTestDuration}s` : 'N/A'}</div>
            <div>Coverage: {data.coveragePercentage ? `${data.coveragePercentage}%` : 'N/A'}</div>
            <div>Blockers: {data.blockers || 0}</div>
            <div>Last Updated: {data.lastUpdated || 'N/A'}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-between'> 
        <Link 
          href={detailPageUrl} 
          className="w-full"
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button variant="outline" className="w-full">
            View Full Report
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};


export default VerificationCard;