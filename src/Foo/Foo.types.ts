import type { IBar } from '../Bar/Bar.types';

interface TFoo {
  /**
   * 说明
   * - 1234123
   * @default title
   * @version 0.0.01
   */
  title?: string | number;
  title22323222sd2ssds232: string;
  c333: Exclude<IBar<boolean>['abc']['aaa'], undefined>;
  b322: Omit<IBar<number>, 'b322' | 'c333'>;
  s333?: IBar<string>;
}

export { IBar, TFoo };
