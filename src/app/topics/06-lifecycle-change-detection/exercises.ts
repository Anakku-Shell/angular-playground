import { Exercise } from '../../shared/exercise-box/exercise';

/**
 * "Try it yourself" tasks, one set per demo card. They edit the demo code, so `ng serve` shows
 * the result on save. The specs check the original demos: undo your edits before `npm test`.
 */
export const EXERCISES = {
  lifecycle: {
    files: ['demos/lifecycle/lifecycle-child.ts'],
    tasks: [
      {
        task: 'Add `ngAfterViewChecked` (and `AfterViewChecked` to `implements`) logging one line. Predict when it runs, then click "Change input".',
        expect:
          'It logs after the first render and once more after each input change: an OnPush child is only checked when something marks it.',
        solution: `ngAfterViewChecked(): void {
  this.log.add('ngAfterViewChecked');
}`,
      },
      {
        task: 'React to the input without ngOnChanges: in the constructor, add an `effect()` that logs the current `label()`.',
        expect:
          'The effect logs the first label after the creation hooks, and again on every "Change input". This is the signal way to react to inputs.',
        solution: `constructor() {
  // ...
  effect(() => this.log.add(\`effect: label = \${this.label()}\`));
}`,
      },
      {
        task: 'Predict first, then try: log `this.label()` from the constructor.',
        expect:
          'The build fails with NG8118 "`label` is a required `input` and does not have a value in this context": inputs arrive after construction.',
        solution: `ngOnInit(): void {
  this.log.add(\`ngOnInit: label() = "\${this.label()}"\`);   // inputs are set here
}`,
      },
    ],
  },

  renderHooks: {
    files: ['demos/render-hooks-demo.ts'],
    tasks: [
      {
        task: 'In the `afterNextRender` read phase, also measure the list height and show it in a new row.',
        expect: 'A height in px appears once, after the first render.',
        solution: `protected readonly firstHeight = signal<number | null>(null);

afterNextRender({
  read: () => {
    const rect = this.messageList().nativeElement.getBoundingClientRect();
    this.firstWidth.set(Math.round(rect.width));
    this.firstHeight.set(Math.round(rect.height));
  },
});`,
      },
      {
        task: 'Predict first, then try: inside the `afterEveryRender` write phase, also call `this.clicks.update((n) => n + 1)`.',
        expect:
          'Console: NG0103 "Infinite change detection while refreshing application views". Each render changes a signal, which schedules another render; Angular gives up after a few rounds.',
        solution: `// In afterEveryRender, write to the DOM or to plain fields, never to signals
// the template reads.`,
      },
    ],
  },

  onPush: {
    files: ['demos/on-push-demo.ts', 'demos/on-push/user-card.ts'],
    tasks: [
      {
        task: 'Predict first: click "Mutate" twice, then "Event in the child". What does the child show?',
        expect:
          'It jumps to the mutated count: the event marked the child dirty, and when it was checked it read the (mutated) object. The data was there all along; nothing had told Angular.',
        solution: `No code. "Replace" is the right fix: a new object is a new input value.`,
      },
      {
        task: 'Remove `changeDetection: ChangeDetectionStrategy.OnPush` from UserCard and click "Mutate".',
        expect:
          'Now the child updates too: an Eager child is checked whenever its parent is. Run `npm run lint`: the project rule asks for OnPush, because mutation-driven UIs are hard to follow.',
        solution: `changeDetection: ChangeDetectionStrategy.OnPush,   // put it back`,
      },
    ],
  },

  zoneless: {
    files: ['demos/zoneless-demo.ts'],
    tasks: [
      {
        task: 'Predict first: click "setTimeout → plain field" twice, wait, then click "setTimeout → signal". What happens to the plain field?',
        expect:
          'When the signal updates, the plain field jumps to 2 as well: the signal scheduled a refresh, and the refresh reads every binding of the view.',
        solution: `No code. Plain fields are not wrong, they just do not notify anyone.`,
      },
      {
        task: 'In `plainLaterMarked`, replace `markForCheck()` with `this.cdr.detectChanges()`.',
        expect:
          'It updates too, but synchronously and only this component. `markForCheck()` is the usual choice: it lets Angular batch the work.',
        solution: `this.later(() => {
  this.plain++;
  this.cdr.detectChanges();
});`,
      },
      {
        task: 'Turn `plain` into a signal and remove the `markForCheck()` call.',
        expect:
          'Every button now updates the view by itself: with signals there is nothing to remember.',
        solution: `protected readonly plain = signal(0);
// this.later(() => this.plain.update((n) => n + 1));
<!-- template --> {{ plain() }}`,
      },
    ],
  },
} as const satisfies Record<string, Exercise>;
