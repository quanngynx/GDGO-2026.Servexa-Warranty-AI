import { Avatar, AvatarFallback, AvatarImage } from "@servexa-warranty-ai/ui/components/avatar";
import { useTranslation } from "react-i18next";

export function RecentSales() {
    const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt={t("Avatar")} />
          <AvatarFallback>{t("OM")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">{t("Olivia Martin")}</p>
            <p className="text-sm text-muted-foreground">
              {t("olivia.martin@email.com")}</p>
          </div>
          <div className="font-medium">+$1,999.00</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt={t("Avatar")} />
          <AvatarFallback>{t("JL")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">{t("Jackson Lee")}</p>
            <p className="text-sm text-muted-foreground">
              {t("jackson.lee@email.com")}</p>
          </div>
          <div className="font-medium">+$39.00</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt={t("Avatar")} />
          <AvatarFallback>{t("IN")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">{t("Isabella Nguyen")}</p>
            <p className="text-sm text-muted-foreground">
              {t("isabella.nguyen@email.com")}</p>
          </div>
          <div className="font-medium">+$299.00</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt={t("Avatar")} />
          <AvatarFallback>{t("WK")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">{t("William Kim")}</p>
            <p className="text-sm text-muted-foreground">{t("will@email.com")}</p>
          </div>
          <div className="font-medium">+$99.00</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt={t("Avatar")} />
          <AvatarFallback>{t("SD")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">{t("Sofia Davis")}</p>
            <p className="text-sm text-muted-foreground">
              {t("sofia.davis@email.com")}</p>
          </div>
          <div className="font-medium">+$39.00</div>
        </div>
      </div>
    </div>
  );
}
