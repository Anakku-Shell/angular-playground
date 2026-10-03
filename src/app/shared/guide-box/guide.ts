/**
 * Guided tours are plain data (one `guides.ts` per topic) rendered by `<app-guide-box>`, at the
 * top of each demo card's explanation. They lead the reader through the card in a fixed order:
 * why the feature exists, what to try in the live demo, the idea in a few lines of code, and
 * which files to read.
 *
 * The same object also feeds the topic's tab bar (`label`) and its map (`question`, `use`).
 *
 * In every string except `label` and `snippet`, text between backticks renders as inline code.
 */
export interface GuideStep {
  /** Something to do in the live demo. */
  readonly action: string;
  /** What happens, and why. */
  readonly result: string;
}

export interface GuideFile {
  /** Path relative to the topic folder. */
  readonly file: string;
  /** What to look for in it. `[1]`, `[2]`... point to numbered comments in the file. */
  readonly lookFor: string;
}

export interface Guide {
  /** Short name of the card, for its tab (`input()`, `Guards`). Plain text. */
  readonly label: string;
  /** The map's "You want to…" column: the need this card answers. */
  readonly question: string;
  /** The map's "Use" column: the tool that answers it. */
  readonly use: string;
  /** The problem the feature solves, in one or two sentences. */
  readonly why: string;
  readonly steps: readonly GuideStep[];
  /** The smallest code that shows the idea. Plain code, rendered as-is. */
  readonly snippet: string;
  /** Files in reading order. */
  readonly read: readonly GuideFile[];
}
