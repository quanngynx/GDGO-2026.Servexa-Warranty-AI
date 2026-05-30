import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  default as LoadingBar,
  type LoadingBarRef,
} from "@servexa-warranty-ai/ui/components/loading-bar/top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const state = useRouterState();

  useEffect(() => {
    if (state.status === "pending") {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [state.status]);

  return (
    <LoadingBar
      color="var(--muted-foreground)"
      ref={ref}
      shadow={true}
      height={2}
    />
  );
}
