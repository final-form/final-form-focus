import getAllInputs from './getAllInputs';

describe('getAllInputs', () => {
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
    expect(getAllInputs()).toEqual([]);
  });

  it('should return an empty array if no forms exist', () => {
    expect(getAllInputs()).toEqual([]);
  });

  it('should return an array of focusable inputs from all forms', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
      </form>
      <form>
        <input type="text" name="email" />
      </form>
    `;

    const inputs = getAllInputs();
    expect(inputs).toHaveLength(3);
    expect(inputs.map(input => input.name)).toEqual(['firstName', 'lastName', 'email']);
  });

  it('should ignore unnamed inputs', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" />
        <input type="text" />
      </form>
    `;

    const inputs = getAllInputs();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should ignore inputs with empty names', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" />
        <input type="text" name="" />
      </form>
    `;

    const inputs = getAllInputs();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should handle all form element types', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="text" />
        <select name="select">
          <option value="1">1</option>
        </select>
        <textarea name="textarea"></textarea>
        <button name="button">Button</button>
      </form>
    `;

    const inputs = getAllInputs();
    expect(inputs).toHaveLength(4);
    expect(inputs.map(input => input.name)).toEqual(['text', 'select', 'textarea', 'button']);
  });

  it('should ignore non-form elements', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" />
        <div name="div">Not a form element</div>
      </form>
    `;

    const inputs = getAllInputs();
    expect(inputs).toHaveLength(1);
    expect(inputs[0].name).toBe('firstName');
  });

  it('should focus the correct element when focus is called', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" />
      </form>
    `;

    const input = document.querySelector('input');
    const focusSpy = jest.spyOn(input as HTMLInputElement, 'focus');

    const inputs = getAllInputs();
    inputs[0].focus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should return an empty array if there are no forms on the page', async () => {
    document.body.innerHTML = '<div>No forms here</div>' // Set specific HTML for this test
    const { default: getAllInputsFunc } = await import('../src/getAllInputs');
    expect(getAllInputsFunc()).toEqual([]);
  })

  it('should return an empty array if forms exist but have no focusable inputs', async () => {
    document.body.innerHTML = '<form name="foo"><p>Just text</p></form><form name="bar"></form>'
    const { default: getAllInputsFunc } = await import('../src/getAllInputs');
    expect(getAllInputsFunc()).toEqual([]);
  })

  it('should return an empty array if a form contains only a button without a name', async () => {
    document.body.innerHTML = `<div>
      <form name="formWithButton">
        <button type="submit">Submit</button>
      </form>
    </div>`
    const { default: getAllInputsFunc } = await import('../src/getAllInputs');
    expect(getAllInputsFunc()).toEqual([]); // Button has no name, should be filtered
  })

  it('should return named inputs from all forms, excluding unnamed or non-focusable elements', async () => {
    document.body.innerHTML = `
      <form name="form1">
        <input name="input1_1" type="text"/>
        <button type="submit" name="btn1">Submit With Name</button>
        <button type="button">Button Without Name</button>
      </form>
      <form name="form2">
        <input name="input2_1" type="text"/>
        <select name="select2_2"></select>
        <textarea name="area2_3"></textarea>
        <div name="notAnInput"></div>
      </form>
      <div><input name="orphanInput" type="text"/></div> 
      <form name="form3">
         <input type="text" /> 
      </form>
    `
    const { default: getAllInputsFunc } = await import('../src/getAllInputs');
    const inputs = getAllInputsFunc();

    expect(inputs.length).toBe(5); // input1_1, btn1, input2_1, select2_2, area2_3

    const names = inputs.map((i: { name: string }) => i.name).sort();
    expect(names).toEqual(['area2_3', 'btn1', 'input1_1', 'input2_1', 'select2_2'].sort());

    expect(inputs.find((i: { name: string }) => i.name === 'orphanInput')).toBeUndefined();
  })
}) 