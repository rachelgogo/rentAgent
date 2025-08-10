// OpenAI模型配置
// 支持多种模型选择，包括最新的GPT-4o

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  temperature: number;
  costPer1kTokens: number; // 每1000个token的成本（美元）
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: '最新最强的多模态模型，性能卓越',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.005 // $5 per 1M tokens
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'GPT-4o的轻量版本，性价比高',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.00015 // $0.15 per 1M tokens
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'GPT-4的优化版本，平衡性能和成本',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.01 // $10 per 1M tokens
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '经典模型，成本最低',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.0005 // $0.5 per 1M tokens
  }
];

// 默认模型
export const DEFAULT_MODEL = 'gpt-4o';

// 获取模型配置
export function getModelConfig(modelId: string): ModelConfig {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  return model || AVAILABLE_MODELS.find(m => m.id === DEFAULT_MODEL)!;
}

// 获取所有可用模型
export function getAllModels(): ModelConfig[] {
  return AVAILABLE_MODELS;
}

// 计算预估成本
export function estimateCost(modelId: string, inputTokens: number, outputTokens: number): number {
  const model = getModelConfig(modelId);
  const totalTokens = inputTokens + outputTokens;
  return (totalTokens / 1000) * model.costPer1kTokens;
}
