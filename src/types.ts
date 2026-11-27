export interface Place {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: Category;
  videoUrl?: string;
  videoTitle?: string;
  visited: boolean;
  visitDate?: string;
  notes?: string;
  imageUrl?: string;
}

export type Category = 
  | 'museum'
  | 'park'
  | 'church'
  | 'bridge'
  | 'monument'
  | 'restaurant'
  | 'street'
  | 'other';

export const categoryLabels: Record<Category, string> = {
  museum: 'Музей',
  park: 'Парк',
  church: 'Храм/Собор',
  bridge: 'Мост',
  monument: 'Памятник',
  restaurant: 'Ресторан/Кафе',
  street: 'Улица/Площадь',
  other: 'Другое',
};

export const categoryIcons: Record<Category, string> = {
  museum: '🏛️',
  park: '🌳',
  church: '⛪',
  bridge: '🌉',
  monument: '🗿',
  restaurant: '🍽️',
  street: '🏘️',
  other: '📍',
};

export const categoryColors: Record<Category, string> = {
  museum: '#8b5cf6',
  park: '#22c55e',
  church: '#f59e0b',
  bridge: '#3b82f6',
  monument: '#ef4444',
  restaurant: '#ec4899',
  street: '#6366f1',
  other: '#64748b',
};
