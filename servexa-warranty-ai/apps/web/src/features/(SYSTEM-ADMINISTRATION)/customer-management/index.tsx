import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomersDialogs } from "./components/customer-dialogs";
import { CustomersPrimaryButtons } from "./components/customer-primary-buttons";
import { CustomersProvider } from "./components/customer-provider";
import { CustomersTable } from "./components/customer-table";
import { customerApi } from "@/libs/api/human-resources/customer/api";
import { type Customer } from "./data/schema";
import type {
  CustomerListApiResponse,
  CustomerListResponse,
  CustomerResponseDto,
} from "@/libs/api/human-resources/customer/data-transfer-object";

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/customer-management/"
);

export function CustomerManagement() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { data } = useQuery({
    queryKey: [
      "system-admin",
      "customers",
      {
        page: (search.page as number) ?? 1,
        limit: (search.pageSize as number) ?? 10,
        search: (search.fullname as string) || undefined,
      },
    ],
    queryFn: () =>
      customerApi.findAll({
        page: (search.page as number) ?? 1,
        limit: (search.pageSize as number) ?? 10,
        search: (search.fullname as string) || "",
      }),
  });
  const list = listPayloadFromCustomersApi(data);
  const customers = (list?.items ?? []).map(mapToCustomerRow);

  return (
    <CustomersProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Customer Management
            </h2>
            <p className="text-muted-foreground">Manage your customers here.</p>
          </div>
          <CustomersPrimaryButtons />
        </div>
        <CustomersTable data={customers} search={search} navigate={navigate} />
      </Main>
      <CustomersDialogs />
    </CustomersProvider>
  );
}

function listPayloadFromCustomersApi(
  body: CustomerListApiResponse | null | undefined
): CustomerListResponse | undefined {
  return body?.metadata;
}

function mapToCustomerRow(item: CustomerResponseDto): Customer {
  return {
    id: item.id,
    customerGroup:
      item.customerGroup === "individual"
        ? "individual"
        : "other",
    fullname: item.fullName,
    email: item.email,
    phone1: item.phone1,
    phone2: item.phone2,
    province: item.provinceId ?? "",
    ward: item.wardId ?? "",
    address: item.address ?? "",
    taxCode: item.taxCode ?? "",
    bankName: item.bankName ?? "",
    accountNumber: item.accountNumber ?? "",
    contactPerson: item.contactPerson ?? "",
    ascCenter: item.ascCenterId
      ? {
          id: item.ascCenterId,
          centerName: item.ascCenterId,
          centerCode: item.ascCenterId,
        }
      : null,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    createdBy: "",
    updatedBy: null,
    _count: {
      repairCases: 0,
    },
  };
}
