// @flow
import type { Decorator, FormApi } from 'final-form'
import type { GetInputs } from './types'
import { getIn } from 'final-form'
import getAllInputs from './getAllInputs'

const createDecorator = (getInputs?: GetInputs): Decorator => (
  form: FormApi
) => {
  const focusOnFirstError = (errors: Object) => {
    if (!getInputs) {
      getInputs = getAllInputs
    }
    const firstInput = getInputs().find(
      input => input.name && getIn(errors, input.name)
    )
    if (firstInput) {
      firstInput.focus()
    }
  }
  // Save original submit function
  const originalSubmit = form.submit

  // Subscribe to errors, and keep a local copy of them
  let state: { errors?: Object, submitErrors?: Object } = {}
  const unsubscribe = form.subscribe(
    nextState => {
      state = nextState
    },
    { errors: true, submitErrors: true }
  )

  // What to do after submit
  const afterSubmit = () => {
    const { errors, submitErrors } = state
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
      result.then(afterSubmit)
    } else {
      // sync
      afterSubmit()
    }
    return result
  }

  return () => {
    unsubscribe()
    form.submit = originalSubmit
  }
}

export default createDecorator
