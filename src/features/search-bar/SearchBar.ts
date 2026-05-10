import { Block } from '../../shared/lib/Block';
import html from './search-bar.html?raw';
import css from './search-bar.css?raw';

export class SearchBar extends Block {
  private inputElement: HTMLInputElement | null = null;

  getHTML() { return html; }
  getCSS() { return css; }

  initialize() {
    this.inputElement = this.querySelector('.search-bar__input');
    const searchBtn = this.querySelector('.search-bar__button');

    const triggerSearch = () => {
      if (this.inputElement) {
        this.dispatchEvent(new CustomEvent('search-changed', {
          detail: { term: this.inputElement.value },
          bubbles: true,
          composed: true
        }));
      }
    };

    if (searchBtn) {
      searchBtn.addEventListener('click', triggerSearch);
    }

    if (this.inputElement) {
      this.inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          triggerSearch();
        }
      });
    }
  }
}

customElements.define('search-bar', SearchBar);
