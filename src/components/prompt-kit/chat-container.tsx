"use client";

import { cn } from "@/lib/utils";
import { StickToBottom } from "use-stick-to-bottom";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "./message";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "./prompt-input";
import { Button } from "../ui/button";
import { AlertTriangle, ArrowUp, Copy } from "lucide-react";
import { DotsLoader } from "./loader";

export function ChatContainer({
  messages,
  isLoading,
  error,
  onMessageAction,
}: {
  messages: any[];
  isLoading: boolean;
  error: any;
  onMessageAction: (message: any, action: any) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <ChatContainerRoot className="flex-1 overflow-y-auto">
        <ChatContainerContent className="space-y-4 p-4">
          {messages.map((message, index) => (
            <Message
              key={index}
              className={cn(
                "flex w-full flex-col gap-2",
                message.role === "assistant" ? "items-start" : "items-end",
              )}
            >
              <div
                className={cn(
                  "group flex w-full flex-col gap-2",
                  message.role === "assistant" ? "items-start" : "items-end",
                )}
              >
                <MessageContent
                  className={cn(
                    "rounded-xl px-4 py-2",
                    message.role === "assistant"
                      ? "bg-gray-100"
                      : "bg-blue-500 text-white",
                  )}
                  markdown={message.role === "assistant"}
                >
                  {message.content}
                </MessageContent>
                {message.role === "assistant" && (
                  <MessageActions
                    className={cn(
                      "opacity-0 transition-opacity group-hover:opacity-100",
                    )}
                  >
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => onMessageAction(message, { id: "copy" })}
                      >
                        <Copy />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                )}
              </div>
            </Message>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl px-4 py-2">
                <DotsLoader />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="bg-red-100 text-red-500 rounded-xl px-4 py-2 flex gap-2">
                <AlertTriangle />
                {error.message}
              </div>
            </div>
          )}
        </ChatContainerContent>
      </ChatContainerRoot>
      <div className="p-4 border-t border-gray-200"></div>
    </div>
  );
}

export type ChatContainerRootProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

function ChatContainerRoot({
  children,
  className,
  ...props
}: ChatContainerRootProps) {
  return (
    <StickToBottom
      className={cn("flex overflow-y-auto", className)}
      resize="smooth"
      initial="instant"
      role="log"
      {...props}
    >
      {children}
    </StickToBottom>
  );
}

function ChatContainerContent({
  children,
  className,
  ...props
}: ChatContainerContentProps) {
  return (
    <StickToBottom.Content
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {children}
    </StickToBottom.Content>
  );
}

function ChatContainerScrollAnchor({
  className,
  ...props
}: ChatContainerScrollAnchorProps) {
  return (
    <div
      className={cn("h-px w-full shrink-0 scroll-mt-4", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor };
