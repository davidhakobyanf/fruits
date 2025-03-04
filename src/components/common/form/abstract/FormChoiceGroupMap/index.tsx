import { FormChoiceGroupMapProps } from "../../types";
import FormCheckbox from "../FormCheckbox";
import FormRadio from "../FormRadio";


const FormChoiceGroupMap = ({
  fields,
  isChecked,
  onChange,
  type,
  direction = "vertical"
}: FormChoiceGroupMapProps) => {
  const ChoiceComponent = type === 'radio' ? FormRadio : FormCheckbox;
  const directionClass = "flex" + (direction === "vertical" ? "-col" : "-row");

  return (
    <div className={`flex ${directionClass} gap-5.5 p-6.5`}>
      {fields.map((field) => (
        <ChoiceComponent
          key={field.id}
          {...field}
          checked={isChecked(field.value)}
          onChange={() => onChange(field.value)}
        />
      ))}
    </div>
  );
};

export default FormChoiceGroupMap;
