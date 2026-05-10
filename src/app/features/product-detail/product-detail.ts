import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  showAddedMessage = signal(false);
  isLoading = signal(true);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (foundProduct) => {
        this.product.set(foundProduct);
        this.isLoading.set(false);
        if (!foundProduct) this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      }
    });
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    this.cartService.addToCart(currentProduct);
    this.showAddedMessage.set(true);
    setTimeout(() => this.showAddedMessage.set(false), 2000);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  get cartTotal(): number {
    return this.cartService.totalPrice();
  }

  get cartItemCount(): number {
    return this.cartService.totalItems();
  }
}
