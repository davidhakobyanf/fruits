type LocalizedFormValues = Record<string, any>;

export const transformLocalizedValues = (
  formData: FormData,
): LocalizedFormValues => {
  const data: LocalizedFormValues = {};
  const usedKeys: string[] = [];

  for (let [key, value] of formData.entries()) {    
    if (key.includes('.')) {
      const [field, lang] = key.split('.');

      if (!data[lang]) {
        data[lang] = {};
      }
      data[lang][field] = value;
      usedKeys.push(key);
    }
  }  

  usedKeys.forEach((usedKey) => {
    formData.delete(usedKey);
  });

  return data;
};
