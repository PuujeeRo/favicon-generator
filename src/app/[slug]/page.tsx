'use client'
import React, { useState } from 'react';
import Container from "@/components/layout/container";
import ImageConverter from '@/components/ImageConverter';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Page() {
    const pathname = usePathname(); // e.g., '/PNG-to-SVG'
    const slug = pathname.split('/')[1]; // Assuming the structure is '/[slug]'
    const searchParams = useSearchParams();
    // const sourceFileType = slug.split('-')[0]?.toLocaleLowerCase();
    // const targetFileType = slug.split('-')[2]?.toLocaleLowerCase();
    const sourceFileType = slug.split('-')[0] || '';
    const targetFileType = slug.split('-')[2] || '';

    return (<>
        <Container>
            <ImageConverter />
        </Container>
    </>);
}