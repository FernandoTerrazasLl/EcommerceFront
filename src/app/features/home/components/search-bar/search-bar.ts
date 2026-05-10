import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  searchTerm = '';
  searchChange = output<string>();

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit(this.searchTerm);
  }
}
