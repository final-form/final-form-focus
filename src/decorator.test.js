import createDecorator from './decorator'
import { createForm } from 'final-form'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const onSubmitMock = () => {}

describe('decorator', () => {
  it('should do nothing if submit succeeds', () => {
    const form = createForm({ onSubmit: onSubmitMock })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})

    const getInputs = jest.fn()
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.change('foo', 42)

    form.submit()

    expect(getInputs).not.toHaveBeenCalled()
  })

  it('should call getInputs if submit fails', () => {
    const form = createForm({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors = {}
        if (!values.foo) {
          errors.foo = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})

    const getInputs = jest.fn(() => [])
    const decorator = createDecorator(getInputs)
    decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)
  })

  it('should focus on first field with error', () => {
    const form = createForm({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})
    form.registerField('baz', () => {}, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ])
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
    const form = createForm({
      onSubmit: values => {
        const errors = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})
    form.registerField('baz', () => {}, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ])
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
    const form = createForm({
      onSubmit: async values => {
        await sleep(2)
        const errors = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})
    form.registerField('baz', () => {}, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ])
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
    const form = createForm({
      onSubmit: values => {
        const errors = {}
        if (!values.foo) {
          errors.foo = 'Required'
        }
        return errors
      },
      validate: values => {
        const errors = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})
    form.registerField('baz', () => {}, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ])
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

    // set baz, error should move to foo (submit error)
    form.change('baz', 42)

    form.submit()

    expect(getInputs).toHaveBeenCalledTimes(3)

    expect(foo).toHaveBeenCalled()
    expect(foo).toHaveBeenCalledTimes(1)
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).toHaveBeenCalledTimes(1)
  })

  it('should stop focusing when unsubscribed', () => {
    const form = createForm({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})
    form.registerField('baz', () => {}, {})

    const foo = jest.fn()
    const bar = jest.fn()
    const baz = jest.fn()
    const getInputs = jest.fn(() => [
      { name: 'foo', focus: foo },
      { name: 'bar', focus: bar },
      { name: 'baz', focus: baz }
    ])
    const decorator = createDecorator(getInputs)
    const unsubscribe = decorator(form)

    form.submit()

    expect(getInputs).toHaveBeenCalled()
    expect(getInputs).toHaveBeenCalledTimes(1)

    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(1)
    expect(baz).not.toHaveBeenCalled()

    form.submit()
    expect(getInputs).toHaveBeenCalledTimes(2)
    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(2)
    expect(baz).not.toHaveBeenCalled()

    form.submit()
    expect(getInputs).toHaveBeenCalledTimes(3)
    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(3)
    expect(baz).not.toHaveBeenCalled()

    unsubscribe()
    form.submit()
    expect(getInputs).toHaveBeenCalledTimes(3)
    expect(foo).not.toHaveBeenCalled()
    expect(bar).toHaveBeenCalledTimes(3)
    expect(baz).not.toHaveBeenCalled()
  })

  it('should use getAllInputs when no getInputs is given', () => {
    // this is mainly here for code coverage, as we cannot test that getAllInputs was called
    const form = createForm({
      onSubmit: onSubmitMock,
      validate: values => {
        const errors = {}
        if (!values.bar) {
          errors.bar = 'Required'
        }
        if (!values.baz) {
          errors.baz = 'Required'
        }
        return errors
      }
    })
    form.registerField('foo', () => {}, {})
    form.registerField('bar', () => {}, {})
    form.registerField('baz', () => {}, {})

    const decorator = createDecorator()
    decorator(form)
    form.submit()
  })
})
