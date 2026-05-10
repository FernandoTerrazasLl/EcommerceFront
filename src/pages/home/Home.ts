import { Block } from '../../shared/lib/Block';
import { ProductApi } from '../../entities/product/api';
import type { ProductList } from '../../widgets/product-list/ProductList';
import html from './home.html?raw';
import css from './home.css?raw';

export class HomePage extends Block {
  private productListWidget: ProductList | null = null;
  private isLoadingElement: HTMLElement | null = null;

  getHTML() { return html; }
  getCSS() { return css; }

  async initialize() {
    this.productListWidget = this.querySelector('product-list') as ProductList;
    this.isLoadingElement = this.querySelector('.home__loading');

    this.addEventListener('search-changed', async (e: Event) => {
      const customEvent = e as CustomEvent;
      await this.loadProducts(customEvent.detail.term);
    });

    await this.loadProducts();
  }

  private async loadProducts(searchTerm = '') {
    if (this.isLoadingElement) this.isLoadingElement.style.display = 'block';
    if (this.productListWidget) this.productListWidget.style.display = 'none';

    try {
      const products = await ProductApi.searchProducts(searchTerm);
      if (this.productListWidget) {
        this.productListWidget.setProducts(products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      if (this.isLoadingElement) this.isLoadingElement.style.display = 'none';
      if (this.productListWidget) this.productListWidget.style.display = 'block';
    }
  }
}

customElements.define('home-page', HomePage);
