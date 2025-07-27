'use client';

import React, { useState, useMemo } from 'react';
import { useExcelData } from '@/context/excel-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { FileText, Wand2, FileDown } from 'lucide-react';
import { generateFinancialReport, FinancialReportInput, FinancialReportOutput } from '@/ai/flows/ai-powered-report-generation';
import { Skeleton } from '@/components/ui/skeleton';
import FinancialKpis from '@/components/reports/FinancialKpis';
import FinancialRiskRadar from '@/components/reports/FinancialRiskRadar';
import SeasonalPerformance from '@/components/reports/SeasonalPerformance';
import CoverageRatioChart from '@/components/reports/CoverageRatioChart';
import PdfExportDialog from '@/components/reports/PdfExportDialog';

const translations = {
  en: {
    title: 'Smart Reports',
    description: 'Generate AI-powered financial reports and actionable insights.',
    noData: 'No data available. Please upload an Excel file on the dashboard to generate reports.',
    generateMonthly: 'Generate Monthly Report',
    generateAnnual: 'Generate Annual Report',
    generating: 'Generating...',
    reportSummary: 'Report Summary',
    recommendations: 'Actionable Recommendations',
    exportPdf: 'Export PDF Report',
  },
  ar: {
    title: 'التقارير الذكية',
    description: 'إنشاء تقارير مالية مدعومة بالذكاء الاصطناعي وتوصيات قابلة للتنفيذ.',
    noData: 'لا توجد بيانات متاحة. يرجى رفع ملف Excel في لوحة التحكم لإنشاء التقارير.',
    generateMonthly: 'إنشاء تقرير شهري',
    generateAnnual: 'إنشاء تقرير سنوي',
    generating: 'جاري الإنشاء...',
    reportSummary: 'ملخص التقرير المالي',
    recommendations: 'توصيات مالية قابلة للتنفيذ',
    exportPdf: '📄 تحميل تقرير PDF',
  },
};

export default function ReportsPage() {
  const { excelData } = useExcelData();
  const { language } = useLanguage();
  const t = translations[language];
  const [report, setReport] = useState<FinancialReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<'monthly' | 'annual' | null>(null);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);

  const financialDataSummary = useMemo(() => {
    if (!excelData) return '';
    const { totals } = excelData;
    return `
      - Total Students: ${totals.students}
      - Total Subscription Income: ${totals.subscriptions.toLocaleString()} DZD
      - Total Donations: ${totals.donations.toLocaleString()} DZD
      - Total Income: ${totals.income.toLocaleString()} DZD
      - Total Expenses (Salaries + General): ${totals.expenses.toLocaleString()} DZD
        - Salaries: ${totals.salaries.toLocaleString()} DZD
        - General Expenses: ${totals.generalExpenses.toLocaleString()} DZD
      - Net Profit/Loss: ${totals.netProfit.toLocaleString()} DZD (${totals.netProfit >= 0 ? 'Profit' : 'Loss'})
    `;
  }, [excelData]);


  const handleGenerateReport = async (type: 'monthly' | 'annual') => {
    if (!excelData) return;

    setIsLoading(true);
    setReport(null);
    setReportType(type);

    const input: FinancialReportInput = {
      reportType: type,
      financialDataSummary,
    };

    try {
      const result = await generateFinancialReport(input);
      setReport(result);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!excelData) {
    return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
              </CardHeader>
              <CardContent>
                  <CardTitle>{t.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{t.noData}</p>
              </CardContent>
          </Card>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => handleGenerateReport('monthly')} disabled={isLoading && reportType === 'monthly'}>
                <Wand2 className="mr-2 h-4 w-4" />
                {isLoading && reportType === 'monthly' ? t.generating : t.generateMonthly}
            </Button>
            <Button onClick={() => handleGenerateReport('annual')} disabled={isLoading && reportType === 'annual'}>
                <Wand2 className="mr-2 h-4 w-4" />
                {isLoading && reportType === 'annual' ? t.generating : t.generateAnnual}
            </Button>
             <PdfExportDialog excelData={excelData} aiReport={report} aiSummary={financialDataSummary}>
                <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    {t.exportPdf}
                </Button>
            </PdfExportDialog>
          </div>
      </div>
      
      <div id="kpis-section">
        <FinancialKpis seasonalAnalysis={excelData.seasonalAnalysis} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3" id="seasonal-performance-section">
          <SeasonalPerformance seasonalAnalysis={excelData.seasonalAnalysis} />
        </div>
        <div className="lg:col-span-2" id="coverage-ratio-section">
          <CoverageRatioChart seasonalAnalysis={excelData.seasonalAnalysis} />
        </div>
      </div>
      
      <div id="risk-radar-section">
        <FinancialRiskRadar riskData={excelData.riskRadar} />
      </div>

      {(isLoading || report) && (
        <div id="ai-report-section">
            {isLoading && (
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            </div>
            )}

            {report && (
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                <CardHeader>
                    <CardTitle>{t.reportSummary}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{report.reportSummary}</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>{t.recommendations}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{report.actionableRecommendations}</p>
                </CardContent>
                </Card>
            </div>
            )}
        </div>
      )}
    </div>
  );
}
