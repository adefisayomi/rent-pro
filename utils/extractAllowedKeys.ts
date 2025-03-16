


export function extractAllowedKeys<T extends Record<string, any>>(
  obj: any,
  keys: (keyof T)[]
): Partial<T> {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
}