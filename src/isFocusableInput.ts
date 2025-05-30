/**
 * Predicate to identify inputs that can have focus() called on them
 */
const isFocusableInput = (element: any): element is { focus: () => void } => {
  if (!element || typeof element.focus !== 'function') {
    return false;
  }

  // Check if it's a form element that can be focused
  if (element instanceof HTMLElement) {
    // Hidden inputs and disabled inputs should not be focusable
    if (
      (element instanceof HTMLInputElement && element.type === 'hidden') ||
      element.hasAttribute('disabled')
    ) {
      return false;
    }
  }

  return true;
};

export default isFocusableInput; 