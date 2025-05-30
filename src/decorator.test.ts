import createDecorator from './decorator'
import { createForm } from 'final-form'
import { FocusableInput } from './types'

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
const onSubmitMock = (): void => { }

interface FormValues {
  foo?: number;
  bar?: number;
  baz?: number;
  nonexistent?: string;
}

describe('decorator', () => {
  it('should do nothing if submit succeeds', () => {
    const form = createForm<FormValues>({ onSubmit: onSubmitMock })
    form.registerField('foo', () => { }, {})
    form.registerField('bar', () => { }, {})

    const getInputs = jest.fn()
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.change('foo', 42)

    form.submit()

    expect(getInputs).not.toHaveBeenCalled()
  })

  it('should call getInputs if submit fails', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors: Record<string, string> = {}
        if (!values.foo) {
          errors.foo = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => { }, {})
    form.registerField('bar', () => { }, {})

    const getInputs = jest.fn(() => [])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)
  })

  it('should focus on first field with error', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors: Record<string, string> = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => { }, {})
    form.registerField('bar', () => { }, {})
    form.registerField('baz', () => { }, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).not.toHaveBeenCalled()

    // set bar, error should move to baz
    form.change('bar', 42)

    form.submit()

    expect(getInputs).toHaveBeenCalledTimes(2)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).toHaveBeenCalled()
    expect(baz).toHaveBeenCalledTimes(1)
  })

  it('should focus on first field with sync submit error', () => {
    const form = createForm<FormValues>({
      onSubmit: values => {
        const errors: Record<string, string> = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => { }, {})
    form.registerField('bar', () => { }, {})
    form.registerField('baz', () => { }, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).not.toHaveBeenCalled()

    // set bar, error should move to baz
    form.change('bar', 42)

    form.submit()

    expect(getInputs).toHaveBeenCalledTimes(2)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).toHaveBeenCalled()
    expect(baz).toHaveBeenCalledTimes(1)
  })

  it('should focus on first field with async submit error', async () => {
    const form = createForm<FormValues>({
      onSubmit: async values => {
        await sleep(2)
        const errors: Record<string, string> = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => { }, {})
    form.registerField('bar', () => { }, {})
    form.registerField('baz', () => { }, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    await form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).not.toHaveBeenCalled()

    // set bar, error should move to baz
    form.change('bar', 42)

    await form.submit()

    expect(getInputs).toHaveBeenCalledTimes(2)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).toHaveBeenCalled()
    expect(baz).toHaveBeenCalledTimes(1)
  })

  it('should prioritize sync errors over submit errors', () => {
    const form = createForm<FormValues>({
      onSubmit: values => {
        const errors: Record<string, string> = {}
        if (!values.foo) {
          errors.foo = 'Required'
        }
        return errors
      },
      validate: values => {
        const errors: Record<string, string> = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => { }, {})
    form.registerField('bar', () => { }, {})
    form.registerField('baz', () => { }, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).not.toHaveBeenCalled()

    // set bar, error should move to baz
    form.change('bar', 42)

    form.submit()

    expect(getInputs).toHaveBeenCalledTimes(2)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).toHaveBeenCalled()
    expect(baz).toHaveBeenCalledTimes(1)
  })

  it('should handle empty errors object', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: () => ({})
    })
    form.registerField('foo', () => { }, {})

    const getInputs = jest.fn()
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).not.toHaveBeenCalled()
  })

  it('should handle undefined errors', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: () => undefined
    })
    form.registerField('foo', () => { }, {})

    const getInputs = jest.fn()
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).not.toHaveBeenCalled()
  })

  it('should handle no matching input for error', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: () => ({ nonexistent: 'Required' })
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle async validation rejection', async () => {
    const form = createForm<FormValues>({
      onSubmit: async () => {
        throw new Error('Validation failed')
      }
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    try {
      await form.submit()
    } catch {
      // Expected error
    }

    expect(getInputs).not.toHaveBeenCalled()
  })

  it('should handle async validation with no errors', async () => {
    const form = createForm<FormValues>({
      onSubmit: async () => {
        await sleep(2)
        return undefined
      }
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    await form.submit()

    expect(getInputs).not.toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle sync validation with no errors', () => {
    const form = createForm<FormValues>({
      onSubmit: () => undefined
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).not.toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with no errors', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    // Trigger a form state change
    form.change('foo', 42)

    expect(getInputs).not.toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with errors', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors: Record<string, string> = {}
        if (!values.foo) {
          errors.foo = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    // Trigger validation
    form.change('foo', undefined)

    expect(getInputs).toHaveBeenCalled()
    expect(focus).toHaveBeenCalled()
  })

  it('should handle form state changes with submit errors', () => {
    const form = createForm<FormValues>({
      onSubmit: () => ({ foo: 'Submit error' })
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(focus).toHaveBeenCalled()
  })

  it('should cleanup properly', () => {
    const form = createForm<FormValues>({ onSubmit: onSubmitMock })
    const originalSubmit = form.submit
    const getInputs = jest.fn(() => [])
    const findInput = jest.fn(() => undefined)
    const decorator = createDecorator(getInputs, findInput)
    const cleanup = decorator(form) // Apply decorator and get cleanup

    expect(form.submit).not.toBe(originalSubmit)

    cleanup() // Call cleanup

    expect(form.submit).toBe(originalSubmit)
  })

  it('should handle async validation with errors and no matching input', async () => {
    const form = createForm<FormValues>({
      onSubmit: async () => {
        await sleep(2)
        return { nonexistent: 'Required' }
      }
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    await form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle sync validation with errors and no matching input', () => {
    const form = createForm<FormValues>({
      onSubmit: () => ({ nonexistent: 'Required' })
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with errors and no matching input', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: () => ({ nonexistent: 'Required' })
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    // Trigger validation
    form.change('foo', 42)

    expect(getInputs).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with submit errors and no matching input', () => {
    const form = createForm<FormValues>({
      onSubmit: () => ({ nonexistent: 'Required' })
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with no errors', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    // Trigger form state change
    form.change('foo', 42)

    expect(getInputs).not.toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with empty errors object', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: () => ({})
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    // Trigger validation
    form.change('foo', 42)

    expect(getInputs).not.toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle form state changes with undefined errors', () => {
    const form = createForm<FormValues>({
      onSubmit: onSubmitMock,
      validate: () => undefined
    })
    form.registerField('foo', () => { }, {})

    const focus = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus }
    ] as FocusableInput[])
    const decorator = createDecorator(getInputs)
    decorator(form)

    // Trigger validation
    form.change('foo', 42)

    expect(getInputs).not.toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('should handle async validation errors', async () => {
    const focus = jest.fn();
    const inputs = [{ name: 'firstName', focus }];
    const getInputs = jest.fn(() => inputs);
    const findInput = jest.fn((_inputs, _errors) => inputs[0]);
    const decorator = createDecorator(getInputs, findInput);

    const form = {
      batch: jest.fn(),
      blur: jest.fn(),
      change: jest.fn(),
      destroyOnUnregister: false,
      focus: jest.fn(),
      initialize: jest.fn(),
      mutators: {},
      reset: jest.fn(),
      restart: jest.fn(),
      subscribe: jest.fn((_callback, _options) => () => { }),
      submit: jest.fn().mockImplementation(() => Promise.reject()),
      getState: jest.fn(() => ({
        errors: { firstName: 'Required' }
      })),
      registerField: jest.fn(),
      getFieldState: jest.fn(),
      getRegisteredFields: jest.fn(),
      isValidationPaused: jest.fn(),
      pauseValidation: jest.fn(),
      resumeValidation: jest.fn(),
      setConfig: jest.fn(),
      validate: jest.fn(),
      resetFieldState: jest.fn(),
      setCallbackScheduler: jest.fn(),
      subscribeFieldState: jest.fn(),
      getFieldSnapshot: jest.fn(),
      getFormState: jest.fn(),
      notify: jest.fn()
    } as any; // Type assertion to avoid complex type issues

    const unsubscribe = decorator(form);
    await form.submit().catch(() => { });

    expect(focus).toHaveBeenCalled();
    expect(findInput).toHaveBeenCalledWith(inputs, { firstName: 'Required' });

    unsubscribe();
    expect(form.submit).toBe(form.submit); // Original submit function should be restored
  });

  it('should handle async submit errors', async () => {
    const focus = jest.fn();
    const inputs = [{ name: 'firstName', focus }];
    const getInputs = jest.fn(() => inputs);
    const findInput = jest.fn((_inputs, _errors) => inputs[0]);
    const decorator = createDecorator(getInputs, findInput);

    const form = {
      batch: jest.fn(),
      blur: jest.fn(),
      change: jest.fn(),
      destroyOnUnregister: false,
      focus: jest.fn(),
      initialize: jest.fn(),
      mutators: {},
      reset: jest.fn(),
      restart: jest.fn(),
      subscribe: jest.fn((_callback, _options) => () => { }),
      submit: jest.fn().mockImplementation(() => Promise.reject()),
      getState: jest.fn(() => ({
        submitErrors: { firstName: 'Server error' }
      })),
      registerField: jest.fn(),
      getFieldState: jest.fn(),
      getRegisteredFields: jest.fn(),
      isValidationPaused: jest.fn(),
      pauseValidation: jest.fn(),
      resumeValidation: jest.fn(),
      setConfig: jest.fn(),
      validate: jest.fn(),
      resetFieldState: jest.fn(),
      setCallbackScheduler: jest.fn(),
      subscribeFieldState: jest.fn(),
      getFieldSnapshot: jest.fn(),
      getFormState: jest.fn(),
      notify: jest.fn()
    } as any; // Type assertion to avoid complex type issues

    const unsubscribe = decorator(form);
    await form.submit().catch(() => { });

    expect(focus).toHaveBeenCalled();
    expect(findInput).toHaveBeenCalledWith(inputs, { firstName: 'Server error' });

    unsubscribe();
    expect(form.submit).toBe(form.submit); // Original submit function should be restored
  });
}) 