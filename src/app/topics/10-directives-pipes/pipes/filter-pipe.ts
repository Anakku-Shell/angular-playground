import { Pipe, PipeTransform } from '@angular/core';

function filterItems(items: readonly string[], term: string): string[] {
  const needle = term.trim().toLowerCase();
  return items.filter((item) => item.toLowerCase().includes(needle));
}

/**
 * Pure (the default): Angular calls `transform` again only when an argument changes, compared
 * with `===`. Pushing into the same array is not a change, so the output goes stale.
 */
@Pipe({ name: 'filterPure' })
export class FilterPurePipe implements PipeTransform {
  transform(items: readonly string[], term: string): string[] {
    return filterItems(items, term);
  }
}

/** Impure: `transform` runs on every change detection of the component, mutations included. */
@Pipe({ name: 'filterImpure', pure: false })
export class FilterImpurePipe implements PipeTransform {
  transform(items: readonly string[], term: string): string[] {
    return filterItems(items, term);
  }
}
