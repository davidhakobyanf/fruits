import { locales } from '../../../../constants/Languages';
import FormInput from '../FormInput';
import { FormLanguageMapInputsProps } from '../types';
import { useFormContext } from '../../../../context/ToyFormDataContext.tsx';

const FormLanguageMapInputs = ({
                                 type = 'input',
                                 label,
                                 name,
                               }: FormLanguageMapInputsProps) => {
  const { data, setData } = useFormContext();

  const handleInputChange = (locale: string, value: string) => {
    // console.log(`[handleInputChange] Locale: ${locale}, Value: ${value}`);
    setData((prevData) => {
      const updatedData = {
        ...prevData,
        [`${name}_${locale}`]: value,
      };
      // console.log('[handleInputChange] Updated Data:', updatedData);
      return updatedData;
    });
  };

  // console.log('[FormLanguageMapInputs] Render Start');
  // console.log('[FormLanguageMapInputs] Current Data:', data);

  return (
    <div className="flex row gap-6">
      {locales.map((locale) => {
        // console.log(`[FormLanguageMapInputs] Processing Locale: ${locale}`);

        const currentTranslation = data?.translations?.find(
          (t) => t.locale.locale === locale
        );
        const defaultValue =
          currentTranslation?.[name] || data?.[`${name}_${locale}`] || '';

        // console.log(
        //   `[FormLanguageMapInputs] Default Value for ${name}_${locale}:`,
        //   defaultValue
        // );

        return (
          <FormInput
            key={locale}
            as={type}
            onChange={(e) => handleInputChange(locale, e.target.value)}
            id={`${name}_${locale}`}
            name={`${name}_${locale}`}
            label={`${label} (${locale.toUpperCase()})`}
            defaultValue={defaultValue}
          />
        );
      })}
      {/*{console.log('[FormLanguageMapInputs] Render End')}*/}
    </div>
  );
};

export default FormLanguageMapInputs;
