import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  products = input.required<Product[]>();
  showNoResults = input<boolean>(false);

  constructor(private router: Router) {}

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}
