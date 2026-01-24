import { create } from 'zustand'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: 'local' | 'llm'
  timestamp: number
}

interface ChatState {
  isOpen: boolean
  messages: Message[]
  isLoading: boolean
  conversationId: string | null
  setOpen: (open: boolean) => void
  toggle: () => void
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  setConversationId: (id: string | null) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  conversationId: null,

  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setConversationId: (conversationId) => set({ conversationId }),
  clearMessages: () => set({ messages: [], conversationId: null }),
}))
