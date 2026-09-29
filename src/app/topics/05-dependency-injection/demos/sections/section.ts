import { Signal } from '@angular/core';

/**
 * The token nested sections provide and look up. An abstract class, so `SectionBox` can
 * provide itself under it and consumers do not import the component.
 */
export abstract class Section {
  abstract readonly name: Signal<string>;
}
