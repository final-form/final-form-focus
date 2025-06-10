import { Decorator, FormState } from 'final-form'

type FocusableInput = {
    name: string,
    focus: () => void,
}

type GetInputs = () => FocusableInput[]
type FindInput = (inputs: FocusableInput[], errors: FormState['errors']) => FocusableInput[]

declare const createDecorator: (getInputs?: GetInputs, findInput?: FindInput) => Decorator
declare const getFormInputs: (name: string) => GetInputs

export default createDecorator
export { getFormInputs }
