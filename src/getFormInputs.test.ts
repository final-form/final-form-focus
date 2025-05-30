import getFormInputs from './getFormInputs';

describe('getFormInputs', () => {
  let originalDocument: Document;

  beforeEach(() => {
    originalDocument = global.document;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  it('should return an empty array if no document is found', async () => {
    // @ts-expect-error - We know what we're doing here for testing purposes
    global.document = undefined;
    expect(getFormInputs('anyForm')()).toEqual([]);
  });

  it('should return an empty array if form is not found', () => {
    expect(getFormInputs('nonexistentForm')()).toEqual([]);
  });

  it('should return an array of focusable inputs from the specified form', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
      </form>
      <form name="otherForm">
        <input type="text" name="email" />
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(2);
    expect(inputs.map(input => input.name)).toEqual(['firstName', 'lastName']);
  });

  it('should ignore unnamed inputs', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="text" />
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should ignore inputs with empty names', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="text" name="" />
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should handle all form element types', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="text" />
        <select name="select">
          <option value="1">1</option>
        </select>
        <textarea name="textarea"></textarea>
        <button name="button">Button</button>
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(4);
    expect(inputs.map(input => input.name)).toEqual(['text', 'select', 'textarea', 'button']);
  });

  it('should ignore non-form elements', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <div name="div">Not a form element</div>
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should focus the correct element when focus is called', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
      </form>
    `;

    const input = document.querySelector('input');
    const focusSpy = jest.spyOn(input as HTMLInputElement, 'focus');

    const inputs = getFormInputs('testForm')();
    inputs[0].focus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should handle non-focusable inputs', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="hidden" name="hiddenField" />
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should convert non-string names to strings', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="text" />
      </form>
    `;

    // @ts-expect-error - Testing edge case where name is not a string
    document.querySelector('input[type="text"]:not([name])').name = 123;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(2);
    expect(inputs.map(input => input.name)).toEqual(['firstName', '123']);
  });

  it('should handle disabled inputs', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="text" name="lastName" disabled />
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should handle readonly inputs', () => {
    document.body.innerHTML = `
      <form name="testForm">
        <input type="text" name="firstName" />
        <input type="text" name="lastName" readonly />
      </form>
    `;

    const inputs = getFormInputs('testForm')();
    expect(inputs).toHaveLength(2);
    expect(inputs.map(input => input.name)).toEqual(['firstName', 'lastName']);
  });

  it('should return an empty array if no form is found by the given name', async () => {
    document.body.innerHTML = ''; // Ensures no forms exist
    expect(getFormInputs('nonExistentForm')()).toEqual([]);
  });

  it('should return an empty array if there are no inputs in the form', async () => {
    document.body.innerHTML = `<div>
      <form name="foo">
        <button type="submit">Submit</button>
      </form>
    </div>`
    expect(getFormInputs('foo')()).toEqual([])
  })

  it('should return an array of the inputs in the form', async () => {
    document.body.innerHTML = `<div>
      <form name="foo">
        <input name="cat" type="text"/>
        <input name="rat" type="text"/>
        <input name="dog" type="text"/>
        <button type="submit" name="btnSubmit">Submit</button> 
      </form>
    </div>`
    const inputs = getFormInputs('foo')()
    expect(inputs).not.toBeUndefined()
    expect(Array.isArray(inputs)).toBe(true)
    expect(inputs.length).toBe(4); // cat, rat, dog, btnSubmit
    const names = inputs.map((i: { name: string }) => i.name).sort();
    expect(names).toEqual(['btnSubmit', 'cat', 'dog', 'rat'].sort());
  })
}) 