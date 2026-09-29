import { CartStore, Product } from './cart-store';

// A service with no dependencies can be tested with `new`, without TestBed.
describe('CartStore', () => {
  const mouse: Product = { id: 2, name: 'Mouse', price: 19.5 };
  const monitor: Product = { id: 3, name: 'Monitor', price: 189 };

  it('adds products and merges repeated ones into one line', () => {
    const store = new CartStore();

    store.add(mouse);
    store.add(monitor);
    store.add(mouse);

    expect(store.lines()).toEqual([
      { product: mouse, quantity: 2 },
      { product: monitor, quantity: 1 },
    ]);
    expect(store.count()).toBe(3);
    expect(store.total()).toBe(228);
  });

  it('clears the cart', () => {
    const store = new CartStore();
    store.add(mouse);

    store.clear();

    expect(store.lines()).toEqual([]);
    expect(store.total()).toBe(0);
  });
});
