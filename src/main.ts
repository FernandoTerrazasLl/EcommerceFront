import './style.css';
import './widgets/header/Header';
import './features/search-bar/SearchBar';
import './widgets/product-list/ProductList';

import { initRouter } from './app/router';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

initRouter(appRoot);
