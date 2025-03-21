export function extractAllowedKeys<T extends Record<string, any>>(
  payload: T, 
  allowedKeys: Array<keyof T>
): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedKeys.includes(key as keyof T))
  ) as Partial<T>;
}