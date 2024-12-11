'use client'
import dynamic from 'next/dynamic';
const FaviconConvertorPage = dynamic(() => import('@/app/favicon-converter/page'));

import Tools from "@/components/Tools";

export default function Home() {

  return (
  <>
    <div className="">
      {/* <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"> */}
      <Tools />
      <FaviconConvertorPage /> 
      {/* </main> */}
    </div>
  </>);
}
