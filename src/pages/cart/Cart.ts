import { Block } from '../../shared/lib/Block';
import { cartStore } from '../../entities/cart/store';
import html from './cart.html?raw';
import css from './cart.css?raw';

export class CartPage extends Block {
  getHTML() { return html; }
  getCSS() { return css; }

  initialize() {
    this.renderCart();

    window.addEventListener('cart-updated', () => {
      this.renderCart();
    });

    const checkoutBtn = this.querySelector('.cart__checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cartStore.getTotalItems() > 0) {
          alert('¡Compra realizada con éxito! Gracias por tu pedido.');
          cartStore.clearCart();
          this.goHome();
        }
      });
    }

    const backBtn = this.querySelector('.cart__back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.goHome());
    }
  }

  private renderCart() {
    const itemsContainer = this.querySelector('.cart__items');
    const summaryContainer = this.querySelector('.cart__summary-content');

    if (!itemsContainer || !summaryContainer) return;

    const items = cartStore.getItems();
    const totalItems = cartStore.getTotalItems();
    const totalPrice = cartStore.getTotalPrice();

    if (items.length === 0) {
      itemsContainer.innerHTML = '<p class="cart__empty">Tu carrito está vacío.</p>';
      summaryContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <span>Artículos:</span>
          <span>0</span>
        </div>
        <div class="cart__total">
          <span>Total:</span>
          <span>$0.00</span>
        </div>
      `;
      const checkoutBtn = this.querySelector('.cart__checkout') as HTMLButtonElement;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    const checkoutBtn = this.querySelector('.cart__checkout') as HTMLButtonElement;
    if (checkoutBtn) checkoutBtn.disabled = false;

    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item">
        <img class="cart-item__image" src="${item.product.image}" alt="${item.product.name}">
        <div class="cart-item__details">
          <h3 class="cart-item__title">${item.product.name}</h3>
          <p class="cart-item__price">$${item.product.price.toFixed(2)}</p>
          <div class="cart-item__actions">
            <div class="cart-item__quantity-controls">
              <button class="cart-item__btn cart-item__btn--decrease" data-id="${item.product.id}">−</button>
              <span class="cart-item__quantity">${item.quantity}</span>
              <button class="cart-item__btn cart-item__btn--increase" data-id="${item.product.id}">+</button>
            </div>
            <button class="cart-item__btn--remove" data-id="${item.product.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');

    summaryContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <span>Artículos:</span>
        <span>${totalItems}</span>
      </div>
      <div class="cart__total">
        <span>Total:</span>
        <span>$${totalPrice.toFixed(2)}</span>
      </div>
    `;

    this.bindItemEvents();
  }

  private bindItemEvents() {
    this.querySelectorAll('.cart-item__btn--decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const item = cartStore.getItems().find(i => i.product.id === id);
        if (item) {
          cartStore.updateQuantity(id, item.quantity - 1);
        }
      });
    });

    this.querySelectorAll('.cart-item__btn--increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const item = cartStore.getItems().find(i => i.product.id === id);
        if (item) {
          cartStore.updateQuantity(id, item.quantity + 1);
        }
      });
    });

    this.querySelectorAll('.cart-item__btn--remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        cartStore.removeFromCart(id);
      });
    });
  }

  private goHome() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }
}

customElements.define('cart-page', CartPage);
