import * as mongoose from 'mongoose';

export function createObjectId(_id: string) {
  return new mongoose.Types.ObjectId(_id);
}

export function convertObjectIdToString(_id: any) {
  return (_id as unknown as mongoose.Types.ObjectId).toString();
}

/**
 * Get the value corresponding to a percentage of a total number.
 * @param {number} percentage - The percentage value (e.g., 20 for 20%).
 * @param {number} total - The total number.
 * @returns {number} - The calculated value.
 */
export function getValueFromPercentage(percentage: number, total: number) {
  return Number(((percentage / 100) * total).toFixed(2));
}

// Example usage:
const percentage = 25; // 25%
const total = 200; // Total value
const result = getValueFromPercentage(percentage, total);
console.log(`25% of 200 is ${result}`); // Outputs: 25% of 200 is 5

export function getPhoneNumberFromString(stringVal: string) {
  try {
    var numb = stringVal.match(/\d/g);
    let myNumb = numb.join('');

    if (myNumb.length === 10) {
      return Number(myNumb);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
