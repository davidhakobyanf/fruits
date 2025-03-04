import { FormEvent } from 'react';
import { FormProps } from './types';
import FormUpload from './FormUpload';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormMultiSelect from './FormMultiSelect';
import FormButton from './FormButton';
import FormLanguageMapInputs from './FormLanguageMapInputs';
import { transformLocalizedValues } from '../../../utils/transformLocalizedValues';
import FormCheckboxGroup from './FormCheckboxGroup';
import FormRadioGroup from './FormRadioGroup';

const Form = ({ children, onSubmit }: FormProps) => {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const localizedData = transformLocalizedValues(formData);
    

    onSubmit(localizedData, formData);
  }
  return <form onSubmit={handleSubmit}>{children}</form>;
};

Form.CheckboxGroup = FormCheckboxGroup;
Form.RadioGroup = FormRadioGroup;
Form.Upload = FormUpload;
Form.Input = FormInput;
Form.Select = FormSelect;
Form.MultiSelect = FormMultiSelect;
Form.LanguageMapInputs = FormLanguageMapInputs;
Form.Button = FormButton;

export default Form;
