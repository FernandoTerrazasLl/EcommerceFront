import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ProductDetail } from './features/product-detail/product-detail';
import { Cart } from './features/cart/cart';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'product/:id',
    component: ProductDetail
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: '**',
    redirectTo: ''
  }
];
