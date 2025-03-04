import { useNavigate } from 'react-router-dom';
import Form from '../../../components/common/form';
import { useFormContext } from '../../../context/ToyFormDataContext.tsx';
import { useEffect, useState } from 'react';
import CustomUpload from '../../../components/common/form/FormMultiUpload';

const CreateCategoriesForm = () => {
  const { data, setData } = useFormContext();
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([])
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

  const submitCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in data) {
        console.log(`Appending field: ${key}, Value:`, data[key]);
        formData.append(key, data[key]);
      }

      const res = await fetch("https://api.mytoy.am/admin/categories/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorResponse = await res.text(); // Считываем тело ответа при ошибке
        console.error(`Error response: ${errorResponse}`); // Логируем тело ошибки
        throw new Error(`HTTP error! Status: ${res.status}, Body: ${errorResponse}`);
      }

      const result = await res.json();
      setData(result.data);
      navigate("/categories");
      return result;
    } catch (error) {
      console.error("Error occurred while creating category:", error);
    }
  };

  const handleInputChange = (locale: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      title: {
        ...prevData?.title,
        [locale]:value
      },
      translations: prevData?.translations?.map((translation: any) =>
        translation.locale.locale === locale
          ? { ...translation, [name]: value }
          : translation
      ) || []
    }));
  };

  const handleFileChange = (file: File) => {
    setData((prevData: any) => ({
      ...(prevData || {}),
      image: file[0],
    }));
  };
  const handleInputChangeDiscount = (name: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [name]:value
    }));
  };
  useEffect(() => {
    getDataCategories();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data])
  return (
    <Form onSubmit={submitCreateCategory}>
      <Form.Upload name="image" onChange={handleFileChange} />
      <Form.LanguageMapInputs
        label="Կատեգորիայի անվանումը"
        type="input"
        name="title"
        newData = 'true'
        onChange={(key, value) => handleInputChange(key, value)}
        page={'create'}
        value={data?.title || {}}
      />

      <Form.Select
        label={'Ծնող կատեգորիա'}
        name={'parentId'}
        id={`id`}
        options={allCategories || []}
        placeholder={'select'}
        type={'parentId'}
      />
      <Form.CheckboxGroup
        name="showInHomeSlider"
        direction="horizontal"
        fields={[{ id: 'showHomePage1', name: 'showInHomeSlider', label: 'Ցույց տալ գլխավոր էջը', value: 1 }]}
        selectedValues={data?.showInHomeSlider || false}
      />

      <Form.Button title="Ստեղծել" />
    </Form>
  );
};

export default CreateCategoriesForm;
