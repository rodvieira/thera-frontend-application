'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/domain/order-status';
import type { OrderStatus } from '@/domain/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useClients } from '@/features/clients/hooks';
import { useTransportTypes } from '@/features/transport-types/hooks';
import {
  setFilter,
  clearFilters,
  selectMonitoringFilters,
} from '../store/monitoring-slice';

const ALL = '__all__';

interface Option {
  value: string;
  label: string;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value || ALL}
        onValueChange={(v) => onChange(v === ALL ? '' : (v ?? ''))}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function MonitoringFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectMonitoringFilters);
  const { data: clients = [] } = useClients();
  const { data: transportTypes = [] } = useTransportTypes();

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <FilterSelect
        label="Status"
        value={filters.status}
        onChange={(v) => dispatch(setFilter({ status: v as OrderStatus | '' }))}
        options={ORDER_STATUSES.map((status) => ({
          value: status,
          label: ORDER_STATUS_LABELS[status],
        }))}
      />
      <FilterSelect
        label="Cliente"
        value={filters.clientId}
        onChange={(v) => dispatch(setFilter({ clientId: v }))}
        options={clients.map((c) => ({ value: c.id, label: c.name }))}
      />
      <FilterSelect
        label="Transporte"
        value={filters.transportTypeId}
        onChange={(v) => dispatch(setFilter({ transportTypeId: v }))}
        options={transportTypes.map((t) => ({ value: t.id, label: t.name }))}
      />
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Data</Label>
        <Input
          type="date"
          value={filters.date}
          onChange={(e) => dispatch(setFilter({ date: e.target.value }))}
          className="w-40"
        />
      </div>
      <Button variant="ghost" onClick={() => dispatch(clearFilters())}>
        Limpar
      </Button>
    </div>
  );
}
