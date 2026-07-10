'use client';

import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, type Column } from '@/components/data-table';
import type { TransportType } from '@/domain/types';
import { useTransportTypes } from '../hooks';
import { TransportTypeFormDialog } from './transport-type-form-dialog';

export function TransportTypesView() {
  const { data = [], isLoading } = useTransportTypes();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TransportType | null>(null);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (transportType: TransportType) => {
    setEditing(transportType);
    setOpen(true);
  };

  const columns: Column<TransportType>[] = [
    { header: 'Nome', cell: (row) => row.name },
    {
      header: '',
      className: 'w-16 text-right',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openEdit(row)}
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
        title="Tipos de Transporte"
        description="Modalidades de transporte disponíveis para as Ordens de Venda."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Novo tipo
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhum tipo de transporte cadastrado."
      />
      <TransportTypeFormDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
      />
    </>
  );
}
