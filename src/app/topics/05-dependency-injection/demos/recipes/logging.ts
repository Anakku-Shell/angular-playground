import { Injectable, InjectionToken, Signal, signal } from '@angular/core';

/**
 * An abstract class works as a DI token and as a type, and (unlike an interface) exists at
 * run time. Consumers inject `Logger`; the provider decides which class they get.
 */
export abstract class Logger {
  abstract readonly entries: Signal<readonly string[]>;
  abstract log(message: string): void;
}

@Injectable()
export class MemoryLogger implements Logger {
  private readonly lines = signal<readonly string[]>([]);
  readonly entries = this.lines.asReadonly();

  log(message: string): void {
    this.lines.update((lines) => [...lines, message]);
  }
}

/** Two more names for a logger, to compare `useExisting` (alias) with `useClass` (new instance). */
export const AUDIT_LOG = new InjectionToken<Logger>('AUDIT_LOG');
export const DEBUG_LOG = new InjectionToken<Logger>('DEBUG_LOG');

export interface GreeterConfig {
  readonly greeting: string;
  readonly punctuation: string;
}

/** Plain configuration data: an interface has no run-time value, so it needs a token. */
export const GREETER_CONFIG = new InjectionToken<GreeterConfig>('GREETER_CONFIG');

/** A plain class, not decorated: a `useFactory` provider builds it with `new`. */
export class Greeter {
  constructor(
    private readonly config: GreeterConfig,
    private readonly logger: Logger,
  ) {}

  greet(name: string): string {
    this.logger.log(`Greeter: greeted ${name}`);
    return `${this.config.greeting}, ${name}${this.config.punctuation}`;
  }
}
