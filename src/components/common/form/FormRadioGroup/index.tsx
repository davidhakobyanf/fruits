import { FormChoiceGroupProps } from '../types';
import FormChoiceGroupMap from '../abstract/FormChoiceGroupMap';
import { useFormContext } from '../../../../context/ToyFormDataContext.tsx';

const FormRadioGroup = (groupProps: FormChoiceGroupProps, selectedValues: any[]) => {
  const { data, setData } = useFormContext();

  const checked = data?.gender || '';

  const handleRadioChange = (value: string | number) => {
    setData({
      ...(data || {}),
      gender: value,
    });
  };

  return (
    <FormChoiceGroupMap
      {...groupProps}
      type="radio"
      isChecked={(value) => checked === value}
      onChange={handleRadioChange}
    />
  );
};

export default FormRadioGroup;
