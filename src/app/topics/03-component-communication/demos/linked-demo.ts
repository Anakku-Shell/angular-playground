import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { OptionPicker } from './linked/option-picker';

const SIZES = {
  shirts: ['XS', 'S', 'M', 'L', 'XL'],
  shoes: ['38', '39', '40', '41', '42', '43'],
  hats: ['One size'],
} as const satisfies Record<string, readonly string[]>;

type Category = keyof typeof SIZES;

@Component({
  selector: 'app-linked-demo',
  imports: [OptionPicker],
  templateUrl: './linked-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedDemo {
  protected readonly categories = Object.keys(SIZES) as Category[];
  protected readonly category = signal<Category>('shirts');
  protected readonly sizes = computed(() => SIZES[this.category()]);

  protected onCategory(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as Category);
  }
}
