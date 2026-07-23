import { getRouteApi } from '@tanstack/react-router'
import { type NavigateFn } from '@servexa-warranty-ai/ui/hooks/use-table-url-state'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseDocumentListDto } from '@/libs/api/document/data-transfer-object'
import { DocumentsDialogs } from './components/reference-documents-dialogs'
import { DocumentsPrimaryButtons } from './components/reference-documents-primary-buttons'
import { DocumentsProvider } from './components/reference-documents-provider'
import { DocumentsTable } from './components/reference-documents-table'
import { useDocumentsQuery } from './hooks/use-documents-query'
import { useTranslation } from "react-i18next";

const documentsManagementRoute = getRouteApi(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/reference-documents-management/',
)

export type ReferenceDocumentsListSearch = {
  page: number
  pageSize: number
  search: string
}

type ReferenceDocumentsManagementViewProps = {
  search: ReferenceDocumentsListSearch
  navigate: NavigateFn
}

export function ReferenceDocumentsManagementView({
  search,
  navigate,
}: ReferenceDocumentsManagementViewProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useDocumentsQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
  })

  const list = listPayloadFromApi<ResponseDocumentListDto>(data)
  const documents = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <DocumentsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t("Reference Documents")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage reference documentation and document versions.")}</p>
          </div>
          <DocumentsPrimaryButtons />
        </div>
        <DocumentsTable
          data={documents}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <DocumentsDialogs />
    </DocumentsProvider>
  )
}

export function ReferenceDocumentsManagement() {
  const { t } = useTranslation();
  const search = documentsManagementRoute.useSearch()
  const navigate = documentsManagementRoute.useNavigate()
  return <ReferenceDocumentsManagementView search={search} navigate={navigate} />
}
