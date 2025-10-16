"use client";

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container";
import { DotsLoader } from "@/components/prompt-kit/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUp,
  Copy,
  Paperclip,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { memo, useRef, useState } from "react";
import { askAgent, uploadVideo } from "../_actions";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  videoPath?: string;
};

type MessageComponentProps = {
  message: ChatMessage;
  isLastMessage: boolean;
};

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message.role === "assistant";

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end",
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0">
            <MessageContent
              className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0"
              markdown
            >
              {message.content}
            </MessageContent>
            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100",
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Upvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsUp />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Downvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsDown />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
              {message.content}
            </MessageContent>
            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    );
  },
);

MessageComponent.displayName = "MessageComponent";

const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0">
        <DotsLoader />
      </div>
    </div>
  </Message>
));

LoadingMessage.displayName = "LoadingMessage";

const ErrorMessage = memo(({ error }: { error: string }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  </Message>
));

ErrorMessage.displayName = "ErrorMessage";

export default function AgentChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedVideoPath, setUploadedVideoPath] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    setUploadedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await uploadVideo(formData);

      if (data.success) {
        setUploadedVideoPath(data.path);
      } else {
        setError("Failed to upload video");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload video");
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadedVideoPath(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if ((!input.trim() && !uploadedVideoPath) || isLoading) return;

    const messageContent = uploadedFile
      ? `${input.trim()}\n[Video uploaded: ${uploadedFile.name}]`
      : input.trim();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      videoPath: uploadedVideoPath || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const result = await askAgent(userMessage.content, uploadedVideoPath);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      clearFile();
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error processing your request.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">
        <ChatContainerContent className="space-y-12 px-4 py-12">
          {messages.length === 0 && (
            <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
              <div className="text-foreground mb-4 text-2xl font-semibold">
                Welcome to Video Memory Agent
              </div>
              <div className="text-muted-foreground mb-2 font-medium">
                Try asking:
              </div>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                <li>
                  Upload a video and ask to clip it from 00:00:10 for 5 seconds
                </li>
                <li>Give me ideas for birthday video moments</li>
                <li>What should I capture on my vacation?</li>
              </ul>
            </div>
          )}

          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
              <MessageComponent
                key={message.id}
                message={message}
                isLastMessage={isLastMessage}
              />
            );
          })}

          {isLoading && <LoadingMessage />}
          {error && <ErrorMessage error={error} />}
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <PromptInput
          isLoading={isLoading}
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        >
          <div className="flex flex-col">
            {uploadedFile && (
              <div className="mx-2 mt-2 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <Paperclip size={16} />
                <span className="flex-1 truncate text-sm">
                  {uploadedFile.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={clearFile}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
            <PromptInputTextarea
              placeholder="Ask your agent anything or upload a video to clip..."
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />
            <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 p-2">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Paperclip size={18} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  disabled={(!input.trim() && !uploadedVideoPath) || isLoading}
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {!isLoading ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
