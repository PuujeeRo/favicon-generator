'use client'
import Container from "@/components/layout/container";
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64data = reader.result;
        
        // Ensure base64data is a string
        if (typeof base64data === 'string') {
          // Set the image preview
          setImagePreview(base64data);

          // Set the favicon
          const link = document.createElement('link');
          link.rel = 'icon';
          link.href = base64data;
          link.type = 'image/png';

          const existingLink = document.querySelector("link[rel='icon']");
          if (existingLink) {
            document.head.removeChild(existingLink);
          }

          document.head.appendChild(link);
        }
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file.');
    }
  };

    return (<>
        <Container>
            this is Convertors page
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ width: '100px', height: '100px' }} />}
          
           
        </Container>
    </>);
}