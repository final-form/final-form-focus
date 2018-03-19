// @flow
/**
 * Predicate to identify inputs that can have focus() called on them
 */
const isFocusableInput = (wtf: any) =>
  !!(wtf && typeof wtf.focus === 'function')

export default isFocusableInput
