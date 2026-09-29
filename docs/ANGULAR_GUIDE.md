# Angular Guide

Companion notes for this playground. It targets **Angular 21** and points out what differs in v19/v20 codebases. Each topic page in the app has a matching subsection in [Topics](#5-topics).

## Contents

1. [Setup](#1-setup)
2. [Project anatomy](#2-project-anatomy)
3. [Architecture](#3-architecture)
4. [TypeScript tips in Angular](#4-typescript-tips-in-angular)
5. [Topics](#5-topics)
6. [Angular 19 → 20 → 21](#6-angular-19--20--21)
7. [Production build](#7-production-build)
8. [References](#8-references)
9. [Appendix: Coming from Vue](#appendix-coming-from-vue)

---

## 1. Setup

### Node and the CLI

- Angular needs an active LTS version of Node. The CLI checks the supported range and fails early with a clear message if yours is outside it.
- The Angular CLI (`@angular/cli`) is a **dev dependency of the project**. There is no need to install it globally:
  - `npm start`, `npm run build`, `npm test`, `npm run lint` run the project's scripts, and npm puts `node_modules/.bin` on the `PATH` while they run.
  - For other commands, use `npx ng <command>` (e.g. `npx ng generate component foo`).
  - To create a new project without a global install: `npx @angular/cli@21 new my-app`.
  - A global CLI (`npm i -g @angular/cli`) also works: inside a project it hands off to the project's local version. It adds nothing but a possible version mismatch warning.

### Creating the project

This playground was created with:

```bash
npx @angular/cli@21 new angular-playground --directory . --style=scss --routing --ssr=false --skip-git
```

| Flag            | Meaning                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| `--directory .` | Generate into the current folder instead of a new one.                   |
| `--style=scss`  | Component and global styles use SCSS.                                    |
| `--routing`     | Adds `app.routes.ts` and `provideRouter()`.                              |
| `--ssr=false`   | Client-side only (no server-side rendering / hydration).                 |
| `--skip-git`    | Do not run `git init` or make a first commit (the repo already existed). |

Defaults you get in v21 without asking: standalone components, **zoneless** change detection (no `zone.js`), **Vitest** as the test runner, `strict` TypeScript, and the 2025 file naming (`app.ts` instead of `app.component.ts`).

### Everyday commands

| Command                       | What it does                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `npm start` (`ng serve`)      | Dev server on `http://localhost:4200` with hot reload.                         |
| `npm run build` (`ng build`)  | Production build into `dist/angular-playground/browser`.                       |
| `npm test` (`ng test`)        | Runs the unit tests with Vitest (watch mode; add `--watch=false` for one run). |
| `npm run test:coverage`       | One test run with a coverage report in `coverage/`.                            |
| `npm run lint` (`ng lint`)    | ESLint over `src/**/*.ts` and `src/**/*.html`.                                 |
| `npm run format`              | Prettier over the whole repo (`format:check` only reports).                    |
| `npx ng generate <schematic>` | Generates code from a schematic (see below).                                   |

Useful `ng generate` (`ng g`) schematics:

```bash
npx ng g component shared/user-card   # user-card.ts / .html / .scss / .spec.ts
npx ng g service core/user-store      # user-store.ts (no ".service" suffix since v20)
npx ng g directive shared/highlight
npx ng g pipe shared/initials
npx ng g guard core/auth              # functional guard
npx ng g interceptor core/auth        # functional interceptor
npx ng g environments                 # src/environments/*.ts + fileReplacements
```

Add `--dry-run` to see what would be created without writing anything.

### Dev server: esbuild, Vite and HMR

- `angular.json` uses the **`@angular/build`** builders: `@angular/build:application` for builds and `@angular/build:dev-server` for `ng serve`. They bundle with **esbuild** and serve through **Vite**.
- Editing a component's **template (`.html`) or styles (`.scss`)** is applied with **HMR** (hot module replacement): the change appears without a page reload and the component keeps its state.
- Editing a **`.ts`** file triggers a fast full reload.
- You never touch Vite's config directly: the builder owns it, and the options live in `angular.json`.
- Vite pre-bundles dependencies into `.angular/cache`. If you start importing a new entry point (e.g. `@angular/core/rxjs-interop`) while `ng serve` runs, the cache can end up with two copies of `@angular/core`, and errors such as `NG0203 ... can only be used within an injection context` appear for correct code. Fix: stop the server, delete `.angular/cache` and start it again.

**Legacy: the webpack builder.** Projects created before v17 (and many v19 codebases that were upgraded, not recreated) may still use `@angular-devkit/build-angular:browser` / `:dev-server`, which bundle with webpack. It still works but is slower and gets no new features. Migrate with:

```bash
npx ng update @angular/cli --name use-application-builder
```

The migration switches the builders, renames options (e.g. `main` → `browser`) and moves the output to `dist/<app>/browser`. Custom webpack configs (e.g. via `@angular-builders/custom-webpack`) have no direct equivalent and need to be reworked.

### Linting and formatting

- **Lint:** the CLI ships no linter (TSLint was removed in v12). The standard is **angular-eslint**: `ng add angular-eslint@<major>`.
  - Match the major to your Angular version (here `@21`). Without it, `ng add` installs the latest release, which may target a newer Angular and refuses to configure the project.
  - It creates `eslint.config.js` (ESLint "flat config") and a `lint` target in `angular.json`.
  - Besides the recommended rules, this repo enforces a few project conventions: `OnPush` on every component, signal-based APIs (`input()` instead of `@Input()`), native control flow (`@if` instead of `*ngIf`) and self-closing tags.
- **Format:** the CLI generates a `.prettierrc` (`printWidth: 100`, `singleQuote`, the `angular` parser for HTML). Prettier formats; ESLint finds bugs and bad practices. They complement each other.
- **Line endings:** `.gitattributes` (`* text=auto eol=lf`) and `.editorconfig` keep every file on LF, whatever each machine's `core.autocrlf` says.

---

## 2. Project anatomy

```
angular.json            Workspace config: builders, build/serve/test/lint targets, budgets
package.json            Dependencies and npm scripts
tsconfig.json           Shared TS + Angular compiler options (strict)
tsconfig.app.json       App build: src/**/*.ts minus specs
tsconfig.spec.json      Tests: specs + Vitest globals
eslint.config.js        ESLint flat config (angular-eslint)
public/                 Static files copied as-is (favicon.ico)
src/
  index.html            Host page: <app-root> is where the app mounts
  main.ts               Entry point: bootstrapApplication(App, appConfig)
  styles.scss           Global styles (design tokens, base elements)
  app/
    app.ts|html|scss    Root component (the shell: header, sidebar, <router-outlet>)
    app.config.ts       App-wide providers (router, error listeners...)
    app.routes.ts       Top-level routes
    pages/              Pages that are not topics (home, not-found)
    shared/             Reusable UI (demo-card, tips-box)
    topics/             One folder per topic + topics.registry.ts
```

### `main.ts`

```ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

Starts the app: creates the root injector from `appConfig.providers`, then renders `App` into the `<app-root>` element of `index.html`. There is no root `NgModule` (that was the pre-standalone `platformBrowserDynamic().bootstrapModule(AppModule)`).

### `app.config.ts`

An `ApplicationConfig` is just `{ providers: [...] }`. Features are enabled with `provideXxx()` functions:

- `provideBrowserGlobalErrorListeners()`: reports uncaught errors and unhandled promise rejections to Angular's `ErrorHandler`.
- `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`:
  - `withComponentInputBinding()`: route params, query params and route `data` are bound to component inputs with the same name (no need to inject `ActivatedRoute` for simple cases).
  - `withViewTransitions()`: page changes are animated with the browser's View Transitions API; browsers without it simply skip the animation.
- `provideHttpClient(withFetch(), withInterceptors(APP_INTERCEPTORS))`: makes `HttpClient` injectable, backed by the fetch API, with the functional interceptors from `core/http/` (see [5.9](#59-http--rxjs)).

### `app.routes.ts`

Routes are plain objects. This app uses `loadComponent: () => import(...)` for every page, so each page is a **lazy chunk** fetched the first time it is visited (visible in the `ng build` output as "Lazy chunk files"). The `**` wildcard route must be last: the router matches in order.

Topic routes are generated from `topics/topics.registry.ts`, the single source of truth for the sidebar, the home page and the routes.

### `tsconfig.json`

Strictness flags worth knowing:

- `strict`: all of TypeScript's strict checks (`strictNullChecks`, `noImplicitAny`...).
- `noPropertyAccessFromIndexSignature`: `obj['key']` is required for index signatures, `obj.key` only for declared properties.
- `noImplicitOverride`: overriding a base member needs the `override` keyword.
- Angular compiler: `strictTemplates` type-checks templates like TS code (inputs, `$event`, pipes), `strictInjectionParameters` and `strictInputAccessModifiers` catch DI and input mistakes at build time.

### `angular.json`

One project (`angular-playground`) with the targets `build`, `serve`, `test` and `lint`. Things you will touch:

- `build.options.styles` / `assets`: global stylesheets and static files.
- `build.configurations.production.budgets`: size limits that warn or fail the build (see [Production build](#7-production-build)).
- `serve.defaultConfiguration: development`: `ng serve` uses the unoptimised build with source maps.

---

## 3. Architecture

> First draft. Sections marked _TODO_ are filled in by the matching topic.

### Standalone components and bootstrap

- A component declares what its template uses in its own `imports` array (other components, directives, pipes). There is no `NgModule` to declare it in.
- `standalone: true` is the default since v19, so it is not written. In v19+ code you may still see it, harmlessly.
- The app starts with `bootstrapApplication(RootComponent, appConfig)` (see `main.ts`).
- NgModules still exist and appear in older codebases; see the legacy topic.

### Providers in `app.config.ts`

- `appConfig.providers` configures the **root environment injector**: whatever is provided there is a singleton for the whole app.
- Services with `@Injectable({ providedIn: 'root' })` need no entry here: they register themselves and are tree-shaken if unused.
- `app.config.ts` is for app-wide _configuration_ (router, HTTP client, interceptors, error handling, initializers).

### The DI hierarchy

Angular has two trees of injectors, and `inject()` looks in both.

```
Environment injectors (app-wide, not tied to the DOM)

  null injector            throws NG0201 "No provider for X" (or returns null with `optional`)
    ▲
  platform injector        platform-level services, shared by apps on the page
    ▲
  root injector            appConfig.providers + every @Injectable({ providedIn: 'root' })
    ▲
  route injector           `providers` on a route, for that route and its children

Element injectors (one per component/directive element that has providers)

  <app-root>               providers / viewProviders of AppRoot
    ▲
  <app-page>               providers of Page
    ▲
  <app-child>              ← inject(X) starts here
```

**Resolution order** for `inject(X)` in `<app-child>`:

1. Walk up the **element injectors**: the child's own element, then its parents in the template tree, up to the root component. The first provider of `X` wins.
2. If none has it, continue in the **environment injectors** that belong to that element (route injector, then root, then platform).
3. Not found: NG0201, or `null` with `{ optional: true }`.

Modifiers change where the walk starts or stops: `self` (only the first element), `skipSelf` (start at the parent), `host` (stop at the host of the current template), `optional` (null instead of throwing). See [5.5](#55-dependency-injection).

**Where to provide**

| Where                                   | Instances                  | Lifetime                                  |
| --------------------------------------- | -------------------------- | ----------------------------------------- |
| `@Injectable({ providedIn: 'root' })`   | one for the app            | the app                                   |
| `appConfig.providers`                   | one for the app            | the app                                   |
| route `providers: [...]`                | one per route config       | from first activation; kept after leaving |
| component `providers` / `viewProviders` | one per component instance | destroyed with the component              |

**Route-level providers**

```ts
{
  path: 'admin',
  providers: [AdminStore, { provide: API_BASE, useValue: '/api/admin' }],
  loadChildren: () => import('./admin/admin.routes'),
}
```

- Every component under `admin` (and the guards and resolvers of those routes) injects the same `AdminStore`. Other routes cannot see it.
- The route injector is an environment injector: it outlives the components. Navigating away does not destroy it, so state survives coming back. Use component `providers` when state must reset per visit.
- It is how feature-scoped services are written without NgModules (in older code, a lazy `NgModule`'s `providers` did the same).

### Change detection

Change detection is the pass that walks the component tree and updates the DOM where a template binding's value changed. Two questions decide how it behaves: **when** a pass is scheduled, and **which components** it checks.

**When: zone.js vs zoneless**

|                                 | zone.js (default before v21)                                                                  | zoneless (stable in v20.2, default in v21)                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| How Angular finds out           | `zone.js` patches `setTimeout`, promises, `fetch`, DOM events… and runs a pass after each one | Only explicit notifications (list below)                                                                          |
| Setup                           | `zone.js` in the polyfills, `provideZoneChangeDetection()`                                    | Nothing in v21; `provideZonelessChangeDetection()` in v20 (`provideExperimentalZonelessChangeDetection()` in v19) |
| Cost                            | Extra polyfill (~30 kB raw), passes after async work that changed nothing                     | Passes only when something changed                                                                                |
| Plain field set in `setTimeout` | Shows up (a pass ran after the timer)                                                         | Stays stale until the next pass                                                                                   |

What schedules a pass in a zoneless app:

- a signal read by a template changes;
- an event bound in a template (`(click)`…) runs;
- `ChangeDetectorRef.markForCheck()`, or an `async` pipe emitting (it calls `markForCheck()` internally);
- a view is attached or removed, or `ComponentRef.setInput()` is called.

**Which components: `OnPush` vs `Eager`**

```
AppRoot (Eager)            checked on every pass
  └─ Page (OnPush)         checked only if marked dirty
       ├─ Card (OnPush)    skipped: nothing concerns it
       └─ List (OnPush)    ← a signal it reads changed: marked dirty, so the pass
                             checks List (and walks through Page to reach it)
```

- `Eager` (called `Default` before v21, now deprecated under that name) checks the component on every pass. It is what you get when `changeDetection` is omitted.
- `OnPush` checks it only when it is marked dirty: a new input reference, an event in its template, a signal its template reads, `markForCheck()`. Every component in this playground uses it.
- Signals make this fine-grained: a signal change marks only the components that read it, so the pass skips the rest of the tree.

**Migrating to zoneless** (what breaks): code that changed plain fields in callbacks and relied on zone.js to notice. Subscriptions, timers, promise callbacks and third-party library callbacks that set component fields must switch to signals, `toSignal()`, the `async` pipe, or call `markForCheck()`. `NgZone.onStable` / `onMicrotaskEmpty` no longer fire; use `afterNextRender`. Apps already built with OnPush and signals usually just work. Demos in [5.6](#56-lifecycle--change-detection).

### Routing and lazy loading

- `loadComponent` for a single page, `loadChildren` for a set of child routes. Both produce a lazy chunk.
- Router features are opt-in functions passed to `provideRouter(routes, ...)`: `withComponentInputBinding()` (params as inputs, used here), `withViewTransitions()`, `withPreloading()`, `withRouterConfig()`, `withInMemoryScrolling()`…
- A navigation runs in stages. Knowing the order explains most routing bugs:

```
URL ──▶ match routes (redirects, canMatch, lazy loadChildren)
    ──▶ canDeactivate on the routes being left
    ──▶ canActivateChild / canActivate on the routes being entered
    ──▶ resolvers (the old page stays on screen meanwhile)
    ──▶ activate: create components, bind inputs, set the title
```

- **Preloading.** Without it, a lazy chunk is fetched on the first visit, so that first click waits for the network. `withPreloading(PreloadAllModules)` fetches every lazy route in the background after the app starts. A custom `PreloadingStrategy` can preload only routes marked in `data`. Preloading does not run `canMatch` guards (only the deprecated `canLoad` stops it), so code behind a guard still gets downloaded.
- Guards, resolvers and redirects are plain functions that run in an injection context (`inject()` works). Details and demos in [5.7](#57-routing).

### Folder structure

A common layout for Angular apps, and the one used here:

- `core/`: app-wide singletons (services, interceptors, guards). Nothing visual.
- `shared/`: reusable, presentational UI and pipes/directives used across features.
- `features/` (here `topics/` and `pages/`): one folder per feature or page, lazy-loaded.

Each component keeps its files together (`name.ts`, `.html`, `.scss`, `.spec.ts`). Since v20 the style guide drops the `.component` / `.service` suffixes.

### Smart vs presentational components

- **Smart** (container) components own state and logic: they inject services, hold signals, and handle events. Usually one per page or feature.
- **Presentational** components only render their inputs and report user actions through outputs. They inject nothing app-specific, so they are easy to reuse and to test.
- Data flows down through inputs and events flow up through outputs. When a tree gets deep, or unrelated components need the same state, move the state into a service (see [5.3](#53-component-communication)).

---

## 4. TypeScript tips in Angular

_TODO._

---

## 5. Topics

One subsection per topic page. Code: `src/app/topics/NN-topic-name/`.

### 5.1 Components & templates

Route: `/topics/01-components-templates`. All the APIs below are **stable**.

**Template syntax at a glance**

| Syntax                                  | What it does                                                     |
| --------------------------------------- | ---------------------------------------------------------------- |
| `{{ expr }}`                            | Interpolation: renders `expr` as (escaped) text.                 |
| `[prop]="expr"`                         | Property binding: sets a DOM property or a component input.      |
| `[attr.name]="expr"`                    | Attribute binding (`aria-*`, `colspan`...). `null` removes it.   |
| `[class.name]="bool"` / `[class]="map"` | Toggle one class / set several.                                  |
| `[style.prop.unit]="expr"`              | One inline style, e.g. `[style.width.px]`.                       |
| `(event)="statement"`                   | Event binding. `$event` is the DOM event (or an output's value). |
| `(keyup.enter)`, `(keydown.shift.tab)`  | Key event filters.                                               |
| `[(x)]="signalOrField"`                 | Two-way binding: `[x]` + `(xChange)`.                            |
| `#ref`                                  | Template variable pointing to an element or component.           |
| `@let name = expr;`                     | Read-only template variable (stable since v19).                  |
| `expr \| pipe: arg`                     | Transforms a value for display.                                  |

**Interpolation and expressions**

- Expressions read the component's members only (no `window`, `console`, globals). Signals are read by calling them: `{{ user().name }}`.
- Supported: arithmetic, ternaries, `?.`, `??`, method calls, literals. Keep them short: derived values belong in a `computed()`, which is cached and recomputed only when its signals change.
- Interpolation escapes HTML. `[innerHTML]` renders markup and Angular sanitizes it.

**Bindings**

- Property vs attribute: `[disabled]` sets `button.disabled` (a DOM property). `aria-pressed` exists only as an attribute, so it needs `[attr.aria-pressed]`. `[attr.x]="false"` renders `x="false"`; use `null` to remove the attribute.
- Static `class`, `[class]` and `[class.x]` merge instead of overwriting each other.

**Events**

- For `(input)`, `$event` is a generic `Event`. Cast in the class: `(event.target as HTMLInputElement).value`.
- A handled template event marks the component for re-render (this is one of the triggers in a zoneless app).
- Testing gotcha: `[value]="draft()"` only writes to the DOM when the bound value changes between two renders. A test that fires `input` and `keyup.enter` back to back, with no render in between, sees `''` → `''` and the input is not cleared. Await `fixture.whenStable()` between the two events, as a real user would.

**Two-way binding**

```html
<input [(ngModel)]="name" />
<!-- is the same as -->
<input [ngModel]="name()" (ngModelChange)="name.set($event)" />
```

- `ngModel` needs `FormsModule` in the component's `imports`.
- `[(ngModel)]` accepts a writable signal directly: pass the signal (`name`), not its value (`name()`).
- Any component with an input `x` and an output `xChange` supports `[(x)]`; `model()` creates that pair.

**Template reference variables**

- `#nameInput` on an element gives the element; on a component, the component instance; `#m="ngModel"` gives a directive through its `exportAs` name.
- Gotcha: `{{ nameInput.value }}` does not update as you type. Typing fires no bound event, so nothing triggers a render. Keep state in signals; use refs to pass values into methods or call element methods (`nameInput.focus()`).

**`@let`**

```html
@let subtotal = quantity() * unitPrice;
@let customer = customer$ | async;
```

- Stable since v19 (developer preview in 18.1).
- Read-only, visible after its declaration in the same block and nested blocks.
- Great for "subscribe once, use many times" with `async`. Logic that the class also needs goes in a `computed()`.

**Built-in pipes** (from `@angular/common`, imported per component)

- `date` (`'fullDate'`, `'HH:mm'`...), `currency` (`'EUR'`, `'EUR':'code'`), `uppercase`, `json`, `keyvalue` (sorted by key), `async`.
- They use the app locale (`en-US` by default). Other locales: `registerLocaleData()` + `LOCALE_ID`.
- Pure pipes re-run only when the input value or reference changes. `async`, `json` and `keyvalue` are impure: they run on every check.
- `async` subscribes and unsubscribes automatically when the component is destroyed.

**Styles and `ViewEncapsulation`**

| Mode                 | How                                                                | Leaks out? | Global styles get in? |
| -------------------- | ------------------------------------------------------------------ | ---------- | --------------------- |
| `Emulated` (default) | Adds `_ngcontent-*` / `_nghost-*` attributes to elements and rules | No         | Yes                   |
| `None`               | Adds the CSS to the page as-is                                     | **Yes**    | Yes                   |
| `ShadowDom`          | Native shadow root                                                 | No         | No (but see gotcha)   |

- `:host` styles the component's own element; `:host(.x)` when the host has class `x`.
- Emulated styles do not reach projected content or child components. `::ng-deep` pierces that but is deprecated: use global styles or CSS custom properties.
- Angular removes a component's styles when its last instance is destroyed (visible with the `None` sample: untick it and the leak disappears).
- CSS custom properties and inherited properties (font, color) cross every boundary, shadow roots included.
- Gotcha: `ShadowDom` keeps out `styles.scss`, but Angular copies the styles of its other components into every shadow root. A `None` component's rule therefore reaches inside.

**Escaping Angular syntax in a template**

- `@` starts a block: write `&#64;` to print it.
- `{{ }}` is interpolation even when written as `&#123;&#123;` (entities are decoded first). Put `ngNonBindable` on the element to print it as text.
- A bare `{` or `}` in text opens or closes a block: write `&#123;` / `&#125;`. `ngNonBindable` does not help here, because blocks are parsed before bindings.

### 5.2 Control flow

Route: `/topics/02-control-flow`. Built-in blocks are **stable** (since v17) and need no imports. Exceptions noted below.

**`@if`**

```html
@if (score() >= 90) {
  <strong>A</strong>
} @else if (score() >= 70) {
  <strong>B</strong>
} @else {
  <strong>F</strong>
}

<!-- `as` names the value; the type is narrowed inside the block (User | undefined → User) -->
@if (selectedUser(); as user) {
  <p>{{ user.name }}</p>
} @else {
  <p>No user selected.</p>
}
```

- A false block is removed from the DOM and its components are destroyed. To keep state, hide with `[hidden]` or a class.
- It tests truthiness: `0` and `''` are false.

**`@for`**

```html
@for (task of tasks(); track task.id; let pos = $index) {
  <li [class.is-odd]="$odd">{{ pos + 1 }} / {{ $count }} {{ task.title }}</li>
} @empty {
  <li>No tasks</li>
}
```

- `track` is **required**. Implicit variables: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd`. Rename them with `let x = $index` (needed in nested loops).
- Works with any iterable (`Set`, `Map` gives `[key, value]`). Plain objects: `keyvalue` pipe.

**`track` and DOM reuse**

| `track`           | Reorder                                            | Same data, new objects            |
| ----------------- | -------------------------------------------------- | --------------------------------- |
| `item.id`         | Rows move with their items                         | Rows kept                         |
| `$index`          | Rows stay; their state now belongs to another item | Rows kept                         |
| `item` (identity) | Rows move                                          | **All rows recreated** (`NG0956`) |

- Use a stable unique id. Duplicate keys log `NG0955`.
- `$index` is only safe for lists that never reorder, or rows without state.
- Legacy `*ngFor` defaulted to identity when `trackBy` was missing, a classic performance issue.

**`@switch`**

```html
@let currentPlan = plan();
@switch (currentPlan) {
  @case ('free') { ... }
  @case ('pro') { ... }
  @case ('team')
  @case ('enterprise') { shared body }
  @default never;
}
```

- Cases compare with `===`; no fall-through, no `break`.
- Consecutive `@case` blocks share one body, and `@default never;` makes the template type checker report a union member without a case. Both are recent additions (available in this project's v21.2, not in v19/v20).
- Gotcha: `@default never;` needs a narrowable value. `@switch (plan())` fails (TypeScript does not narrow function calls, signal reads included); store the value with `@let` first.

**`@defer`**

```html
@defer (on interaction; prefetch on idle) {
  <app-heavy-widget />
} @placeholder (minimum 500ms) {
  <button>Load</button>
} @loading (after 100ms; minimum 1s) {
  <p>Loading…</p>
} @error {
  <p>Could not load.</p>
}
```

- Standalone components, directives and pipes used **only** inside the block go into a separate lazy chunk (`npm run build` lists it, e.g. `heavy-widget`). Using the dependency elsewhere in the same component (template or `viewChild`) keeps it eager.
- Triggers: `on idle` (default), `on viewport`, `on interaction`, `on hover`, `on immediate`, `on timer(3s)`, `when expr`. Combine several with `;`. `prefetch on ...` downloads early and renders on the main trigger.
- `on viewport` / `on interaction` / `on hover` watch the placeholder's root element (or a `#ref` passed as `on viewport(ref)`).
- A loaded block never goes back to its placeholder; `when` is one-way.
- Gotcha: with HMR (the `ng serve` default) Angular loads every defer dependency eagerly and logs `NG0751`. Use `ng serve --no-hmr` or a build to see real chunk loading.
- Testing: `TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Manual })`, then `(await fixture.getDeferBlocks())[0].render(DeferBlockState.Complete)`.

**Legacy structural directives**

| Legacy (`@angular/common`, deprecated since v20)        | Built-in                                         |
| ------------------------------------------------------- | ------------------------------------------------ |
| `<p *ngIf="cond; else other">` + `<ng-template #other>` | `@if (cond) { } @else { }`                       |
| `*ngIf="user$ \| async as user"`                        | `@if (user$ \| async; as user) { }`              |
| `*ngFor="let x of xs; let i = index; trackBy: fn"`      | `@for (x of xs; track x.id; let i = $index) { }` |
| `[ngSwitch]` + `*ngSwitchCase` / `*ngSwitchDefault`     | `@switch` / `@case` / `@default`                 |

- `*` is sugar for wrapping the element in `<ng-template>`; only one structural directive fits per element (use `<ng-container>` to combine).
- Each directive had to be imported (`NgIf`, `NgFor`... or `CommonModule`). Blocks need no imports.
- Migration: `ng generate @angular/core:control-flow`.

### 5.3 Component communication

Route: `/topics/03-component-communication`. `input()`, `output()`, `model()` and the signal queries are **stable** since v19; `linkedSignal` since v20; `<ng-content>` fallback content since v18.

**Inputs**

```ts
readonly value = input.required({ transform: numberAttribute }); // no default, must be bound
readonly max = input(100, { transform: numberAttribute });       // default 100
readonly striped = input(false, { transform: booleanAttribute }); // `striped` alone → true
readonly label = input('Progress', { alias: 'caption' });        // public name: caption

protected readonly percent = computed(() => (this.value() / this.max()) * 100);
```

- An input is a **read-only signal** in the child. Derive with `computed()`; the child cannot `set()` it.
- A missing required input is a template compile error. Reading a required input before it is set (e.g. in a field initializer like `signal(this.value())`) throws `NG0950`.
- Static attributes always pass strings: `numberAttribute` / `booleanAttribute` accept both `max="4"` and `[max]="4"`.
- Aliases are discouraged (lint rule `no-input-rename`). Avoid names of native attributes (`title`): the static attribute also stays on the host element.
- Local state that starts from an input and resets when it changes: `linkedSignal(() => this.options()[0])`.
- Legacy: `@Input() value = 0;` (a plain field; changes seen in `ngOnChanges` or a setter). Migration: `ng generate @angular/core:signal-input-migration`.

**Outputs**

```ts
readonly rated = output<number>(); // child: this.rated.emit(4)
readonly cleared = output();       // no payload
```

```html
<app-star-rating [value]="rating()" (rated)="rating.set($event)" (cleared)="rating.set(0)" />
```

- Outputs do **not bubble**: only the direct parent can listen. Intermediate components re-emit.
- Name them after what happened, without `on`. Avoid DOM event names (`change`, `click`): native events bubbling out of the child reach the same listener.
- `output()` is not an RxJS `Subject`. To expose an Observable as an output: `outputFromObservable()` (Signals topic).
- Legacy: `@Output() rated = new EventEmitter<number>();`. Migration: `ng generate @angular/core:output-migration`.

**`model()`: two-way binding**

```ts
readonly value = model(1); // an input + a `valueChange` output
this.value.update((n) => n + 1); // updates the child and emits valueChange
```

```html
<app-quantity-stepper [(value)]="quantity" />  <!-- pass the signal, not quantity() -->
<app-quantity-stepper [value]="quantity()" />  <!-- one-way: child changes stay local -->
```

- `[(x)]` works with any input `x` + output `xChange`; `model()` declares both.
- Use it for form-like controls. Otherwise prefer input + a named output ("data down, events up").

**Content projection**

```html
<!-- panel.html -->
<header><ng-content select="h3, [panel-title]" /></header>
<div><ng-content /></div>                         <!-- default slot: everything else -->
<footer>
  <ng-content select="[panel-footer]">No actions</ng-content> <!-- fallback content -->
</footer>

<!-- parent -->
<app-panel>
  <h3>Title</h3>
  <p>Body</p>
  <ng-container ngProjectAs="[panel-footer]">
    <button>Save</button><button>Reset</button>
  </ng-container>
</app-panel>
```

- Projected content belongs to the **parent**: its bindings read the parent's state and the parent's styles apply. The child's encapsulated styles do not reach it.
- It is always created, even if the child never shows it, and projected once (not repeated by `@for`). For lazy or repeated content, pass an `<ng-template>` and render it with `ngTemplateOutlet`.

**Queries**

| Query                                        | Searches                                 | Returns                  |
| -------------------------------------------- | ---------------------------------------- | ------------------------ |
| `viewChild('ref')` / `viewChild(Cmp)`        | the component's own template             | `Signal<T \| undefined>` |
| `viewChild.required(...)`                    | same, throws if missing                  | `Signal<T>`              |
| `viewChildren(Cmp)`                          | own template, all matches                | `Signal<readonly T[]>`   |
| `contentChild(...)` / `contentChildren(...)` | the content projected into the component | same shapes              |

- A string locates a template reference (`#search`) and gives an `ElementRef` for elements, the instance for components. `{ read: ElementRef }` changes what you get.
- Results update when the view changes (`@if`, `@for`). They are ready after the view is created: read them in handlers, `computed`, `effect` or `afterNextRender`, not in the constructor.
- Use them for DOM work (focus, measuring) and imperative children (players, timers); prefer inputs/outputs for data.
- Legacy: `@ViewChild` / `@ContentChild` decorators, available from `ngAfterViewInit` / `ngAfterContentInit`. Migration: `ng generate @angular/core:signal-queries-migration`.

**Sharing state between siblings**

```ts
@Injectable()
export class CartStore {
  private readonly cartLines = signal<readonly CartLine[]>([]);
  readonly lines = this.cartLines.asReadonly();
  readonly count = computed(() => this.cartLines().reduce((n, l) => n + l.quantity, 0));
  add(product: Product): void { /* immutable update */ }
}

// Common parent: providers: [CartStore]. Each sibling: inject(CartStore).
```

- Private writable signal, public read-only signals and methods: only the store changes the state.
- `providedIn: 'root'` = one instance for the app; `providers` on a component = one per component instance, shared with its children (see [5.5](#55-dependency-injection)).
- Older code does this with a `BehaviorSubject` and the `async` pipe.

### 5.4 Signals & reactivity

Route: `/topics/04-signals`. `signal`, `computed`, `untracked` are **stable** (v17); `effect`, `linkedSignal`, `toSignal`, `toObservable` since v20; `outputFromObservable` since v19. `resource`, `rxResource` and `httpResource` are **experimental** in v21.

**`signal` and `computed`**

```ts
readonly quantity = signal(1);
this.quantity.set(2);               // new value
this.quantity.update((q) => q + 1); // derived from the current one
readonly total = computed(() => this.quantity() * this.price); // read-only, lazy, memoized
readonly items = signal<Item[]>([]);
this.items.update((list) => [...list, item]); // immutable: new array
```

- Dependencies are the signals read during the last run, found at run time (conditional reads count only when their branch runs).
- `computed` runs only when read (**lazy**) and reruns only after a dependency changed (**memoized**). It must be pure: writing a signal inside it throws.
- Mutating an array/object in place does not notify: the reference is the same.
- **Signals + `OnPush`**: a signal read in a template marks only that component for refresh. With zoneless (the v21 default), signals are what schedules change detection.

**Equality and `untracked`**

```ts
readonly point = signal({ x: 0, y: 0 }, { equal: (a, b) => a.x === b.x && a.y === b.y });
readonly sum = computed(() => this.a() + untracked(this.b)); // b is read, not tracked
```

- Default equality is `Object.is`. A custom `equal` (also on `computed`/`linkedSignal`) stops equal values from propagating. Keep it cheap.
- `untracked` is mostly for effects: react to one signal, read others as context, and wrap calls into code you do not control.

**`effect`**

```ts
constructor() {
  effect((onCleanup) => {
    const text = this.draft();                   // dependency
    const timer = setTimeout(() => save(text), 500);
    onCleanup(() => clearTimeout(timer));        // before the next run and on destroy
  });
}
```

- Only for **side effects outside Angular's data flow**: storage, logging, a canvas, a third-party widget. Needs an injection context; a component's effects are destroyed with it.
- **Do not write signals in an effect to derive state** (`effect(() => this.total.set(...))`): use `computed`, or `linkedSignal` if it must also be writable.
- Runs asynchronously during change detection: several `set()` calls give one run. For DOM work after render: `afterRenderEffect` / `afterNextRender`.
- Vue: `effect` ≈ `watchEffect`. For `watch(source, cb)`, read the source and wrap the rest in `untracked()`.

**`linkedSignal`: writable derived state**

```ts
readonly method = linkedSignal<readonly string[], string>({
  source: this.methods,
  computation: (methods, previous) =>
    previous && methods.includes(previous.value) ? previous.value : methods[0],
});
this.method.set('Express'); // lasts until `methods` changes
```

- Short form `linkedSignal(() => this.options()[0])` always resets. The long form sees the previous value.

**`resource` (experimental)**

```ts
readonly user = resource({
  params: () => this.userId(),                  // reactive; undefined → idle
  loader: ({ params, abortSignal }) => fetchUser(params, abortSignal),
});
// user.value(), user.status(), user.isLoading(), user.error(), user.hasValue(), user.reload()
```

- A params change aborts the previous request (`abortSignal`) and runs the loader again.
- `value()` throws in the error state: check `error()` / `hasValue()` first.
- A loading resource is a pending task: `fixture.whenStable()` in tests waits for it.
- `rxResource` (loader returns an Observable) and `httpResource` (HTTP topic) are variants. Stable alternative: an `HttpClient` Observable + `toSignal`.

**RxJS interop** (`@angular/core/rxjs-interop`)

```ts
readonly debouncedQuery = toSignal(
  toObservable(this.query).pipe(debounceTime(300), distinctUntilChanged()),
  { initialValue: '' },
);
readonly held = outputFromObservable(press$.pipe(switchMap(() => timer(800).pipe(takeUntil(release$)))));
```

| API                          | Direction           | Notes                                                                                       |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `toSignal(obs$, opts)`       | Observable → Signal | Subscribes now, unsubscribes on destroy. `initialValue` or `requireSync` avoid `undefined`. |
| `toObservable(sig)`          | Signal → Observable | Emits asynchronously, the last value per change detection.                                  |
| `outputFromObservable(obs$)` | Observable → output | Parent listens with `(held)="..."`.                                                         |
| `outputToObservable(ref)`    | output → Observable | For code that wants to `pipe()` a child's output.                                           |
| `takeUntilDestroyed()`       | operator            | Unsubscribes when the injection context is destroyed.                                       |

- Signals for state the template reads; RxJS for events over time (debounce, cancellation, combining streams).
- Legacy: state in `BehaviorSubject`s rendered with the `async` pipe, `ngOnDestroy` + `takeUntil(destroy$)` to unsubscribe.

### 5.5 Dependency injection

Route: `/topics/05-dependency-injection`. Everything here is **stable**. The injector tree and route-level providers are in [3. Architecture](#the-di-hierarchy).

**Where a service lives**

```ts
@Injectable({ providedIn: 'root' })   // one app-wide instance, tree-shakable
export class Counter { ... }

@Component({ providers: [Counter] })  // one instance per component instance, destroyed with it
@Component({ viewProviders: [Counter] }) // same, but invisible to projected content
```

- `providedIn: 'root'` is the default for services. The instance lives as long as the app: its state survives navigation.
- Component `providers` are visible to the component's template **and** to content projected into it. `viewProviders` only to its template: projected content resolves from where it was declared.
- `@Injectable()` without `providedIn` must be listed in some `providers` array, or injecting it throws NG0201.

**`InjectionToken`**

```ts
export const PREFERS_DARK_SCHEME = new InjectionToken<Signal<boolean>>('PREFERS_DARK_SCHEME', {
  providedIn: 'root',
  factory: () => {
    const query = inject(DOCUMENT).defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    // ... wrap it in a signal
  },
});
// Override for a subtree or a test: { provide: PREFERS_DARK_SCHEME, useValue: signal(true) }
```

- A token is the key for anything that is not a class: config objects, primitives, functions, signals. Interfaces do not exist at run time, so they cannot be keys.
- `providedIn` + `factory` gives a default without any provider, and the factory can `inject()`.
- Angular's own settings are tokens too (`DEFAULT_CURRENCY_CODE`, `LOCALE_ID`, `APP_INITIALIZER`…): providing one on a component changes it for that subtree.

**Provider recipes**

```ts
providers: [
  { provide: GREETER_CONFIG, useValue: { greeting: 'Hello', punctuation: '!' } },
  { provide: Logger, useClass: MemoryLogger },        // abstract class as token
  { provide: AUDIT_LOG, useExisting: Logger },         // alias: same instance
  { provide: Greeter, useFactory: () => new Greeter(inject(GREETER_CONFIG), inject(Logger)) },
]
```

| Recipe        | Gives                              | Typical use                                  |
| ------------- | ---------------------------------- | -------------------------------------------- |
| `useValue`    | that exact value                   | config, constants, test doubles              |
| `useClass`    | a new instance of the class        | implementation behind an abstract class      |
| `useExisting` | whatever another token resolves to | aliases; a component providing itself        |
| `useFactory`  | the function's return value        | values that need logic or other dependencies |

- `providers: [X]` is short for `{ provide: X, useClass: X }`. `multi: true` collects several providers of one token into an array.
- Legacy: `useFactory` with `deps: [A, B]`. With `inject()` inside the factory, `deps` is not needed.

**Resolution modifiers**

```ts
inject(Section, { optional: true });                  // T | null instead of NG0201
inject(Section, { self: true });                      // only this element
inject(Section, { skipSelf: true, optional: true });  // start at the parent: "the enclosing one"
inject(Section, { host: true, optional: true });      // stop at the host of the current template
```

- The "enclosing parent" pattern: a component provides itself with `{ provide: Section, useExisting: forwardRef(() => SectionBox) }` and finds its parent with `skipSelf`. Without `skipSelf` it finds itself while still being constructed: NG0200 (circular dependency).
- `host`: elements inside the current template all count; at the host element itself only its `viewProviders` do.
- Legacy: the `@Optional()`, `@Self()`, `@SkipSelf()`, `@Host()` parameter decorators.

**`DestroyRef`**

```ts
constructor() {
  const id = setInterval(tick, 1000);
  inject(DestroyRef).onDestroy(() => clearInterval(id)); // returns a function to unregister
}
```

- Works in components, directives, pipes and services. A service in a component's `providers` gets that component's `DestroyRef`; a root service gets the root injector's (destroyed with the app).
- On destroy, a service's `ngOnDestroy` runs first, then its `DestroyRef` callbacks.
- `takeUntilDestroyed()` is built on it.

**The injection context**

`inject()` works only while Angular is creating something:

- constructors and field initializers of components, directives, pipes and services;
- provider factories (`useFactory`, `InjectionToken` factories);
- functional guards, resolvers and interceptors;
- a callback passed to `runInInjectionContext(injector, fn)`.

Anywhere else (event handlers, `setTimeout`, promise callbacks) it throws **NG0203**. Inject at creation and keep the result, or keep the `Injector` and use `runInInjectionContext`.

```ts
export function injectDocumentTitle(): () => string {
  assertInInjectionContext(injectDocumentTitle); // clear NG0203 naming this function
  const document = inject(DOCUMENT);
  return () => document.title;
}
```

- "Inject functions" (name starting with `inject`) package reusable DI logic. The same rule applies to `effect()`, `toSignal()` and `takeUntilDestroyed()`.
- Legacy: constructor injection, `constructor(private readonly logger: Logger) {}`. Migration: `ng generate @angular/core:inject`.

### 5.6 Lifecycle & change detection

Route: `/topics/06-lifecycle-change-detection`. Everything here is **stable** (`afterNextRender` / `afterEveryRender` since v20, zoneless since v20.2). How change detection is scheduled and which components it checks is in [3. Architecture](#change-detection).

**Lifecycle hooks**, in the order the demo logs them:

| Step                    | Runs                                              | Use it for                                               |
| ----------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| `constructor`           | once, inputs **not** set yet                      | `inject()`, signals, effects, render hooks               |
| `ngOnChanges(changes)`  | before `ngOnInit`, then whenever an input changes | reacting to input changes (prefer `computed`)            |
| `ngOnInit`              | once, after the first `ngOnChanges`               | setup that needs inputs                                  |
| `ngDoCheck`             | every check                                       | rarely; custom change detection                          |
| `ngAfterContentInit`    | once, projected content ready                     | reading `contentChild` (decorator queries)               |
| `ngAfterContentChecked` | every check                                       | rarely                                                   |
| `ngAfterViewInit`       | once, own view and children ready                 | DOM work (now usually `afterNextRender`)                 |
| `ngAfterViewChecked`    | every check                                       | rarely                                                   |
| `ngOnDestroy`           | once, before removal                              | cleanup (or `DestroyRef.onDestroy`, which runs after it) |

```ts
export class LifecycleChild implements OnChanges, OnInit {
  readonly label = input.required<string>();

  ngOnChanges(changes: SimpleChanges<LifecycleChild>): void {
    // Typed in v21: changes.label is SimpleChange<string> | undefined.
    const change = changes.label;
    if (change && !change.firstChange) console.log(change.previousValue, '→', change.currentValue);
  }

  ngOnInit(): void {
    this.label(); // safe here; in the constructor a required input throws NG0950
  }
}
```

- `ngOnChanges` fires for signal inputs too, but only when the input gets a **new value**. Mutating an object passed by reference does not count.
- The `implements` clauses are optional; they only make TypeScript check the method signatures.
- The `*Checked` hooks and `ngDoCheck` run on every pass: keep them cheap.

**Render hooks**

```ts
constructor() {
  afterNextRender({ read: () => this.width.set(this.box().nativeElement.offsetWidth) }); // once
  afterEveryRender({ write: () => { list.scrollTop = list.scrollHeight; } });            // every render
}
```

- They run after Angular has updated the DOM, in the browser only (never during SSR), so they are the place for DOM measurement and third-party DOM libraries.
- Phases `earlyRead` → `write` → `mixedReadWrite` → `read` batch the DOM work of all callbacks and avoid layout thrashing.
- `afterEveryRender` runs after **every** render of the app, not just the owner's. Do not set signals in it: that schedules another render and loops. `afterRenderEffect()` is the signal-aware variant.
- v19 name: `afterRender` (developer preview). Both replace most uses of `ngAfterViewInit` / `ngAfterViewChecked`.

**OnPush in practice**

```ts
this.user().visits++;                                    // same object: OnPush child not checked
this.user.update((u) => ({ ...u, visits: u.visits + 1 })); // new reference: child checked
inject(ChangeDetectorRef).markForCheck();                 // mark this view and its ancestors dirty
```

- Treat inputs as immutable values. A mutation shows up only when something else happens to check the child (an event in it, `markForCheck()`).
- `markForCheck()` schedules; `detectChanges()` checks the component and its children synchronously, right now.

**Zoneless in practice**

```ts
setTimeout(() => this.plain++, 500);                          // view stays stale
setTimeout(() => { this.plain++; cdr.markForCheck(); }, 500); // view updates
setTimeout(() => this.count.update((n) => n + 1), 500);      // signal: view updates
```

- The stale value is not lost: the next pass (any click, any signal) shows it. That makes these bugs intermittent, so prefer signals for all template state.
- In tests, `await fixture.whenStable()` waits for the scheduled pass. Calling `fixture.detectChanges()` forces a pass and can hide a missing notification.

### 5.7 Routing

Route: `/topics/07-routing`, loaded with `loadChildren`. Everything used here is **stable**. The topic page hosts a "mini app" with a nested `<router-outlet>`, an address bar and a nav; the other cards drive it. Navigation order and preloading are in [3. Architecture](#routing-and-lazy-loading).

**Child routes and a nested outlet**

```ts
// topics.registry.ts
loadChildren: () => import('./07-routing/07-routing.routes').then((m) => m.ROUTING_ROUTES),

// 07-routing.routes.ts
export const ROUTING_ROUTES: Routes = [
  {
    path: '',
    component: RoutingPage,      // has the nested <router-outlet>
    providers: [FakeAuth],       // route-level providers, shared by children and guards
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',        // componentless: groups the list and the detail
        children: [
          { path: '', component: ProductList, title: pageTitle('Products') },
          { path: ':id', component: ProductDetail, resolve: { product: productResolver }, title: productTitleResolver },
        ],
      },
      { path: 'catalog/:id', redirectTo: ({ params }) => `products/${params['id']}` },
      { path: 'admin', component: AdminView, canActivate: [authGuard] },
      { path: 'edit', component: EditView, canDeactivate: [unsavedChangesGuard] },
      { path: '**', component: MissingView },
    ],
  },
];
```

- The outlet can sit in any component under the route's component (here `MiniApp`): an outlet finds its parent route through the injector tree.
- `routerLink="products"` in a component is relative to that component's route. `routerLinkActive` matches by prefix; `[routerLinkActiveOptions]="{ exact: true }"` turns that off.
- Route `providers` create an environment injector for the route subtree. It lives as long as the route config, not as long as the page.

**Params and query params as inputs** (`withComponentInputBinding()`)

```ts
export class ProductDetail {
  readonly id = input.required({ transform: numberAttribute }); // :id, "3" → 3
  readonly product = input.required<Product>();                 // resolve: { product }
}
export class ProductList {
  readonly sort = input<string>();                              // ?sort=price
}
```

- Inputs bind by name to route params, query params, `data` and `resolve` keys. A query param that disappears sets its input to `undefined`.
- `/products/1` → `/products/2` **reuses** the component: only the inputs change. Reading `route.snapshot` once in `ngOnInit` is the classic stale-data bug.
- Without input binding: `inject(ActivatedRoute).paramMap` (Observable) + `toSignal()`.

**Guards**

```ts
export const authGuard: CanActivateFn = (_route, state) =>
  inject(FakeAuth).loggedIn() ||
  inject(Router).createUrlTree(['/topics/07-routing/login'], { queryParams: { returnUrl: state.url } });

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  component.canLeave(); // boolean | Promise<boolean>: the navigation waits for it
```

| Guard              | Runs                                   | Typical use                                                                  |
| ------------------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| `canMatch`         | while matching; false = try next route | feature flags, role-based route variants; skips the lazy chunk on navigation |
| `canActivate`      | before entering the route              | auth                                                                         |
| `canActivateChild` | before entering any child              | auth for a whole section                                                     |
| `canDeactivate`    | before leaving the route               | unsaved changes                                                              |

- Return `true` / `false`, a `UrlTree` or a `RedirectCommand` (redirect), directly or as a Promise / Observable.
- Guards protect the UI only; the server must check permissions too. `canDeactivate` does not run on tab close or reload (use `beforeunload`).
- Guards only run on navigation: logging out while on `/admin` does not leave the page by itself.

**Resolvers and titles**

```ts
export const productResolver: ResolveFn<Product> = async (route) => {
  const router = inject(Router);                     // before any await
  await delay(400);
  const product = findProduct(Number(route.paramMap.get('id')));
  return product ?? new RedirectCommand(router.createUrlTree([...], { queryParams: { missing: id } }));
};
```

- The router waits for resolvers before activating the route, so the old page stays visible. Show progress with `router.currentNavigation()` (a signal since v20.2; `null` when idle).
- For slow data, consider navigating at once and loading in the component (`resource()` / `httpResource()`) instead.
- `title` accepts a string or a `ResolveFn<string>`. Title resolvers run in parallel with the other resolvers, so they cannot read their results. The deepest route with a title wins; a custom `TitleStrategy` can add a suffix globally.

**Redirects and wildcards**

- `{ path: '', redirectTo: 'products', pathMatch: 'full' }`: `pathMatch: 'full'` is required for empty-path redirects, or every URL matches.
- `redirectTo` can be a function (v18+) receiving the params, query params and data. Since v20 it may return a Promise or Observable.
- A `**` route inside a lazy `Routes` array catches unknown paths below that prefix only. The app-level `**` in `app.routes.ts` must stay last (a unit test checks it).

**Programmatic navigation**

```ts
router.navigate(['..', id], { relativeTo: this.route });            // commands, relative
router.navigate(['products'], { relativeTo, queryParams: { sort: 'price' } });
router.navigateByUrl('/topics/07-routing/admin');                   // absolute URL string
inject(Location).back();                                            // browser history
```

- The returned promise resolves `true` when the navigation completes and `false` when a guard returns `false`. When a guard **redirects**, it resolves with the redirected navigation's result (`true` on reaching the login page).
- Prefer `routerLink` for anything clickable (real `href`, open in a new tab). Navigate from code after an action.
- Useful options: `queryParamsHandling: 'merge' | 'preserve'`, `replaceUrl`, `state`, `fragment`.

### 5.8 Forms

Route: `/topics/08-forms`. Template-driven and reactive forms are **stable**; typed reactive forms since v14. Signal forms (`@angular/forms/signals`) are **experimental** in v21.

|                 | Template-driven                           | Reactive                                  | Signal forms (experimental)                           |
| --------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| Import          | `FormsModule`                             | `ReactiveFormsModule`                     | `FormField` + functions from `@angular/forms/signals` |
| Model lives in  | the template (`ngModel`)                  | the class (`FormGroup`, `FormControl`)    | a `WritableSignal`                                    |
| Validation      | HTML attributes (`required`, `minlength`) | `Validators` / functions                  | schema rules (`required(path.x)`)                     |
| Reading changes | `(ngModelChange)`                         | `valueChanges` Observable                 | signals (`field().value()`)                           |
| Good for        | small, static forms                       | most real forms; dynamic and complex ones | new code, when you accept an experimental API         |

All three add the same state classes to controls: `ng-valid` / `ng-invalid`, `ng-pristine` / `ng-dirty`, `ng-untouched` / `ng-touched`, `ng-pending`.

**Template-driven**

```html
<form #f="ngForm" novalidate (ngSubmit)="save(f)">
  <input name="name" [(ngModel)]="name" #nameCtrl="ngModel" required minlength="3" />
  @if (nameCtrl.invalid && nameCtrl.touched) { <p>…</p> }
  <button type="submit">Save</button>
</form>
```

- Every `ngModel` inside a form needs a `name`: it is the key in `f.value`.
- `[(ngModel)]` also binds to a `WritableSignal`.
- `touched` = the control lost focus once; `dirty` = the user changed the value. Show errors on `touched` or after submit.

**Typed reactive forms**

```ts
private readonly fb = inject(NonNullableFormBuilder);
protected readonly form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  age: [30, [Validators.min(18), Validators.max(120)]],
  address: this.fb.group({ city: [''], zip: ['', Validators.pattern(/^\d{5}$/)] }),
});
// form.controls.age.value is a number; form.setValue({ nme: … }) does not compile.
```

```html
<form [formGroup]="form">
  <input formControlName="name" />
  <fieldset formGroupName="address"><input formControlName="city" /></fieldset>
</form>
```

- `FormBuilder` makes `FormControl<T | null>` (because `reset()` sets `null`); `NonNullableFormBuilder` makes `FormControl<T>` and resets to the initial value.
- `setValue()` needs the complete shape and throws at runtime if a key is missing; `patchValue()` takes any subset.
- `form.value` leaves disabled controls out (it is typed `Partial<…>`); `getRawValue()` includes them.
- `valueChanges` / `statusChanges` fire on user input and on changes from code; pass `{ emitEvent: false }` to stay silent.
- Zoneless: form state is not a signal. Changes from user events refresh the view, but changes that happen later (async validators, `setValue` in a timer) need a signal read in the template, e.g. `toSignal(form.statusChanges)`.
- Old code: `UntypedFormGroup`, `FormGroup` with `any`, or `this.form.get('name')` strings lose the types. Prefer `form.controls.name`.

**FormArray**

```ts
skills: this.fb.array([this.fb.control('TypeScript', Validators.required)], Validators.required),
this.skills.push(this.fb.control(''));   this.skills.removeAt(i);
```

```html
<ol formArrayName="skills">
  @for (skill of skills.controls; track skill; let i = $index) {
    <li><input [formControlName]="i" /></li>
  }
</ol>
```

- Track the control object, not `$index`, or removing an item reuses the wrong input.
- Array validators see the item count. For "at least one", use `Validators.required`: `minLength(n)` skips empty values and an empty array counts as empty.
- `FormRecord` is the variant for dynamic keys.

**Custom, async and cross-field validators**

```ts
export function forbiddenValue(forbidden: string): ValidatorFn {
  return (control) => (control.value === forbidden ? { forbiddenValue: { forbidden } } : null);
}
export function usernameAvailable(): AsyncValidatorFn {
  return (control) => api.isTaken(control.value).pipe(map((taken) => (taken ? { usernameTaken: true } : null)));
}
export function fieldsMatch(a: string, b: string): ValidatorFn {
  return (group) => (group.get(a)?.value === group.get(b)?.value ? null : { fieldsMismatch: true });
}

username: ['', [Validators.required, forbiddenValue('admin')], [usernameAvailable()]],
passwords: this.fb.group({ password: [''], confirm: [''] }, { validators: fieldsMatch('password', 'confirm') }),
```

- A validator returns `null` (valid) or an errors object; a factory lets it take parameters.
- Async validators run only after the sync ones pass; each new value cancels the running check. Meanwhile the status is `PENDING` (neither valid nor invalid). Use `{ updateOn: 'blur' }` or a debounce to avoid a request per keystroke.
- A cross-field validator goes on the parent group and its error lives on the group (`passwords.hasError('fieldsMismatch')`), not on the controls.

**Signal forms (experimental)**

```ts
protected readonly model = signal({ email: '', password: '', confirm: '' });
protected readonly loginForm = form(this.model, (path) => {
  required(path.email, { message: 'Email is required.' });
  email(path.email);
  minLength(path.password, 8);
  validate(path.confirm, ({ value, valueOf }) =>
    value() === valueOf(path.password) ? null : { kind: 'mismatch', message: 'Passwords do not match.' });
});
```

```html
<input [formField]="loginForm.email" />
@for (error of loginForm.email().errors(); track error.kind) { <p>{{ error.message }}</p> }
```

- The model signal is the single source of truth: typing writes it, `model.set()` updates the inputs. No `setValue` / `valueChanges`.
- Every state is a signal: `loginForm.email().touched()`, `loginForm().valid()`, so zoneless refresh just works.
- Rules are reactive (`valueOf()` re-runs a rule when the other field changes). Others: `disabled`, `hidden`, `readonly`, `validateAsync`.
- `submit(form, action)` marks every field as touched and runs the action only when valid; errors returned by the action are shown on the fields.

### 5.9 HTTP & RxJS

Route: `/topics/09-http-rxjs`. `HttpClient`, functional interceptors and `withFetch()` are **stable**; `takeUntilDestroyed` and `toSignal` since v20. `httpResource` is **experimental** (since 19.2). The demos call the public [DummyJSON](https://dummyjson.com) API, so they need internet access; the specs use a fake backend.

**Setup** (`app.config.ts`)

```ts
provideHttpClient(
  withFetch(), // fetch API instead of XMLHttpRequest; no upload progress events
  withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor]),
);
```

**Functional interceptors** (`src/app/core/http/`)

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(inject(API_BASE_URL))) return next(req); // never leak the token
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errors = inject(HttpErrors); // inject() now, not inside catchError
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !req.context.get(SKIP_GLOBAL_ERROR)) {
        errors.report(error);
      }
      return throwError(() => error); // the caller still gets it
    }),
  );
};
```

- Requests are immutable: modify them with `req.clone(...)`.
- Order: requests go through the array top to bottom, responses come back bottom to top.
- `HttpContextToken` passes per-request options to interceptors (`SKIP_GLOBAL_ERROR` here).
- The logging interceptor uses `finalize()`, which also runs when a request is cancelled (unsubscribed).
- Legacy: class interceptors (`implements HttpInterceptor`) registered with the `HTTP_INTERCEPTORS` multi-provider; they need `withInterceptorsFromDi()`.

**Typed API service**

```ts
@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL); // InjectionToken, easy to override

  list(limit: number): Observable<Product[]> {
    return this.http
      .get<ProductPage>(`${this.baseUrl}/products`, { params: { limit } })
      .pipe(map((page) => page.products));
  }
}
```

- `get<T>()` is a type assertion, not validation: the server can return anything.
- `HttpClient` Observables are **cold** (nothing is sent until you subscribe; each subscription sends a new request) and complete after one response.

**RxJS essentials**

| Operator                                         | Use it for                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `map`, `filter`                                  | transform / drop values                                                |
| `debounceTime(ms)`                               | wait for the user to stop typing                                       |
| `distinctUntilChanged()`                         | skip a value equal to the previous one                                 |
| `switchMap`                                      | new value cancels the running inner request (search, route params)     |
| `mergeMap`                                       | inner requests run in parallel                                         |
| `concatMap`                                      | inner requests queue, in order                                         |
| `exhaustMap`                                     | ignore new values while one is running (submit button)                 |
| `catchError`                                     | turn an error into a value (or rethrow); put it inside the `switchMap` |
| `retry({ count, delay })`                        | resubscribe after an error; only for requests safe to repeat           |
| `shareReplay({ bufferSize: 1, refCount: true })` | share one execution between subscribers and replay the last value      |
| `takeUntilDestroyed()`                           | unsubscribe when the component / service is destroyed                  |
| `startWith`, `tap`, `finalize`                   | initial value, side effects, cleanup                                   |

Observable vs Promise: a Promise is eager, single-valued and not cancellable. An Observable is lazy, can emit many values and is cancelled by unsubscribing (which aborts an HTTP request). Convert with `firstValueFrom(obs$)` (`toPromise()` is deprecated).

**Search as you type**

```ts
state = toSignal(
  this.query.valueChanges.pipe(
    map((term) => term.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) =>
      this.api.search(term).pipe(
        map((page): SearchState => ({ status: 'success', ...page })),
        catchError(() => of<SearchState>({ status: 'error', message: '…' })),
        startWith<SearchState>({ status: 'loading' }),
      ),
    ),
  ),
  { initialValue: { status: 'idle' } },
);
```

- One union type for the UI state (`idle | loading | success | error`) instead of separate flags.
- `catchError` inside the `switchMap`: an error that reaches the outer stream completes it and the search stops working.

**`async` pipe vs `toSignal`**

|                      | `obs$ \| async`            | `toSignal(obs$)`                           |
| -------------------- | -------------------------- | ------------------------------------------ |
| Subscribes           | when the template renders  | at creation (needs an injection context)   |
| Before first value   | `null`                     | `undefined`, or `initialValue`             |
| Unsubscribes         | when the view is destroyed | when the injector (component) is destroyed |
| Usable in `computed` | no                         | yes                                        |
| Typical in           | v19 and older codebases    | new code                                   |

Both subscribe independently: two consumers of a cold HTTP Observable send two requests unless it goes through `shareReplay`.

**Unsubscription rules**

- No manual cleanup: `async` pipe, `toSignal`, `httpResource`, `resource`, outputs.
- Manual `subscribe()` to something that never completes (`valueChanges`, `interval`, router events, a store): add `takeUntilDestroyed()` (in an injection context) or `takeUntilDestroyed(destroyRef)` (elsewhere).
- HTTP completes after one response, so it does not leak, but unsubscribing on destroy still aborts a request the user no longer needs.
- Never nest `subscribe` calls: use a flattening operator.

**`httpResource` (experimental)**

```ts
productId = signal(1);
product = httpResource<Product>(() => `${base}/products/${this.productId()}`);
// product.value(), .status(), .isLoading(), .error(), .statusCode(), .headers(), .reload()
```

- It is `resource()` backed by `HttpClient`: interceptors and `provideHttpClientTesting` work. A new URL aborts the running request. Return `undefined` to skip the request.
- For reads (GET) only. Use `HttpClient` for writes.
- Options: `defaultValue`, `parse` (validate the response, e.g. with a schema), `equal`.
- Read `error()` or `hasValue()` before `value()`: the value of a failed resource throws.
- Testing: it marks the app as busy, so `fixture.whenStable()` waits for its request. Flush the request first (use `TestBed.tick()` to send it).

**Testing HTTP** (details in the testing topic)

```ts
providers: [provideHttpClient(withInterceptors(APP_INTERCEPTORS)), provideHttpClientTesting()];
const httpMock = TestBed.inject(HttpTestingController);
const req = httpMock.expectOne(`${API}/products/1`);
expect(req.request.headers.get('Authorization')).toBe('Bearer demo-token');
req.flush(product); // or req.flush(body, { status: 404, statusText: 'Not Found' })
httpMock.verify(); // in afterEach: no unexpected requests
```

### 5.10 Directives & pipes

Route: `/topics/10-directives-pipes`. Everything here is **stable**. A component is a directive with a template; a directive adds behavior to an element it does not own; a pipe transforms a value in the template. All three are standalone and are used by listing them in a component's `imports`.

**Attribute directive with inputs and host bindings**

```ts
@Directive({
  selector: '[appHighlight]', // camelCase attribute with the app prefix
  host: {
    '[style.backgroundColor]': 'hovered() ? color() : null',
    '[class.is-highlighted]': 'hovered()',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class Highlight {
  readonly appHighlight = input(''); // same name as the selector
  readonly defaultColor = input('#ffe58a');
  protected readonly hovered = signal(false);
  protected readonly color = computed(() => this.appHighlight() || this.defaultColor());
}
```

```html
<p appHighlight>default color</p>
<p [appHighlight]="color()" defaultColor="orange">bound</p>
```

- `host` metadata replaces `@HostBinding('style.color')` / `@HostListener('click', ['$event'])`, which are still common in v19 code.
- Global listener targets: `(document:click)`, `(window:resize)`, `(body:…)`. Key filters: `(keydown.escape)`, `(keydown.control.s)`.
- Prefer host bindings to `ElementRef.nativeElement` manipulation or `Renderer2`: they are declarative and cleaned up automatically.

**Injecting what a directive needs**

| `inject(...)`      | Gives                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| `ElementRef`       | the host element (`nativeElement`)                                               |
| `ViewContainerRef` | the position next to the host, to create components or templates there           |
| `TemplateRef`      | the `<ng-template>` a structural directive sits on                               |
| another directive  | a directive on the same element (e.g. a component injecting its host directives) |

A directive has no template: to show UI it creates a component, as the tooltip does:

```ts
const bubble = this.viewContainer.createComponent(TooltipBubble);
bubble.setInput('text', this.appTooltip());
// later: bubble.destroy()
```

**`exportAs` and directive outputs**

```ts
@Directive({ selector: '[appDropdown]', exportAs: 'appDropdown' })
export class Dropdown {
  readonly isOpen = signal(false);
  readonly closed = output<CloseReason>();
  toggle() { … }
}
```

```html
<div appDropdown #menu="appDropdown" (closed)="log($event)">
  <button (click)="menu.toggle()" [attr.aria-expanded]="menu.isOpen()">Actions</button>
</div>
```

`#ref` alone refers to the element (or component); `#ref="name"` refers to the directive exported under that name (`ngModel`, `ngForm` work the same way).

**`hostDirectives` composition**

```ts
@Component({
  selector: 'app-tag',
  hostDirectives: [
    { directive: Highlight, inputs: ['appHighlight: color'] },
    { directive: Tooltip, inputs: ['appTooltip: hint'] },
  ],
})
export class Tag {
  protected readonly highlight = inject(Highlight); // host directives are injectable
}
```

- Behavior reuse by composition instead of class inheritance.
- Inputs/outputs of a host directive are hidden unless listed (`'name: alias'` renames). Required inputs must be exposed.
- Applied statically, to every instance; the directives must be standalone; their selectors are ignored.

**Structural directive**

```ts
@Directive({ selector: '[appHasRole]' })
export class HasRole {
  readonly appHasRole = input.required<Role>();
  readonly appHasRoleElse = input<TemplateRef<unknown> | null>(null);
  private readonly template = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly session = inject(Session);
  // computed() only notifies when the result flips: no needless re-render
  private readonly allowed = computed(() => this.session.hasRole(this.appHasRole()));

  constructor() {
    effect(() => {
      const template = this.allowed() ? this.template : this.appHasRoleElse();
      this.viewContainer.clear();
      if (template) this.viewContainer.createEmbeddedView(template);
    });
  }
}
```

```html
<p *appHasRole="'editor'; else readOnly">…</p>
<!-- desugars to -->
<ng-template [appHasRole]="'editor'" [appHasRoleElse]="readOnly"><p>…</p></ng-template>
```

- Microsyntax keys map to inputs named `selector + Key` (`else` → `appHasRoleElse`).
- Template variables come from the view context: `createEmbeddedView(tpl, { $implicit: value, index })` is read with `let x; let i = index`. Type it with a static `ngTemplateContextGuard(dir, ctx): ctx is MyContext`.
- `@if` / `@for` / `@switch` replaced most structural directives; custom ones remain useful for permissions or feature flags. Hiding UI is not security: the server must check too.

**Custom pipes**

```ts
@Pipe({ name: 'truncate' }) // pure by default
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, ellipsis = '…'): string {
    return value.length > limit ? value.slice(0, limit).trimEnd() + ellipsis : value;
  }
}
```

```html
{{ text | truncate }} {{ text | truncate: 30 }} {{ text | truncate: 30 : ' [more]' | uppercase }}
```

|                  | Pure (default)                                 | Impure (`pure: false`)                     |
| ---------------- | ---------------------------------------------- | ------------------------------------------ |
| `transform` runs | when an argument changes (`===`)               | on every change detection of the component |
| Sees mutations   | no (`push` keeps the same reference)           | yes                                        |
| Cost             | memoized, cheap                                | must be cheap                              |
| Instances        | one per usage in the template                  | one per usage in the template              |
| Examples         | `date`, `currency`, `uppercase`, custom format | `async`, `json`, `keyvalue`                |

- **Pure pipes as memoization**: `{{ items | filter: term }}` recomputes only when `items` or `term` change, while `{{ filter(items, term) }}` (a method call) runs on every check.
- Update data immutably (new array/object) so pure pipes and `OnPush` see the change.
- For derived data inside one component, a `computed()` is usually clearer than a pipe; pipes shine for formatting reused across templates.
- Pipes are plain classes: unit-test them with `new TruncatePipe().transform(...)`, no `TestBed` needed (unless they `inject()`).

### 5.11 State management

The page builds one cart twice: a plain service with signals, then NgRx SignalStore (`@ngrx/signals`). Both reuse the same presentational components (`ProductList`, `CartView`), which only have inputs and outputs.

**Where state can live**

| State                                | Where                                                |
| ------------------------------------ | ---------------------------------------------------- |
| One component (open panel, input)    | signals in the component, or `signalState`           |
| A feature (a page and its children)  | a store in that component's `providers`              |
| The whole app (user, cart, settings) | a store with `providedIn: 'root'`                    |
| The server's data (lists, entities)  | a store or `resource` / `httpResource` that loads it |
| Shareable UI state (filters, page)   | the URL (query params, topic 07)                     |

**A store service with signals**

```ts
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly linesState = signal<readonly CartLine[]>([]); // only the store writes
  readonly lines = this.linesState.asReadonly(); // components read
  readonly count = computed(() => countItems(this.lines()));
  readonly total = computed(() => totalPrice(this.lines()));

  add(product: Product): void {
    // the "actions"
    this.linesState.update((lines) => addLine(lines, product)); // new array, never mutate
  }
  clear(): void {
    this.linesState.set([]);
  }
}
```

- This is the default choice for most apps: no dependency, typed, trivially testable (`TestBed.inject(CartStore)`).
- It replaces the v14–v16 pattern of a service with a private `BehaviorSubject` and a public `asObservable()`; you will still meet that one in older code.
- Keep writes inside the store (private writable signal, public methods). If every component can `set()` the state, nobody owns it.

**NgRx SignalStore**

```ts
export const CartSignalStore = signalStore(
  // { providedIn: 'root' } as first argument for a global store
  withState<CartState>({ lines: [] }), // store.lines() is a signal
  withComputed(({ lines }) => ({
    count: computed(() => countItems(lines())),
  })),
  withMethods((store) => ({
    add(product: Product): void {
      patchState(store, (state) => ({ lines: addLine(state.lines, product) }));
    },
    clear(): void {
      patchState(store, { lines: [] });
    },
  })),
);

@Component({ providers: [CartSignalStore] /* one instance per component */ })
export class SignalStoreDemo {
  protected readonly cart = inject(CartSignalStore);
}
```

- Features apply in order; each sees what the previous ones added. `withProps`, `withHooks`, `withLinkedState` and custom features (`signalStoreFeature`) complete the set.
- State is protected: `patchState` only works inside the store unless `protectedState: false`.
- `patchState` merges **one level deep** and always creates a new state object. Nested objects are spread by hand.
- `watchState(store, fn)` runs synchronously on every change (logging, persistence); `effect` would batch them.
- `@ngrx/signals/entities` (`withEntities`, `addEntity`, `updateEntity`…) handles normalized collections.
- `signalState({...})` is the state part alone, for local component state. Nested objects become deep signals: `state.filters.maxPrice()`.

**Async: `rxMethod`**

```ts
withMethods((store, api = inject(CatalogApi)) => ({
  search: rxMethod<string>(
    pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => patchState(store, { status: 'loading' })),
      switchMap((query) =>
        api.search(query).pipe(
          tap((products) => patchState(store, { products, status: 'loaded' })),
          catchError(() => {
            patchState(store, { status: 'error' });
            return EMPTY; // handled inside switchMap: the method keeps working
          }),
        ),
      ),
    ),
  ),
})),
withHooks({
  onInit(store) {
    store.search(store.query); // a signal: re-runs on every change
  },
}),
```

- `rxMethod` accepts a value, a signal or an Observable, and unsubscribes when its injector is destroyed.
- `tapResponse({ next, error })` from `@ngrx/operators` is the idiomatic replacement for the `tap` + `catchError` pair.
- `signalMethod` is the same idea without RxJS.

**Classic NgRx (`@ngrx/store`)**

Many v19 codebases use the Redux-style store. The pieces:

| Piece    | Role                                                    | Example                                                             |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Action   | an event that happened, `[Source] Event`                | `createAction('[Cart] Add', props<{ product: Product }>())`         |
| Reducer  | pure function `(state, action) => newState`             | `on(CartActions.add, (s, { product }) => ({ ...s, lines: [...] }))` |
| Selector | memoized read of a slice of state                       | `createSelector(selectCart, (cart) => cart.lines.length)`           |
| Effect   | side effects: listens to actions, dispatches others     | `ofType(load)` → `switchMap(api)` → `loadSuccess` / `loadFailure`   |
| Store    | holds the state; `dispatch(action)`, `select(selector)` | `store.selectSignal(selectCount)` returns a signal (v16+)           |

```ts
// Grouping actions: one object per source
export const CartActions = createActionGroup({
  source: 'Cart',
  events: { Add: props<{ product: Product }>(), Clear: emptyProps() },
});

// Feature: reducer + generated selectors
export const cartFeature = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialState,
    on(CartActions.add, (state, { product }) => ({ ...state, lines: addLine(state.lines, product) })),
    on(CartActions.clear, () => initialState),
  ),
}); // cartFeature.selectLines, ...

// Component
private readonly store = inject(Store);
protected readonly lines = this.store.selectSignal(cartFeature.selectLines);
add(product: Product) { this.store.dispatch(CartActions.add({ product })); }

// app.config.ts
provideStore(), provideState(cartFeature), provideEffects(CartEffects), provideStoreDevtools()
```

- Strengths: one global, serializable state; every change is an action you can trace and replay in Redux DevTools; strict separation of reads, writes and side effects. Costs: more files and indirection per feature.
- `@ngrx/component-store` was the lighter local-state option before SignalStore, which now replaces it.
- NGXS and Akita are other Redux-like libraries you may meet; the concepts transfer.

**Which one?**

- Start with signals in components, then a **service with signals** when state is shared. It covers most apps.
- **SignalStore** when stores grow (many fields, entities, async flows, shared features) and the team wants one structured pattern.
- **Classic NgRx** when the codebase already uses it, or a large team needs strict action-based traceability. Do not mix patterns for the same state.
- Vue analogy: service with signals ≈ a composable holding module-level `ref`s; SignalStore ≈ Pinia; classic NgRx ≈ Vuex with strict mutations.

### 5.12 Testing

The page shows small subjects (a star rating, a temperature store, a quotes API, a greeting, two routes) next to excerpts of their specs. The full specs are in `src/app/topics/12-testing/subjects/`.

**The setup in v21**

- `ng test` uses the `@angular/build:unit-test` builder: it compiles the specs with esbuild (like the app) and runs them with **Vitest** in **jsdom**. There is no `karma.conf.js`, no `test.ts` and no `zone.js/testing`.
- `tsconfig.spec.json` adds `"types": ["vitest/globals"]`, so `describe`, `it`, `expect`, `beforeEach` and `vi` need no import.
- Useful flags: `--watch=false` (one run), `--include <folder or file>`, `--coverage` (needs `@vitest/coverage-v8`; this project has `npm run test:coverage`, with the HTML report in `coverage/`). For anything the builder options do not cover, `"runnerConfig": true` loads a `vitest.config.ts`. `"browsers": ["chromium"]` runs the tests in a real browser instead of jsdom (needs a Vitest browser provider such as `@vitest/browser-playwright`).
- `TestBed` is reset before each test, so providers and components do not leak between tests.

**Components**

```ts
const fixture = TestBed.createComponent(StarRating);
await fixture.whenStable(); // first render

fixture.componentRef.setInput('max', 3); // like a template binding
await fixture.whenStable();
expect(fixture.nativeElement.querySelectorAll('.star').length).toBe(3);

fixture.componentInstance.rated.subscribe(spy); // an output is an OutputRef
button.click();
await fixture.whenStable();
```

- Zoneless: the fixture schedules change detection like the app does, asynchronously. After changing inputs or clicking, `await fixture.whenStable()` before reading the DOM.
- `setInput` is the only way to set a signal `input()`: there is no writable field to assign.
- To test `[(value)]` on a `model()` exactly as a parent uses it, render a small **host component** in the spec.
- Test through the DOM (text, attributes, `disabled`), not private members.

**Services, signals and effects**

```ts
const store = TestBed.inject(TemperatureStore);
store.setCelsius(30);
expect(store.fahrenheit()).toBe(86); // computed reads are synchronous

TestBed.runInInjectionContext(() => effect(() => seen.push(store.celsius())));
TestBed.tick(); // runs change detection and pending effects
```

`TestBed.tick()` replaced `TestBed.flushEffects()` (deprecated in v20).

**HTTP**

```ts
providers: [provideHttpClient(), provideHttpClientTesting()];

const result = firstValueFrom(api.random()); // subscribe first: HttpClient is lazy
const req = httpMock.expectOne(`${API}/quotes/random`);
req.flush(data); // or flush(body, { status: 503, statusText }) / req.error(new ProgressEvent('error'))
expect(await result).toEqual(data);

afterEach(() => httpMock.verify()); // no unexpected requests
```

Add `withInterceptors([...])` to `provideHttpClient` to test the real interceptor chain against the fake backend (topic 09's page spec does this).

**Mocking through DI**

| Technique                                           | When                                                   |
| --------------------------------------------------- | ------------------------------------------------------ |
| `{ provide: Clock, useValue: { now: () => date } }` | Replace a service with a plain object                  |
| `{ provide: CatalogApi, useClass: FakeCatalogApi }` | A fake class with the same methods                     |
| `{ provide: API_BASE_URL, useValue: '...' }`        | Configuration tokens                                   |
| `vi.spyOn(TestBed.inject(Clock), 'now')`            | Keep the real service, stub one method, check calls    |
| `TestBed.overrideComponent(C, { set: {...} })`      | Change a component's own `providers` / `imports`       |
| `vi.useFakeTimers()`                                | Control `Date`, `setTimeout`, debounce without waiting |

Configure providers before the first `createComponent` or `inject`: after that the test module is frozen.

**Router**

```ts
TestBed.configureTestingModule({
  providers: [provideRouter(userRoutes, withComponentInputBinding())],
});
const harness = await RouterTestingHarness.create();
const detail = await harness.navigateByUrl('/2', UserDetail); // also asserts the component
expect(detail.id()).toBe('2');
```

Guards and resolvers are functions: test them through navigation, or call them in `TestBed.runInInjectionContext`.

**Karma and Jasmine (older projects)**

Projects created before v20 usually run **Karma + Jasmine** in a real browser (`karma.conf.js`, `zone.js/testing`, `@angular-devkit/build-angular:karma`). The Angular APIs (`TestBed`, fixtures, `HttpTestingController`, `RouterTestingHarness`) are the same; what changes is the runner and the assertion library.

| Jasmine                                 | Vitest                                            |
| --------------------------------------- | ------------------------------------------------- |
| `jasmine.createSpy()`                   | `vi.fn()`                                         |
| `spyOn(obj, 'm').and.returnValue(x)`    | `vi.spyOn(obj, 'm').mockReturnValue(x)`           |
| `expect(spy).toHaveBeenCalledWith(...)` | same                                              |
| `fit` / `fdescribe`                     | `it.only` / `describe.only`                       |
| `fakeAsync` + `tick()` (needs zone.js)  | `vi.useFakeTimers()` + `vi.advanceTimersByTime()` |

Migration path: Karma is deprecated. Switch the `test` target to `@angular/build:unit-test` (there is a schematic, `ng g @schematics/angular:refactor-jasmine-vitest`, that rewrites most Jasmine calls), install `vitest` and `jsdom`, drop `karma.conf.js` and the Karma packages, then fix what the schematic could not convert. The builder can also run Karma (`"runner": "karma"`) while you migrate.

**End-to-end tests (concepts only)**

Unit tests with TestBed check one piece in a simulated DOM. E2E tests start the real app in a real browser and drive it like a user. **Playwright** (fast, several browsers, good auto-waiting) is the usual choice today; **Cypress** is common in existing projects. Protractor, the old Angular E2E tool, is gone. `ng e2e` runs whatever E2E builder you add (`ng add playwright-ng-schematics`, `ng add @cypress/schematic`). Keep E2E tests few and focused on critical flows (login, checkout); cover the details with unit tests.

---

## 6. Angular 19 → 20 → 21

_TODO (Legacy & migration topic)._

---

## 7. Production build

_TODO (Production build topic)._

---

## 8. References

- [angular.dev](https://angular.dev): official docs and tutorials.
- [Angular CLI reference](https://angular.dev/cli).
- [Build system (`@angular/build`)](https://angular.dev/tools/cli/build-system-migration): the application builder and the migration from webpack.
- [Style guide](https://angular.dev/style-guide).
- [angular-eslint](https://github.com/angular-eslint/angular-eslint).

---

## Appendix: Coming from Vue

_TODO (Legacy & migration topic)._
