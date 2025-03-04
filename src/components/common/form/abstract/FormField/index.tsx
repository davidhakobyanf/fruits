import { FormFieldProps } from '../../types';

const FormField = ({ children, label, htmlFor, className = "" }: FormFieldProps) => {
  return (
    <div className={className}>
      <label className="mb-2.5 block text-black dark:text-white" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
};

export default FormField;
