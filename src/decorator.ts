import { Decorator, FormApi } from 'final-form';
import { GetInputs, FindInput } from './types';
import getAllInputs from './getAllInputs';
import defaultFindInput from './findInput';

const createDecorator = (
  getInputs: GetInputs = getAllInputs,
  findInput: FindInput = defaultFindInput
): Decorator => (form: FormApi) => {
  const focusOnFirstError = (errors: Record<string, any>) => {
    if (!errors || !Object.keys(errors).length) return;
    const inputs = getInputs();
    const firstInput = findInput(inputs, errors);
    if (firstInput) {
      firstInput.focus();
    }
  };

  // Save original submit function
  const originalSubmit = form.submit;

  // Subscribe to form state changes
  const unsubscribe = form.subscribe(
    ({ submitErrors, errors }) => {
      if (errors && Object.keys(errors).length) {
        focusOnFirstError(errors);
      } else if (submitErrors && Object.keys(submitErrors).length) {
        focusOnFirstError(submitErrors);
      }
    },
    { errors: true, submitErrors: true }
  );

  // Rewrite submit function
  form.submit = () => {
    const result = originalSubmit.call(form);
    if (result && typeof result.then === 'function') {
      // async
      result.catch(() => {
        // Handle async validation errors
        const state = form.getState();
        if (state.errors && Object.keys(state.errors).length) {
          focusOnFirstError(state.errors);
        } else if (state.submitErrors && Object.keys(state.submitErrors).length) {
          focusOnFirstError(state.submitErrors);
        }
      });
    }
    return result;
  };

  return () => {
    unsubscribe();
    form.submit = originalSubmit;
  };
};

export default createDecorator; 