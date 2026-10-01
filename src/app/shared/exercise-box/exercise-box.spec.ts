import { TestBed } from '@angular/core/testing';

import { Exercise } from './exercise';
import { ExerciseBox } from './exercise-box';

const EXERCISE: Exercise = {
  files: ['demos/a.html', 'demos/a.ts'],
  tasks: [
    { task: 'Bind `[title]` to the name', expect: 'A tooltip', solution: '<p [title]="name()">' },
    { task: 'Second task', expect: 'Something else', solution: 'x' },
  ],
};

describe('ExerciseBox', () => {
  it('lists the files and one item per task, with inline code and a folded solution', async () => {
    const fixture = TestBed.createComponent(ExerciseBox);
    fixture.componentRef.setInput('exercise', EXERCISE);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.exercise__files')?.querySelectorAll('code').length).toBe(2);
    const items = el.querySelectorAll('.exercise__tasks > li');
    expect(items.length).toBe(2);
    expect(items[0].querySelector('p code')?.textContent).toBe('[title]');
    expect(items[0].querySelector('details')?.open).toBe(false);
    expect(items[0].querySelector('details pre')?.textContent).toBe('<p [title]="name()">');
  });
});
