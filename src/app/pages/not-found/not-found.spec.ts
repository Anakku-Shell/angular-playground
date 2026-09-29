import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { NotFound } from './not-found';

describe('NotFound', () => {
  it('shows the URL that did not match', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: NotFound }])],
    });
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/does-not-exist');

    expect(harness.routeNativeElement?.textContent).toContain('/does-not-exist');
  });
});
