'use client';

import React from 'react';
import { useExcelData } from '@/context/excel-data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { Receipt } from 'lucide-react';

const translations = {
  en: {
    title: 'Expenses',
    description: 'List of all expenses from the uploaded file.',
    noData: 'No expense data available. Please upload an Excel file on the dashboard.',
    item: 'Item',
    amount: 'Amount',
    date: 'Date',
    type: 'Type',
    notes: 'Notes',
  },
  ar: {
    title: 'المصاريف',
    description: 'قائمة بجميع المصاريف من الملف الذي تم رفعه.',
    noData: 'لا توجد بيانات للمصاريف. يرجى رفع ملف Excel في لوحة التحكم.',
    item: 'البيان',
    amount: 'المبلغ',
    date: 'التاريخ',
    type: 'نوع المصروف',
    notes: 'ملاحظة',
  },
};

export default function ExpensesPage() {
  const { excelData } = useExcelData();
  const { language } = useLanguage();
  const t = translations[language];

  if (!excelData || !excelData.expenses) {
    return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                      <Receipt className="h-8 w-8 text-muted-foreground" />
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

  const { expenses } = excelData;

  return (
    <div className="space-y-4">
       <div>
        <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>
      <Card id="expenses-table">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.item}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.type}</TableHead>
                <TableHead>{t.notes}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense['البيان']}</TableCell>
                  <TableCell>{Number(expense['المبلغ']).toLocaleString('en-US')} د.ج</TableCell>
                  <TableCell>{expense['التاريخ']}</TableCell>
                  <TableCell>{expense['نوع المصروف']}</TableCell>
                  <TableCell>{expense['ملاحظة']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
