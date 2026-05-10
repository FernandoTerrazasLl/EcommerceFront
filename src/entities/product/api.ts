import { supabase } from '../../shared/api/supabase';
import type { Product } from './model';

export const ProductApi = {
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  },

  async getProductById(id: number): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) return undefined;
    return data as Product;
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    if (!searchTerm.trim()) {
      return this.getAllProducts();
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm.trim()}%`)
      .order('id', { ascending: true });
      
    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  }
};
