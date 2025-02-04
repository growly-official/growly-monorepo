/** Conver string to number
 *
 * @param str String convertible value
 */
export const stoi = (str: string | number | bigint): number => {
  return parseInt(str.toString());
};
