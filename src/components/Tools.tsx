import Link from 'next/link';
import Container from "@/components/layout/container";

const Tools = () => {
    return (
        <div className="max-w-[1024px] mx-auto p-4 pb-0 font-[family-name:var(--font-geist-sans)]">
            <div style={{ fontFamily: 'Arial, sans-serif' }} className='flex gap-2'>
                <h1>Tools: </h1>
                <ul style={{ listStyleType: 'none', padding: 0, }} className='flex gap-2'>
                    <li className='hover:underline'>
                        <Link href="/favicon-converter" style={{ textDecoration: 'none', color: '#0070f3' }}>
                            Favicon Converter
                        </Link>
                    </li>
                    <li className='hover:underline' >
                        <Link href="/image-converter" style={{ textDecoration: 'none', color: '#0070f3' }}>
                            Image Converter
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Tools;
