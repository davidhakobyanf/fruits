import Form from '../../../components/common/form';
import { useFormContext } from '../../../context/ToyFormDataContext.tsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateToysForm = ({ toyData = null }) => {
  const { data, setData } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add isSubmitting state

  useEffect(() => {
    if (toyData) {
      const titles = toyData.translations?.map((translation) => translation.title) || [];
      const descriptions = toyData.translations?.map((translation) => translation.description) || [];
      const metaTitles = toyData.translations?.map((translation) => translation.metaTitle) || [];
      const metaDescriptions = toyData.translations?.map((translation) => translation.metaDescription) || [];

      setData({
        title: titles,
        description: descriptions,
        category: toyData.category?.translations[0] || '',
        brand: toyData.brand || '',
        price: toyData.price || '',
        discount: toyData.discount || '',
        quantity: toyData.quantity || '',
        ageGroups: toyData.ageGroups || [],
        gender: toyData.gender || '',
        searchWords: toyData.searchWords || '',
        metaTitle: metaTitles,
        metaDescription: metaDescriptions,
        image: toyData.image || ''
      });

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [toyData, setData]);
  console.log(data,'data');
  console.log(toyData,'toyData');
  const submitCreateToy = async (event: React.FormEvent) => {
    // event.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      for (const key in data) {
        let value = data[key];

        if (key === 'images') {
          // Пробежаться по каждому файлу из массива data[key]
          data[key].forEach((element, index) => {
            // Добавляем каждый файл по отдельности в FormData с одинаковым ключом 'images'
            formData.append('images', element);
          });
        }else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        }
        else{
          if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
          }
        }
      }

      const res = await fetch('https://api.mytoy.am/admin/toys/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const result = await res.json();
      setData(result.data);

      navigate('/toys');
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
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
      console.log(data);
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

  const handleFileChange = (file: FileList) => {
    setData((prevData) => ({
      ...(prevData || {}),
      image: file[0],
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
    <Form onSubmit={submitCreateToy}>
      <Form.Upload onChange={handleFileChange} />
      {/*<Form.Upload name="images" onChange={handleFileChange} />*/}
      <Form.LanguageMapInputs
        label="Խաղալիքի անվանումը"
        type="input"
        name="title"
        value={data?.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        page={'create'}
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
              { id: 1, label: '0-1', name: 'ageGroup', value: '0-1' },
              { id: 2, label: '1-3', name: 'ageGroup', value: '1-3' },
              { id: 3, label: '4-5', name: 'ageGroup', value: '4-5' },
              { id: 4, label: '6-8', name: 'ageGroup', value: '6-8' },
              { id: 5, label: '9-12', name: 'ageGroup', value: '9-12' },
              { id: 6, label: '12+', name: 'ageGroup', value: '12+' },
            ]}
            selectedValues={data?.ageGroup || []}
            onChange={(e) => handleCheckboxChange('ageGroup', e.target.value)}
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
      <Form.Button title="Ստեղծել" disabled={isSubmitting} />
    </Form>
  );
};

export default CreateToysForm;
