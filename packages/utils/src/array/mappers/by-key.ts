export default function byKey(key: string) {
  return (element: any) => element[key];
}
