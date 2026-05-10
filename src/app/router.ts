import { createBrowserHistory } from 'history';
import '../pages/home/Home';
import '../pages/product-detail/ProductDetail';
import '../pages/cart/Cart';

export const history = createBrowserHistory();

const routes = [
  { path: /^\/$/, component: 'home-page' },
  { path: /^\/product\/(\d+)$/, component: 'product-detail-page' },
  { path: /^\/cart$/, component: 'cart-page' }
];

export function initRouter(rootElement: HTMLElement) {
  function render(location: any) {
    const path = location.pathname;
    let matchedComponent = 'home-page';

    for (const route of routes) {
      if (route.path.test(path)) {
        matchedComponent = route.component;
        break;
      }
    }

    rootElement.innerHTML = `<${matchedComponent}></${matchedComponent}>`;
  }
  render(history.location);

  history.listen(({ location }) => {
    render(location);
  });

  window.addEventListener('popstate', () => {
    render(window.location);
  });
}
