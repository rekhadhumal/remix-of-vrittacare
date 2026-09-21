import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import botAvatar from "@/assets/bot-avatar.png";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { getChatMessages, sendChatMessage, type ChatMessage } from "@/lib/chat.functions";
import { cn } from "@/lib/utils";

const QUICK = [
  { label: "Why this score?", icon: TrendingUp },
  { label: "What should I improve?", icon: Lightbulb },
  { label: "Compare my results", icon: TrendingUp },
] as const;

export function AssistantPanel({ compact = false }: { compact?: boolean }) {
  const load = useServerFn(getChatMessages);
  const send = useServerFn(sendChatMessage);
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const { data: messages = [] } = useQuery<ChatMessage[]>({ queryKey: ["chat"], queryFn: () => load() });

  const mutation = useMutation({
    mutationFn: (message: string) => send({ data: { message } }),
    onSuccess: async () => {
      setPending(null);
      await queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
    onError: (error: Error) => {
      setPending(null);
      toast.error(error.message);
    },
  });

  function submit(text: string) {
    const value = text.trim();
    if (!value || mutation.isPending) return;
    setInput("");
    setPending(value);
    mutation.mutate(value);
  }

  const allMessages: ChatMessage[] = pending
    ? [...messages, { id: "pending", role: "user", content: pending, created_at: new Date().toISOString() }]
    : messages;

  return (
    <div className={cn("flex h-full flex-col overflow-hidden", compact ? "min-h-[620px]" : "min-h-0")}>
      <header className="relative flex items-center gap-3 border-b border-mb-line pb-4 after:absolute after:-bottom-px after:left-0 after:h-px after:w-20 after:bg-gradient-to-r after:from-mb-cyan after:to-transparent">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-mb-cyan/20 blur-md" />
          <img src={botAvatar} alt="Wellness Assistant" width={512} height={512} className="relative h-12 w-12 rounded-full border border-mb-cyan/35 bg-mb-panel-2 object-contain shadow-mb-glow transition duration-500 hover:-translate-y-1 hover:rotate-2 hover:scale-105" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-mb-sidebar bg-mb-green" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold">Wellness Assistant</p>
          <p className="truncate text-[11px] text-muted-foreground">Your friendly, data-grounded companion</p>
        </div>
      </header>

      <Conversation className="min-h-0">
        <ConversationContent className="gap-4 px-0 py-5">
          {allMessages.length === 0 ? (
            <Message from="assistant">
              <MessageContent className="rounded-2xl rounded-tl-sm border border-mb-line bg-mb-panel px-3.5 py-3 text-[13px] leading-relaxed shadow-mb-card">
                <MessageResponse>
                  Hi! I’m your Wellness Assistant. Ask me about your saved assessment, habits, or what to focus on next.
                </MessageResponse>
              </MessageContent>
            </Message>
          ) : null}
          {allMessages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent className={cn("rounded-2xl border border-mb-line bg-mb-panel px-3.5 py-2.5 text-[13px] leading-relaxed shadow-mb-card", message.role === "user" && "rounded-tr-sm border-mb-cyan/15 bg-mb-chat-user text-mb-chat-user-foreground")}>
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
            </Message>
          ))}
          {mutation.isPending ? <Shimmer className="text-xs text-muted-foreground">Thinking…</Shimmer> : null}
        </ConversationContent>
        <ConversationScrollButton className="bottom-2 border-mb-line bg-mb-panel-2" />
      </Conversation>

      <div className="space-y-3 border-t border-mb-line pt-3">
        <div className="flex flex-wrap gap-2">
          {QUICK.map(({ label, icon: Icon }) => (
            <Button key={label} type="button" variant="outline" size="sm" onClick={() => submit(label)} disabled={mutation.isPending} className="h-7 rounded-full border-mb-line bg-mb-panel-2/70 px-2.5 text-[10px] font-medium text-muted-foreground hover:border-mb-cyan/35 hover:bg-mb-panel-2 hover:text-foreground disabled:opacity-50">
              <Icon className="h-3 w-3 text-mb-cyan" /> {label}
            </Button>
          ))}
        </div>
        <PromptInput onSubmit={(message) => submit(message.text)} className="rounded-2xl border-mb-line bg-mb-panel-2/80 shadow-mb-card transition focus-within:border-mb-cyan/35">
          <PromptInputTextarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your message…" className="min-h-16 text-xs" />
          <PromptInputFooter className="justify-end pb-2.5 pt-0">
            <PromptInputSubmit status={mutation.isPending ? "submitted" : "ready"} disabled={!input.trim() || mutation.isPending} className="rounded-full bg-gradient-to-br from-mb-cyan to-primary text-primary-foreground shadow-[0_8px_24px_-12px_var(--mb-cyan)]" />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}