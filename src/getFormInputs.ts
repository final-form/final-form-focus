import { GetInputs, FocusableInput } from './types';
import isFocusableInput from './isFocusableInput';

/**
 * Generates a function to get all the inputs in a form with the specified name
 */
const getFormInputs = (name: string): GetInputs => (): FocusableInput[] => {
  if (typeof document === 'undefined') {
    return [];
  }
  const form = document.forms.namedItem(name);
  if (!form) return [];
  return Array.prototype.slice
    .call(form.elements)
    .filter(isFocusableInput)
    .filter((el: any) => el.name && el.name.trim() !== '') // Filter out unnamed inputs
    .map((el: any) => ({
      name: String(el.name),
      focus: () => el.focus()
    }));
};

export default getFormInputs; 