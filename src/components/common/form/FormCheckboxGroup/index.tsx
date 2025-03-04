import { useFormContext } from '../../../../context/ToyFormDataContext.tsx';
import { FormChoiceGroupProps } from '../types';
import FormChoiceGroupMap from '../abstract/FormChoiceGroupMap';

const FormCheckboxGroup = (groupProps: FormChoiceGroupProps) => {
  const { data, setData } = useFormContext();
  const { name } = groupProps;

  const checked = name === 'showInHomeSlider'
    ? data?.showInHomeSlider === (1 || true)
    : data?.ageGroups || [];

  const handleCheckboxChange = (id: string) => {
    if (name === 'showInHomeSlider') {
      const newValue = data?.showInHomeSlider ? 0 : 1;
      setData({ ...data, showInHomeSlider: newValue });

    } else {
      const updatedChecked = checked.includes(id)
        ? checked.filter((itemId: string) => itemId !== id)
        : [...checked, id];

      setData({ ...data, ageGroups: updatedChecked });
    }
  };

  const isChecked = (id: string) => {
    if (name === 'showInHomeSlider') {
      return data?.showInHomeSlider === 1 || data?.showInHomeSlider === true;
    }
    return (data?.ageGroups || []).includes(id);
  };

  return (
    <FormChoiceGroupMap
      {...groupProps}
      type="checkbox"
      isChecked={isChecked}
      onChange={handleCheckboxChange}
    />
  );
};

export default FormCheckboxGroup;
