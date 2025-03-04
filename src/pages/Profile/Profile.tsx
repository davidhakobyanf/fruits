import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import EditableField from "../../components/common/EditabeField/EditableField";
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  console.log(slug,'slug');
  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const res = await fetch(`https://api.mytoy.am/admin/users/${slug}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status);
      const responseBody = await res.text();
      console.log("Response body:", responseBody);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const { data } = JSON.parse(responseBody);
      setProfiles(data); // Set all profiles
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  };

  const saveProfile = async (profile) => {
    try {
      setLoading(true);

      // Извлекаем только нужные поля
      const { id, name, email, phone, address } = profile;

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing!");
        setLoading(false);
        return;
      }

      const res = await fetch(`https://api.mytoy.am/admin/profile/${id}`, {
        method: "PUTCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        throw new Error(`Error updating profile: ${responseBody.message || res.status}`);
      }

      setLoading(false);
      alert(`Profile for ${name} updated successfully!`);
    } catch (error) {
      console.error("Error saving profile:", error.message);
      setLoading(false);
    }
  };


  const handleFieldChange = (id, field, value) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profiles) =>
        profiles.id === id ? { ...profiles, [field]: value } : profiles
      )
    );
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(profiles,'profiles');
  return (
    <>
      <Breadcrumb pageName="Profiles" />
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {profiles ? (<div key={profiles.id} className="space-y-4 border-b pb-4">
          <EditableField
            label="Name"
            value={profiles?.name || "unseted"}
            onChange={(value) => handleFieldChange(profiles.id, "name", value)}
          />
          <EditableField
            label="Email"
            value={profiles?.email || "unseted"}
            onChange={(value) => handleFieldChange(profiles?.id, "email", value)}
          />
          <EditableField
            label="Address"
            value={profiles?.address || "unseted"}
            onChange={(value) => handleFieldChange(profiles?.id, "address", value)}
          />
          <EditableField
            label="Phone"
            value={profiles?.phone || "unseted"}
            onChange={(value) => handleFieldChange(profiles?.id, "phone", value)}
          />
          <button
            onClick={() => saveProfile(profiles)}
            className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : `Save ${profiles?.name}`}
          </button>
        </div>) : null
        }


      </div>
    </>
  );
};

export default Profile;
