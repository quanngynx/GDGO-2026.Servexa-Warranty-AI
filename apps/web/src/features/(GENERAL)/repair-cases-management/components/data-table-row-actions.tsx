import { Button } from '@servexa-warranty-ai/ui/components/button'
import { Link } from '@tanstack/react-router'
import { EyeIcon } from 'lucide-react'
import type { Row } from '@tanstack/react-table'
import type { RepairCaseDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { useTranslation } from "react-i18next";

interface DataTableRowActionsProps {
  row: Row<RepairCaseDto>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { t } = useTranslation();
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/repair-cases-management/$id" params={{ id: row.original.id }}>
        <EyeIcon className="mr-2 h-4 w-4" />
        {t("View")}</Link>
    </Button>
  )
}
