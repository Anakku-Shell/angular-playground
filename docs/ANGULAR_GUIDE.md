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
- Later topics add `provideHttpClient()`, etc.

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

_TODO (Dependency injection topic):_ environment injectors vs element injectors, `providers` on routes and components, resolution order.

### Change detection

- v21 apps are **zoneless** by default: there is no `zone.js` patching browser APIs to guess when something changed. The view is refreshed when Angular is told: a signal read by the template changes, a template event handler runs, an `async` pipe emits, or `markForCheck()` is called.
- Every component here uses `ChangeDetectionStrategy.OnPush`, which fits this model: the component is only checked when one of those notifications concerns it.
- _TODO (Lifecycle & change detection topic):_ zone.js vs zoneless in detail, and what breaks when migrating.

### Routing and lazy loading

- `loadComponent` for a single page, `loadChildren` for a set of child routes. Both produce a lazy chunk.
- _TODO (Routing topic):_ guards, resolvers, `withComponentInputBinding` in practice, preloading.

### Folder structure

A common layout for Angular apps, and the one used here:

- `core/`: app-wide singletons (services, interceptors, guards). Nothing visual.
- `shared/`: reusable, presentational UI and pipes/directives used across features.
- `features/` (here `topics/` and `pages/`): one folder per feature or page, lazy-loaded.

Each component keeps its files together (`name.ts`, `.html`, `.scss`, `.spec.ts`). Since v20 the style guide drops the `.component` / `.service` suffixes.

### Smart vs presentational components

_TODO (Component communication topic)._

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
