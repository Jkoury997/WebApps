'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Brand from "@/components/ui/brand";
import Header from "@/components/ui/header";
import Navbar from "@/components/ui/navbar";
import { EnableNotification } from '@/components/component/enable-notification';
import { ToastContainer } from 'react-toastify';

export default function DashboardLayout({ children }) {
  const titleBrand = "FichAqui";

  const [useruuid, setUseruuid] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const uuid = Cookies.get('useruuid');
    const role = Cookies.get('userRole');
    setUseruuid(uuid);
    setUserRole(role);
    console.log(`useruuid: ${uuid}, userRole: ${role}`);
  }, []);

  if (!useruuid || !userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div key="1" className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      {!isEnabled && (
        <div className="flex items-center justify-center w-full h-full">
          <EnableNotification setIsEnabled={setIsEnabled} />
        </div>
      )}
      {isEnabled && (
        <>
          <div className="hidden bg-gray-100/40 border-r lg:block">
            <div className="flex flex-col gap-2">
              <Brand title={titleBrand}></Brand>
              <div className="flex-1">
                <Navbar userRole={userRole}></Navbar>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Header userRole={userRole} title={titleBrand}></Header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
              {children}
            </main>
          </div>
          <ToastContainer/>
        </>
      )}
    </div>
  );
}
