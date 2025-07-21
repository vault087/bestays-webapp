export type FormOption = {
  key: string;
  label: string;
};

export interface FormBaseOptionProps {
  options: FormOption[];
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
  selectOption: (option: FormOption) => void;
}

export interface FormMultiOptionProps extends FormBaseOptionProps {
  selectedOptions: FormOption[] | null;
  toggleOption: (option: FormOption, selected: boolean) => void;
}
