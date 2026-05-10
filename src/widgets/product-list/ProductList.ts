import { Block } from '../../shared/lib/Block';
import type { Product } from '../../entities/product/model';
import html from './product-list.html?raw';
import css from './product-list.css?raw';

export class ProductList extends Block {
  private products: Product[] = [];

  getHTML() { return html; }
  getCSS() { return css; }

  setProducts(products: Product[]) {
    this.products = products;
    this.renderProducts();
  }

  initialize() {
    this.renderProducts();
  }

  private renderProducts() {
    const container = this.querySelector('.product-list__grid');
    if (!container) return;

    if (this.products.length === 0) {
      container.innerHTML = '<p class="product-list__empty">No se encontraron productos.</p>';
      return;
    }

    container.innerHTML = this.products.map(product => `
      <div class="product-card" data-id="${product.id}" role="button" tabindex="0">
        <div class="product-card__image-wrapper">
          <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-card__content">
          <h3 class="product-card__title">${product.name}</h3>
          <p class="product-card__price">$${product.price.toFixed(2)}</p>
        </div>
      </div>
    `).join('');

    const cards = this.querySelectorAll('.product-card');
    cards.forEach(card => {
      const id = card.getAttribute('data-id');
      if (!id) return;

      const navigate = () => {
        window.history.pushState({}, '', `/product/${id}`);
        window.dispatchEvent(new Event('popstate'));
      };

      card.addEventListener('click', navigate);

      card.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter') {
          navigate();
        }
      });
    });
  }
}

customElements.define('product-list', ProductList);
