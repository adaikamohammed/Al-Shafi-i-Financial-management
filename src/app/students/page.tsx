'use client';

import React, { useMemo, useState } from 'react';
import { useExcelData } from '@/context/excel-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { Users, Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const translations = {
  en: {
    title: 'Students',
    description: 'List of all students from the uploaded file.',
    noData: 'No student data available. Please upload an Excel file on the dashboard.',
    fullName: 'Full Name',
    gender: 'Gender',
    level: 'Level',
    group: 'Group',
    teacher: 'Teacher',
    season1: 'Season 1',
    season2: 'Season 2',
    season3: 'Season 3',
    season4: 'Season 4',
    notes: 'Notes',
    searchByName: 'Search by name...',
    allGroups: 'All Groups',
    allLevels: 'All Levels',
    allTeachers: 'All Teachers',
    search: 'Search',
    reset: 'Reset',
  },
  ar: {
    title: 'الطلاب',
    description: 'قائمة بجميع الطلاب من الملف الذي تم رفعه.',
    noData: 'لا توجد بيانات للطلاب. يرجى رفع ملف Excel في لوحة التحكم.',
    fullName: 'الاسم الكامل',
    gender: 'الجنس',
    level: 'المستوى',
    group: 'الفوج',
    teacher: 'الشيخ/الأستاذة',
    season1: 'الموسم 1',
    season2: 'الموسم 2',
    season3: 'الموسم 3',
    season4: 'الموسم 4',
    notes: 'ملاحظات',
    searchByName: 'البحث بالإسم...',
    allGroups: 'كل الأفواج',
    allLevels: 'كل المستويات',
    allTeachers: 'كل المشايخ',
    search: 'بحث',
    reset: 'إعادة تعيين',
  },
};

export default function StudentsPage() {
  const { excelData } = useExcelData();
  const { language } = useLanguage();
  const t = translations[language];

  const [filters, setFilters] = useState({
    name: '',
    group: 'all',
    level: 'all',
    teacher: 'all',
  });

  const uniqueGroups = useMemo(() => {
    if (!excelData?.students) return [];
    const groups = new Set(excelData.students.map(s => s['الفوج']));
    return ['all', ...Array.from(groups)];
  }, [excelData?.students]);

  const uniqueLevels = useMemo(() => {
    if (!excelData?.students) return [];
    const levels = new Set(excelData.students.map(s => s['المستوى']));
    return ['all', ...Array.from(levels)];
  }, [excelData?.students]);

  const uniqueTeachers = useMemo(() => {
    if (!excelData?.students) return [];
    const teachers = new Set(excelData.students.map(s => s['الشيخ/الأستاذة']));
    return ['all', ...Array.from(teachers)];
  }, [excelData?.students]);

  const filteredStudents = useMemo(() => {
    if (!excelData?.students) return [];
    return excelData.students.filter(student => {
      const nameMatch = student['الاسم الكامل'].toLowerCase().includes(filters.name.toLowerCase());
      const groupMatch = filters.group === 'all' || student['الفوج'] === filters.group;
      const levelMatch = filters.level === 'all' || student['المستوى'] === filters.level;
      const teacherMatch = filters.teacher === 'all' || student['الشيخ/الأستاذة'] === filters.teacher;
      return nameMatch && groupMatch && levelMatch && teacherMatch;
    });
  }, [excelData?.students, filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setFilters({ name: '', group: 'all', level: 'all', teacher: 'all' });
  }

  if (!excelData || !excelData.students) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                    <Users className="h-8 w-8 text-muted-foreground" />
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

       <Card id="students-table">
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Input
              placeholder={t.searchByName}
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
            <Select value={filters.group} onValueChange={(value) => handleFilterChange('group', value)}>
                <SelectTrigger><SelectValue placeholder={t.allGroups} /></SelectTrigger>
                <SelectContent>
                    {uniqueGroups.map((group) => (
                        <SelectItem key={group} value={group}>{group === 'all' ? t.allGroups : group}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                <SelectTrigger><SelectValue placeholder={t.allLevels} /></SelectTrigger>
                <SelectContent>
                    {uniqueLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level === 'all' ? t.allLevels : level}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
             <Select value={filters.teacher} onValueChange={(value) => handleFilterChange('teacher', value)}>
                <SelectTrigger><SelectValue placeholder={t.allTeachers} /></SelectTrigger>
                <SelectContent>
                    {uniqueTeachers.map((teacher) => (
                        <SelectItem key={teacher} value={teacher}>{teacher === 'all' ? t.allTeachers : teacher}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
             <div className="flex gap-2">
                 <Button onClick={resetFilters} variant="outline" className="w-full">
                    <RotateCcw />
                    {t.reset}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.fullName}</TableHead>
                <TableHead>{t.gender}</TableHead>
                <TableHead>{t.level}</TableHead>
                <TableHead>{t.group}</TableHead>
                <TableHead>{t.teacher}</TableHead>
                <TableHead>{t.season1}</TableHead>
                <TableHead>{t.season2}</TableHead>
                <TableHead>{t.season3}</TableHead>
                <TableHead>{t.season4}</TableHead>
                <TableHead>{t.notes}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student['الاسم الكامل']}</TableCell>
                  <TableCell>{student['الجنس']}</TableCell>
                  <TableCell>{student['المستوى']}</TableCell>
                  <TableCell>{student['الفوج']}</TableCell>
                  <TableCell>{student['الشيخ/الأستاذة']}</TableCell>
                  <TableCell>{student['الموسم 1']}</TableCell>
                  <TableCell>{student['الموسم 2']}</TableCell>
                  <TableCell>{student['الموسم 3']}</TableCell>
                  <TableCell>{student['الموسم 4']}</TableCell>
                  <TableCell>{student['ملاحظات']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
