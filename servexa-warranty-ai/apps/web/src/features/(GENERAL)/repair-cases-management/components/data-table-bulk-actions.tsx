import { Button } from '@servexa-warranty-ai/ui/components/button'
import type { Table } from '@tanstack/react-table';
import { useState } from 'react';

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <Button variant='outline' size='sm' disabled>
      Bulk Actions
    </Button>
  )
}
