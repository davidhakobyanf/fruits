import React, { useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLayout, setShowLayout] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');


    if (window.location.pathname.includes('signin')) {
      if(token){
        navigate('/');

      }
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
    
    if (!token) {
      navigate('/auth/signin');
      return;
    }
  }, [navigate, window.location.pathname]);

  if (!showLayout) {
    return <>{children}</>; 
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
