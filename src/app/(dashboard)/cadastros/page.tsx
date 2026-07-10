import { Users, Truck, Package } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { NavCard, type NavCardProps } from '@/components/nav-card';

const cadastros: NavCardProps[] = [
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
        {cadastros.map((cadastro) => (
          <NavCard key={cadastro.href} {...cadastro} />
        ))}
      </div>
    </>
  );
}
