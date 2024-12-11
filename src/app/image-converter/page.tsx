'use client'
import Container from "@/components/layout/container";
import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// const ImageConvertorPage = dynamic(() => import('@/app/convertors/page'));

import ImageConverter from '@/components/ImageConverter';

export default function Page() {

    return (<>
        <Container>
            <ImageConverter />                  
        </Container>
    </>);
}