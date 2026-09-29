import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EuroPrice } from './tokens/euro-price';
import { PREFERS_DARK_SCHEME } from './tokens/prefers-dark-scheme';

@Component({
  selector: 'app-tokens-demo',
  imports: [CurrencyPipe, EuroPrice],
  template: `
    <dl class="demo-values">
      <dt>inject(PREFERS_DARK_SCHEME)()</dt>
      <dd class="scheme">
        {{ prefersDark() ? 'dark' : 'light' }}
        <span class="muted">(switch your system theme: it updates live)</span>
      </dd>
      <dt>&#123;&#123; price | currency &#125;&#125; here</dt>
      <dd class="default-price">{{ price | currency }}</dd>
      <dt>Same pipe inside &lt;app-euro-price&gt;</dt>
      <dd class="euro-price"><app-euro-price [amount]="price" /></dd>
    </dl>
  `,
  styleUrl: './di-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensDemo {
  protected readonly prefersDark = inject(PREFERS_DARK_SCHEME);
  protected readonly price = 9.99;
}
