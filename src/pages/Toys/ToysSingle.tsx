import { FormDataProvider } from '../../context/ToyFormDataContext.tsx';
import CreateToysForm from '../../features/Toys/CreateToys';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditToysForm from '../../features/Toys/EditToys';

const SingleToyPage = () => {
  const [data, setData] = useState(null);
  const [id, setId] = useState(null);
  const token = localStorage.getItem('token');

  const getData = async () => {
    try {
      const res = await fetch(`https://api.mytoy.am/admin/toys/${id}`, { // Используем id в URL запроса
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
      setData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {

    const currentUrl = window.location.href;
    setId(currentUrl.split('/').pop())
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <FormDataProvider>
      <div className="container mx-auto p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">Toy</h1>
        <EditToysForm toyData={data}  id={id}/>
      </div>
    </FormDataProvider>
  );
};

export default SingleToyPage;
