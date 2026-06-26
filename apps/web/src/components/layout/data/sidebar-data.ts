import {
  Bell,
  Book,
  Bot,
  Box,
  Bug,
  CalendarArrowUp,
  CircleDollarSign,
  Construction,
  CreditCard,
  FileX,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  ListTodo,
  Lock,
  MapPin,
  Monitor,
  Palette,
  ServerOff,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  UserX,
  Users,
  Wrench,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      title: "GENERAL",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Repair Cases Management",
          url: "/repair-cases-management",
          icon: ListTodo,
        },
        {
          title: "Operations Intelligence",
          url: "/ai/gemini",
          icon: Bot,
        },
        {
          title: "Payment Pending Repair Cases",
          url: "/payment-pending-repair-cases",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "REPORTS",
      items: [
        {
          title: "Accessories Status Statistics",
          icon: LayoutDashboard,
          url: "/accessories-status-statistics",
        },
        {
          title: "History of repair cases status changes",
          icon: ListTodo,
          url: "/history-of-repair-cases-status-changes",
        },
        {
          title: "Quality & Errors", // 1, 4, 5
          icon: ShieldAlert,
          items: [
            {
              title: "Model Error Report",
              url: "/model-error-report",
            },
            {
              title: "Category Error Report",
              url: "/category-error-report",
            },
            {
              title: "Purchase Location Error Report",
              url: "/purchase-location-error-report",
            },
          ],
        },
        {
          title: "Cost & Finance", // 2, 3, 7, 8
          icon: CircleDollarSign,
          items: [
            {
              title: "PSC Cost Report",
              url: "/psc-cost-report",
            },
            {
              title: "Cost Report",
              url: "/cost-report",
            },
            {
              title: "Payment Report",
              url: "/payment-report",
            },
            {
              title: "Weekly Report",
              url: "/weekly-report",
            },
          ],
        },
        {
          title: "Out of Warranty & Service", // 6
          icon: CalendarArrowUp,
          items: [
            {
              title: "Out of Warranty Report",
              url: "/out-of-warranty-report",
            },
          ],
        },
      ],
    },
    {
      title: "SYSTEM ADMINISTRATION",
      items: [
        {
          title: "Organization & Locations",
          icon: MapPin,
          items: [
            {
              title: "Central Warehouse Management",
              url: "/central-warehouse-management",
            },
            {
              title: "ASC Centers Management",
              url: "/asc-centers-management",
            },
            {
              title: "Purchase Locations Management",
              url: "/purchase-locations-management",
            },
          ],
        },
        {
          title: "Users & Customers",
          icon: Users,
          items: [
            {
              title: "Customer Management",
              url: "/customer-management",
            },
            {
              title: "User Management",
              url: "/user-management",
            },
          ],
        },
        {
          title: "Products & Inventory",
          icon: ListOrdered,
          items: [
            {
              title: "Products Management",
              url: "/products-management",
            },
            {
              title: "Accessories Management",
              url: "/accessories-management",
            },
          ],
        },
        {
          title: "Master Data",
          icon: Box,
          items: [
            {
              title: "Product Categories Management",
              url: "/product-categories-management",
            },
          ],
        },
        {
          title: "System & Reference",
          icon: Book,
          items: [
            {
              title: "Reference Documentation",
              url: "/reference-documentation",
            },
          ],
        },
        {
          title: "Roles & Permissions",
          icon: Shield,
          items: [
            {
              title: "Roles Management",
              url: "/roles-management",
            },
            {
              title: "Permissions Management",
              url: "/permissions-management",
            },
          ],
        },
      ],
    },
    // {
    //   title: "Pages",
    //   items: [
    //     {
    //       title: "Auth",
    //       icon: ShieldCheck,
    //       items: [
    //         {
    //           title: "Sign In",
    //           url: "/sign-in",
    //         },
    //         {
    //           title: "Sign Up",
    //           url: "/sign-up",
    //         },
    //         {
    //           title: "Forgot Password",
    //           url: "/forgot-password",
    //         },
    //       ],
    //     },
    //     {
    //       title: "Errors",
    //       icon: Bug,
    //       items: [
    //         {
    //           title: "Unauthorized",
    //           url: "/errors/unauthorized",
    //           icon: Lock,
    //         },
    //         {
    //           title: "Forbidden",
    //           url: "/errors/forbidden",
    //           icon: UserX,
    //         },
    //         {
    //           title: "Not Found",
    //           url: "/errors/not-found",
    //           icon: FileX,
    //         },
    //         {
    //           title: "Internal Server Error",
    //           url: "/errors/internal-server-error",
    //           icon: ServerOff,
    //         },
    //         {
    //           title: "Maintenance Error",
    //           url: "/errors/maintenance-error",
    //           icon: Construction,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/settings",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: Monitor,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
