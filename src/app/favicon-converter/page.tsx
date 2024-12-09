'use client'
import JSZip from 'jszip';
import Container from "@/components/layout/container";
import React, { useEffect, useState } from 'react';

export default function Page() {
    const [imagePreview, setImagePreview] = useState<string | null>("/no-photo.jpg");
    const [isFaviconSet, setIsFaviconSet] = useState(false);
    const [copyText, setCopyText] = useState("Copy");
    const [imageBase64, setImageBase64] = useState<string | null>(null);
  
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

          // const existingLink = document.querySelector("link[rel='icon']");
          // if (existingLink) {
          //   document.head.removeChild(existingLink);
          // }

          // document.head.appendChild(link);

          // Indicate that the favicon has been set
          setIsFaviconSet(true);

          // Convert to .ico file and create download link
          // createIcoDownload(base64data);
          setImageBase64(base64data);
        }
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file.');
    }
  };

  const createIcoDownload = () => {
    if (imageBase64) {
      // Create an image element for the base image (from imageBase64)
      const img = new Image();
      img.src = imageBase64;
  
      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const sizes = [16, 32, 48, 64, 96, 180, 192, 512, 150, 270]; // Icon sizes
          const zip = new JSZip(); // Create a new JSZip instance
          
          // Add each size to the zip
          sizes.forEach(size => {
            canvas.width = size;
            canvas.height = size;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.drawImage(img, 0, 0, size, size); // Draw the image at the specified size
  
            // Convert the canvas to a PNG blob
            canvas.toBlob((blob) => {
              if (blob) {
                // Add each image to the zip file
                zip.file(`favicon-${size}x${size}.png`, blob);
              }
            }, 'image/png');
          });

          // Create favicon.ico file (containing multiple sizes in one file)
          const createIcoFile = () => {
            // Create a canvas for 16x16 and 32x32 sizes
            const icoCanvas = document.createElement('canvas');
            const icoCtx = icoCanvas.getContext('2d');
            if (icoCtx) {
              icoCanvas.width = 64;
              icoCanvas.height = 64;

              // Draw the 16x16 and 32x32 icons on the canvas
              icoCtx.drawImage(img, 0, 0, 16, 16);
              icoCtx.drawImage(img, 0, 0, 32, 32);

              // Convert the canvas to a Blob
              icoCanvas.toBlob((blob) => {
                if (blob) {
                  // Add the .ico file to the zip
                  zip.file('favicon.ico', blob);
                }
              }, 'image/x-icon');
            }
          };
          // Call the function to create the .ico file
          createIcoFile();

          // Create the site.webmanifest content
          const manifest = {
            name: "My Web App",
            short_name: "WebApp",
            description: "A great web app",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#000000",
            icons: [
              { src: "favicon-16x16.png", sizes: "16x16", type: "image/png" },
              { src: "favicon-32x32.png", sizes: "32x32", type: "image/png" },
              { src: "favicon-48x48.png", sizes: "48x48", type: "image/png" },
              { src: "favicon-64x64.png", sizes: "64x64", type: "image/png" },
              { src: "favicon-96x96.png", sizes: "96x96", type: "image/png" },
              { src: "favicon-180x180.png", sizes: "180x180", type: "image/png" },
              { src: "android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
              { src: "android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
              { src: "mstile-150x150.png", sizes: "150x150", type: "image/png" },
              { src: "mstile-270x270.png", sizes: "270x270", type: "image/png" }
            ]
          };

          // Convert the manifest to a blob
          const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });

          // Add the site.webmanifest to the zip
          zip.file("site.webmanifest", manifestBlob);
  
          // Wait for all blobs to be added before creating the download
          setTimeout(() => {
            // Generate the zip file
            zip.generateAsync({ type: 'blob' }).then((content) => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(content);
              link.download = 'favicons.zip'; // Save the zip file 
              link.click();
            });
          }, 500);
        }
      };
    }
  };

  const handleCopyClick = () => {
    const codeElement = document.getElementById('faviconCode');
    if (codeElement) {
      const range = document.createRange();
      range.selectNodeContents(codeElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('copy');
      setCopyText("Copied");
      // alert('Code copied to clipboard!');
    }
  };

    return (<>
        <Container>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                </div>
                <input id="dropzone-file" type="file" accept="image/*" className="hidden"  onChange={handleFileChange} />
            </label>
          </div>
      
          {/* Show the preview of the selected image */}
          {imagePreview && (
            <div>
              <h3 className="text-gray-500 dark:text-gray-400">Preview of Selected Image (Favicon):</h3>
              <div className="flex items-center space-x-4">
                <div style={{ width: '50px', height: '50px', border: '1px solid #ccc', display: 'inline-block', borderRadius: '2px', }} >
                  <img src={imagePreview} alt="Ico Preview" style={{ width: '100%', height: '100%', borderRadius: '2px', }} />
                </div>
                <button onClick={() => createIcoDownload()} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" >
                  <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" >
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>  
          )}

          {/* Indicate if favicon has been set */}
          {/* {isFaviconSet && (
            <div>
              <p>Favicon has been set successfully!</p>
            </div>
          )} */}

          <h3 className="text-xl font-extrabold dark:text-white mt-6 mb-1">Standard Favicon Sizes</h3>
          <p className="text-gray-500 dark:text-gray-400">For modern web applications, these sizes cover most device requirements:</p>
          <div className="shadow-md rounded-lg overflow-hidden">
            <table className="relative w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Size</th>
                  <th scope="col" className="px-6 py-3">Purpose</th>
                  <th scope="col" className="px-6 py-3">File Name</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">16x16 px</td>
                  <td className="px-6 py-2">Browser tab icon, classic favicon</td>
                  <td className="px-3 py-2"><code>favicon-16x16.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">32x32 px</td>
                  <td className="px-6 py-2">High-resolution classic favicon</td>
                  <td className="px-3 py-2"><code>favicon-32x32.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">48x48 px</td>
                  <td className="px-6 py-2">Older desktop browsers (optional)</td>
                  <td className="px-3 py-2"><code>favicon-48x48.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">64x64 px</td>
                  <td className="px-6 py-2">Custom high-res favicons (optional)</td>
                  <td className="px-3 py-2"><code>favicon-64x64.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">96x96 px</td>
                  <td className="px-6 py-2">High-resolution classic favicon</td>
                  <td className="px-3 py-2"><code>favicon-96x96.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">180x180 px</td>
                  <td className="px-6 py-2">Apple touch icon (iOS)</td>
                  <td className="px-3 py-2"><code>apple-touch-icon.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">192x192 px</td>
                  <td className="px-6 py-2">Android Chrome (recommended for Android home screen icons)</td>
                  <td className="px-3 py-2"><code>android-chrome-192x192.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">512x512 px</td>
                  <td className="px-6 py-2">Android Chrome high-resolution icon (used for splash screens)</td>
                  <td className="px-3 py-2"><code>android-chrome-512x512.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">150x150 px</td>
                  <td className="px-6 py-2">{`Windows "Live Tile" icon`}</td>
                  <td className="px-3 py-2"><code>mstile-150x150.png</code></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">270x270 px</td>
                  <td className="px-6 py-2">Microsoft Edge larger icons</td>
                  <td className="px-3 py-2"><code>mstile-270x270.png</code></td>
                </tr>
              </tbody>
            </table>
          </div> 

          <h3 className="text-xl font-extrabold dark:text-white mt-6 mb-1">Link Tags for Including Favicons in HTML</h3>
          <p className="text-gray-500 dark:text-gray-400">To include these favicons in your HTML <code>{`<head>`}</code>, add the following:</p>
          <pre className="p-2 shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
            <code id="faviconCode" className="language-html text-gray-500 dark:text-gray-400">
            {`<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">\n`}
            &nbsp;{`<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">\n`}
            &nbsp;{`<link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon-48x48.png">\n`}
            &nbsp;{`<link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png">\n`}
            &nbsp;{`<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">\n`}
            &nbsp;{`<link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-chrome-192x192.png">\n`}
            &nbsp;{`<link rel="icon" type="image/png" sizes="512x512" href="/favicons/android-chrome-512x512.png">\n`}
            &nbsp;{`<meta name="msapplication-TileImage" content="/favicons/mstile-150x150.png">\n`}
            &nbsp;{`<meta name="msapplication-square270x270logo" content="/favicons/mstile-270x270.png">\n`}
            &nbsp;{`<link rel="manifest" href="/site.webmanifest">`}
            </code>
          </pre>
          <button onClick={handleCopyClick} className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            { copyText ? copyText : 'Copy' } 
          </button>

          <h3 className="text-xl font-extrabold dark:text-white mt-6 mb-1">Apple Touch Icon</h3>
          <p className="text-gray-500 dark:text-gray-400">For iOS devices, specify the  <code>{`apple-touch-icon`}</code> to ensure the icon displays correctly on bookmarks:</p>
          <pre className="p-2 shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
            <code className="language-html text-gray-500 dark:text-gray-400">
            {`<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">\n`}
            </code>
          </pre>

          <h3 className="text-xl font-extrabold dark:text-white mt-6 mb-1">Microsoft Tile Icons for Windows</h3>
          <p className="text-gray-500 dark:text-gray-400">For Windows devices, especially for pinned sites in Windows Start, use the Microsoft tile images:</p>
          <pre className="p-2 shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
            <code className="language-html text-gray-500 dark:text-gray-400">
            {`<meta name="msapplication-TileImage" content="/favicons/mstile-150x150.png">\n`}
            &nbsp;{`<meta name="msapplication-square270x270logo" content="/favicons/mstile-270x270.png">\n`}
            </code>
          </pre>

          <h3 className="text-xl font-extrabold dark:text-white mt-6 mb-1">Android Devices (Home Screen Icons)</h3>
          <p className="text-gray-500 dark:text-gray-400">The 192x192 px and 512x512 px icons are commonly used for Android devices:</p>
          <pre className="p-2 shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
            <code className="language-html text-gray-500 dark:text-gray-400">
            {`<link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-chrome-192x192.png">\n`}
            &nbsp;{`<link rel="icon" type="image/png" sizes="512x512" href="/favicons/android-chrome-512x512.png">\n`}
            </code>
          </pre>         

          <h3 className="text-xl font-extrabold dark:text-white mt-6 mb-1">Example Directory Structure</h3>
          <p className="text-gray-500 dark:text-gray-400">Organize all these files within a dedicated folder for easy management. A common folder structure might look like:</p>
          <pre className="p-2 shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
            <code className="language-html text-gray-500 dark:text-gray-400">
            public/ <br/>
            &emsp;└── favicons/ <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── favicon-16x16.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── favicon-32x32.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── favicon-48x48.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── favicon-96x96.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── favicon-180x180.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── android-chrome-192x192.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── android-chrome-512x512.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;├── mstile-150x150.png <br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;└── mstile-270x270.png
            </code>
          </pre>
        </Container>
    </>);
}
