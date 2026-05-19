import {
  CopilotChatInput,
  type CopilotChatInputProps,
} from "@copilotkit/react-core/v2";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

export type ServexaCopilotChatInputLayout = "rail" | "fullPage";

type ServexaCopilotChatInputProps = CopilotChatInputProps & {
  layout?: ServexaCopilotChatInputLayout;
};

function ServexaCopilotDisclaimer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("servexa-copilot-input-disclaimer", className)}
    >
      Powered by Servexa Warranty AI. Responses may contain errors.
    </div>
  );
}

function ServexaCopilotChatInputComponent({
  disclaimer,
  textArea,
  sendButton,
  addMenuButton,
  layout = "rail",
  className,
  ...props
}: ServexaCopilotChatInputProps) {
  const isFullPage = layout === "fullPage";

  return (
    <CopilotChatInput
      {...props}
      className={cn(
        "servexa-copilot-chat-input-root",
        isFullPage && "servexa-copilot-chat-input-root--full-page",
        className,
      )}
      disclaimer={disclaimer ?? ServexaCopilotDisclaimer}
      textArea={mergeTextAreaSlot(textArea)}
      sendButton={mergeSendButtonSlot(sendButton)}
      addMenuButton={mergeToolbarButtonSlot(addMenuButton)}
    />
  );
}

function mergeTextAreaSlot(
  textArea: CopilotChatInputProps["textArea"],
): CopilotChatInputProps["textArea"] {
  const base =
    "cpk:min-h-[2.75rem] cpk:text-[15px] cpk:leading-relaxed cpk:placeholder:text-muted-foreground/80";
  if (textArea === undefined) {
    return base;
  }
  if (typeof textArea === "string") {
    return cn(base, textArea);
  }
  return textArea;
}

function mergeSendButtonSlot(
  sendButton: CopilotChatInputProps["sendButton"],
): CopilotChatInputProps["sendButton"] {
  const base = "servexa-copilot-send-button";
  if (sendButton === undefined) {
    return base;
  }
  if (typeof sendButton === "string") {
    return cn(base, sendButton);
  }
  return sendButton;
}

function mergeToolbarButtonSlot(
  slot: CopilotChatInputProps["addMenuButton"],
): CopilotChatInputProps["addMenuButton"] {
  const base = "servexa-copilot-toolbar-button";
  if (slot === undefined) {
    return base;
  }
  if (typeof slot === "string") {
    return cn(base, slot);
  }
  return slot;
}

/**
 * Servexa-branded {@link CopilotChatInput} for the `CopilotChat` `input` slot.
 *
 * @see https://docs.copilotkit.ai/reference/v2/components/CopilotChatInput
 */
const copilotInputSubcomponents = {
  TextArea: CopilotChatInput.TextArea,
  SendButton: CopilotChatInput.SendButton,
  ToolbarButton: CopilotChatInput.ToolbarButton,
  StartTranscribeButton: CopilotChatInput.StartTranscribeButton,
  CancelTranscribeButton: CopilotChatInput.CancelTranscribeButton,
  FinishTranscribeButton: CopilotChatInput.FinishTranscribeButton,
  AddMenuButton: CopilotChatInput.AddMenuButton,
  AudioRecorder: CopilotChatInput.AudioRecorder,
  Disclaimer: CopilotChatInput.Disclaimer,
} as const;

function assignCopilotInputStatics<T extends typeof ServexaCopilotChatInputComponent>(
  component: T,
): typeof CopilotChatInput {
  return Object.assign(component, copilotInputSubcomponents) as typeof CopilotChatInput;
}

/** Default rail layout input slot. */
export const ServexaCopilotChatInput = assignCopilotInputStatics(
  ServexaCopilotChatInputComponent,
);

/** Input slot with layout-specific styling (e.g. full-page welcome). */
export function createServexaCopilotChatInput(
  layout: ServexaCopilotChatInputLayout,
): typeof CopilotChatInput {
  function InputWithLayout(props: CopilotChatInputProps) {
    return <ServexaCopilotChatInputComponent {...props} layout={layout} />;
  }
  return assignCopilotInputStatics(InputWithLayout);
}
