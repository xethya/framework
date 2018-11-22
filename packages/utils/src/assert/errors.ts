export class AssertionError extends Error {
  constructor(message: string) {
    super();
    this.message = ['[AssertionError] An assertion has failed', message].filter(Boolean).join(': ');
  }
}
