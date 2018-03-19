// @flow
import type { GetInputs } from './types'
import isFocusableInput from './isFocusableInput'

/**
 * Generates a function to get all the inputs in a form with the specified name
 */
const getFormInputs = (name: string): GetInputs => () => {
  if (typeof document === 'undefined') {
    return []
  }
  // $FlowFixMe
  const form = document.forms[name]
  return ((form && form.length
    ? Array.prototype.slice.call(form).filter(isFocusableInput)
    : []): any[]) // cast cheat to get from HTMLFormElement children to FocusableInput
}

export default getFormInputs
