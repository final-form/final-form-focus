import isFocusableInput from './isFocusableInput'

describe('isFocusableInput', () => {
  it('should return false for undefined', () => {
    expect(isFocusableInput(undefined)).toBe(false)
  })

  it('should return false for an object without a focus method', () => {
    expect(isFocusableInput({})).toBe(false)
    expect(isFocusableInput({ notFocus: () => { } })).toBe(false)
    expect(isFocusableInput({ focus: 'not a function' })).toBe(false)
  })

  it('should return true for an object with a focus method', () => {
    expect(isFocusableInput({ focus: () => { } })).toBe(true)
  })
}) 