// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */

const MAX_NUM_OF_DIGITS = 11;
const MAX_NUM_OF_DIGITS_INDEX = 0;
const MAX_NUM_OF_DECIMAL_INDEX = 1;

const Errors = {
  invalidDecimalError: {
    code: "doubleNumber.e001",
    message: "The value is not a valid decimal number."
  },
  maxDigitsExceeded: {
    code: "doubleNumber.e002",
    message: "The value exceeded maximum number of digits."
  },
  maxDecimalPlacesExceeded: {
    code: "doubleNumber.e003",
    message: "The value exceeded maximum number of decimal places."
  }
}

class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
  }

  match(value) {
    let result = new ValidationResult();
        if (value == null) { return result; }

      let number;

      try {
        number = new Decimal(value);
      } catch (e) {
        this.appendError(result, Errors.invalidDecimalError);
        return result;
      }

      this.validateNumberOfDigits(number, result);

      if (this.isDecimalPlacesValidationNeeded()) {
        this.validateDecimalPlaces(number, result)
      }

    return result;
  }

  appendError(result, error) {
    result.addInvalidTypeError(error.code, error.message);
  }

  isDecimalPlacesValidationNeeded() {
    return this.params.length === 2;
  }

  validateNumberOfDigits(number, result) {
    if (number.precision(true) > (this.params[MAX_NUM_OF_DIGITS_INDEX] ?? MAX_NUM_OF_DIGITS)) {
      this.appendError(result, Errors.maxDigitsExceeded);
    }
  }

  validateDecimalPlaces(number, result) {
    if (number.decimalPlaces() > this.params[MAX_NUM_OF_DECIMAL_INDEX]) {
      this.appendError(result, Errors.maxDecimalPlacesExceeded);
    }
  }
}

module.exports = DecimalNumberMatcher;
