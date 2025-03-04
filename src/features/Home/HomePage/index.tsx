import Form from '../../../components/common/form';
import { useFormContext } from '../../../context/ToyFormDataContext.tsx';
import { useEffect, useState } from 'react';
import Loader from '../../../components/common/Loader';

const CreateHome = () => {
  const { data, setData } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Состояние для загрузки данных
  const [existingData, setExistingData] = useState(null);
  const [hasNewImages, setHasNewImages] = useState(false); // Состояние для отслеживания новых изображений

  const fetchData = async () => {
    setIsFetching(true); // Начинаем загрузку данных
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.mytoy.am/admin/home/slider', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const result = await res.json();
      if (result?.data) {
        setExistingData(result.data);
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const url = 'https://api.mytoy.am/admin/home/slider/create';

      // Фильтруем только новые изображения (бинарные данные)
      const newImages = data.images.filter((image) => image instanceof File);

      // Создаем массив промисов для каждого нового изображения
      const uploadPromises = newImages.map(async (image) => {
        const formData = new FormData();
        formData.append('image', image);

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return res.json();
      });

      // Ждем завершения всех промисов
      await Promise.all(uploadPromises);

      // После успешной отправки сбрасываем данные и запрашиваем их заново
      setExistingData(null);
      setData({ images: [] });
      setHasNewImages(false); // Сбрасываем состояние новых изображений
      await fetchData(); // Повторный запрос данных
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (files: FileList) => {
    const newFiles = Array.from(files);
    setData((prevData) => ({
      ...(prevData || {}),
      images: [...(prevData?.images || []), ...newFiles],
    }));

    // Проверяем, есть ли новые файлы
    if (newFiles.length > 0) {
      setHasNewImages(true);
    }
  };

  useEffect(() => {
    if (data?.images) {
      const hasNewFiles = data.images.some((image) => image instanceof File);
      setHasNewImages(hasNewFiles);
    }
  }, [data]);

  console.log(existingData, 'existingData');
  console.log(data, 'data');

  // Отображаем Loader, если данные загружаются или отправляются
  if (isFetching || isSubmitting) {
    return <Loader />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Upload
        onChange={handleFileChange}
        defaultValueImage={
          Array.isArray(data) && data.length > 0
            ? data.map((item) => ({
              id: item.id,
              url: `https://api.mytoy.am/${item.image}`,
              name: item.image,
            }))
            : []
        }
        isSlider={true}
        token={localStorage.getItem('token')}
      />
      {(hasNewImages ) && (
        <Form.Button
          title={existingData?.length ? 'Թարմացնել' : 'Ստեղծել'}
          disabled={isSubmitting}
        />
      )}
    </Form>
  );
};

export default CreateHome;