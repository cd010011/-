
import type { ItemCategory } from './types';

export const ITEM_CATEGORIES: ItemCategory[] = [
  {
    name: '傢俱 (Furniture)',
    items: [
      { id: 'sofa', name: '沙發 (Sofa)' },
      { id: 'cabinet', name: '櫃子 (Cabinet)' },
      { id: 'table', name: '桌子 (Table)' },
      { id: 'chair', name: '椅子 (Chair)' },
      { id: 'bed', name: '床 (Bed)' },
      { id: 'bookshelf', name: '書櫃 (Bookshelf)' },
      { id: 'coffee-table', name: '咖啡桌 (Coffee Table)'},
      { id: 'rug', name: '地毯 (Rug)'},
    ],
  },
  {
    name: '電器 (Appliances)',
    items: [
      { id: 'refrigerator', name: '冰箱 (Refrigerator)' },
      { id: 'tv', name: '電視 (Television)' },
      { id: 'washing-machine', name: '洗衣機 (Washing Machine)' },
      { id: 'air-conditioner', name: '冷氣 (Air Conditioner)' },
      { id: 'floor-lamp', name: '落地燈 (Floor Lamp)' },
      { id: 'microwave', name: '微波爐 (Microwave)'},
    ],
  },
];
