'use client';

import React from 'react';
import { useExcelData } from '@/context/excel-data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { Briefcase } from 'lucide-react';

const translations = {
  en: {
    title: 'Staff & Group Analysis',
    description: 'Staff salaries and their group\'s financial performance.',
    noData: 'No staff data available. Please upload an Excel file on the dashboard.',
    fullName: 'Full Name',
    role: 'Role',
    totalSalary: 'Total Annual Salary',
    groupIncome: 'Group Annual Income',
    salaryToIncome: 'Salary vs. Income',
  },
  ar: {
    title: 'تحليل الموظفين والأفواج',
    description: 'رواتب الموظفين والأداء المالي لأفواجهم.',
    noData: 'لا توجد بيانات للموظفين. يرجى رفع ملف Excel في لوحة التحكم.',
    fullName: 'الاسم الكامل',
    role: 'الدور',
    totalSalary: 'الراتب السنوي الإجمالي',
    groupIncome: 'دخل الفوج السنوي',
    salaryToIncome: 'الراتب مقابل الدخل',
  },
};

export default function StaffPage() {
  const { excelData } = useExcelData();
  const { language } = useLanguage();
  const t = translations[language];

  if (!excelData || !excelData.salaries) {
    return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
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

  const { salaries, groupIncome } = excelData;

  const calculateTotalSalary = (staff: any) => {
    return Object.keys(staff).reduce((acc, key) => {
      if (key !== 'الاسم الكامل' && key !== 'الدور') {
        return acc + (Number(staff[key]) || 0);
      }
      return acc;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.fullName}</TableHead>
                <TableHead>{t.role}</TableHead>
                <TableHead>{t.totalSalary}</TableHead>
                <TableHead>{t.groupIncome}</TableHead>
                <TableHead>{t.salaryToIncome}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaries.map((staff, index) => {
                const totalSalary = calculateTotalSalary(staff);
                const staffName = staff['الاسم الكامل'];
                const income = groupIncome[staffName] || 0;
                const ratio = income > 0 ? ((totalSalary / income) * 100).toFixed(1) : 0;
                
                return (
                  <TableRow key={index}>
                    <TableCell>{staffName}</TableCell>
                    <TableCell>{staff['الدور']}</TableCell>
                    <TableCell>{totalSalary.toLocaleString('en-US')} د.ج</TableCell>
                    <TableCell>{income.toLocaleString('en-US')} د.ج</TableCell>
                    <TableCell>{ratio}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
