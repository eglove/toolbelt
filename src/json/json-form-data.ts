import isString from "lodash/isString.js";

export const jsonToFormData = (value: Record<string, unknown>, key = "json") => {
  const formData = new FormData();
  formData.append(key, JSON.stringify(value));
  return formData;
};

export const formDataToJson = (formData: FormData, key = "json") => {
  const data = formData.get(key);

  if (!isString(data)) {
    return;
  }

  return JSON.parse(data);
};
