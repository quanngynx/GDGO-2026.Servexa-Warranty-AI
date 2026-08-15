import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useTranslation } from "react-i18next";

export function Settings() {
  const { t } = useTranslation();

  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("Settings")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage your Settings here.")}
            </p>
          </div>
        </div>
        <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]'>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>
              {t("Coming Soon")}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {t("This page is under construction.")}
            </p>
          </div>
        </div>
      </Main>
    </>
  )
}
