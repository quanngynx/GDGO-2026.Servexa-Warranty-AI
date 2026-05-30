import { useEffect, useState } from "react";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { Separator } from "@servexa-warranty-ai/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@servexa-warranty-ai/ui/components/tooltip";
import { SidebarTrigger, useSidebar } from "@servexa-warranty-ai/ui/components/sidebar";
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
};

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const { open } = useSidebar();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "z-50 h-16",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 p-4 sm:gap-4",
          offset > 10 &&
            fixed &&
            "after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg"
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger variant="outline" className="max-md:scale-125" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {open ? "Close sidebar" : "Open sidebar"}
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6" />
        <DynamicBreadcrumb />
        {children}
      </div>
    </header>
  );
}
