// @flow
import type { Decorator, FormApi } from 'final-form'
import type { GetInputs, FindInput } from './types'
import getAllInputs from './getAllInputs'
import defaultFindInput from './findInput'

const noop = () => {}

const createDecorator = (
  getInputs?: GetInputs,
  findInput?: FindInput
): Decorator => (form: FormApi) => {
  const focusOnFirstError = (errors: Object) => {
    if (!getInputs) {
      getInputs = getAllInputs
    }
    if (!findInput) {
      findInput = defaultFindInput
    }
    const firstInput = findInput(getInputs(), errors)
    if (firstInput) {
      firstInput.focus()
    }
  }
  // Save original submit function
  const originalSubmit = form.submit

  // What to do after submit
  const afterSubmit = () => {
    const { errors, submitErrors } = form.getState()
    if (errors && Object.keys(errors).length) {
      focusOnFirstError(errors)
    } else if (submitErrors && Object.keys(submitErrors).length) {
      focusOnFirstError(submitErrors)
    }
  }

  // Rewrite submit function
  form.submit = () => {
    const result = originalSubmit.call(form)
    if (result && typeof result.then === 'function') {
      // async
      result.then(afterSubmit, noop)
    } else {
      // sync
      afterSubmit()
    }
    return result
  }

  return () => {
    form.submit = originalSubmit
  }
}

export default createDecorator
