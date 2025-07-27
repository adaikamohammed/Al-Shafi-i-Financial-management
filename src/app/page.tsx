'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useLanguage } from '@/context/language-context';
import { useExcelData } from '@/context/excel-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Download, BarChart, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import DashboardCharts from '@/components/reports/DashboardCharts';

const translations = {
    en: {
        title: "Annual Financial Analysis",
        description: "Upload your annual Excel file to see the financial overview.",
        downloadTemplate: "Download Annual Template",
        uploadFile: "Upload Year File",
        uploading: "Uploading...",
        analysisDashboard: "Analysis Dashboard",
        noData: "No data uploaded. Please upload an Excel file to begin.",
        totalStudents: "Total Students",
        totalIncome: "Total Income",
        totalExpenses: "Total Expenses",
        netProfit: "Net Profit",
        unpaidStudents: "Students with Unpaid Fees",
        studentName: "Student Name",
        season: "Season",
        teacher: "Teacher",
        instructionsTitle: "Instructions",
        instructionsText: "Please enter the exact amount paid for each student in each season (e.g., 2500, 2000, 1500, 0). Enter 0 if the student has not paid.",
    },
    ar: {
        title: "التحليل المالي السنوي",
        description: "ارفع ملف Excel السنوي لعرض النظرة العامة المالية.",
        downloadTemplate: "📥 تحميل النموذج السنوي",
        uploadFile: "📤 رفع ملف السنة",
        uploading: "جاري الرفع...",
        analysisDashboard: "لوحة التحكم التحليلية",
        noData: "لا توجد بيانات. يرجى رفع ملف Excel للبدء.",
        totalStudents: "إجمالي الطلاب",
        totalIncome: "إجمالي الدخل",
        totalExpenses: "إجمالي المصروفات",
        netProfit: "صافي الربح",
        unpaidStudents: "الطلاب غير المسددين للرسوم",
        studentName: "اسم الطالب",
        season: "الموسم",
        teacher: "الشيخ/الأستاذة",
        instructionsTitle: "تعليمات",
        instructionsText: "يرجى إدخال المبلغ المدفوع بالضبط لكل طالب في كل موسم (مثلاً: 2500، 2000، 1500، 0). أدخل 0 إن لم يدفع الطالب.",
    }
};

export default function HomePage() {
    const { language } = useLanguage();
    const t = translations[language];
    const { excelData, setExcelData } = useExcelData();
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const studentsSheet = XLSX.utils.sheet_to_json(workbook.Sheets['الطلبة']);
                const salariesSheet = XLSX.utils.sheet_to_json(workbook.Sheets['الرواتب']);
                const donorsSheet = XLSX.utils.sheet_to_json(workbook.Sheets['الداعمين']);
                const expensesSheet = XLSX.utils.sheet_to_json(workbook.Sheets['المصاريف']);

                setExcelData({
                    students: studentsSheet,
                    salaries: salariesSheet,
                    donors: donorsSheet,
                    expenses: expensesSheet,
                });
            } catch (error) {
                console.error("Error processing Excel file:", error);
                // You might want to show a toast notification here
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDownloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        
        const ws_students_data = [
            ["الاسم الكامل", "الجنس", "المستوى", "الفوج", "الشيخ/الأستاذة", "الموسم 1", "الموسم 2", "الموسم 3", "الموسم 4", "ملاحظات"],
            ["أحمد بوحاج", "ذكر", "2 متوسط", "فوج 3", "الشيخ أحمد بن عمر", 2500, 0, 2500, 2500, "تأخر فصل"],
        ];
        const ws_students = XLSX.utils.aoa_to_sheet(ws_students_data);
        XLSX.utils.book_append_sheet(wb, ws_students, "الطلبة");

        const ws_salaries_data = [
            ["الاسم الكامل", "الدور", "شهر جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
            ["الشيخ صهيب نصيب", "شيخ", 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000],
        ];
        const ws_salaries = XLSX.utils.aoa_to_sheet(ws_salaries_data);
        XLSX.utils.book_append_sheet(wb, ws_salaries, "الرواتب");

        const ws_donors_data = [
            ["الاسم الكامل", "رقم الهاتف", "المبلغ", "التاريخ", "ملاحظة"],
            ["عبد القادر حميدي", "0694123456", 30000, "15/02/2024", "دعم موسم الشتاء"],
        ];
        const ws_donors = XLSX.utils.aoa_to_sheet(ws_donors_data);
        XLSX.utils.book_append_sheet(wb, ws_donors, "الداعمين");

        const ws_expenses_data = [
            ["البيان", "المبلغ", "الشهر", "نوع المصروف", "ملاحظة"],
            ["إصلاح مكيف فوج 2", 12000, "مارس", "صيانة", "دورة الصيف"],
        ];
        const ws_expenses = XLSX.utils.aoa_to_sheet(ws_expenses_data);
        XLSX.utils.book_append_sheet(wb, ws_expenses, "المصاريف");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), "نموذج_البيانات_السنوي.xlsx");
    };

    function s2ab(s: string) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const { totals, unpaidStudents } = excelData || {};

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
                    <p className="text-muted-foreground">{t.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleDownloadTemplate}
                        className="w-full md:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {t.downloadTemplate}
                    </Button>
                    <Button asChild className="w-full md:w-auto">
                         <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center">
                            <Upload className="mr-2 h-4 w-4" />
                            {isLoading ? t.uploading : t.uploadFile}
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" disabled={isLoading} />
                        </label>
                    </Button>
                </div>
            </div>

            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{t.instructionsTitle}</AlertTitle>
                <AlertDescription>
                    {t.instructionsText}
                </AlertDescription>
            </Alert>

            {!excelData || excelData.students.length === 0 ? (
                 <Card className="flex h-64 flex-col items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                               <BarChart className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold">{t.analysisDashboard}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t.noData}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-8">
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.totalStudents}</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{totals?.students}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.totalIncome}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{totals?.income.toLocaleString('en-US')} د.ج</div>
                          </CardContent>
                        </Card>
                         <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.totalExpenses}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{totals?.expenses.toLocaleString('en-US')} د.ج</div>
                          </CardContent>
                        </Card>
                        <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.netProfit}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{totals?.netProfit.toLocaleString('en-US')} د.ج</div>
                          </CardContent>
                        </Card>
                      </div>
                    
                    <DashboardCharts excelData={excelData} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="text-destructive"/>
                                {t.unpaidStudents}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t.studentName}</TableHead>
                                        <TableHead>{t.teacher}</TableHead>
                                        <TableHead>{t.season}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {unpaidStudents?.map((student: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.teacher}</TableCell>
                                            <TableCell>{student.season}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
