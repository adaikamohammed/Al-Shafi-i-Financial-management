'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const translations = {
  en: {
    kpiTitle: 'Monthly Financial Performance Indicators (KPIs)',
    incomeChange: 'Income Change %',
    expenseChange: 'Expense Change %',
    netProfit: 'Net Profit',
    comparedToPrevious: 'vs. previous season',
    increase: 'Increase',
    decrease: 'Decrease',
    noComparison: 'No previous season data',
    selectSeason: 'Select Season',
  },
  ar: {
    kpiTitle: 'مؤشرات الأداء المالي الموسمية (KPIs)',
    incomeChange: '🔺 نسبة التغير في المداخيل',
    expenseChange: '🔻 نسبة تغير المصاريف',
    netProfit: '💸 صافي الربح',
    comparedToPrevious: 'مقارنة بالموسم السابق',
    increase: 'ارتفاع',
    decrease: 'تراجع',
    noComparison: 'لا توجد بيانات للمقارنة',
    selectSeason: 'اختر الموسم',
  },
};

interface SeasonalAnalysis {
  name: string;
  income: number;
  expenses: number;
  netProfit: number;
}

const FinancialKpis = ({ seasonalAnalysis }: { seasonalAnalysis: SeasonalAnalysis[] }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const latestSeasonIndex = seasonalAnalysis.length - 1;
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(latestSeasonIndex);

  const selectedSeason = seasonalAnalysis[selectedSeasonIndex];
  const previousSeason = selectedSeasonIndex > 0 ? seasonalAnalysis[selectedSeasonIndex - 1] : null;

  const calculateChange = (current: number, previous: number | undefined) => {
    if (previous === undefined || previous === 0) {
      return { percentage: null, text: t.noComparison };
    }
    const change = ((current - previous) / previous) * 100;
    const isIncrease = change > 0;
    const text = `${isIncrease ? '+' : ''}${change.toFixed(1)}% ${t.comparedToPrevious}`;
    return { percentage: change, text, isIncrease };
  };

  const incomeChange = calculateChange(selectedSeason?.income, previousSeason?.income);
  const expenseChange = calculateChange(selectedSeason?.expenses, previousSeason?.expenses);
  const netProfit = selectedSeason?.netProfit || 0;

  const getChangeColor = (change: number | null, isExpense = false) => {
    if (change === null) return 'text-muted-foreground';
    if (isExpense) {
      return change > 0 ? 'text-red-500' : 'text-green-500';
    }
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-headline text-primary">{t.kpiTitle}</h2>
            <div className="w-48">
                 <Select
                    value={String(selectedSeasonIndex)}
                    onValueChange={(value) => setSelectedSeasonIndex(Number(value))}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder={t.selectSeason} />
                    </SelectTrigger>
                    <SelectContent>
                        {seasonalAnalysis.map((season, index) => (
                        <SelectItem key={index} value={String(index)}>
                            {season.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.incomeChange}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className={`text-2xl font-bold ${getChangeColor(incomeChange.percentage)}`}>
                    {incomeChange.percentage !== null ? `${incomeChange.isIncrease ? '+' : ''}${incomeChange.percentage.toFixed(1)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">{incomeChange.text}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.expenseChange}</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className={`text-2xl font-bold ${getChangeColor(expenseChange.percentage, true)}`}>
                     {expenseChange.percentage !== null ? `${expenseChange.isIncrease ? '+' : ''}${expenseChange.percentage.toFixed(1)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">{expenseChange.text}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.netProfit}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {netProfit.toLocaleString('en-US')} د.ج
                </div>
                <p className="text-xs text-muted-foreground">
                    {selectedSeason?.name || ''}
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default FinancialKpis;
