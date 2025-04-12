// Environment Configuration
const APP = {
  BASE_URL: process.env.API_URL,
  WEBSTORE_DOMAIN_NAME: process.env.WEBSTORE_DOMAIN_NAME,
  SESSION_TIMEOUT: 60 * 60,
  DEFAULT_LOCALE: "en-US",
  MAXIMUM_FRACTION_DIGITS: 2,
  SECRET_KEY: "SecretKey",
};
export const GENERAL_SETTINGS = {
  DATE_FORMAT: "MM/DD/YY",
  TIME_ZONE: "hh:mm A",
  DEFAULT_TIME_ZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
};
export const APP_NAME = {
  WEBSTORE: "WEBSTORE",
  PAGE_BUILDER: "PAGE_BUILDER",
};

export const REG_EX = {
  Email: /^[a-zA-Z0-9]{1,100}(?:[._+%-][a-zA-Z0-9]{1,100})*@[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,}$/,
  Password: /^(?!.*[{}])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/,
  AlphaNumericCharacter: /^[a-zA-Z0-9]*$/,
  OnlyNumberAllowed: /^[0-9]+$/,
};

export { APP };
