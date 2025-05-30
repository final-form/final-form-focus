import { GetInputs, FocusableInput } from './types';
import isFocusableInput from './isFocusableInput';

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement;

/**
 * Type guard to check if an element is a form element with name and focus
 */
const isNamedFormElement = (element: Element): element is FormElement => {
  return (
    (element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLButtonElement) &&
    element.name !== undefined &&
    typeof element.name === 'string' &&
    element.name !== '' &&
    typeof element.focus === 'function'
  );
};

/**
 * Gets all the inputs inside all forms on the page
 */
const getAllInputs: GetInputs = (): FocusableInput[] => {
  if (typeof document === 'undefined') {
    return [];
  }

  return Array.from(document.forms).reduce<FocusableInput[]>((accumulator, form) => {
    const formElements = Array.from(form.elements)
      .filter(isNamedFormElement)
      .filter(isFocusableInput)
      .map(element => ({
        name: element.name,
        focus: () => element.focus()
      }));

    return accumulator.concat(formElements);
  }, []);
};

export default getAllInputs; 