import { byKey } from './mappers';
import { IShuffledElement } from './types';

export default function shuffle<T>(list: T[]): T[] {
  return list.map((element) => {
    return {
      element,
      shuffleIndex: Math.random(),
    } as IShuffledElement<T>;
  }).sort((leftElement: IShuffledElement<T>, rightElement: IShuffledElement<T>) => {
    let orderDirection = 0;

    if (leftElement.shuffleIndex < rightElement.shuffleIndex) {
      orderDirection = 1;
    }

    if (leftElement.shuffleIndex > rightElement.shuffleIndex) {
      orderDirection = -1;
    }

    return orderDirection;
  }).map(byKey('element'));
}
