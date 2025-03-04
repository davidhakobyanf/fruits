import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const res = await fetch("https://api.mytoy.am/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseBody = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const { data } = JSON.parse(responseBody);
      setProfiles(data); // Set all profiles
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  };

  const formatDateTime = (isoString) => {
    try {
      return format(new Date(isoString),'yyyy-MM-dd HH:mm');
    }catch (error) {
      console.error("Error formatting date:", error);
      return isoString;
    }
  }
  useEffect(() => {
    getData();
  }, []);
  console.log(profiles,'profiles');
  return (
    <>
      <Breadcrumb pageName="Profile List" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className={'grid p-3 grid-cols-9 place-content-center place-items-center gap-5 bg-slate-300'}>
          <div className={'w-full col-span-2 block '}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Name
            </p>
          </div>
          <div className={'w-full col-span-3 block'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Email
            </p>
          </div>
          <div className={'w-full col-span-2 block'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Phone Number
            </p>
          </div>
          <div className={'w-full'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Address
            </p>
          </div>
          <div className={'w-full'}>
            <p className={'block w-full text-start text-[18px] font-semibold text-black'}>
              Created at
            </p>
          </div>
        </div>
        {
          profiles.map((profile) =>
            <NavLink to={`${profile?.id}`} key={profile?.id} className={'grid py-5 px-3 grid-cols-9 place-content-center place-items-center gap-5'}>
              <div className={'col-span-2 w-full'}>
                <p className={'block text-start '}>
                  {profile?.name || "unseted"}
                </p>
              </div>
              <div className={'col-span-3 w-full'}>
                <p className={'block text-start '}>
                  {profile?.email || "unseted"}
                </p>
              </div>
              <div className={'col-span-2 w-full'}>
                <p className={'block text-start '}>
                  {profile?.phone || "unseted"}
                </p>
              </div>
              <div className={'w-full'}>
                <p className={'block text-start '}>
                  {profile?.address || "unseted"}
                </p>
              </div>
              <div className={'w-full'}>
                <p className={'block text-center '}>
                  {formatDateTime(profile?.createdAt) || "unseted"}
                </p>
              </div>
            </NavLink>
          )
        }
      </div>
    </>
  );
};

export default ProfileList;
