'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '@/context/language-context';
import { Alert, AlertDescription } from '@/components/ui/alert';

const translations = {
  en: {
    title: 'Expense Coverage Ratio',
    description: 'How well income covers expenses each season.',
    ratio: 'Coverage Ratio',
    income: 'Income',
    expenses: 'Expenses',
    deficitWarning: (season: string, percentage: number) => `Deficit Alert: In ${season}, expenses exceeded income by ${percentage.toFixed(1)}%.`,
  },
  ar: {
    title: 'نسبة تغطية المصاريف',
    description: 'مدى تغطية الدخل للمصاريف في كل موسم.',
    ratio: 'نسبة التغطية',
    income: 'الدخل',
    expenses: 'المصاريف',
    deficitWarning: (season: string, percentage: number) => `تنبيه عجز: في ${season}، تجاوزت المصاريف الدخل بنسبة ${percentage.toFixed(1)}%.`,
  },
};

interface SeasonalAnalysis {
  name: string;
  income: number;
  expenses: number;
}

const CoverageRatioChart = ({ seasonalAnalysis }: { seasonalAnalysis: SeasonalAnalysis[] }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const data = seasonalAnalysis.map(season => {
    const ratio = season.expenses > 0 ? (season.income / season.expenses) * 100 : (season.income > 0 ? 1000 : 100);
    return {
      ...season,
      ratio: ratio,
    };
  });
  
  const deficits = data.filter(s => s.ratio < 100);

  const getBarColor = (ratio: number) => {
    if (ratio > 100) return '#22c55e'; // green-500
    if (ratio < 100) return '#ef4444'; // red-500
    return '#6b7280'; // gray-500
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-background border rounded-md shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-green-500">{`${t.income}: ${data.income.toLocaleString()} د.ج`}</p>
          <p className="text-sm text-red-500">{`${t.expenses}: ${data.expenses.toLocaleString()} د.ج`}</p>
          <p className="text-sm font-semibold">{`${t.ratio}: ${data.ratio.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold font-headline text-primary">{t.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </CardHeader>
      <CardContent>
         {deficits.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {deficits.map(d => t.deficitWarning(d.name, 100 - d.ratio)).join(' ')}
              </AlertDescription>
            </Alert>
          )}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ratio">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.ratio)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CoverageRatioChart;
