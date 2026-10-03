import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CartStore } from './siblings/cart-store';
import { CartSummary } from './siblings/cart-summary';
import { ProductPicker } from './siblings/product-picker';

/**
 * The common parent of the siblings demo. It passes nothing to its children: it only provides
 * the store they share. Read siblings/cart-store.ts first.
 */
@Component({
  selector: 'app-siblings-demo',
  imports: [ProductPicker, CartSummary],
  // One CartStore instance for this component and everything in its template.
  // With providedIn: 'root' instead, every page would share a single cart.
  providers: [CartStore],
  template: `
    <!-- No bindings: the siblings talk through the injected CartStore. -->
    <div class="siblings">
      <app-product-picker />
      <app-cart-summary />
    </div>
  `,
  styles: `
    .siblings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiblingsDemo {}
