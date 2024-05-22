import joi from "joi";
import { ResponseCode } from "../types/enum";

const parameterValidate = <T>(data: T, schema: joi.ObjectSchema<T>) => {
  const validateResult = schema.validate(data);
  if (validateResult.error) {
    throw {
      message: validateResult.error.message,
      code: ResponseCode.ParameterError,
    };
  }
  return validateResult.value;
};

export default parameterValidate;
