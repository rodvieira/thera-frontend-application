import Link from 'next/link';
import { ClipboardList, Activity, CalendarClock, Database } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

const areas = [
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
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <Link
              key={area.href}
              href={area.href}
              className="group rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <h2 className="font-display text-base font-semibold tracking-tight">
                  {area.label}
                </h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {area.description}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
