import { assert, Collection, numeric, Range, Stack } from "@xethya/utils";
import { v4 as generateUUID } from "uuid";

const { formatThousands } = numeric;

export const enum ModifierType {
  /**
   * A boost represents an increase in the score.
   */
  Boost = "B",

  /**
   * A drop represents a decrease in the score.
   */
  Drop = "D",
}

export type Modifier = {
  /**
   * A unique identifier for this modifier. Generated internally.
   * It uses the uuid.v4() hash function.
   */
  id: string;

  /**
   * By how much would the score be affected, whether it is a boost
   * or a drop.
   */
  factor: number;

  /**
   * Why is this boost or drop occuring.
   *
   * @todo This data structure might be insufficient.
   * @see https://github.com/xethya/framework/issues/44
   */
  reason?: string;

  /**
   * Whether this modifier is a boost (B) or a drop (D).
   */
  type: ModifierType;
};

export type PointOptions = {
  /**
   * The name of this score.
   */
  name: string;

  /**
   * The unit of this score, such as HP, MP or XP.
   */
  unit?: string;

  /**
   * The initial score this point instance starts with.
   */
  initialScore: number;

  /**
   * The minimum score this counter can handle. Defaults to -Infinity.
   */
  minimumScore?: number;

  /**
   * The maximum score this counter can handle. Defaults to +Infinity.
   */
  maximumScore?: number;
};

export type PointFormatOptions = {
  /**
   * Whether to format the score value as thousands (i.e. 1,000,000).
   */
  formatScoreInThousands?: boolean;

  /**
   * Whether to show the unit name along the value (i.e. 1,000,000 HP).
   */
  showUnit?: boolean;

  /**
   * The separator to use when splitting thousands (i.e. "," or ".").
   */
  thousandSeparator?: string;
};

export type CalculatedModifier = () => number;

export class Point {
  /**
   * The name of this score.
   */
  public name: string;

  /**
   * The unit of this score, such as HP, MP or XP.
   */
  public unit: string;

  /**
   * The initial score this point instance starts with.
   */
  public initialScore: number;

  /**
   * How low or how high the score counter can go.
   */
  public range: Range;

  /**
   * A list of factors that permanently affect the computed value of the point.
   */
  protected readonly permanentModifiers: Collection<Modifier>;

  /**
   * A list of factors that temporarily affect the computed value of the point.
   * Unlike permanent modifiers, these can be removed.
   */
  protected readonly temporaryModifiers: Collection<Modifier>;

  /**
   * Stores the latest score calculation.
   */
  protected lastScore: number = 0;

  /**
   * Stores the latest boost or drop registered.
   */
  protected lastModifier: Modifier;

  /**
   * Stores the amount of boosts or drops registered so far.
   */
  protected lastModifierCount: number = 0;

  protected calculations: Stack<CalculatedModifier>;

  /**
   * Points are cumulative units that can reflect different features of a creature.
   * Some examples would be hit points (how many hits a creature can take before dying
   * or being destroyed), magic points (how much magical energy a creature is holding)
   * or experience points (how much has a creature progressed in its life,
   * raising its "level" and therefore other points).
   */
  constructor(options: PointOptions) {
    this.name = options.name;
    this.unit = options.unit || "";
    this.initialScore = options.initialScore;
    this.lastScore = this.initialScore;
    this.range = new Range(
      options.minimumScore === undefined ? -Infinity : options.minimumScore,
      options.maximumScore === undefined ? Infinity : options.maximumScore,
    );

    assert(
      this.range.includes(this.initialScore),
      `initialScore must be within the specified range: ${this.range.toString()}`,
    );

    this.permanentModifiers = new Collection<Modifier>("id");
    this.temporaryModifiers = new Collection<Modifier>("id");
    this.calculations = new Stack<CalculatedModifier>();

    this.permanentModifiers.onBeforeAdd(this.checkForValidModifier.bind(this));
    this.permanentModifiers.onAdd(this.updateLastScore.bind(this));
    this.permanentModifiers.onAdd(this.increaseModifierCount.bind(this));

    this.temporaryModifiers.onBeforeAdd(this.checkForValidModifier.bind(this));
    this.temporaryModifiers.onAdd(this.updateLastScore.bind(this));
    this.temporaryModifiers.onRemove(this.updateLastScore.bind(this));
    this.temporaryModifiers.onAdd(this.increaseModifierCount.bind(this));
    this.temporaryModifiers.onRemove(this.decreaseModifierCount.bind(this));
  }

  /**
   * Used to update how many modifiers have been registered so far.
   * Triggers after adding either a temporary or permanent modifier.
   */
  protected increaseModifierCount() {
    this.lastModifierCount += 1;
  }

  /**
   * Used to update how many modifiers have been registered so far.
   * Triggers after removing a temporary modifier.
   */
  protected decreaseModifierCount() {
    this.lastModifierCount -= 1;
  }

  /**
   * Updates the score counter with the latest boost or drop that was added or removed.
   *
   * @param collection The list of modifiers being affected.
   */
  protected updateLastScore(collection: Collection<Modifier>) {
    let factor = this.lastModifier.factor;
    const isTemporaryModifier = collection === this.temporaryModifiers;
    const isRemovingModifier =
      this.lastModifierCount - 1 === this.permanentModifiers.count + this.temporaryModifiers.count;

    if (isTemporaryModifier && isRemovingModifier) {
      factor = -factor;
    }

    this.lastScore += factor;
  }

  /**
   * Verifies that the modifier has a valid factor and keeps the score range in check.
   * Triggered by the `before:add` event of the modifier collections.
   *
   * @param modifier The modifier being added either permanently or temporarily.
   */
  protected checkForValidModifier(collection: Collection<Modifier>, modifier: Modifier) {
    const { factor, type } = modifier;
    const isPermanent = collection === this.permanentModifiers;

    if (type === ModifierType.Boost) {
      assert(factor > 0, "Point changes must use a factor greater than zero");
      assert(
        this.range.includes(this.lastScore + factor),
        `Boosting ${isPermanent ? "permanently" : "temporarily"} by ${factor} makes the score ${this.lastScore +
          factor}, which goes out of the range ${this.range.toString()}`,
      );
    }

    if (type === ModifierType.Drop) {
      assert(factor < 0, "Point changes must use a factor greater than zero");
      assert(
        this.range.includes(this.lastScore - factor),
        `Dropping ${isPermanent ? "permanently" : "temporarily"} by ${factor} makes the score ${this.lastScore -
          factor}, which goes out of the range ${this.range.toString()}`,
      );
    }

    this.lastModifier = modifier;
  }

  /**
   * Records a permanent boost into this point counter.
   *
   * @param factor How much this boost would increment the score.
   * @param reason Why is this boost occuring.
   */
  public boostPermanentlyBy(factor: number, reason?: string) {
    this.permanentModifiers.add({ id: generateUUID(), factor, reason, type: ModifierType.Boost });
  }

  /**
   * Records a permanent drop into this point counter.
   *
   * @param factor How much this drop would decrement the score.
   * @param reason Why is this drop occuring.
   */
  public dropPermanentlyBy(factor: number, reason?: string) {
    this.permanentModifiers.add({ id: generateUUID(), factor: -factor, reason, type: ModifierType.Drop });
  }

  /**
   * Records a temporary boost into this point counter. Temporary boosts can
   * be canceled using the `revertTemporaryEffect` method.
   *
   * @param factor How much this boost would increment the score.
   * @param reason Why is this boost occuring.
   */
  public boostTemporarilyBy(factor: number, reason?: string): Modifier {
    const modifier = { id: generateUUID(), factor, reason, type: ModifierType.Boost };
    this.temporaryModifiers.add(modifier);

    return modifier;
  }

  /**
   * Records a temporary drop into this point counter. Temporary drops can
   * be canceled using the `revertTemporaryEffect` method.
   *
   * @param factor How much this drop would decrement the score.
   * @param reason Why is this drop occuring.
   */
  public dropTemporarilyBy(factor: number, reason?: string) {
    const modifier = { id: generateUUID(), factor: -factor, reason, type: ModifierType.Drop };
    this.temporaryModifiers.add(modifier);

    return modifier;
  }

  /**
   * Cancels a given boost or drop, reverting its effects.
   *
   * @param modifier The boost or drop to revert, returned by either `boostTemporarilyBy`
   *                 or `dropTemporarilyBy`.
   */
  public revertTemporaryEffect(modifier: Modifier) {
    this.temporaryModifiers.remove(modifier.id);
  }

  public addCalculation(calc: CalculatedModifier): void {
    this.calculations.push(calc);
  }

  /**
   * Calculates the current score in the point counter.
   */
  public getScore(): number {
    let calculatedScore = 0;
    const executedCalculations = new Stack<CalculatedModifier>();

    let calc: CalculatedModifier | void;

    // tslint:disable-next-line: no-conditional-assignment
    while ((calc = this.calculations.pop())) {
      calculatedScore += calc();
      assert(
        this.range.includes(this.lastScore + calculatedScore),
        `Calculation exceeds score range of ${this.range.toString()}`,
      );
      executedCalculations.push(calc);
    }

    // tslint:disable-next-line: no-conditional-assignment
    while ((calc = executedCalculations.pop())) {
      this.calculations.push(calc);
    }

    return this.lastScore + calculatedScore;
  }

  public getLastScore(): number {
    return this.lastScore;
  }

  /**
   * Returns a string representation of the point counter's current score.
   *
   * @param formatOptions Allows to configure different aspects of how the string will look.
   */
  public toString(
    formatOptions: PointFormatOptions = {
      formatScoreInThousands: true,
      showUnit: true,
      thousandSeparator: ".",
    },
  ): string {
    const { formatScoreInThousands = true, showUnit = true, thousandSeparator = "." } = formatOptions;

    const score = formatScoreInThousands ? formatThousands(this.lastScore, thousandSeparator) : this.lastScore;
    const unit = showUnit ? ` ${this.unit}` : "";
    return `${score}${unit}`;
  }
}
