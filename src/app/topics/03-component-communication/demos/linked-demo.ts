import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { OptionPicker } from './linked/option-picker';

const SIZES = {
  shirts: ['XS', 'S', 'M', 'L', 'XL'],
  shoes: ['38', '39', '40', '41', '42', '43'],
  hats: ['One size'],
} as const satisfies Record<string, readonly string[]>;

type Category = keyof typeof SIZES;

/** The parent of the linked demo: picks a category and passes its sizes to the picker. */
@Component({
  selector: 'app-linked-demo',
  imports: [OptionPicker],
  templateUrl: './linked-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedDemo {
  protected readonly categories = Object.keys(SIZES) as Category[];
  protected readonly category = signal<Category>('shirts');
  // A new array whenever the category changes. The picker receives it as its `options` input.
  protected readonly sizes = computed(() => SIZES[this.category()]);

  protected onCategory(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as Category);
  }
}
