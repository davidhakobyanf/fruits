import { useEffect, useState } from 'react';
import PageContainer from '../../components/common/Containers/PageContainer';
import { NavLink } from 'react-router-dom';

const Toys = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  const getData = async () => {
    try {
      const res = await fetch('https://api.mytoy.am/admin/toys/', {
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

  const deleteToy = async (
    e: React.MouseEvent<HTMLButtonElement>,
    toy: any,
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://api.mytoy.am/admin/toys/delete/${toy.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete toy: ${res.statusText}`);
      }

      const data = await res.json();

      setData((data) => data.filter((t) => t.id !== toy.id));
    } catch (error) {
      console.error('Error deleting toy:', error);
    }
  };

  useEffect(() => {
    getData();
    console.log(data, 'data');
  }, []);
  console.log(data,'data');
  return (
    <PageContainer title="Խաղալիքներ">
      <NavLink
        className={
          'text-white bg-blue-700 p-3 rounded-lg ml-auto mb-5 block w-fit'
        }
        to={'/toys/create'}
      >
        Add New Toy
      </NavLink>
      <div>
        <div
          className={
            'w-max p-3 flex place-content-center place-items-center gap-5 bg-slate-200'
          }
        >
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Id
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Image
            </p>
          </div>
          <div className={'w-[300px] col-span-3 block '}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Name
            </p>
          </div>
          <div className={'w-[400px] col-span-4 block'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Description
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Price
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Discount
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Age
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Category
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Brand
            </p>
          </div>
          <div className={'w-[100px]'}>
            <p
              className={
                'block w-full text-start text-[18px] font-semibold text-black'
              }
            >
              Created at
            </p>
          </div>
          <div className={'w-[100px]'}></div>
        </div>
        {data?.map((el, key) => (
          <figure
            key={key}
            className={
              'w-max px-3 py-5 flex place-content-center place-items-center gap-5'
            }
          >
            <NavLink key={key}
                     to={`${el?.id}`}>
              <figure
                className={
                  'w-max px-3 py-5 flex place-content-center place-items-center gap-5'
                }
              >
                <div className={'w-[100px]'}>
                  <p
                    className={
                      'block w-full text-start text-[18px] font-semibold text-black'
                    }
                  >
                    #{el.id}
                  </p>
                </div>
                <img className={'w-[100px] aspect-square object-cover'} src={`https://api.mytoy.am/${el.image}`} />
                <div className={'w-[300px]'}>
                  <p className={'block text-start'}>
                    {el?.translations?.map((el: any) => <p>{el.title}</p>)}
                  </p>
                </div>
                <div className={'w-[400px]'}>
                  <p className={'block text-start '}>
                    {el?.translations?.[1].description}
                  </p>
                </div>
                <div className={'w-[100px]'}>
                  <p className={'block text-start '}>{el.price} Դ</p>
                </div>
                <div className={'w-[100px]'}>
                  <p className={'block text-start '}>{el.discount}%</p>
                </div>
                <div className={'w-[100px]'}>
                  <p className={'block text-start '}>
                    {el?.ageGroups?.map((el: any) => <p>{el.value}</p>)}
                  </p>
                </div>
                <div className={'w-[100px]'}>
                  <p className={'block text-start '}>
                    {el?.category.translations?.map((el: any) => <p>{el.title}</p>)}
                  </p>
                </div>
                <div className={'w-[100px]'}>
                  {/*<p className={'block text-start '}>{el.brand.translations?.[1].title}</p>*/}
                </div>
                <div className={'w-[100px]'}>
                  <p className={'block text-start '}>{new Date(el.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </figure>
            </NavLink>
            <div className={'w-[100px]'}>
              <button
                onClick={(e) => deleteToy(e, el)}
                className={
                  'text-white w-[80px] py-2 mb-2 mx-auto rounded-md block bg-red-700'
                }
              >
                Delete
              </button>
              <NavLink
                to={`${el?.id}`}
                className={
                  'text-white w-[80px] py-2 mb-2 mx-auto rounded-md flex justify-center items-center bg-green-700'
                }
              >
                Edit
              </NavLink>
            </div>
          </figure>
        ))}
      </div>
    </PageContainer>
  );
};

export default Toys;
