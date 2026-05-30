import { TableCell, TableRow } from "../table";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, type Row, type RowData } from "@tanstack/react-table";

interface DraggableRowProps<TData extends RowData> {
  row: Row<TData>;
  isPinned: boolean;
}

export function DraggableRow<TData extends RowData>({
  row,
  isPinned,
}: DraggableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id.toString(),
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      data-pinned={isPinned}
      ref={setNodeRef}
      className={cn(
        "group/row relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80",
        isPinned && "bg-accent/50 font-medium border-b-2 border-b-primary/20"
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            "bg-background",
            isPinned && "bg-accent/50",
            cell.column.columnDef.meta?.className,
            cell.column.columnDef.meta?.tdClassName
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
