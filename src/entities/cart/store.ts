import type { Product } from '../product/model';

export interface CartItem {
  product: Product;
  quantity: number;
}

class CartStore {
  private items: CartItem[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  addToCart(product: Product): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.notify();
  }

  removeFromCart(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.notify();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.notify();
    }
  }

  clearCart(): void {
    this.items = [];
    this.notify();
  }

  private notify(): void {
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: {
        items: this.getItems(),
        totalItems: this.getTotalItems(),
        totalPrice: this.getTotalPrice()
      }
    }));
  }
}

export const cartStore = new CartStore();
