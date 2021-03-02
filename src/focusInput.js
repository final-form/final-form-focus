// @flow
import type { FocusableInput, FocusInput } from './types'

/**
 * Focuses an input
 */
const focusInput: FocusInput = (input: FocusableInput) =>
  input.focus()

export default focusInput
