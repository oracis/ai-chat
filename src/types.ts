export interface ConversationProps {
  id: number;
  title: string;
  selectedModel: string;
  createdAt: string;
  updatedAt: string;
  providerId: number;
}

export interface ProviderProps {
  id: number;
  name: string;
  title?: string;
  desc?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  models: string[];
}

export type MessageType = 'question' | 'answer';
export type MessageStatus = 'loading' | 'streaming' | 'finished' | 'error';

export interface MessageProps {
  id: number;
  type: MessageType;
  status?: MessageStatus;
  conversationId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  imagePath?: string;
}

export type ButtonColor = 'green' | 'purple';
export type ButtonSize = 'small' | 'large';
export interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  iconName?: string;
}

export interface MessageStreamProps {
  role: 'user' | 'assistant';
  content: string;
  imagePath?: string;
}

export interface CreateChatProps {
  messageId: number;
  providerName: string;
  selectedModel: string;
  messages?: MessageStreamProps[];
}

export interface UpdatedStreamProps {
  messageId: number;
  data: {
    result: string;
    is_end: boolean;
    is_error?: boolean;
  };
}

export type OnUpdatedCallback = (data: UpdatedStreamProps) => void;

export interface MessageListRef {
  ref: HTMLDivElement;
}

export interface MessageListExpose {
  scrollToBottom: () => void;
}

export interface UniversalChunkProps {
  is_end: boolean;
  result: string;
}

export type ProviderSettings = Record<string, Record<string, any>>;

export interface AppConfig {
  language: 'zh-CN' | 'en-US';
  fontSize: number;
  providerSettings?: ProviderSettings;
}

// Dynamic provider settings schema (simple key-value per provider)
export interface ProviderConfigItem {
  key: string;
  value: any;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'number' | 'url';
}

export type ProviderConfigMap = Record<string, ProviderConfigItem[]>;
