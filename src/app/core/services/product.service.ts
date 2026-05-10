import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private supabaseService: SupabaseService) {}

  getAllProducts(): Observable<Product[]> {
    const query = this.supabaseService.getClient()
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return (data as Product[]) ?? [];
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    const query = this.supabaseService.getClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) return undefined;
        return data as Product;
      })
    );
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    if (!searchTerm.trim()) {
      return this.getAllProducts();
    }

    const query = this.supabaseService.getClient()
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm.trim()}%`)
      .order('id', { ascending: true });

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return (data as Product[]) ?? [];
      })
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const query = this.supabaseService.getClient()
      .from('products')
      .insert(product)
      .select()
      .single();

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as Product;
      })
    );
  }

  updateProduct(id: number, changes: Partial<Product>): Observable<Product> {
    const query = this.supabaseService.getClient()
      .from('products')
      .update(changes)
      .eq('id', id)
      .select()
      .single();

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as Product;
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    const query = this.supabaseService.getClient()
      .from('products')
      .delete()
      .eq('id', id);

    return from(query).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      })
    );
  }

}
