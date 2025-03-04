import { useEffect, useState } from 'react';
import PageContainer from '../../components/common/Containers/PageContainer';
import { NavLink } from 'react-router-dom';

const Categories = () => {
  const [data, setData] = useState(null);

  const getData = async () => {
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
      setData(data.data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="Կատեգորիաներ" >
      <NavLink className={'text-white bg-blue-700 p-3 rounded-lg ml-auto mb-5 block w-fit'} to={'/categories/create'}>
        Add New Category
      </NavLink>
      <div className="overflow-auto touch-pan-y touch-pan-x">
        <div className="p-3 place-content-center place-items-center gap-5 bg-slate-200 grid grid-cols-7 min-w-[900px]">
          <div className={'w-full'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Image
            </p>
          </div>
          <div className={'w-full col-span-3 block '}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Name
            </p>
          </div>
          <div className={'w-full'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Discount
            </p>
          </div>
          <div className={'w-full'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Created at
            </p>
          </div>
        </div>
        {data?.map((el, key) => (
          <NavLink
            key={key}
            to={`${el?.id}`}
            className="w-full px-3 py-5 place-content-center place-items-center gap-5 grid grid-cols-7  min-w-[900px]"
          >
            <img
              className="w-full aspect-square block object-cover"
              src={`https://api.mytoy.am/${el.image}` || ''}
              alt={`${el?.slug}` || 'img is not defined'}
            />
            <div className="w-full col-span-3">
              <p className="block text-start ">
                {el.translations?.[1]?.title || 'unsetted'}
              </p>
            </div>
            <div className="w-full">
              <p className="block text-start ">
                {el.toys?.[0]?.discount || 'unsetted'}
              </p>
            </div>
            <div className="w-full">
              <p className="block text-start ">
                {new Date(el.createdAt).toLocaleDateString('en-GB') || 'unsetted'}
              </p>
            </div>
            <div className="w-full">
              <button className="text-white w-[80px] py-2 mb-2 mx-auto rounded-md block bg-green-700">
                Edit
              </button>
            </div>
          </NavLink>
        ))}
      </div>
      {/* <div className={'bg-black/50 fixed h-full w-full flex justify-center items-center'}>
        <div className={'bg-white w-[200px] h-[200px] '}>
        </div>
      </div> */}
    </PageContainer>
  );
};

export default Categories;
