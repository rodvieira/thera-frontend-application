import Link from 'next/link';
import { Users, Truck, Package } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

const cadastros = [
  {
    href: '/cadastros/clientes',
    label: 'Clientes',
    description: 'Clientes e seus tipos de transporte autorizados.',
    icon: Users,
  },
  {
    href: '/cadastros/transportes',
    label: 'Tipos de Transporte',
    description: 'Modalidades de transporte (caminhão, carreta, bi-truck…).',
    icon: Truck,
  },
  {
    href: '/cadastros/itens',
    label: 'Itens',
    description: 'Itens com SKU para vincular às Ordens de Venda.',
    icon: Package,
  },
];

export default function CadastrosPage() {
  return (
    <>
      <PageHeader
        title="Cadastros"
        description="Dados-mestre do sistema: clientes, tipos de transporte e itens."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cadastros.map((cadastro) => {
          const Icon = cadastro.icon;
          return (
            <Link
              key={cadastro.href}
              href={cadastro.href}
              className="group rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <h2 className="font-display text-base font-semibold tracking-tight">
                  {cadastro.label}
                </h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {cadastro.description}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
