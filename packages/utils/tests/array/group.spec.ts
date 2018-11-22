import { group, groupAndMap } from '../../src/array';
import { GroupMatchingFunction, IGrouping, TransformFunction } from '../../src/array/types';

interface IGroupMock {
  id: string;
  group: string;
}

interface ITransformedType {
  id: string;
}

const elements: IGroupMock[] = [
  { id: 'alpha', group: 'red' },
  { id: 'gamma', group: 'blue' },
  { id: 'delta', group: 'green' },
  { id: 'beta', group: 'red' },
];

const expectedGrouping: IGrouping<IGroupMock> = {
  blue: [
    { id: 'gamma', group: 'blue' },
  ],
  green: [
    { id: 'delta', group: 'green' },
  ],
  red: [
    { id: 'alpha', group: 'red' },
    { id: 'beta', group: 'red' },
  ],
};

const expectedTransformedGrouping: IGrouping<ITransformedType> = {
  blue: [
    { id: 'gamma' },
  ],
  green: [
    { id: 'delta' },
  ],
  red: [
    { id: 'alpha' },
    { id: 'beta' },
  ],
};

const groupCriteria: GroupMatchingFunction<IGroupMock> = (element: IGroupMock) => element.group;

const transformer: TransformFunction<IGroupMock, ITransformedType> = (element: IGroupMock) => ({ id: element.id });

describe('Utils.GroupBy', () => {
  it('should build a grouping using a key', () => {
    expect(group<IGroupMock>(elements, groupCriteria)).toEqual(expectedGrouping);
  });
  it('should build a grouping using a key and returning a transformed type', () => {
    expect(groupAndMap<IGroupMock, ITransformedType>(
      elements, groupCriteria, transformer,
    )).toEqual(expectedTransformedGrouping);
  });
});
