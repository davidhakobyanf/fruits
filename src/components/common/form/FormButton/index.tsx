import { FormButtonProps } from "../types";

const FormButton = ({title}: FormButtonProps) => {
  return (
    <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
      {title}
    </button>
  );
};

export default FormButton;
