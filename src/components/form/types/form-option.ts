export type FormOption = {
  key: string;
  label: string;
};

interface FormBaseOptionProps {
  options: FormOption[];
  selectOption: (option: FormOption) => void;
  placeholder?: string | undefined | null;
  addOption?:
    | {
        label: string;
        onClick: () => void;
      }
    | undefined
    | null;
}

export interface FormSingleOptionProps extends FormBaseOptionProps {
  selectedOption: FormOption | null;
}

export interface FormMultiOptionProps extends FormBaseOptionProps {
  selectedOption: FormOption[];
}
