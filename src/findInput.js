// @flow
import type { FindInput, FocusableInput } from './types'
import { getIn } from 'final-form'

/**
 * Finds the input by looking if the name attribute path is existing in the errors object
 */
const findInput: FindInput = (inputs: FocusableInput[], errors: {}) =>
  inputs.find(input => input.name && getIn(errors, input.name))

export default findInput
