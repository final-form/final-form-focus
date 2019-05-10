// @flow
/**
 * Predicate to identify inputs that can have focus() called on them
 */
const isFocusableInput = (wtf: any) =>
  !!(wtf && typeof wtf.focus === 'function' && wtf.tagName !== 'BUTTON')

export default isFocusableInput
