'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

const translations = {
  en: {
    title: 'Seasonal Performance Classification',
    season: 'Season',
    rating: 'Rating',
    netProfit: 'Net Profit',
    excellent: 'Excellent (Large Surplus)',
    average: 'Average',
    balanced: 'Balanced',
    weak: 'Weak (Loss)',
  },
  ar: {
    title: 'تصنيف المواسم حسب الأداء المالي',
    season: 'الموسم',
    rating: 'التقييم',
    netProfit: 'صافي الربح',
    excellent: 'ممتاز (فائض كبير)',
    average: 'متوسط',
    balanced: 'متوازن',
    weak: 'ضعيف (خسارة)',
  },
};

interface SeasonalAnalysis {
  name: string;
  netProfit: number;
}

const SeasonalPerformance = ({ seasonalAnalysis }: { seasonalAnalysis: SeasonalAnalysis[] }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const classifySeason = (profit: number) => {
    if (profit >= 150000) {
      return { status: t.excellent, icon: '✅', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' };
    }
    if (profit >= 50000) {
      return { status: t.average, icon: '🟠', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' };
    }
    if (profit >= 0) {
      return { status: t.balanced, icon: '🟡', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' };
    }
    return { status: t.weak, icon: '🔴', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' };
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold font-headline text-primary">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.season}</TableHead>
              <TableHead>{t.rating}</TableHead>
              <TableHead className="text-right">{t.netProfit}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasonalAnalysis.map((season) => {
              const classification = classifySeason(season.netProfit);
              return (
                <TableRow key={season.name}>
                  <TableCell className="font-medium">{season.name}</TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold w-fit", classification.color)}>
                        <span>{classification.icon}</span>
                        <span>{classification.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("text-right font-bold", season.netProfit >= 0 ? 'text-green-600' : 'text-red-600')}>{season.netProfit.toLocaleString('en-US')} د.ج</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SeasonalPerformance;
