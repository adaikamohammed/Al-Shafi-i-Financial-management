'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const translations = {
    en: {
        title: 'Financial Risk Radar',
        sourceDependence: 'Source Dependence',
        invoiceEscalation: 'Invoice Escalation',
        donorConcentration: 'Donor Concentration',
        riskAlertTitle: 'High Financial Risk Alert',
        riskAlertDescription: 'At least one risk indicator is high. Administrative intervention is recommended.',
    },
    ar: {
        title: 'رادار المخاطر المالية',
        sourceDependence: 'اعتماد على مصدر واحد',
        invoiceEscalation: 'تصاعد في فواتير',
        donorConcentration: 'قلة تنوع الداعمين',
        riskAlertTitle: 'تنبيه مخاطر مالية مرتفعة',
        riskAlertDescription: 'يوجد مؤشر مخاطر واحد على الأقل مرتفع. يوصى بالتدخل الإداري.',
    }
};

interface RiskData {
    sourceDependence: number;
    invoiceEscalation: number;
    donorConcentration: number;
}

interface FinancialRiskRadarProps {
    riskData: RiskData;
}

const FinancialRiskRadar = ({ riskData }: FinancialRiskRadarProps) => {
    const { language } = useLanguage();
    const t = translations[language];

    const data = [
        { subject: t.sourceDependence, value: riskData.sourceDependence, fullMark: 100 },
        { subject: t.invoiceEscalation, value: riskData.invoiceEscalation, fullMark: 100 },
        { subject: t.donorConcentration, value: riskData.donorConcentration, fullMark: 100 },
    ];

    const isHighRisk = data.some(item => item.value > 70);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold font-headline text-primary">{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                         {isHighRisk && (
                            <Alert variant="destructive" className="mb-4">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertTitle>{t.riskAlertTitle}</AlertTitle>
                                <AlertDescription>{t.riskAlertDescription}</AlertDescription>
                            </Alert>
                        )}
                        <p className="text-muted-foreground">
                            This chart highlights potential financial vulnerabilities. The closer the value is to 100, the greater the risk in that area.
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Risk Score" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default FinancialRiskRadar;
