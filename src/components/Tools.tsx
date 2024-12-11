import Link from 'next/link';
import Container from "@/components/layout/container";

const Tools = () => {
    return (
        <Container>
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h1>Tools</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <Link href="/favicon-converter" style={{ textDecoration: 'none', color: '#0070f3' }}>
                        Favicon Converter
                    </Link>
                </li>
                <li>
                    <Link href="/image-converter" style={{ textDecoration: 'none', color: '#0070f3' }}>
                        Image Converter
                    </Link>
                </li>
            </ul>
        </div>
        </Container>
    );
};

export default Tools;
