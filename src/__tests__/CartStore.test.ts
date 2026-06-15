import { describe, it, expect, beforeEach } from 'vitest';
import { cartStore } from '../entities/cart/store';
import type { Product } from '../entities/product/model';

describe('CartStore Unit Tests', () => {
  const mockProductA: Product = {
    id: 1,
    name: 'Producto A',
    description: 'Descripción A',
    price: 100,
    image: 'image-a.jpg'
  };

  const mockProductB: Product = {
    id: 2,
    name: 'Producto B',
    description: 'Descripción B',
    price: 50,
    image: 'image-b.jpg'
  };

  beforeEach(() => {
    cartStore.clearCart();
  });

  it('addToCart_add2Items_increaseQuantityAndLength', () => {
    // HU-04 - Criterio 1 (CASO VÁLIDO): Dado que el cliente visualiza un artículo en el carrito, 
    // cuando interactúa con los controles para aumentar o disminuir la cantidad del producto, 
    // entonces el sistema debe actualizar el número de unidades mostradas y recalcular el costo total en tiempo real.

    cartStore.addToCart(mockProductA);
    cartStore.addToCart(mockProductA);

    expect(cartStore.getTotalItems()).toBe(2);
    expect(cartStore.getTotalPrice()).toBe(200);
    expect(cartStore.getItems().length).toBe(1);
    expect(cartStore.getItems()[0].quantity).toBe(2);
  });

  it("removeFromCart_clickButtonEraseProductA_eraseItem", () => {
    // HU-04 - Criterio 2 (CASO INVÁLIDO): Dado el cliente se equivoco de articulo, 
    // cuando el cliente apreta el boton de eliminar en el producto requerido, 
    // entonces el sistema debe eliminar todo el contenido de ese producto.

    cartStore.addToCart(mockProductA);
    cartStore.addToCart(mockProductB);

    cartStore.removeFromCart(mockProductA.id);

    expect(cartStore.getTotalItems()).toBe(1);
    expect(cartStore.getTotalPrice()).toBe(50);
    expect(cartStore.getItems().length).toBe(1);
    expect(cartStore.getItems()[0].product.id).toBe(mockProductB.id);
  });

  it('updateQuantity_updateQuantityToZero_eliminateItem', () => {
    // HU-04 - Criterio 3 (CASO LÍMITE): Dado que el cliente tiene un solo artículo en el carrito de compras, 
    // cuando presiona el botón de disminuir cantidad para que llegue a 0, 
    // entonces el sistema debe eliminar automáticamente el ítem de la lista.

    cartStore.addToCart(mockProductA);

    cartStore.updateQuantity(mockProductA.id, 1);
    cartStore.updateQuantity(mockProductA.id, 0);

    expect(cartStore.getTotalItems()).toBe(0);
    expect(cartStore.getTotalPrice()).toBe(0);
    expect(cartStore.getItems().length).toBe(0);
  });

  it('updateQuantity_dontFindItem_dontHaveError', () => {
    // HU-04 - Criterio 3 (CASO LÍMITE): Dado que el cliente tiene un solo artículo en el carrito de compras, 
    // cuando presiona el botón de disminuir cantidad para que llegue a 0, 
    // entonces el sistema debe eliminar automáticamente el ítem de la lista.

    cartStore.updateQuantity(999, 1);

    expect(cartStore.getTotalItems()).toBe(0);
    expect(cartStore.getItems().length).toBe(0);
  });
});
