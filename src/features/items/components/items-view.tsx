'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, type Column } from '@/components/data-table';
import type { Item } from '@/domain/types';
import { useItems } from '../hooks';
import { ItemFormDialog } from './item-form-dialog';

export function ItemsView() {
  const { data = [], isLoading } = useItems();
  const [open, setOpen] = useState(false);

  const columns: Column<Item>[] = [
    {
      header: 'SKU',
      className: 'font-mono text-xs',
      cell: (row) => row.sku,
    },
    { header: 'Nome', cell: (row) => row.name },
    { header: 'Unidade', className: 'w-24', cell: (row) => row.unit },
  ];

  return (
    <>
      <PageHeader
        title="Itens"
        description="Itens disponíveis para vincular às Ordens de Venda."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Novo item
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Nenhum item cadastrado."
      />
      <ItemFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
