import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  private router = inject(Router);

  get items(): CartItem[] {
    return this.cartService.items();
  }

  get totalItems(): number {
    return this.cartService.totalItems();
  }

  get totalPrice(): number {
    return this.cartService.totalPrice();
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  increaseQuantity(productId: number): void {
    const item = this.items.find(i => i.product.id === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity + 1);
  }

  decreaseQuantity(productId: number): void {
    const item = this.items.find(i => i.product.id === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity - 1);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  checkout(): void {
    alert('¡Compra realizada con éxito! Gracias por tu pedido.');
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
}
