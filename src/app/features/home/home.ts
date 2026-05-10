import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SearchBar } from './components/search-bar/search-bar';
import { ProductList } from './components/product-list/product-list';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  imports: [SearchBar, ProductList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  filteredProducts = signal<Product[]>([]);
  showNoResults = signal(false);
  isLoading = signal(true);

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadAllProducts();
    this.setupSearch();
  }

  private loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.filteredProducts.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.isLoading.set(false);
      }
    });
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((term) => this.performSearch(term));
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  private performSearch(searchTerm: string): void {
    this.productService.searchProducts(searchTerm).subscribe({
      next: (results) => {
        this.filteredProducts.set(results);
        this.showNoResults.set(searchTerm.trim() !== '' && results.length === 0);
      },
      error: (err) => console.error('Error al buscar productos:', err)
    });
  }

  get cartItemCount(): number {
    return this.cartService.totalItems();
  }

  get cartTotal(): number {
    return this.cartService.totalPrice();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
