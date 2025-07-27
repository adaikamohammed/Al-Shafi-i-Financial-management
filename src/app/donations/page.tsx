'use client';

import React from 'react';
import { useExcelData } from '@/context/excel-data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { HeartHandshake } from 'lucide-react';

const translations = {
  en: {
    title: 'Donations',
    description: 'List of all donations from the uploaded file.',
    noData: 'No donation data available. Please upload an Excel file on the dashboard.',
    donorName: 'Donor Name',
    phone: 'Phone Number',
    amount: 'Amount',
    date: 'Date',
    notes: 'Notes',
  },
  ar: {
    title: 'التبرعات',
    description: 'قائمة بجميع التبرعات من الملف الذي تم رفعه.',
    noData: 'لا توجد بيانات للتبرعات. يرجى رفع ملف Excel في لوحة التحكم.',
    donorName: 'اسم الداعم',
    phone: 'رقم الهاتف',
    amount: 'المبلغ',
    date: 'التاريخ',
    notes: 'ملاحظة',
  },
};

export default function DonationsPage() {
  const { excelData } = useExcelData();
  const { language } = useLanguage();
  const t = translations[language];

  if (!excelData || !excelData.donors) {
     return (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                      <HeartHandshake className="h-8 w-8 text-muted-foreground" />
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

  const { donors } = excelData;

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
                <TableHead>{t.donorName}</TableHead>
                <TableHead>{t.phone}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.notes}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor, index) => (
                <TableRow key={index}>
                  <TableCell>{donor['الاسم الكامل']}</TableCell>
                  <TableCell>{donor['رقم الهاتف']}</TableCell>
                  <TableCell>{Number(donor['المبلغ']).toLocaleString('en-US')} د.ج</TableCell>
                  <TableCell>{donor['التاريخ']}</TableCell>
                  <TableCell>{donor['ملاحظة']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
