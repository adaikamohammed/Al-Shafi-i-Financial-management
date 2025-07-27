
'use client';

import React, { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { BookOpenCheck, Loader2 } from 'lucide-react';

const translations = {
    en: {
        title: "Generate PDF Report",
        description: "Select the sections you want to include in the PDF report.",
        generate: "Generate PDF",
        generating: "Generating...",
        sections: "Sections to Include",
        managementSummary: "Management Summary",
        financialCharts: "Financial Charts",
        unpaidStudents: "Unpaid Students List",
        detailedExpenses: "Detailed Expenses List",
        kpis: "Financial KPIs",
        riskRadar: "Financial Risk Radar",
        seasonalPerformance: "Seasonal Performance",
        coverageRatio: "Expense Coverage Ratio",
    },
    ar: {
        title: "📄 توليد تقرير PDF",
        description: "اختر الأقسام التي تريد تضمينها في تقرير PDF.",
        generate: "توليد PDF",
        generating: "جاري التوليد...",
        sections: "الأقسام المراد تضمينها",
        managementSummary: "ملخص الإدارة",
        financialCharts: "الرسوم البيانية المالية",
        unpaidStudents: "قائمة الطلاب غير المسددين",
        detailedExpenses: "قائمة المصاريف التفصيلية",
        kpis: "مؤشرات الأداء المالي",
        riskRadar: "رادار المخاطر المالية",
        seasonalPerformance: "أداء المواسم",
        coverageRatio: "نسبة تغطية المصاريف",
    }
};

interface PdfExportDialogProps {
    children: React.ReactNode;
    excelData: any;
    aiReport: any;
    aiSummary: string;
}

interface Section {
    id: string;
    label: string;
    elementId: string;
}

export default function PdfExportDialog({ children, excelData, aiReport, aiSummary }: PdfExportDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
        managementSummary: true,
        kpis: true,
        riskRadar: true,
        seasonalPerformance: true,
        coverageRatio: true,
        unpaidStudents: false,
        detailedExpenses: false,
    });
    const { language } = useLanguage();
    const t = translations[language];

    const sections: Section[] = [
        { id: 'managementSummary', label: t.managementSummary, elementId: 'ai-report-section' },
        { id: 'kpis', label: t.kpis, elementId: 'kpis-section' },
        { id: 'riskRadar', label: t.riskRadar, elementId: 'risk-radar-section'},
        { id: 'seasonalPerformance', label: t.seasonalPerformance, elementId: 'seasonal-performance-section'},
        { id: 'coverageRatio', label: t.coverageRatio, elementId: 'coverage-ratio-section'},
        { id: 'unpaidStudents', label: t.unpaidStudents, elementId: 'students-table' },
        { id: 'detailedExpenses', label: t.detailedExpenses, elementId: 'expenses-table' },
    ];

    const handleCheckboxChange = (id: string) => {
        setSelectedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    const addHeader = (doc: jsPDF, pageTitle: string) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text('Al-Shafi\'i Financial Hub', 15, 15);
            doc.text(new Date().toLocaleDateString(), doc.internal.pageSize.width - 40, 15);
            doc.line(15, 20, doc.internal.pageSize.width - 15, 20);
             if (i === 1) {
                doc.setFontSize(18);
                doc.text(pageTitle, doc.internal.pageSize.width / 2, 35, { align: 'center' });
            }
        }
    };

    const addElementToPdf = async (doc: jsPDF, elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        try {
            const dataUrl = await toPng(element, { 
                cacheBust: true, 
                backgroundColor: 'white',
                pixelRatio: 2,
                style: {}
            });
            const imgProps = doc.getImageProperties(dataUrl);
            const pdfWidth = doc.internal.pageSize.getWidth() - 30; // with margin
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let currentY = doc.internal.pageSize.height - pdfHeight - 20;
            const pageHeight = doc.internal.pageSize.getHeight();
            
            if (doc.internal.pages.length === 1 && doc.internal.getCurrentPageInfo().pageNumber === 1 && doc.output('datauristring') === "data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggODQ+PgpzdHJlYW0KeJxdkL0KwjAMhfc+xV8sP4Bbo4tNlFhL7dJz4/sv6OgcKq4g6DZD8v778l5cFLdO3eM0SVnAJiFhMRkZ703dI2fJz2zyFvPTEpLurTo0G/T2b/J71T6Bf0A9BqLh11aB/8/Z9/Ac5y2wxxhmnY/D5p41P1u25Gv1dGkpR8Ge7C/nN4KSAJcKAHGkYXohYlWJ2H0s+2s4M0Kq3EskcZgGfL/wpcJmRSCgplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSIF0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2E+PgplbmRvYmoKMiAwIG9iago8PC9Qcm9jU2V0IFsvUERGL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8L0YxIDUgMCBSID4+Ci9YT2JqZWN0IDw8Pj4KPj4KZW5kb2JqCjYgMCBvYmoKPDwvUHJvZHVjZXIgKGpzUERGIDEuMy4yKQovQ3JlYXRpb25EYXRlIChEOjIwMTQwNDI0MDkyMjUxKzAyJzAwJyk+PgplbmRvYmoKNyAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgo+PgplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMjU2IDAwMDAwIG4gCjAwMDAwMDA0MTYgMDAwMDAgbiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDg3IDAwMDAwIG4gCjAwMDAwMDAzNDEgMDAwMDAgbiAKMDAwMDAwMDA1MTUgMDAwMDAwIG4gCjAwMDAwMDAwNjAyIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA4L1Jvb3QgNyAwIFIKL0luZm8gNiAwIFIKL0lEIFs8ZDAwZjgyN2E3M2RkOTE0NDg1ZDllMjQ1NmU5OTkwYzk+PGQwMGY4MjdhNzNkZDkxNDQ4NWQ5ZTI0NTZlOTk5MGM5Pl0KPj4Kc3RhcnR4cmVmCjY4OAolJUVPRgo=") {
                doc.addPage();
                doc.setPage(doc.internal.getNumberOfPages());
                currentY = 40;
            } else if (pdfHeight > pageHeight - 40) {
                 doc.addPage();
                 currentY = 40;
            } else {
                 doc.addPage();
                 currentY = 40;
            }


            doc.addImage(dataUrl, 'PNG', 15, currentY, pdfWidth, pdfHeight);

        } catch (error) {
            console.error(`Failed to capture element ${elementId}`, error);
        }
    };
    
    const addTextSection = (doc: jsPDF, title: string, content: string) => {
        doc.addPage();
        doc.setFontSize(16);
        doc.text(title, 15, 40);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(content.replace(/^\s*[\r\n]/gm, ''), doc.internal.pageSize.width - 30);
        doc.text(splitText, 15, 50);
    }


    const generatePdf = useCallback(async () => {
        setIsLoading(true);

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });
        
        doc.setFont('Helvetica', 'sans-serif');
        doc.deletePage(1);

        for (const section of sections) {
            if (selectedSections[section.id]) {
                 if (section.id === 'managementSummary') {
                    if (aiReport) {
                        addTextSection(doc, t.managementSummary, aiReport.reportSummary);
                        addTextSection(doc, "Actionable Recommendations", aiReport.actionableRecommendations);
                    } else {
                        addTextSection(doc, t.managementSummary, aiSummary);
                    }
                }
                else {
                    await addElementToPdf(doc, section.elementId);
                }
            }
        }
        
        addHeader(doc, "Financial Report");
        doc.save(`Al-Shafii-Report-${new Date().toISOString().split('T')[0]}.pdf`);

        setIsLoading(false);
        setOpen(false);
    }, [selectedSections, aiReport, aiSummary, t.managementSummary, sections]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <h3 className="font-semibold">{t.sections}</h3>
                    <div className="grid grid-cols-2 gap-4">
                         {sections.map(section => (
                            <div className="flex items-center space-x-2" key={section.id}>
                                <Checkbox
                                    id={section.id}
                                    checked={!!selectedSections[section.id]}
                                    onCheckedChange={() => handleCheckboxChange(section.id)}
                                />
                                <Label htmlFor={section.id} className="cursor-pointer">
                                    {section.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={generatePdf} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? t.generating : t.generate}
                    </Button>
                </DialogFooter>
            </DialogContent>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>
        </Dialog>
    );
}
