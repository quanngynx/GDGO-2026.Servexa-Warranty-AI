import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@servexa-warranty-ai/ui/components/tooltip";
import { MessagesSquare } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function NavigationChats() {
  const navigate = useNavigate();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="md:size-7"
          onClick={() => navigate({ to: "/chats" })}
        >
          <MessagesSquare className="size-[1.2rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Chats</TooltipContent>
    </Tooltip>
  );
}
