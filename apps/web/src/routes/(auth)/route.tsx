import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/assets/logo";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import bgDark from "@/features/auth/sign-in/assets/background-dark.png";
import bgLight from "@/features/auth/sign-in/assets/background.png";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
    const { t } = useTranslation();
  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="absolute left-2 top-2 z-20 flex items-center md:left-8 md:top-8">
        <Logo className="me-2" />
        <h1 className="text-xl font-bold">{t("Servexa Warranty AI")}</h1>
      </div>
      <div className="lg:p-8 flex items-center justify-center min-h-screen">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
          <Outlet />
        </div>
      </div>
      <div
        className={cn(
          "relative h-full overflow-hidden bg-muted max-lg:hidden",
          "[&>img]:absolute [&>img]:inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:select-none"
        )}
      >
        <img
          src={bgLight}
          className="dark:hidden"
          width={1024}
          height={1151}
          alt={t("Servexa Warranty AI")}
        />
        <img
          src={bgDark}
          className="hidden dark:block"
          width={1024}
          height={1138}
          alt={t("Servexa Warranty AI")}
        />
      </div>
    </div>
  );
}
