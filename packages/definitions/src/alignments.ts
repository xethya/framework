enum CreatureMorality {
  Good = 1,
  Evil = 2,
  Neutral = 4,
}

enum CreatureAttitude {
  Lawful = 8,
  Chaotic = 16,
  Neutral = 32,
}

/**
 * A typical creature in the game world has an alignment, which broadly describes its moral and personal attitudes.
 * Alignment is a combination of two factors: one identifies morality (good, evil, or neutral),
 * and the other describes attitudes toward society and order (lawful, chaotic, or neutral).
 */
export enum CreatureAlignment {
  /***
   * Lawful good (LG) creatures can be counted on to do the right thing as expected by society.
   */
  LawfulGood = CreatureAttitude.Lawful | CreatureMorality.Good,

  /**
   * Neutral good (NG) folk do the best they can to help others according to their needs.
   */
  NeutralGood = CreatureAttitude.Neutral | CreatureMorality.Good,

  /**
   * Chaotic good (CG) creatures act as their conscience directs,
   * with little regard for what others expect.
   */
  ChaoticGood = CreatureAttitude.Chaotic | CreatureMorality.Good,

  /**
   * Lawful neutral (LN) individuals act in accordance with law, tradition,
   * or personal codes.
   */
  LawfulNeutral = CreatureAttitude.Lawful | CreatureMorality.Neutral,

  /**
   * Neutral (N) is the alignment of those who prefer to steer clear of moral
   * questions and don't take sides, doing what seems best at the time.
   */
  Neutral = CreatureAttitude.Neutral | CreatureMorality.Neutral,

  /**
   * Chaotic neutral (CN) creatures follow their whims,
   * holding their personal freedom above all else.
   */
  ChaoticNeutral = CreatureAttitude.Chaotic | CreatureMorality.Neutral,

  /**
   * Lawful evil (LE) creatures methodically take what they want,
   * within the limits of a code of tradition, loyalty, or order.
   */
  LawfulEvil = CreatureAttitude.Lawful | CreatureMorality.Evil,

  /**
   * Neutral evil (NE) is the alignment of those who do whatever
   * they can get away with, without compassion or qualms.
   */
  NeutralEvil = CreatureAttitude.Neutral | CreatureMorality.Evil,

  /**
   * Chaotic evil (CE) creatures act with arbitrary violence,
   * spurred by their greed, hatred, or bloodlust.
   */
  ChaoticEvil = CreatureAttitude.Chaotic | CreatureMorality.Evil,
}
