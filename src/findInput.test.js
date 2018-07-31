import findInput from './findInput'

const errors = { erroneousPath: 'errorMessage' }
const nonErroneousElement = { name: 'noerror', focus: () => {} }
const erroneousElement = { name: 'erroneousPath', focus: () => {} }

describe('findInput', () => {
  it('should return undefined when an empty array is given', () => {
    expect(findInput([], errors)).toEqual(undefined)
  })

  it('should return undefined when an empty error object is given', () => {
    expect(findInput([erroneousElement, nonErroneousElement], {})).toEqual(
      undefined
    )
  })

  it('should return undefined when there is no element for any of the error paths', () => {
    expect(findInput([nonErroneousElement], errors)).toEqual(undefined)
  })

  it('should return the correct element for the error path', () => {
    expect(findInput([erroneousElement, nonErroneousElement], errors)).toEqual(
      erroneousElement
    )
  })
})
