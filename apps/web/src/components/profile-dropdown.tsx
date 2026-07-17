import { Link } from "@tanstack/react-router";
import useDialogState from "@servexa-warranty-ai/ui/hooks/use-dialog-state";
import { Avatar, AvatarFallback, AvatarImage } from "@servexa-warranty-ai/ui/components/avatar";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@servexa-warranty-ai/ui/components/dropdown-menu";
import { useTranslation } from "react-i18next";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@servexa-warranty-ai/ui/components/tooltip";
import { useProfileQuery } from "@/features/auth/hooks/use-profile-query";
import { IconLanguage } from "@/assets/custom/icon-language";

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState();
  const { data: user, isLoading } = useProfileQuery();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const fallbackText = user?.fullName
    ? user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "U";

  return (
    <>
      <DropdownMenu modal={false}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{isLoading ? "..." : fallbackText}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("Profile")}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">
                {isLoading ? t("profile.loading") : user?.fullName || t("profile.user")}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {isLoading ? "..." : user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                {t("profile.profile")}
                <DropdownMenuShortcut>{t("⇧⌘P")}</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings/account">
                {t("profile.account")}
                <DropdownMenuShortcut>{t("⇧⌘A")}</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings/notifications">
                {t("profile.notifications")}
                <DropdownMenuShortcut>{t("⌘N")}</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings/display">
                {t("profile.display")}
                <DropdownMenuShortcut>{t("⌘D")}</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconLanguage className="mr-2 h-4 w-4" />
              {t("language")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  {t("languages.en")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("vi")}>
                  {t("languages.vi")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
            {t("profile.signOut")}
            <DropdownMenuShortcut className="text-current">
              {t("⇧⌘Q")}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
