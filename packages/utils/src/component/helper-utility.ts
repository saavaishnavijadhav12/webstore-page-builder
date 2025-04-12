export function removeWhiteSpaces(data: string) {
  return data.trim();
}

export async function addDays(days: number) {
  const date: Date = new Date();
  const newDate = new Date(date.setTime(date.getTime() + days * 86400000));
  return newDate;
}

export const debounce = (callback: CallableFunction, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
