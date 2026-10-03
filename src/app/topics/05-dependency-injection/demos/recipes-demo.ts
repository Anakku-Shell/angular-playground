import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {
  AUDIT_LOG,
  DEBUG_LOG,
  Greeter,
  GREETER_CONFIG,
  Logger,
  MemoryLogger,
} from './recipes/logging';

/*
 * A provider says how to build the value for a token:
 *   SomeClass                          shorthand for { provide: SomeClass, useClass: SomeClass }
 *   { provide, useClass: Other }       new Other() (with its own injected dependencies)
 *   { provide, useValue: value }       this exact value
 *   { provide, useExisting: Token }    whatever Token resolves to (an alias, same instance)
 *   { provide, useFactory: () => ... } the factory's return value (inject() works inside)
 */
@Component({
  selector: 'app-recipes-demo',
  providers: [
    // [1] useValue: a ready-made value (config objects, constants, test doubles).
    { provide: GREETER_CONFIG, useValue: { greeting: 'Hello', punctuation: '!' } },
    // [2] useClass: the token (an abstract class) is backed by a concrete class.
    { provide: Logger, useClass: MemoryLogger },
    // [3] useExisting: an alias. AUDIT_LOG returns the same instance as Logger.
    { provide: AUDIT_LOG, useExisting: Logger },
    // [4] useClass again under another token: a second, separate MemoryLogger.
    { provide: DEBUG_LOG, useClass: MemoryLogger },
    // [5] useFactory: any code that returns the value. It runs in an injection context.
    { provide: Greeter, useFactory: () => new Greeter(inject(GREETER_CONFIG), inject(Logger)) },
  ],
  templateUrl: './recipes-demo.html',
  styleUrls: ['./di-demo.scss', './recipes-demo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesDemo {
  protected readonly logger = inject(Logger);
  private readonly auditLog = inject(AUDIT_LOG);
  protected readonly debugLog = inject(DEBUG_LOG);
  private readonly greeter = inject(Greeter);

  protected readonly auditIsLogger = this.auditLog === this.logger;
  protected readonly debugIsLogger = this.debugLog === this.logger;

  protected readonly greeting = signal('');
  private readonly names = ['Ada', 'Grace', 'Linus', 'Margaret'];
  private greeted = 0;

  protected greet(): void {
    const name = this.names[this.greeted++ % this.names.length];
    this.greeting.set(this.greeter.greet(name));
  }

  protected writeAudit(): void {
    this.auditLog.log('AUDIT_LOG: settings changed');
  }

  protected writeDebug(): void {
    this.debugLog.log('DEBUG_LOG: cache miss');
  }
}
