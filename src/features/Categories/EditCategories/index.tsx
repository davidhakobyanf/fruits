import { useNavigate, useParams } from 'react-router-dom';
import Form from '../../../components/common/form';
import { useFormContext } from '../../../context/ToyFormDataContext.tsx';
import { useEffect, useState } from 'react';

const EditCategoriesForm = () => {
  const { data, setData } = useFormContext();
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitEditCategory = async (event: React.FormEvent) => {
    // event.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          let value = data[key];
          if (key === 'image') {
            if (value instanceof File) {
              formData.append('image', value);
            }else if (value === null) {
              formData.append('image', '');
            }
          }else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, value);
          }
        }
      }
      console.log(formData,'formData');
      const res = await fetch(`https://api.mytoy.am/admin/categories/update/${slug}`, {
        method: 'PUT',
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
      navigate('/categories');
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getDataCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api.mytoy.am/admin/categories/main`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const fetchData = await res.json();
      const categories = fetchData.data.map(item => {
        const amTranslation = item.translations.find(translation => translation.locale.locale === "am");
        return amTranslation ? { value: item.id, title: amTranslation.title } : null;
      }).filter(Boolean);
      setAllCategories(categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api.mytoy.am/admin/categories/${slug}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const fetchedData = await res.json();
      console.log('Fetched data before transformation:', fetchedData);

      const transformedData = {
        ...fetchedData.data,
         title_am: fetchedData.data.translations.find(t => t.locale.locale === 'am')?.title || '',
         title_ru: fetchedData.data.translations.find(t => t.locale.locale === 'ru')?.title || '',
         title_en: fetchedData.data.translations.find(t => t.locale.locale === 'en')?.title || '',
        ...(fetchedData.data.parent?.id ? { parentId: fetchedData.data.parent.id } : {}),
      };
      delete transformedData.parent;
      delete transformedData.translations;
      delete transformedData.createdAt;
      delete transformedData.updatedAt;
      delete transformedData.slug;
      delete transformedData.toys;
      delete transformedData.id;
      console.log('Transformed data:', transformedData);

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getData();
    getDataCategories();
  }, []);
  console.log(
    data,'data'
  );
  console.log(data?.showInHomeSlider,'data?.showInHomeSlider');
  return (
    <Form onSubmit={submitEditCategory}>
      <Form.Upload
        name="image"
        defaultValueImage={
          data?.image
              ? [{
                url: `https://api.mytoy.am/${data.image}`,
                name: data.image,
              }]
              : []
        }
      />
      <Form.LanguageMapInputs
        label="Կատեգորիայի անվանումը"
        type="input"
        name="title"
        value={data?.translations || {}}
      />
      {data?.parentId &&    <Form.Select
        label={'Ծնող կատեգորիա'}
        name={'parentId'}
        id={`id`}
        options={allCategories || []}
        placeholder={'select'}
        type={'parentId'}
        defaultValueSelect={data?.parentId}
      />}

      <Form.CheckboxGroup
        name="showInHomeSlider"
        direction="horizontal"
        fields={[{ id: 'showHomePage1', name: 'showInHomeSlider', label: 'Ցույց տալ գլխավոր էջը', value: 1 }]}
        selectedValues={data?.showInHomeSlider || false}

      />

      <Form.Button title="Փոխել" disabled={isSubmitting} />
    </Form>
  );
};

export default EditCategoriesForm;
