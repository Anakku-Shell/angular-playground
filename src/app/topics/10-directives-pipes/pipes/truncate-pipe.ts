import { Pipe, PipeTransform } from '@angular/core';

/*
 * A pipe is a class with @Pipe({ name }) and a transform(value, ...args) method. Import it in
 * the components that use it, like a component. For logic the class also needs, a computed()
 * or a plain function is often simpler than a pipe.
 */

/**
 * Cuts a text to `limit` characters. Arguments follow the pipe name, separated by colons:
 * `{{ text | truncate: 20 : ' [more]' }}`.
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, ellipsis = '…'): string {
    return value.length > limit ? value.slice(0, limit).trimEnd() + ellipsis : value;
  }
}
