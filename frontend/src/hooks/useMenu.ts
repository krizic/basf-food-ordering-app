import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { MenuItem } from '../types';

export function useMenu(category?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const data = await api.getMenu(category);
        setItems(data.items.map(item => ({
          ...item,
          price: Number(item.price),
          options: item.options?.map((opt: any) => ({
            ...opt,
            choices: typeof opt.choices === 'string' ? JSON.parse(opt.choices) : opt.choices,
          })) || [],
        })));
        setCategories(data.categories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [category]);

  return { items, categories, loading, error };
}
