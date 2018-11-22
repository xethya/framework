import { reverse } from '../string';

export default function formatThousands(value: number, separator: string) {
  const integerText = value.toString();

  if (integerText.length < 4) {
    return integerText;
  }

  return reverse(reverse(integerText)
    .replace(/\d{3}/g, `$&${separator}`));
}
