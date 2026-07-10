'use client';

import { useMemo, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, type Column } from '@/components/data-table';
import type { Client } from '@/domain/types';
import { useTransportTypes } from '@/features/transport-types/hooks';
import { useClients } from '../hooks';
import { ClientFormDialog } from './client-form-dialog';

export function ClientsView() {
  const { data: clients = [], isLoading } = useClients();
  const { data: transportTypes = [] } = useTransportTypes();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const transportName = useMemo(
    () => new Map(transportTypes.map((t) => [t.id, t.name])),
    [transportTypes],
  );

  const columns: Column<Client>[] = [
    { header: 'Nome', cell: (row) => row.name },
    {
      header: 'Documento',
      className: 'font-mono text-xs',
      cell: (row) => row.document || '—',
    },
    {
      header: 'Transportes autorizados',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.authorizedTransportTypeIds.map((id) => (
            <Badge key={id} variant="secondary">
              {transportName.get(id) ?? id}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: '',
      className: 'w-16 text-right',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditing(row);
            setOpen(true);
          }}
          aria-label={`Editar ${row.name}`}
        >
          <Pencil className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Clientes e os tipos de transporte autorizados para cada um."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Novo cliente
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={clients}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhum cliente cadastrado."
      />
      <ClientFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </>
  );
}
