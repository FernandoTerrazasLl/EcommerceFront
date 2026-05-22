import { Block } from '../../shared/lib/Block';
import { ProductApi } from '../../entities/product/api';
import { cartStore } from '../../entities/cart/store';
import type { Product } from '../../entities/product/model';
import html from './product-detail.html?raw';
import css from './product-detail.css?raw';

export class ProductDetailPage extends Block {
  private product: Product | undefined;

  getHTML() { return html; }
  getCSS() { return css; }

  async initialize() {
    // Extract ID from URL path (e.g. /product/123)
    const pathParts = window.location.pathname.split('/');
    const productId = parseInt(pathParts[pathParts.length - 1], 10);

    if (isNaN(productId)) {
      this.goHome();
      return;
    }

    await this.loadProduct(productId);
    this.bindEvents();
  }

  private async loadProduct(id: number) {
    const loadingEl = this.querySelector('.product-detail__loading') as HTMLElement | null;
    const contentEl = this.querySelector('.product-detail__content') as HTMLElement | null;
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';

    this.product = await ProductApi.getProductById(id);

    if (!this.product) {
      this.goHome();
      return;
    }

    this.renderProductInfo();

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'flex';
  }

  private renderProductInfo() {
    if (!this.product) return;

    const img = this.querySelector('.product-detail__image') as HTMLImageElement;
    if (img) {
      img.src = this.product.image;
      img.alt = this.product.name;
    }

    const title = this.querySelector('.product-detail__title');
    if (title) title.textContent = this.product.name;

    const price = this.querySelector('.product-detail__price');
    if (price) price.textContent = `$${this.product.price}`;

    const desc = this.querySelector('.product-detail__description');
    if (desc) desc.textContent = this.product.description;
  }

  private static readonly MESSAGE_DURATION_MS = 2000;

  private bindEvents() {
    const backBtn = this.querySelector('.product-detail__back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.goHome());
    }

    const addToCartButton = this.querySelector('.product-detail__add');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => {
        if (this.product) {
          cartStore.addToCart(this.product);
          this.showAddedMessage();
        }
      });
    }
  }

  private showAddedMessage() {
    const messageElement = this.querySelector('.product-detail__message') as HTMLElement;
    if (messageElement) {
      messageElement.style.display = 'block';
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, ProductDetailPage.MESSAGE_DURATION_MS);
    }
  }

  private goHome() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }
}

customElements.define('product-detail-page', ProductDetailPage);
