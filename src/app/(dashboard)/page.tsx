import { ClipboardList, Activity, CalendarClock, Database } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { NavCard, type NavCardProps } from '@/components/nav-card';

const areas: NavCardProps[] = [
  {
    href: '/ordens',
    label: 'Ordens de Venda',
    description: 'Criar, consultar e evoluir o status das OVs.',
    icon: ClipboardList,
  },
  {
    href: '/monitoramento',
    label: 'Monitoramento',
    description: 'Acompanhar o fluxo operacional com filtros e indicadores.',
    icon: Activity,
  },
  {
    href: '/agendamento',
    label: 'Central de Agendamento',
    description: 'Definir datas, janelas de entrega e reagendar.',
    icon: CalendarClock,
  },
  {
    href: '/cadastros',
    label: 'Cadastros',
    description: 'Clientes, tipos de transporte e itens.',
    icon: Database,
  },
];

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Plataforma única para gerenciar o ciclo de vida das Ordens de Venda — do cadastro à entrega, com rastreabilidade."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {areas.map((area) => (
          <NavCard key={area.href} {...area} />
        ))}
      </div>
    </>
  );
}
