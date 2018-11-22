export default function divideAndModulo(value: number, factor: number): { result: number, remainder: number } {
  const result = Math.floor(Math.abs(value / factor));
  const remainder = Math.abs(value % factor);

  return {
    remainder,
    result,
  };
}
