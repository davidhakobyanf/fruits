import Form from '../../../components/common/form';
import { useFormContext } from '../../../context/ToyFormDataContext.tsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditToysForm = ({ toyData = null ,id = null}) => {
  const { data, setData } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (toyData) {
      const transformedData = {
        title_am: toyData.translations?.find((t) => t.locale.locale === 'am')?.title || '',
        title_ru: toyData.translations?.find((t) => t.locale.locale === 'ru')?.title || '',
        title_en: toyData.translations?.find((t) => t.locale.locale === 'en')?.title || '',
        description_am: toyData.translations?.find((t) => t.locale.locale === 'am')?.description || '',
        description_ru: toyData.translations?.find((t) => t.locale.locale === 'ru')?.description || '',
        description_en: toyData.translations?.find((t) => t.locale.locale === 'en')?.description || '',
        metaTitle_am: toyData.translations?.find((t) => t.locale.locale === 'am')?.metaTitle || '',
        metaDescription_am: toyData.translations?.find((t) => t.locale.locale === 'am')?.metaDescription || '',
        metaTitle_ru: toyData.translations?.find((t) => t.locale.locale === 'ru')?.metaTitle || '',
        metaDescription_ru: toyData.translations?.find((t) => t.locale.locale === 'ru')?.metaDescription || '',
        metaTitle_en: toyData.translations?.find((t) => t.locale.locale === 'en')?.metaTitle || '',
        metaDescription_en: toyData.translations?.find((t) => t.locale.locale === 'en')?.metaDescription || '',
        categoryId: toyData.category?.id || null,
        ageGroups: (toyData.ageGroups || []).map((group: any) => (typeof group === 'object' ? group.id.toString() : group)),
      };
      const keysToRemove = ['category', 'id', 'createdAt', 'updatedAt', 'translations','brand','slug'];
      const cleanedData = Object.keys(toyData)
        .filter((key) => !keysToRemove.includes(key))
        .reduce((obj, key) => {
          obj[key] = toyData[key];
          return obj;
        }, {});

      setData({ ...cleanedData, ...transformedData });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [toyData, setData]);

  console.log(data,'data');



  const submitEditToy = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          let value = data[key];

          if (key === 'images' && Array.isArray(value)) {
            value = value.filter((img) => img instanceof File);
            value.forEach((image) => formData.append('images', image));
          } else if (key === 'image') {
            if (value instanceof File) {
              formData.append('image', value);
            }
          } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, value);
          }
        }
      }

      const res = await fetch(`https://api.mytoy.am/admin/toys/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! Status: ${res.status}, Response: ${errorText}`);
      }

      const result = await res.json();
      setData(result.data);
      navigate('/toys');
      return result;
    } catch (error) {
      console.error('Error submitting toy data:', error.message || error);
    } finally {
      setIsSubmitting(false);
    }
  };






  const getCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.mytoy.am/admin/categories', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.mytoy.am/admin/brands', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setBrands(data.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (name: string, value: any) => {
    const parsedValue = ['price', 'discount', 'quantity'].includes(name) ? Number(value) : value;

    setData((prevData) => ({
      ...(prevData || {}),
      [name]: parsedValue,
    }));
  };



  const handleCheckboxChange = (name: string, value: any) => {
    setData((prevData) => {
      const existingValues = prevData?.[name] || [];
      const newValue = existingValues.includes(value)
        ? existingValues.filter((v: string) => v !== value)
        : [...existingValues, value];

      return {
        ...(prevData || {}),
        [name]: newValue,
      };
    });
  };


  return (
    <Form onSubmit={submitEditToy}>
      <Form.Upload
        defaultValueImage={
          Array.isArray(data?.images) && data.images.length > 0
            ? data.images.map((item) => ({
              url: `https://api.mytoy.am/${item.image}`,
              name: item.image,
            }))
            : data?.image
              ? [{
                url: `https://api.mytoy.am/${data.image}`,
                name: data.image,
              }]
              : []
        }

      />


      <Form.LanguageMapInputs
        label="Խաղալիքի անվանումը"
        type="input"
        name="title"
        onChange={(e) => handleInputChange('translations ', e.target.value)}
      />
      <Form.LanguageMapInputs
        label="Խաղալիքի նկարագրությունը"
        type="textarea"
        name="description"
        value={data?.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        page={'create'}
      />
      <div className={'grid grid-cols-2 gap-4'}>
        <Form.Select
          label="Խաղալիքի կատեգորիա"
          options={categories.map((category) => ({ value: category.id, title: category.translations[1]?.title }))}
          value={data?.category?.title || ''}
          name={'categoryId'}
          onChange={(e) => handleInputChange('categoryId', e.target.value)}
          defaultValueSelect={data?.categoryId}

        />
        <Form.Select
          label="Խաղալիքի բռենդ"
          options={brands.map((brand) => ({ value: brand.id, title: brand.name }))}
          value={data?.brand || ''}
          onChange={(e) => handleInputChange('brand', e.target.value)}
        />
      </div>
      <div className={'grid grid-cols-3 gap-4'}>
        <Form.Input
          id="priceInput"
          label="Գին"
          value={data?.price || ''}
          onChange={(e) => handleInputChange('price', e.target.value)}
        />
        <Form.Input
          id="discountInput"
          label="Զեղչ"
          value={data?.discount || ''}
          onChange={(e) => handleInputChange('discount', e.target.value)}
        />
        <Form.Input
          id="qtyInput"
          label="Քանակ"
          value={data?.quantity || ''}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
        />
      </div>
      <div className={'grid grid-cols-2 gap-4'}>
        <div>
          <p>Age</p>
          <Form.CheckboxGroup
            fields={[
              { id: 1, label: '0-1', name: 'ageGroup', value: '1' },
              { id: 2, label: '1-3', name: 'ageGroup', value: '2' },
              { id: 3, label: '4-5', name: 'ageGroup', value: '3' },
              { id: 4, label: '6-8', name: 'ageGroup', value: '4' },
              { id: 5, label: '9-12', name: 'ageGroup', value: '5' },
              { id: 6, label: '12+', name: 'ageGroup', value: '6' },
            ]}
            selectedValues={data?.ageGroups || []}
            onChange={(e) => handleCheckboxChange('ageGroups', e.target.value)}
          />
        </div>
        <div>
          <p>Gender</p>
          <Form.RadioGroup
            fields={[
              { id: 'femaleGender', label: 'Female', name: 'gender', value: 'female' },
              { id: 'maleGender', label: 'Male', name: 'gender', value: 'male' },
              { id: 'bothGender', label: 'Both', name: 'gender', value: 'both' },
            ]}
            selectedValue={data?.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          />
        </div>
      </div>
      <Form.Input
        id="searchDataInput"
        label="Search data"
        as="textarea"
        className="w-full"
        value={data?.searchWords || ''}
        onChange={(e) => handleInputChange('searchWords', e.target.value)}
      />
      <Form.LanguageMapInputs
        label="Meta-անվանումը"
        type="input"
        name="metaTitle"
        value={data?.metaTitle || ''}
        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
        page={'create'}
      />
      <Form.LanguageMapInputs
        label="Meta-նկարագրություն"
        type="textarea"
        name="metaDescription"
        value={data?.metaDescription || ''}
        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
        page={'create'}
      />
      <Form.Button title="Փոխել" disabled={isSubmitting} />
    </Form>
  );
};

export default EditToysForm;
