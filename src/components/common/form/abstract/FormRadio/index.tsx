import { FormCheckboxProps } from '../../types';

const FormRadio = ({
  id,
  label,
  name,
  checked = false,
  value,
  onChange
}: FormCheckboxProps) => {

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="radio"
            id={id}
            name={name}
            checked={checked}
            className="sr-only"
            value={value}
            onChange={onChange}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
              checked && 'border-primary'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                checked && '!bg-primary'
              }`}
            >
              {' '}
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default FormRadio;
