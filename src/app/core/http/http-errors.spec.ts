import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { friendlyMessage, HttpErrors } from './http-errors';

const errorWith = (status: number) => new HttpErrorResponse({ status });

describe('friendlyMessage', () => {
  it.each([
    [0, 'Cannot reach the server. Check your connection.'],
    [401, 'You are not allowed to do that.'],
    [403, 'You are not allowed to do that.'],
    [404, 'Not found.'],
    [500, 'The server failed. Try again later.'],
    [503, 'The server failed. Try again later.'],
    [400, 'The request failed.'],
  ])('status %s → "%s"', (status, message) => {
    expect(friendlyMessage(errorWith(status))).toBe(message);
  });
});

describe('HttpErrors', () => {
  it('keeps the last reported error until dismissed', () => {
    const errors = TestBed.inject(HttpErrors);
    expect(errors.last()).toBeNull();

    errors.report(errorWith(0));
    expect(errors.last()).toBe('Network · Cannot reach the server. Check your connection.');

    errors.report(errorWith(404));
    expect(errors.last()).toBe('404 · Not found.');

    errors.dismiss();
    expect(errors.last()).toBeNull();
  });
});
