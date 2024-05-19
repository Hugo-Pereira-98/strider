interface stringfy {
  stringfy?: boolean;
}

export const setLocalStorage = <T>(
  key: string,
  value: T | string,
  { stringfy = true }: stringfy = {}
) => {
  if (stringfy) {
    value = JSON.stringify(value);
  }

  return localStorage.setItem(`posterr-${key}`, value as string);
};

export const getLocalStorage = <T>(key: string): T | undefined => {
  if (typeof window === 'undefined') return;

  const item = localStorage.getItem(`posterr-${key}`);

  if (item) {
    return JSON.parse(item) as T;
  }
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(`posterr-${key}`);
};
