import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';

import { APP_TITLE } from '../../../app.routes';
import { findProduct, Product } from './products';
import { ROUTING_URL } from './routing-url';

/** Fake network delay, so the "Navigating…" indicator is visible. */
export const RESOLVE_DELAY_MS = 400;

/** Title for a page of this topic, e.g. "Products · Routing · Angular Playground". */
export function pageTitle(page: string): string {
  return `${page} · Routing · ${APP_TITLE}`;
}

/**
 * Loads the product before the route activates. The component receives it as the `product` input
 * (the key used in `resolve: { product: ... }`).
 */
export const productResolver: ResolveFn<Product> = async (route) => {
  // inject() only works before the first await: after it, the injection context is gone.
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  await new Promise((resolve) => setTimeout(resolve, RESOLVE_DELAY_MS));

  const product = findProduct(id);
  if (product) {
    return product;
  }
  // Unknown id: cancel this navigation and go to the list instead.
  return new RedirectCommand(
    router.createUrlTree([ROUTING_URL, 'products'], { queryParams: { missing: id } }),
  );
};

/** A route `title` can be a resolver too. It runs next to the others, so it cannot read their data. */
export const productTitleResolver: ResolveFn<string> = (route) => {
  const product = findProduct(Number(route.paramMap.get('id')));
  return pageTitle(product?.name ?? 'Product not found');
};
