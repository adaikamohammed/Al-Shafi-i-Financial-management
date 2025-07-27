'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  BookOpenCheck,
  Languages,
  LogOut,
  Users,
  Briefcase,
  CalendarCheck,
  HeartHandshake,
  Receipt,
  FileText
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const translations = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    staff: 'Staff',
    subscriptions: 'Subscriptions',
    donations: 'Donations',
    expenses: 'Expenses',
    reports: 'Reports',
    financialManagement: 'Financial Management',
    admin: 'Admin',
    adminEmail: 'admin@alshafii.com',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    footer: `© ${new Date().getFullYear()} Al-Shafi'i Quranic School. All rights reserved.`,
  },
  ar: {
    dashboard: 'لوحة التحكم',
    students: 'الطلاب',
    staff: 'الموظفين',
    subscriptions: 'الاشتراكات',
    donations: 'التبرعات',
    expenses: 'المصاريف',
    reports: 'التقارير',
    financialManagement: 'الإدارة المالية',
    admin: 'مسؤول',
    adminEmail: 'admin@alshafii.com',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    language: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    footer: `© ${new Date().getFullYear()} مدرسة الشافعي القرآنية. جميع الحقوق محفوظة.`,
  },
};


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, dir } = useLanguage();
  const { user, loading } = useAuth();
  const t = translations[language];

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const menuItems = [
    { href: '/', label: t.dashboard, icon: LayoutDashboard },
    { href: '/students', label: t.students, icon: Users },
    { href: '/staff', label: t.staff, icon: Briefcase },
    { href: '/subscriptions', label: t.subscriptions, icon: CalendarCheck },
    { href: '/donations', label: t.donations, icon: HeartHandshake },
    { href: '/expenses', label: t.expenses, icon: Receipt },
    { href: '/reports', label: t.reports, icon: FileText },
  ];

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  if (loading || (!user && pathname !== '/login')) {
    return null;
  }
  
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar side={dir === 'rtl' ? 'right' : 'left'}>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
               <BookOpenCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-headline font-semibold">مركز الشافعي</h1>
              <p className="text-xs text-muted-foreground">{t.financialManagement}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <div>
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
          <SidebarTrigger className="md:hidden" />
          <span className="font-headline text-xl font-semibold md:hidden">مركز الشافعي</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://placehold.co/40x40" alt="Admin User" data-ai-hint="user avatar" />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{t.admin}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Languages className="mr-2 h-4 w-4" />
                  <span>{t.language}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setLanguage('en')}>
                      <span>{t.english}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('ar')}>
                      <span>{t.arabic}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t.profile}</DropdownMenuItem>
              <DropdownMenuItem>{t.settings}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <footer className="p-4 text-center text-xs text-muted-foreground sm:p-6">
          {t.footer}
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
