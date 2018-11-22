import { AssertionError } from './errors';

export default function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new AssertionError(message);
  }
}
