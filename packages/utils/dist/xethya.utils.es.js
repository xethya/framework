import * as EventEmitter from 'eventemitter3';

function group(array, matchBy) {
    const result = {};
    array.forEach((item) => {
        const grouping = matchBy(item);
        if (!(grouping in result)) {
            result[grouping] = [item];
        }
        else {
            result[grouping].push(item);
        }
    });
    return result;
}
function groupAndMap(array, matchBy, transform) {
    const result = {};
    array.forEach((item) => {
        const grouping = matchBy(item);
        if (!(grouping in result)) {
            result[grouping] = [transform(item)];
        }
        else {
            result[grouping].push(transform(item));
        }
    });
    return result;
}

function byKey(key) {
    return (element) => element[key];
}



var index = /*#__PURE__*/Object.freeze({
  byKey: byKey
});

function bySum(leftNumber, rightNumber) {
    return leftNumber + rightNumber;
}



var index$1 = /*#__PURE__*/Object.freeze({
  bySum: bySum
});

function shuffle(list) {
    return list.map((element) => {
        return {
            element,
            shuffleIndex: Math.random(),
        };
    }).sort((leftElement, rightElement) => {
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



var index$2 = /*#__PURE__*/Object.freeze({
  mappers: index,
  reducers: index$1,
  shuffle: shuffle,
  group: group,
  groupAndMap: groupAndMap
});

class AssertionError extends Error {
    constructor(message) {
        super();
        this.message = ['[AssertionError] An assertion has failed', message].filter(Boolean).join(': ');
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new AssertionError(message);
    }
}

class Collection {
    constructor(indexName) {
        this.list = {};
        this.events = new EventEmitter();
        this.indexName = indexName;
    }
    get count() {
        return this.getAllKeys().length;
    }
    get(id) {
        return this.list[id];
    }
    getAll() {
        return this.getAllKeys().map((id) => this.list[id]);
    }
    getAllKeys() {
        return Object.keys(this.list);
    }
    where(condition) {
        return this.getAll().filter(condition);
    }
    contains(id) {
        return id in this.list;
    }
    add(...items) {
        this.events.emit('before:add', this, ...items);
        items.forEach((item) => {
            const index = item[this.indexName];
            assert(!this.contains(index), `An item already exists with key: ${index}`);
            this.list[index] = item;
        });
        this.events.emit('add', this);
    }
    remove(id) {
        if (this.contains(id)) {
            this.events.emit('before:remove', this);
            delete this.list[id];
            this.events.emit('remove');
        }
    }
    removeAll() {
        this.events.emit('before:removeAll', this);
        this.list = {};
        this.events.emit('removeAll', this);
    }
    static fromArrayOf(items, indexName) {
        const collection = new Collection(indexName);
        collection.add(...items);
        return collection;
    }
    onBeforeAdd(callback) {
        this.events.on('before:add', callback);
    }
    onAdd(callback) {
        this.events.on('add', callback);
    }
    onBeforeRemove(callback) {
        this.events.on('before:remove', callback);
    }
    onRemove(callback) {
        this.events.on('remove', callback);
    }
    onBeforeRemoveAll(callback) {
        this.events.on('before:removeAll', callback);
    }
    onRemoveAll(callback) {
        this.events.on('removeAll', callback);
    }
}

function divideAndModulo(value, factor) {
    const result = Math.floor(Math.abs(value / factor));
    const remainder = Math.abs(value % factor);
    return {
        remainder,
        result,
    };
}

function reverse(value) {
    let reversedString = '';
    const startFrom = value.length - 1;
    for (let char = startFrom; char >= 0; char -= 1) {
        reversedString += value[char];
    }
    return reversedString;
}



var index$3 = /*#__PURE__*/Object.freeze({
  reverse: reverse
});

function formatThousands(value, separator) {
    const integerText = value.toString();
    if (integerText.length < 4) {
        return integerText;
    }
    return reverse(reverse(integerText)
        .replace(/\d{3}/g, `$&${separator}`));
}



var index$4 = /*#__PURE__*/Object.freeze({
  divideAndModulo: divideAndModulo,
  formatThousands: formatThousands
});

class Range {
    constructor(lowerBound, upperBound) {
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
    includes(value) {
        return this.lowerBound <= value && value <= this.upperBound;
    }
    /**
     * Converts the Range object to a string representation.
     *
     * @public
     * @function
     * @return {String}
     */
    toString() {
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
    static fromArray(values) {
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
    static fromNotation(notedRange) {
        const errorMessage = 'Range#fromNotation: notedRange must use one of these formats: x,y x;y x:y x~y';
        assert(notedRange !== undefined, errorMessage);
        assert(typeof notedRange === 'string', errorMessage);
        let range;
        const allowedDelimiters = [',', ';', ':', '~'];
        assert(allowedDelimiters.some((delimiter) => notedRange.indexOf(delimiter) > -1), errorMessage);
        let delimiterFound = false;
        while (!delimiterFound) {
            const delimiter = allowedDelimiters.shift();
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

class Countdown {
    constructor(from) {
        this.$isPaused = false;
        this.$isFinished = false;
        this.$secondsToCount = 0;
        this.$secondsElapsed = 0;
        this.$timeInterval = from;
        this.$events = new EventEmitter();
    }
    get seconds() {
        return this.$timeInterval.seconds;
    }
    get minutes() {
        return this.$timeInterval.minutes;
    }
    get hours() {
        return this.$timeInterval.hours;
    }
    get days() {
        return this.$timeInterval.days;
    }
    get secondsToCount() {
        return this.$secondsToCount;
    }
    get secondsElapsed() {
        return this.$secondsElapsed;
    }
    get isPaused() {
        return this.$isPaused;
    }
    get isFinished() {
        return this.$isFinished;
    }
    beginCountdown() {
        this.$countdownTimer = setInterval(this.tick.bind(this), 1000);
        this.$secondsToCount = this.$timeInterval.asSeconds();
        this.$secondsElapsed = 0;
        this.$events.emit('begin');
    }
    pauseCountdown() {
        if (this.$isPaused) {
            return;
        }
        this.$isPaused = true;
        clearInterval(this.$countdownTimer);
    }
    resumeCountdown() {
        if (!this.$isPaused) {
            return;
        }
        this.$isPaused = false;
        this.$countdownTimer = setInterval(this.tick.bind(this), 1000);
    }
    tick() {
        this.$secondsElapsed += 1;
        this.$events.emit('tick', this);
        if (this.$secondsElapsed >= this.$secondsToCount) {
            clearInterval(this.$countdownTimer);
            this.$events.emit('end');
            this.$isFinished = true;
        }
    }
    onBegin(callback) {
        this.$events.on('begin', callback);
    }
    onTick(callback) {
        this.$events.on('tick', callback);
    }
    onNextTick(callback) {
        this.$events.once('tick', callback);
    }
    onEnd(callback) {
        this.$events.on('end', callback);
    }
}

class TimeInterval {
    constructor(seconds = 0, minutes = 0, hours = 0, days = 0) {
        this.$seconds = 0;
        this.$minutes = 0;
        this.$hours = 0;
        this.$days = 0;
        this.seconds += seconds;
        this.minutes += minutes;
        this.hours += hours;
        this.days += days;
    }
    get seconds() {
        return this.$seconds;
    }
    set seconds(newValue) {
        const { remainder, result } = divideAndModulo(newValue, 60);
        this.$seconds = remainder;
        this.minutes += result;
    }
    get minutes() {
        return this.$minutes;
    }
    set minutes(newValue) {
        const { remainder, result } = divideAndModulo(newValue, 60);
        if (remainder > 0 && remainder < 1) {
            this.seconds += remainder * 60;
            this.$minutes = 0;
            return;
        }
        this.$minutes = remainder;
        this.hours += result;
    }
    get hours() {
        return this.$hours;
    }
    set hours(newValue) {
        const { remainder, result } = divideAndModulo(newValue, 24);
        if (remainder > 0 && remainder < 1) {
            this.minutes += remainder * 60;
            this.$hours = 0;
            return;
        }
        this.$hours = remainder;
        this.days += result;
    }
    get days() {
        return this.$days;
    }
    set days(newValue) {
        if (newValue > 0 && newValue < 1) {
            this.hours += newValue * 24;
            this.$days = 0;
            return;
        }
        this.$days = newValue;
    }
    as(timeUnit) {
        const callbackMap = {
            ["seconds" /* SECONDS */]: this.asSeconds,
            ["minutes" /* MINUTES */]: this.asMinutes,
            ["hours" /* HOURS */]: this.asHours,
            ["days" /* DAYS */]: this.asDays,
        };
        return callbackMap[timeUnit].bind(this)();
    }
    asSeconds() {
        const minutesAsSeconds = this.minutes * 60;
        const hoursAsSeconds = this.hours * 60 * 60;
        const daysAsSeconds = this.days * 24 * 60 * 60;
        return this.seconds + minutesAsSeconds + hoursAsSeconds + daysAsSeconds;
    }
    asMinutes() {
        const secondsAsMinutes = this.seconds / 60;
        const hoursAsMinutes = this.hours * 60;
        const daysAsMinutes = this.days * 24 * 60;
        return secondsAsMinutes + this.minutes + hoursAsMinutes + daysAsMinutes;
    }
    asHours() {
        const secondsAsHours = this.seconds / 60 / 60;
        const minutesAsHours = this.minutes / 60;
        const daysAsHours = this.days * 24;
        return secondsAsHours + minutesAsHours + this.hours + daysAsHours;
    }
    asDays() {
        const secondsAsDays = this.seconds / 60 / 60 / 24;
        const minutesAsDays = this.minutes / 60 / 60;
        const hoursAsDays = this.hours / 24;
        return secondsAsDays + minutesAsDays + hoursAsDays + this.days;
    }
    clone() {
        return new TimeInterval(this.seconds, this.minutes, this.hours, this.days);
    }
}



var index$5 = /*#__PURE__*/Object.freeze({
  Countdown: Countdown,
  TimeInterval: TimeInterval
});

export { index$2 as Array, assert, Collection, index$4 as Numeric, index$3 as String, Range, index$5 as Time };
//# sourceMappingURL=xethya.utils.es.js.map
