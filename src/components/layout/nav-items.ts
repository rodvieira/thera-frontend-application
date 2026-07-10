import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  CalendarClock,
  Database,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/ordens', label: 'Ordens de Venda', icon: ClipboardList },
  { href: '/monitoramento', label: 'Monitoramento', icon: Activity },
  { href: '/agendamento', label: 'Agendamento', icon: CalendarClock },
  { href: '/cadastros', label: 'Cadastros', icon: Database },
  { href: '/auditoria', label: 'Auditoria', icon: ScrollText },
];
