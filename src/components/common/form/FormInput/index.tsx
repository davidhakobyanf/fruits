import { ComponentProps, ElementType } from 'react';
import FormField from '../abstract/FormField';
import { FormInputProps } from '../types';

const FormInput = <E extends ElementType>({
  as = 'input' as E,
  label,
  half = false,
  id,
  name,
  ...props
}: FormInputProps<E>) => {
  const Component = as;
  const componentProps = {
    name,
    ...props,
    className:
      'w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
  } as ComponentProps<E>;

  if (as === 'textarea') {
    componentProps['rows'] = 6;
  }
  return (
    <FormField
      label={label}
      htmlFor={id}
      className={`mb-4.5 w-full ${half ? 'xl:w-1/2' : ''}`}
    >
      <Component {...componentProps} />
    </FormField>
  );
};

export default FormInput;
