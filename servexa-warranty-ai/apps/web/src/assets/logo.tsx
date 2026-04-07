import faviconUrl from "@/assets/favicon.svg";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { type ComponentPropsWithoutRef } from "react";

type LogoProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & {
  alt?: string;
};

export function Logo({ className, alt = "Shadcn-Admin", ...props }: LogoProps) {
  return (
    <img
      id="shadcn-admin-logo"
      className={cn("size-6", className)}
      src={faviconUrl}
      alt={alt}
      {...props}
    />
  );
}
