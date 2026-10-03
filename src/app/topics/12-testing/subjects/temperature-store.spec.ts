import { effect } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TemperatureStore } from './temperature-store';

describe('TemperatureStore', () => {
  let store: TemperatureStore;

  beforeEach(() => {
    // [1] A root service: inject it, no component involved. TestBed gives each test a new injector,
    // so every test starts from a fresh store.
    store = TestBed.inject(TemperatureStore);
  });

  it('starts at 20 °C', () => {
    expect(store.celsius()).toBe(20);
    expect(store.fahrenheit()).toBe(68);
    expect(store.feel()).toBe('mild');
  });

  it('recomputes derived signals synchronously after a write', () => {
    // [2] Reading a computed right after a write gives the new value: no waiting, no change detection.
    store.setCelsius(30);
    expect(store.fahrenheit()).toBe(86);
    expect(store.feel()).toBe('hot');
  });

  it('converts from Fahrenheit, rounding to one decimal', () => {
    store.setFahrenheit(0);
    expect(store.celsius()).toBe(-17.8);
    expect(store.feel()).toBe('cold');
  });

  it.each([
    [9.9, 'cold'],
    [10, 'mild'],
    [24.9, 'mild'],
    [25, 'hot'],
  ] as const)('%s °C feels %s', (celsius, feel) => {
    store.setCelsius(celsius);
    expect(store.feel()).toBe(feel);
  });

  it('notifies effects when TestBed flushes them', () => {
    const seen: number[] = [];
    // [3] effect() needs an injection context; TestBed provides one.
    TestBed.runInInjectionContext(() => effect(() => seen.push(store.celsius())));

    // Effects are scheduled, not run on write. TestBed.tick() runs change detection and effects.
    TestBed.tick();
    store.setCelsius(5);
    store.setCelsius(6);
    TestBed.tick();

    // The effect saw the initial value and the last one; the intermediate 5 was never observed.
    expect(seen).toEqual([20, 6]);
  });
});
