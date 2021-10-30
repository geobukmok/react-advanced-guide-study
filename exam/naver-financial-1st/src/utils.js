import { DEFAULT_PARAM_VALUE } from "./constants.js";

/**
 * 만약,
 * param에 숫자가 아닌 값이 들어오거나
 * 음수 또는 0으로 들어온 경우,
 * 기본값으로 지정합니다.
 */
export const checkValidParam = (param) => {
  for (const [key, value] of Object.entries(param)) {
    if (!Number.isInteger(value)) {
      param[key] = DEFAULT_PARAM_VALUE[key];
    } else if (value <= 0) {
      param[key] = DEFAULT_PARAM_VALUE[key];
    }
  }

  return param;
};
