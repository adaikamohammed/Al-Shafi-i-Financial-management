'use client';

import React, { useMemo, useState } from 'react';
import { useExcelData } from '@/context/excel-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { CalendarCheck, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';


const translations = {
  en: {
    title: 'Subscription Status',
    description: 'Payment status for each student across all seasons.',
    noData: 'No subscription data available. Please upload an Excel file on the dashboard.',
    fullName: 'Full Name',
    season1: 'Season 1',
    season2: 'Season 2',
    season3: 'Season 3',
    season4: 'Season 4',
    totalAnnual: 'Total Annual Payment',
    unpaid: 'Unpaid',
    searchByName: 'Search by name...',
    allSeasons: 'All Seasons',
    showUnpaidOnly: 'Show Unpaid Only',
    reset: 'Reset',
    filteredView: 'Filtered View',
    filteredViewDescription: (season: string) => `Showing results for ${season} only. Click reset to show all seasons.`,
    status: 'Status',
  },
  ar: {
    title: 'حالة الاشتراكات',
    description: 'حالة الدفع لكل طالب عبر جميع المواسم.',
    noData: 'لا توجد بيانات للاشتراكات. يرجى رفع ملف Excel في لوحة التحكم.',
    fullName: 'الاسم الكامل',
    season1: 'الموسم 1',
    season2: 'الموسم 2',
    season3: 'الموسم 3',
    season4: 'الموسم 4',
    totalAnnual: 'إجمالي الدفع السنوي',
    unpaid: 'غير مدفوع',
    searchByName: 'البحث بالإسم...',
    allSeasons: 'كل المواسم',
    showUnpaidOnly: 'عرض غير المدفوعين فقط',
    reset: 'إعادة تعيين',
    filteredView: 'عرض مخصص',
    filteredViewDescription: (season: string) => `يتم عرض نتائج ${season} فقط. اضغط على إعادة التعيين لعرض جميع المواسم.`,
    status: 'الحالة',
  },
};

export default function SubscriptionsPage() {
  const { excelData } = useExcelData();
  const { language } = useLanguage();
  const t = translations[language];

  const [filters, setFilters] = useState({
    name: '',
    season: 'all',
    unpaidOnly: false,
  });
  
  const seasonKeys: Record<string, string> = {
    'الموسم 1': t.season1,
    'الموسم 2': t.season2,
    'الموسم 3': t.season3,
    'الموسم 4': t.season4,
  }

  const filteredStudents = useMemo(() => {
    if (!excelData?.students) return [];
    return excelData.students.filter(student => {
      const nameMatch = student['الاسم الكامل'].toLowerCase().includes(filters.name.toLowerCase());
      
      let seasonMatch = true;
      if (filters.unpaidOnly) {
          if (filters.season !== 'all') {
            seasonMatch = (Number(student[filters.season]) || 0) === 0;
          } else {
             seasonMatch = (Number(student['الموسم 1']) || 0) === 0 ||
                           (Number(student['الموسم 2']) || 0) === 0 ||
                           (Number(student['الموسم 3']) || 0) === 0 ||
                           (Number(student['الموسم 4']) || 0) === 0;
          }
      }

      return nameMatch && seasonMatch;
    });
  }, [excelData?.students, filters]);

  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ name: '', season: 'all', unpaidOnly: false });
  };
  
  const getStatusBadge = (value: number | string | undefined) => {
    const amount = Number(value) || 0;
    if (amount > 0) {
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700">{amount.toLocaleString('en-US')} د.ج</Badge>;
    }
    return <Badge variant="destructive">{t.unpaid}</Badge>;
  };

  const calculateTotal = (student: any) => {
    const s1 = Number(student['الموسم 1']) || 0;
    const s2 = Number(student['الموسم 2']) || 0;
    const s3 = Number(student['الموسم 3']) || 0;
    const s4 = Number(student['الموسم 4']) || 0;
    return s1 + s2 + s3 + s4;
  }

  const getPaidSeasonsCount = (student: any) => {
    let count = 0;
    if ((Number(student['الموسم 1']) || 0) > 0) count++;
    if ((Number(student['الموسم 2']) || 0) > 0) count++;
    if ((Number(student['الموسم 3']) || 0) > 0) count++;
    if ((Number(student['الموسم 4']) || 0) > 0) count++;
    return count;
  }
  
  const getTotalBadge = (student: any) => {
      const total = calculateTotal(student);
      const paidCount = getPaidSeasonsCount(student);
      let className = "bg-red-600 hover:bg-red-700";
      if (paidCount >= 3) {
          className = "bg-green-600 hover:bg-green-700";
      } else if (paidCount === 2) {
          className = "bg-yellow-500 hover:bg-yellow-600";
      }
      return <Badge variant="default" className={className}>{total.toLocaleString('en-US')} د.ج</Badge>;
  }


  if (!excelData || !excelData.students) {
    return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                      <CalendarCheck className="h-8 w-8 text-muted-foreground" />
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
    <div className="space-y-4">
       <div>
        <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

       <Card>
        <CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <Input
                    placeholder={t.searchByName}
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="lg:col-span-2"
                />
                <Select value={filters.season} onValueChange={(value) => handleFilterChange('season', value)}>
                    <SelectTrigger><SelectValue placeholder={t.allSeasons} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t.allSeasons}</SelectItem>
                        <SelectItem value="الموسم 1">{t.season1}</SelectItem>
                        <SelectItem value="الموسم 2">{t.season2}</SelectItem>
                        <SelectItem value="الموسم 3">{t.season3}</SelectItem>
                        <SelectItem value="الموسم 4">{t.season4}</SelectItem>
                    </SelectContent>
                </Select>
                 <div className="flex items-center space-x-2">
                    <Switch id="unpaid-only" checked={filters.unpaidOnly} onCheckedChange={(checked) => handleFilterChange('unpaidOnly', checked)} />
                    <Label htmlFor="unpaid-only">{t.showUnpaidOnly}</Label>
                </div>
                 <Button onClick={resetFilters} variant="outline" className="w-full lg:w-auto">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t.reset}
                </Button>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          {filters.season !== 'all' && (
            <Alert className="m-4">
                <AlertTitle>{t.filteredView}</AlertTitle>
                <p>{t.filteredViewDescription(seasonKeys[filters.season])}</p>
            </Alert>
          )}
          <Table>
            <TableHeader>
                {filters.season === 'all' ? (
                  <TableRow>
                    <TableHead>{t.fullName}</TableHead>
                    <TableHead>{t.season1}</TableHead>
                    <TableHead>{t.season2}</TableHead>
                    <TableHead>{t.season3}</TableHead>
                    <TableHead>{t.season4}</TableHead>
                    <TableHead>{t.totalAnnual}</TableHead>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableHead>{t.fullName}</TableHead>
                    <TableHead>{seasonKeys[filters.season]}</TableHead>
                  </TableRow>
                )}
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student['الاسم الكامل']}</TableCell>
                  {filters.season === 'all' ? (
                    <>
                      <TableCell>{getStatusBadge(student['الموسم 1'])}</TableCell>
                      <TableCell>{getStatusBadge(student['الموسم 2'])}</TableCell>
                      <TableCell>{getStatusBadge(student['الموسم 3'])}</TableCell>
                      <TableCell>{getStatusBadge(student['الموسم 4'])}</TableCell>
                      <TableCell>{getTotalBadge(student)}</TableCell>
                    </>
                  ) : (
                    <TableCell>{getStatusBadge(student[filters.season])}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
