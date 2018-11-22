import { GroupMatchingFunction, IGrouping, TransformFunction } from './types';

export function group<T>(
  array: T[],
  matchBy: GroupMatchingFunction<T>,
): IGrouping<T> {
  const result: IGrouping<T> = {};

  array.forEach((item) => {
    const grouping = matchBy(item);
    if (!(grouping in result)) {
      result[grouping] = [item];
    } else {
      result[grouping].push(item);
    }
  });

  return result;
}

export function groupAndMap<T, R>(
  array: T[],
  matchBy: GroupMatchingFunction<T>,
  transform: TransformFunction<T, R>,
): IGrouping<R> {
  const result: IGrouping<R> = {};

  array.forEach((item) => {
    const grouping = matchBy(item);
    if (!(grouping in result)) {
      result[grouping] = [transform(item)];
    } else {
      result[grouping].push(transform(item));
    }
  });

  return result;
}
