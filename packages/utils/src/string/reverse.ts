export default function reverse(value: string) {
  let reversedString = '';
  const startFrom = value.length - 1;

  for (let char = startFrom; char >= 0; char -= 1) {
    reversedString += value[char];
  }

  return reversedString;
}
