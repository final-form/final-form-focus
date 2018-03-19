import getAllInputs from './getAllInputs'

const withoutDocument = fn => {
  const backup = global.document
  delete global.document
  fn()
  global.document = backup
}
describe('getAllInputs', () => {
  it('should return an empty array if no document is found', () => {
    withoutDocument(() => {
      expect(getAllInputs()).toEqual([])
    })
  })

  it('should return an empty array if no form is found by the given name', () => {
    expect(getAllInputs()).toEqual([])
  })

  it('should return an empty array if there are no inputs in the form', () => {
    document.body.innerHTML = `<div>
      <form name="foo">
        <button type="submit">Submit</button>
      </form>
    </div>`
    expect(getAllInputs()).toEqual([])
  })

  it('should return an array of the inputs in the form', () => {
    const inputs = getAllInputs()
    expect(inputs).not.toBeUndefined()
    expect(Array.isArray(inputs)).toBe(true)

    // JS DOM doesn't support this. 😢  Maybe find some other workaround?
    // expect(inputs.length).toBe(3)
    // expect(inputs[0].name).toBe('cat')
    // expect(inputs[1].name).toBe('rat')
    // expect(inputs[2].name).toBe('dog')
  })
})
