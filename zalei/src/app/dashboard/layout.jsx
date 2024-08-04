"use client";

import Brand from "@/components/ui/brand";
import Header from "@/components/ui/header";
import Navbar from "@/components/ui/navbar";

export default function DashboardLayout({ children }) {
  const titleBrand = "Zalei";

  return (
    <div key="1" className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden bg-gray-100/40 border-r lg:block">
        <div className="flex flex-col gap-2">
          <Brand title={titleBrand} />
          <div className="flex-1">
            <Navbar />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header  title={titleBrand} />
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
}
