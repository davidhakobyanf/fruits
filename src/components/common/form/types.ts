import { ElementType } from 'react';
import {
  ChildrenProps,
  ClassNameProps,
  PolymorphicElementProps,
} from '../../../types/common';

interface FormProps extends ChildrenProps {
  onSubmit: (data: Record<string, any>, formData: FormData) => void;
}

interface FormFieldProps extends ChildrenProps, ClassNameProps {
  label: string;
  htmlFor: string;
}

interface FormInputSharedProps {
  label: string;
  name: string;
  half?: boolean;
  id: string;
}

type FormInputProps<E extends ElementType> = PolymorphicElementProps<E, FormInputSharedProps>;

interface FormSelectProps {
  label: string;
  name: string;
  options: { title: string; value: string }[];
  placeholder: string;
  id: string;
  type: string
}

interface FormMultiSelectProps {
  label: string;
  name: string;
  options: { title: string; value: string }[];
  id: string;
}
enum GenderEnum {
  Female = 'female',
  Male = 'male',
  Both = 'both',
}

enum AgeGroupEnum {
  ZeroToOne = '0-1',
  OneToThree = '1-3',
  FourToFive = '4-5',
  SixToEight = '6-8',
  NineToTwelve = '9-12',
  TwelvePlus = '12+',
}

interface CreateToyProps {
  name_am: string,
  name_ru: string,
  name_en: string,
  description_am: string,
  description_ru: string,
  description_en: string,
  categoryId: number,
  brandId: number,
  price: number,
  discount: number,
  quantity: number,
  ageGroups: GenderEnum,
  gender: AgeGroupEnum,
}


interface FormCheckboxProps {
  label: string;
  name: string;
  id: string;
  checked?: boolean;
  value: string;
  onChange: () => void;
}

interface FormChoiceGroupProps {
  fields: Omit<FormCheckboxProps, 'onChange'>[];
  direction?: 'vertical' | 'horizontal';
}

interface FormUploadProps {
  name: string;
}

interface FormLanguageMapInputsProps {
  type: 'input' | 'textarea';
  label: string;
  name: string;
}

interface FormButtonProps {
  title: string;
}

interface FormChoiceGroupMapProps {
  type: 'radio' | 'checkbox';
  isChecked: (field: number | string) => boolean;
  onChange: (field: number | string) => void;
  fields: Omit<FormCheckboxProps, 'onChange'>[];
  direction?: 'vertical' | 'horizontal';
}

export type {
  FormProps,
  FormFieldProps,
  FormInputProps,
  FormSelectProps,
  FormMultiSelectProps,
  FormCheckboxProps,
  FormChoiceGroupProps,
  FormUploadProps,
  FormLanguageMapInputsProps,
  FormButtonProps,
  FormChoiceGroupMapProps,
  CreateToyProps
};
