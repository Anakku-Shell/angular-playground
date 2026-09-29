import { Pipe, PipeTransform } from '@angular/core';

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
