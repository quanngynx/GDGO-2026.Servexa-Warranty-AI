import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { type SVGProps } from "react";
import { useTranslation } from "react-i18next";

export function IconGitlab({ className, ...props }: SVGProps<SVGSVGElement>) {
    const { t } = useTranslation();
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      className={cn("[&>path]:stroke-current", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>{t("GitLab")}</title>
      <path strokeWidth="0" d="M0 0h24v24H0z" fill="none" />
      <path d="M21 14l-9 7l-9 -7l3 -11l3 7h6l3 -7z" />
    </svg>
  );
}
