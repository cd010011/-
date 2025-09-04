
export interface Item {
  id: string;
  name: string;
}

export interface ItemCategory {
  name: string;
  items: Item[];
}

export interface SelectedItem {
  id: string;
  name: string;
  prompt: string;
}
