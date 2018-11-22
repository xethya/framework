import assert from '../assert';

export default class Range {
  lowerBound: number;
  upperBound: number;

  constructor(lowerBound: number, upperBound: number) {
    assert(lowerBound !== upperBound, 'Range#constructor: lowerBound and upperBound cannot be equal');

    this.lowerBound = Math.min(lowerBound, upperBound);
    this.upperBound = Math.max(lowerBound, upperBound);
  }

  /**
   * Checks if a value is in the defined range.
   *
   * @public
   * @function
   * @param  {Number} value - Value to compare.
   * @return {Boolean} true if in range, false otherwise.
   */
  includes(value: number): boolean {
    return this.lowerBound <= value && value <= this.upperBound;
  }

  /**
   * Converts the Range object to a string representation.
   *
   * @public
   * @function
   * @return {String}
   */
  toString(): string {
    return `${this.lowerBound.toString()} ~ ${this.upperBound.toString()}`;
  }

  /**
   * Creates a Range from an array of two numbers.
   *
   * @public
   * @static
   * @function
   * @param  {Array.<Number>} values - Boundaries of the range.
   * @return {Range}
   */
  static fromArray(values: number[]): Range {
    const errorMessage = 'Range#fromArray: values must be an Array of 2 numerical elements';

    assert(values.length === 2, errorMessage);

    return new Range(values[0], values[1]);
  }

  /**
   * Creates a Range from a string-based notation.
   *
   * @public
   * @static
   * @function
   * @param  {String} notedRange - A string representation of a Range,
   *                  using delimiters. Accepted formats: x,y x;y x:y x~y.
   * @return {Range}
   */
  static fromNotation(notedRange: string): Range | undefined {
    const errorMessage = 'Range#fromNotation: notedRange must use one of these formats: x,y x;y x:y x~y';

    assert(notedRange !== undefined, errorMessage);
    assert(typeof notedRange === 'string', errorMessage);

    let range: Range | undefined;
    const allowedDelimiters: string[] = [',', ';', ':', '~'];

    assert(allowedDelimiters.some((delimiter) => notedRange.indexOf(delimiter) > -1), errorMessage);

    let delimiterFound = false;

    while (!delimiterFound) {
      const delimiter: string = allowedDelimiters.shift() as string;

      delimiterFound = notedRange.indexOf(delimiter) > -1;

      if (delimiterFound) {
        const data = notedRange.split(delimiter).map((d) => d.trim());

        assert(data.length === 2, errorMessage);

        range = Range.fromArray(data.map((d) => Number(d)));
      }
    }

    return range;
  }
}
