import { Block } from '../../shared/lib/Block';
import { cartStore } from '../../entities/cart/store';
import html from './header.html?raw';
import css from './header.css?raw';

export class AppHeader extends Block {
  private cartCountElement: HTMLElement | null = null;

  getHTML() { return html; }
  getCSS() { return css; }

  initialize() {
    this.cartCountElement = this.querySelector('.header__cart-count');

    this.updateCartCount();

    window.addEventListener('cart-updated', (e: Event) => {
      const customEvent = e as CustomEvent;
      this.updateCartCount(customEvent.detail.totalItems);
    });

    const cartButton = this.querySelector('.header__cart-button');
    if (cartButton) {
      cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/cart');
        window.dispatchEvent(new Event('popstate'));
      });
    }

    const titleLink = this.querySelector('.header__title a');
    if (titleLink) {
      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
      });
    }
  }

  private updateCartCount(count?: number) {
    if (this.cartCountElement) {
      const currentCount = count !== undefined ? count : cartStore.getTotalItems();

      this.cartCountElement.textContent = currentCount.toString();
      if (currentCount > 0) {
        this.cartCountElement.style.display = 'flex';
      } else {
        this.cartCountElement.style.display = 'none';
      }
    }
  }
}

customElements.define('app-header', AppHeader);
