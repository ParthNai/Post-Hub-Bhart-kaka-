import { difference, intersection } from 'lodash';

export const breakdownArrays = (prev: any[], curr: any[]) => ({
  deleted: difference(prev, curr), // Items in `prev` but not in `curr`
  new: difference(curr, prev), // Items in `curr` but not in `prev`
  existing: intersection(prev, curr), // Items in both `prev` and `curr`
});

export function rangeBetweenNumbers(start: number, end: number) {
  return new Array(end - start + 1).fill('_').map((_, idx) => start + idx);
}
