'use client';

import React, { useRef, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area } from 'recharts';
import { useLanguage } from '@/context/language-context';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


const translations = {
  en: {
    seasonalIncome: 'Seasonal Revenue Evolution',
    income: 'Total Income',
    downloadPNG: 'Download as PNG',
    season: 'Season',
    incomeSource: 'Income Source Ratio',
    subscriptions: 'Subscriptions',
    donations: 'Donations',
    totalIncome: 'Total Income',
    monthlyExpenses: 'Monthly Expenses Analysis',
    expenses: 'Total Expenses',
    salaries: 'Staff Salaries',
    totalExpenses: 'Total Expenses',
    month: 'Month',
    seasonalAnalysis: 'Seasonal Financial Analysis',
    netProfit: 'Net Profit',
    paymentStatusBySeason: 'Payment Status by Season',
    paid: 'Paid',
    unpaid: 'Unpaid',
    all: 'All',
    selectIncomeType: 'Select Income Type',
    expenseComponentRatio: 'Expense Component Ratio',
    selectAnalysisType: 'Select Analysis Type',
  },
  ar: {
    seasonalIncome: 'تطور الإيرادات عبر المواسم',
    income: 'إجمالي المداخيل',
    downloadPNG: 'تحميل كصورة PNG',
    season: 'الموسم',
    incomeSource: 'نسبة مصادر الدخل',
    subscriptions: 'الاشتراكات',
    donations: 'التبرعات',
    totalIncome: 'إجمالي الدخل',
    monthlyExpenses: 'تحليل المصاريف الشهرية',
    expenses: 'إجمالي المصاريف',
    salaries: 'أجور الموظفين',
    totalExpenses: 'إجمالي المصاريف',
    month: 'الشهر',
    seasonalAnalysis: 'تحليل موسمي للإيرادات والمصاريف والربح',
    netProfit: 'صافي الربح',
    paymentStatusBySeason: 'حالة الدفع حسب الموسم',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    all: 'الكل',
    selectIncomeType: 'اختر نوع الدخل',
    expenseComponentRatio: 'نسبة مكونات المصاريف',
    selectAnalysisType: 'اختر نوع التحليل',
  },
};

const incomeSourceColors = {
    [translations.en.subscriptions]: '#22c55e',
    [translations.en.donations]: '#3b82f6',
    [translations.ar.subscriptions]: '#22c55e',
    [translations.ar.donations]: '#3b82f6'
}

const expenseComponentColors = {
    [translations.en.salaries]: '#3b82f6',
    [translations.en.expenses]: '#f97316',
    [translations.ar.salaries]: '#3b82f6',
    [translations.ar.expenses]: '#f97316'
}


const paymentStatusColors = {
    [translations.en.paid]: '#22c55e',
    [translations.en.unpaid]: '#ef4444',
    [translations.ar.paid]: '#22c55e',
    [translations.ar.unpaid]: '#ef4444'
}

const ChartCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();
    const t = translations[language];

    const handleDownload = useCallback(() => {
        if (chartRef.current === null) {
            return;
        }
        toPng(chartRef.current, { cacheBust: true, backgroundColor: 'white', pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error(err);
            });
    }, [chartRef, title]);

    return (
        <Card className={cn("shadow-lg rounded-xl", className)}>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <CardTitle className="font-bold text-primary flex-1">{title}</CardTitle>
                 <Button variant="outline" size="sm" onClick={handleDownload} className="shrink-0">
                    <Download className="mr-2 h-4 w-4" />
                    {t.downloadPNG}
                </Button>
            </CardHeader>
            <CardContent ref={chartRef} className="bg-background p-4">
                {children}
            </CardContent>
        </Card>
    )
}

export default function DashboardCharts({ excelData }: { excelData: any }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeExpenseLine, setActiveExpenseLine] = useState<'total' | 'salaries' | 'expenses' | 'all'>('all');
  const [activeIncomeLine, setActiveIncomeLine] = useState<'total' | 'subscriptions' | 'donations' | 'all'>('all');
  const [activeSeasonalAnalysis, setActiveSeasonalAnalysis] = useState<'all' | 'income' | 'expenses' | 'netProfit'>('all');

  const { totals, monthlyExpenses, seasonalPaymentStatus, seasonalIncomeAnalysis, seasonalAnalysis } = excelData;

  const seasonalRevenueData = seasonalIncomeAnalysis.map((season: any) => ({
      name: season.name,
      [t.subscriptions]: season.subscriptions,
      [t.donations]: season.donations,
      [t.totalIncome]: season.total,
  }));

  const incomeSourceData = [
      { name: t.subscriptions, value: totals.subscriptions },
      { name: t.donations, value: totals.donations }
  ];

  const expenseComponentData = [
      { name: t.salaries, value: totals.salaries },
      { name: t.expenses, value: totals.generalExpenses }
  ];

  const seasonalPaymentData = seasonalPaymentStatus.map((season: any) => ({
    name: season.name,
    [t.paid]: season.paid,
    [t.unpaid]: season.unpaid,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t.seasonalIncome} className="lg:col-span-2">
            <div className="mb-4 w-full sm:w-1/2 md:w-1/3">
                 <Select value={activeIncomeLine} onValueChange={(value: 'total' | 'subscriptions' | 'donations' | 'all') => setActiveIncomeLine(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder={t.selectIncomeType} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t.all}</SelectItem>
                        <SelectItem value="total">{t.totalIncome}</SelectItem>
                        <SelectItem value="subscriptions">{t.subscriptions}</SelectItem>
                        <SelectItem value="donations">{t.donations}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} د.ج`} />
                    <Legend />
                    {(activeIncomeLine === 'subscriptions' || activeIncomeLine === 'all') && (
                        <Line type="monotone" dataKey={t.subscriptions} stroke="#22c55e" strokeWidth={2} />
                    )}
                    {(activeIncomeLine === 'donations' || activeIncomeLine === 'all') && (
                        <Line type="monotone" dataKey={t.donations} stroke="#3b82f6" strokeWidth={2} />
                    )}
                     {(activeIncomeLine === 'total' || activeIncomeLine === 'all') && (
                        <Line type="monotone" dataKey={t.totalIncome} stroke="#f97316" strokeWidth={3} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.incomeSource}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={incomeSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {incomeSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={incomeSourceColors[entry.name as keyof typeof incomeSourceColors]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()} د.ج`, name]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.expenseComponentRatio}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={expenseComponentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {expenseComponentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={expenseComponentColors[entry.name as keyof typeof expenseComponentColors]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()} د.ج`, name]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title={t.monthlyExpenses} className="lg:col-span-2">
            <div className="mb-4 w-full sm:w-1/2 md:w-1/3">
                 <Select value={activeExpenseLine} onValueChange={(value: 'total' | 'salaries' | 'expenses' | 'all') => setActiveExpenseLine(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select expense type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t.all}</SelectItem>
                        <SelectItem value="total">{t.totalExpenses}</SelectItem>
                        <SelectItem value="salaries">{t.salaries}</SelectItem>
                        <SelectItem value="expenses">{t.expenses}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} د.ج`} />
                    <Legend />
                     {(activeExpenseLine === 'salaries' || activeExpenseLine === 'all') && (
                        <Line type="monotone" dataKey="salaries" name={t.salaries} stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                    )}
                    {(activeExpenseLine === 'expenses' || activeExpenseLine === 'all') && (
                        <Line type="monotone" dataKey="expenses" name={t.expenses} stroke="#f97316" strokeWidth={2} activeDot={{ r: 6 }} />
                    )}
                    {(activeExpenseLine === 'total' || activeExpenseLine === 'all') && (
                        <Line type="monotone" dataKey="total" name={t.totalExpenses} stroke="#22c55e" strokeWidth={3} activeDot={{ r: 8 }} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.seasonalAnalysis} className="lg:col-span-2">
             <div className="mb-4 w-full sm:w-1/2 md:w-1/3">
                <Select value={activeSeasonalAnalysis} onValueChange={(value) => setActiveSeasonalAnalysis(value as any)}>
                    <SelectTrigger>
                        <SelectValue placeholder={t.selectAnalysisType} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t.all}</SelectItem>
                        <SelectItem value="income">{t.income}</SelectItem>
                        <SelectItem value="expenses">{t.expenses}</SelectItem>
                        <SelectItem value="netProfit">{t.netProfit}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={seasonalAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} د.ج`} />
                    <Legend />
                    {(activeSeasonalAnalysis === 'income' || activeSeasonalAnalysis === 'all') && (
                        <Line type="monotone" dataKey="income" name={t.income} stroke="#22c55e" strokeWidth={2} />
                    )}
                    {(activeSeasonalAnalysis === 'expenses' || activeSeasonalAnalysis === 'all') && (
                        <Line type="monotone" dataKey="expenses" name={t.expenses} stroke="#f97316" strokeWidth={2} />
                    )}
                    {(activeSeasonalAnalysis === 'netProfit' || activeSeasonalAnalysis === 'all') && (
                        <Line type="monotone" dataKey="netProfit" name={t.netProfit} stroke="#8884d8" strokeWidth={3} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.paymentStatusBySeason} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seasonalPaymentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value}`} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={t.paid} stackId="a" fill={paymentStatusColors[t.paid]} />
                    <Bar dataKey={t.unpaid} stackId="a" fill={paymentStatusColors[t.unpaid]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    </div>
  );
}
