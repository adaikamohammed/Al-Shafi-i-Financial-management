'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Define types for the data
interface Student { [key: string]: any; }
interface Salary { [key:string]: any; }
interface Donor { [key: string]: any; }
interface Expense { [key: string]: any; }

interface ExcelData {
  students: Student[];
  salaries: Salary[];
  donors: Donor[];
  expenses: Expense[];
}

interface ProcessedData extends ExcelData {
  totals: {
    students: number;
    subscriptions: number;
    donations: number;
    expenses: number;
    salaries: number;
    generalExpenses: number;
    income: number;
    netProfit: number;
  };
  unpaidStudents: any[];
  groupIncome: { [key: string]: number };
  monthlyExpenses: { month: string; salaries: number; expenses: number; total: number }[];
  seasonalPaymentStatus: { name: string; paid: number; unpaid: number }[];
  seasonalAnalysis: { name: string; income: number; expenses: number; netProfit: number }[];
  seasonalIncomeAnalysis: { name: string; subscriptions: number; donations: number; total: number }[];
  riskRadar: {
    sourceDependence: number;
    invoiceEscalation: number;
    donorConcentration: number;
  };
}


interface ExcelDataContextProps {
  excelData: ProcessedData | null;
  setExcelData: (data: ExcelData | null) => void;
}

const ExcelDataContext = createContext<ExcelDataContextProps | undefined>(undefined);


const monthOrder = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const salaryMonthMapping: { [key: string]: string } = {
  'شهر جانفي': 'جانفي', 'فيفري': 'فيفري', 'مارس': 'مارس', 'أفريل': 'أفريل', 'ماي': 'ماي', 'جوان': 'جوان',
  'جويلية': 'جويلية', 'أوت': 'أوت', 'سبتمبر': 'سبتمبر', 'أكتوبر': 'أكتوبر', 'نوفمبر': 'نوفمبر', 'ديسمبر': 'ديسمبر'
};


export const ExcelDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ExcelData | null>(null);

  const processedData = useMemo(() => {
    if (!data) return null;

    const { students, salaries, donors, expenses } = data;

    // --- Seasonal Subscriptions and Group Income ---
    const seasonalSubscriptions = { 'الموسم 1': 0, 'الموسم 2': 0, 'الموسم 3': 0, 'الموسم 4': 0 };
    const groupIncome: { [key: string]: number } = {};
    const unpaid: any[] = [];
    const seasonalPaymentStatus = [
        { name: 'الموسم 1', paid: 0, unpaid: 0 },
        { name: 'الموسم 2', paid: 0, unpaid: 0 },
        { name: 'الموسم 3', paid: 0, unpaid: 0 },
        { name: 'الموسم 4', paid: 0, unpaid: 0 },
    ];

    students.forEach(student => {
      const teacher = student['الشيخ/الأستاذة'];
      if (teacher && !groupIncome[teacher]) {
        groupIncome[teacher] = 0;
      }

      for (let i = 1; i <= 4; i++) {
        const seasonKey = `الموسم ${i}` as keyof typeof seasonalSubscriptions;
        const paidAmount = Number(student[seasonKey]) || 0;
        
        seasonalSubscriptions[seasonKey] += paidAmount;
        
        if (teacher) {
            groupIncome[teacher] += paidAmount;
        }

        if (paidAmount === 0) {
            unpaid.push({
                name: student['الاسم الكامل'],
                season: seasonKey,
                teacher: student['الشيخ/الأستاذة'],
            });
            seasonalPaymentStatus[i-1].unpaid += 1;
        } else {
            seasonalPaymentStatus[i-1].paid += 1;
        }
      }
    });

    const totalSalaries = salaries.reduce((acc, staff) => {
        return acc + Object.keys(staff).reduce((staffAcc, key) => {
            if (key !== 'الاسم الكامل' && key !== 'الدور' && !isNaN(Number(staff[key]))) {
                return staffAcc + Number(staff[key]);
            }
            return staffAcc;
        }, 0);
    }, 0);

    const totalGeneralExpenses = expenses.reduce((acc, expense) => acc + (Number(expense['المبلغ']) || 0), 0);
    const totalCosts = totalSalaries + totalGeneralExpenses;

    const monthlySalaries = monthOrder.map(month => ({
        month: month,
        amount: salaries.reduce((acc, staff) => {
            const salaryKey = Object.keys(salaryMonthMapping).find(key => salaryMonthMapping[key] === month) || month;
            return acc + (Number(staff[salaryKey]) || 0);
        }, 0)
    }));
    
    const getDateMonth = (dateValue: any) => {
        if (typeof dateValue === 'number') { // Excel date serial number
            const excelEpoch = new Date(1899, 11, 30);
            const expenseDate = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
            return expenseDate.getUTCMonth();
        } else if (typeof dateValue === 'string') { // Date string 'DD/MM/YYYY' or 'YYYY-MM-DD'
            const parts = dateValue.split(/[\/-]/);
            if (parts.length === 3) {
                 const part1 = parseInt(parts[0], 10);
                 const part2 = parseInt(parts[1], 10);
                 if (!isNaN(part1) && !isNaN(part2)) {
                    // YYYY-MM-DD
                    if (part1 > 12) return part2 - 1;
                    // DD/MM/YYYY
                    return part2 -1;
                 }
            }
        }
        return -1;
    }

    const monthlyGeneralExpenses = monthOrder.map(month => ({ month, amount: 0}));
    expenses.forEach(expense => {
        const monthIndex = getDateMonth(expense['التاريخ']);
        if (monthIndex >= 0 && monthIndex < 12) {
            monthlyGeneralExpenses[monthIndex].amount += Number(expense['المبلغ']) || 0;
        }
    });

    const monthlyExpenses = monthOrder.map((month, index) => {
        const salaries = monthlySalaries[index]?.amount || 0;
        const expenses = monthlyGeneralExpenses[index]?.amount || 0;
        return {
            month,
            salaries,
            expenses,
            total: salaries + expenses,
        }
    });

    const seasonalDonations = { 'الموسم 1': 0, 'الموسم 2': 0, 'الموسم 3': 0, 'الموسم 4': 0 };
    donors.forEach(donor => {
        const month = getDateMonth(donor['التاريخ']);
        if (month >= 0) {
            const amount = Number(donor['المبلغ']) || 0;
            if (month <= 2) seasonalDonations['الموسم 1'] += amount;
            else if (month <= 5) seasonalDonations['الموسم 2'] += amount;
            else if (month <= 8) seasonalDonations['الموسم 3'] += amount;
            else seasonalDonations['الموسم 4'] += amount;
        }
    });
    
    const seasonalIncomeAnalysis = Object.keys(seasonalSubscriptions).map((seasonKey: any) => ({
        name: seasonKey,
        subscriptions: seasonalSubscriptions[seasonKey as keyof typeof seasonalSubscriptions],
        donations: seasonalDonations[seasonKey as keyof typeof seasonalDonations],
        total: seasonalSubscriptions[seasonKey as keyof typeof seasonalSubscriptions] + seasonalDonations[seasonKey as keyof typeof seasonalDonations],
    }));

    const getSeasonIndex = (monthIndex: number) => Math.floor(monthIndex / 3);

    const seasonalExpenses = [0, 0, 0, 0];
    monthlyExpenses.forEach((monthData, index) => {
        const seasonIndex = getSeasonIndex(index);
        seasonalExpenses[seasonIndex] += monthData.total;
    });

    const seasonalAnalysis = seasonalIncomeAnalysis.map((incomeData, index) => {
        const income = incomeData.total;
        const expenses = seasonalExpenses[index];
        const netProfit = income - expenses;
        return {
            name: incomeData.name,
            income,
            expenses,
            netProfit,
        };
    });

    const totalSubscriptions = Object.values(seasonalSubscriptions).reduce((acc, income) => acc + income, 0);
    const totalDonations = donors.reduce((acc, donor) => acc + (Number(donor['المبلغ']) || 0), 0);
    const totalIncome = totalSubscriptions + totalDonations;
    const netProfit = totalIncome - totalCosts;

    // --- Risk Radar Calculations ---
    let sourceDependence = 0;
    if (totalIncome > 0) {
        const maxSource = Math.max(totalSubscriptions, totalDonations);
        const dependenceRatio = (maxSource / totalIncome) * 100;
        if (dependenceRatio >= 70) sourceDependence = 90;
        else if (dependenceRatio >= 50) sourceDependence = 70;
        else if (dependenceRatio >= 30) sourceDependence = 40;
        else sourceDependence = 10;
    }

    let donorConcentration = 0;
    if (donors.length > 0 && totalDonations > 0) {
        const sortedDonors = [...donors].sort((a, b) => (Number(b['المبلغ']) || 0) - (Number(a['المبلغ']) || 0));
        const top3DonorsSum = sortedDonors.slice(0, 3).reduce((acc, donor) => acc + (Number(donor['المبلغ']) || 0), 0);
        const concentrationRatio = (top3DonorsSum / totalDonations) * 100;
        if (concentrationRatio >= 80) donorConcentration = 90;
        else if (concentrationRatio >= 60) donorConcentration = 70;
        else if (concentrationRatio >= 40) donorConcentration = 40;
        else donorConcentration = 10;
    }

    const expensesByTypeAndMonth: { [type: string]: { [month: string]: number } } = {};
    expenses.forEach(expense => {
        const type = expense['نوع المصروف'];
        const amount = Number(expense['المبلغ']) || 0;
        const monthIndex = getDateMonth(expense['التاريخ']);
        
        if (type && monthIndex !== -1) {
            const month = monthOrder[monthIndex];
            if (!expensesByTypeAndMonth[type]) expensesByTypeAndMonth[type] = {};
            expensesByTypeAndMonth[type][month] = (expensesByTypeAndMonth[type][month] || 0) + amount;
        }
    });

    let escalatingExpensesCount = 0;
    Object.keys(expensesByTypeAndMonth).forEach(type => {
        const monthlyValues = monthOrder.map(month => expensesByTypeAndMonth[type][month] || 0);
        for (let i = 2; i < monthlyValues.length; i++) {
            const lastMonth = monthlyValues[i - 1];
            const twoMonthsAgo = monthlyValues[i - 2];
            const currentMonth = monthlyValues[i];

            if (lastMonth > 0 && twoMonthsAgo > 0 &&
                currentMonth > lastMonth * 1.1 &&
                lastMonth > twoMonthsAgo * 1.1) {
                escalatingExpensesCount++;
                break; // Count each type only once
            }
        }
    });

    let invoiceEscalation = 0;
    if (escalatingExpensesCount >= 3) invoiceEscalation = 100;
    else if (escalatingExpensesCount === 2) invoiceEscalation = 75;
    else if (escalatingExpensesCount === 1) invoiceEscalation = 40;


    return {
      ...data,
      totals: {
        students: students.length,
        subscriptions: totalSubscriptions,
        donations: totalDonations,
        expenses: totalCosts,
        salaries: totalSalaries,
        generalExpenses: totalGeneralExpenses,
        income: totalIncome,
        netProfit: netProfit,
      },
      unpaidStudents: unpaid,
      groupIncome,
      monthlyExpenses,
      seasonalPaymentStatus,
      seasonalAnalysis,
      seasonalIncomeAnalysis,
      riskRadar: {
        sourceDependence,
        invoiceEscalation,
        donorConcentration,
      }
    };
  }, [data]);

  const setExcelData = (newData: ExcelData | null) => {
    setData(newData);
  };

  return (
    <ExcelDataContext.Provider value={{ excelData: processedData, setExcelData }}>
      {children}
    </ExcelDataContext.Provider>
  );
};

export const useExcelData = () => {
  const context = useContext(ExcelDataContext);
  if (context === undefined) {
    throw new Error('useExcelData must be used within an ExcelDataProvider');
  }
  return context;
};
