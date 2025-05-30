export interface FocusableInput {
  name: string;
  focus: () => void;
}

export type GetInputs = () => FocusableInput[];

export type FindInput = (inputs: FocusableInput[], state: Record<string, any>) => FocusableInput | undefined; 