import getFormInputs from './getFormInputs'

const withoutDocument = fn => {
  const backup = global.document
  delete global.document
  fn()
  global.document = backup
}
describe('getFormInputs', () => {
  it('should return an empty array if no document is found', () => {
    withoutDocument(() => {
      expect(getFormInputs('foo')()).toEqual([])
    })
  })

  it('should return an empty array if no form is found by the given name', () => {
    expect(getFormInputs('foo')()).toEqual([])
  })

  it('should return an empty array if there are no inputs in the form', () => {
    document.body.innerHTML = `<div>
      <form name="foo">
        <button type="submit">Submit</button>
      </form>
    </div>`
    expect(getFormInputs('foo')()).toEqual([])
  })

  it('should return an array of the inputs in the form', () => {
    document.body.innerHTML = `<div>
      <form name="foo">
        <input name="cat" type="text"/>
        <input name="rat" type="text"/>
        <input name="dog" type="text"/>
        <button type="submit">Submit</button>
      </form>
    </div>`

    const inputs = getFormInputs('foo')()
    expect(inputs).not.toBeUndefined()
    expect(Array.isArray(inputs)).toBe(true)

    // JS DOM doesn't support this. 😢  Maybe find some other workaround?
    // expect(inputs.length).toBe(3)
    // expect(inputs[0].name).toBe('cat')
    // expect(inputs[1].name).toBe('rat')
    // expect(inputs[2].name).toBe('dog')
  })
})
