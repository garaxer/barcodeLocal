import { useState } from "react";

interface Validation {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: {
    isValid: (value: string) => boolean;
    message: string;
  };
}

type ErrorRecord<T> = Record<keyof T, string>;

type Validations<T extends {}> = Partial<Record<keyof T, Validation>>;

const omitSingle = (k: any, { [k]: _, ...obj }) => obj;

export const useFormErrors = <T extends Record<keyof T, any> = {}>(options?: {
  validations?: Validations<T>;
  initialValues?: T;
}) => {
  //Sets the  error and returns boolean
  const checkForError = (key: keyof T, value: string) => {
    const validations = options?.validations;
    if (validations) {
      const validation = validations[key];
      const errorMessage = getError(validation, value);

      !!errorMessage.length
        ? setErrors({ ...errors, [key]: errorMessage })
        : setErrors(omitSingle(key, errors) as typeof errors);
    }
  };

  //figures out the error for the key
  const getError = (
    validation: Partial<Record<keyof T, Validation>>[keyof T],
    value: string
  ) => {
    let newErrorMessage = "";

    if (validation?.required?.value && !value) {
      newErrorMessage = validation?.required?.message;
    }

    const pattern = validation?.pattern;
    if (pattern?.value && !pattern.value.test(value)) {
      newErrorMessage = pattern.message;
    }

    const custom = validation?.custom;
    if (custom?.isValid && !custom.isValid(value)) {
      newErrorMessage = custom.message;
    }

    return newErrorMessage;
  };

  const getErrors = (data: T) => {
    const validations = options?.validations;
    let newErrors = {} as ErrorRecord<T>;
    for (const key in validations) {
      const value = data[key];
      const validation = validations[key];

      const errorMessage = getError(validation, value);
      if (errorMessage) {
        newErrors = { ...newErrors, [key]: errorMessage };
      }
    }
    return newErrors;
  };

  // Extrapolate the state setting part so that we can return a boolean
  const checkForErrors = (data: T) => {
    const errors = getErrors(data);
    setErrors(errors);
    return !!Object.keys(errors).length;
  };

  //If initial values are given, check them for errors, this will be hoisted.
  const [errors, setErrors] = useState<ErrorRecord<T>>(
    options?.initialValues
      ? getErrors(options.initialValues)
      : ({} as ErrorRecord<T>)
  );

  return {
    checkForError,
    checkForErrors,
    errors,
  };
};
