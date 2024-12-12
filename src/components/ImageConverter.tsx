import React, { useState, useEffect, useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { MdPhotoSizeSelectLarge } from "react-icons/md";
import { CiCrop } from "react-icons/ci";
import { MdOutlineCropRotate } from "react-icons/md";
import { FiRotateCw, FiRotateCcw } from "react-icons/fi";
import { LuFlipHorizontal2, LuFlipVertical2  } from "react-icons/lu";
import CropperJS from 'cropperjs';
import CropperInstance  from "cropperjs";

const imageFileTypes = [
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "webp", label: "WEBP" },
  { value: "gif", label: "GIF" },
  { value: "bmp", label: "BMP" },
  { value: "tiff", label: "TIFF" },
  { value: "avif", label: "AVIF" },
  { value: "heic", label: "HEIC" },
  { value: "raw", label: "RAW" },
  // { value: "ico", label: "ICO" },
];


interface ImageCropperProps {
  src: string;
  onSave: (croppedImage: string) => void;
}

const ImageConverter: React.FC = () => {
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('png');
  const [inputFormat, setInputFormat] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  // resizer
  const [resizeWidth, setResizeWidth] = useState<number | null>(null);
  const [resizeHeight, setResizeHeight] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState<boolean>(true);

  // croper
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement | null>(null);
  // const cropperRef = useRef<Cropper>(null);
  
  // Initialize CropperJS after the component is mounted
  // useEffect(() => {
  //   if (cropperRef.current) {
  //     // Create a new CropperJS instance
  //     new CropperJS(cropperRef.current, {
  //       aspectRatio: 1,
  //       guides: false,
  //     });
  //   }
  // }, []);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 5MB.');
        setConvertedImage(null);
        return;
      } else {
        setError(null); // Clear any previous errors
      }
      const fileType = file.type.split('/')[1]; // Extract format after 'image/'
      setInputFormat(fileType);
      
      const fileUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = fileUrl;

      img.onload = async () => {
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height); 
  
        if (outputFormat !== 'svg') {
          const convertedDataUrl = await convertImage(fileUrl, outputFormat);
          setConvertedImage(convertedDataUrl);
        } else {
          const formData = new FormData();
          formData.append('image', file);
  
          try {
            const response = await fetch('/api/image-svg/convert-to', {
              method: 'POST',
              body: formData,
            });
  
            const data = await response.json();
            if (data.svg) {
              const encodedSvg = `data:image/svg+xml;base64,${btoa(data.svg)}`;
              setSvg(encodedSvg);
            } else {
              setError(data.error || 'Failed to load SVG');
            }
          } catch (error: any) {
            setError(error.message);
          }
        }
      };

      // if (outputFormat != 'svg') {
      //   const convertedDataUrl = await convertImage(fileUrl, outputFormat);
      //   setConvertedImage(convertedDataUrl);
      // } else {
      //   const formData = new FormData();
      //   formData.append('image', file);

        // try {
        //   // Send the file to the backend API for conversion
        //   const response = await fetch('/api/image-svg/convert-to', {
        //     method: 'POST',
        //     body: formData,
        //   });
  
        //   // if (!response.ok) {
        //   //   throw new Error('Image conversion failed');
        //   // }
  
        //   // const result = await response.json();
        //   // if (result.svg) {
        //   //   setConvertedImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}`);
        //   // } else {
        //   //   setError('No SVG data returned');
        //   // }
        //   const data = await response.json();
        //     if (data.svg) {
        //         // Encode SVG data to base64
        //         const encodedSvg = `data:image/svg+xml;base64,${btoa(data.svg)}`;
        //         setSvg(encodedSvg);
        //     } else {
        //         setError(data.error || 'Failed to load SVG');
        //     }
        // } catch (error: any) {
        //   setError(error.message);
        // } finally {
        //   // setLoading(false); // Stop loading animation or state
        // }
      // }
    }
  };

  const convertImage = (imageDataUrl: string, format: string, newWidth?: number | null, newHeight?: number | null): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageDataUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = newWidth || img.width;
        const targetHeight = newHeight || img.height;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        if (ctx) {
          // canvas.width = img.width;
          // canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          let convertedDataUrl: string | null = null;
          console.log("format: ", format);
          if (format.toLowerCase() === 'svg') {
            // Wrap the image in an SVG element
            // const svgString = `
            //   <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            //     <image href="${imageDataUrl}" width="${img.width}" height="${img.height}" />
            //   </svg>
            // `;
            // convertedDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
          } else {
            // Convert based on selected format
            const quality = format === 'jpeg' ? 0.8 : undefined; // JPEG quality
            convertedDataUrl = canvas.toDataURL(`image/${format}`, quality);
          }
          
          resolve(convertedDataUrl);
        } else {
          resolve(null);
        }
      };

      img.onerror = () => {
        resolve(null);
      };
    });
  };

  const downloadImage = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage;
      link.download = `converted-image.${outputFormat}`;
      link.click();
    }
  };

  // State to track active tab
  const [activeTab, setActiveTab] = useState('resize');

  const handleTabClick = (tab: string) => {
      setActiveTab(tab);
  };

  // Resizer 
  const handleResize = async () => {
    if (convertedImage) {
      const resizedImage = await convertImage(convertedImage, outputFormat, resizeWidth, resizeHeight);
      setWidth(resizeWidth);
      setHeight(resizeHeight);
      setConvertedImage(resizedImage);
    }
  };

  // This function updates width and height while maintaining the aspect ratio
  const handleResizeWidthChange = (newWidth: number) => {
    setResizeWidth(newWidth);
    if (isAspectRatioLocked && aspectRatio) {
      setResizeHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleResizeHeightChange = (newHeight: number) => {
    setResizeHeight(newHeight);
    if (isAspectRatioLocked && aspectRatio) {
      setResizeWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // Toggle aspect ratio lock
  const toggleAspectRatioLock = () => {
    setIsAspectRatioLocked(prevState => !prevState);
  };

  const handleCrop = () => {
    // if (cropperRef.current) {
    //   const cropper = cropperRef.current as CropperJS;
    //   const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
    //   setCroppedImage(croppedDataUrl);
    // }
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();
      setCroppedImage(croppedImage);
      setConvertedImage(croppedImage);
    }
  };

  
  const [flip, setFlip] = useState<{ horizontal: boolean; vertical: boolean }>({ horizontal: false, vertical: false });
  const [rotation, setRotation] = useState<number>(0);

  const handleFlipHorizontal = () => {
    if (convertedImage) {
      const img = new Image();
      img.src = convertedImage;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
  
          // Clear the canvas and reset transformations
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          // Flip horizontally
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
  
          // Draw the image on the transformed canvas
          ctx.drawImage(img, 0, 0);
  
          // Get the new flipped image as a data URL
          const flippedImage = canvas.toDataURL();
          setConvertedImage(flippedImage);
        }
      };
    }
  };

  const handleFlipVertical = () => {
    if (convertedImage) {
      const img = new Image();
      img.src = convertedImage;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
  
          // Clear the canvas and reset transformations
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          // Flip vertically
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
  
          // Draw the image on the transformed canvas
          ctx.drawImage(img, 0, 0);
  
          // Get the new flipped image as a data URL
          const flippedImage = canvas.toDataURL();
          setConvertedImage(flippedImage);
        }
      };
    }
  };

  const handleRotate = (angle: number) => {
    if (convertedImage) {
      const img = new Image();
      img.src = convertedImage;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
  
        // Update rotation state
        const newRotation = (rotation + angle) % 360;
        setRotation(newRotation);
  
        // Determine new canvas size to fit rotated image
        const radians = (newRotation * Math.PI) / 180;
        const absCos = Math.abs(Math.cos(radians));
        const absSin = Math.abs(Math.sin(radians));
        const newWidth = Math.ceil(img.width * absCos + img.height * absSin);
        const newHeight = Math.ceil(img.width * absSin + img.height * absCos);
  
        canvas.width = newWidth;
        canvas.height = newHeight;
  
        ctx.save();
  
        // Translate to canvas center and rotate
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(radians);
  
        // Draw the image with flipped or original state
        const { horizontal, vertical } = flip;
        if (horizontal) ctx.scale(-1, 1);
        if (vertical) ctx.scale(1, -1);
  
        ctx.drawImage(
          img,
          -img.width / 2, // Center the image
          -img.height / 2,
          img.width,
          img.height
        );
  
        ctx.restore();
  
        const newDataUrl = canvas.toDataURL(`image/${outputFormat}`);
        setConvertedImage(newDataUrl);
      };
    }
  };
  

  return (
    <div>
      {/* <h1>Image Converter</h1> */}
      {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input id="dropzone-file" type="file" accept="image/*" className="hidden"  onChange={handleFileChange} />
        </label>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='flex flex-column justify-evenly mt-3 m-auto max-w-[350px]'>
        <p className="text-gray-900 text-sm block p-2.5 dark:text-white">
          Convert
        </p>
        <select value={inputFormat} onChange={(e) => setInputFormat(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-90 className=0 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">none</option>          
          {imageFileTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="text-gray-900 text-sm block p-2.5 dark:text-white">
          to
        </p>
        <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            {imageFileTypes.map((type) => (
                <option key={type.value} value={type.value}>
                    {type.label}
                </option>
            ))}
        </select> 
      </div>
        
      <div id="image-editor" className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0' >
        {convertedImage && (
        <div className='sm:w-full pt-2'>
          <div className='flex justify-center items-center'>
            <p className="text-gray-500 dark:text-gray-400">Converted Image <span style={{fontSize:'12px', }}>{`(${width}x${height}px)`}</span> :</p>
            <button onClick={downloadImage} className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center" >
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              Download {outputFormat.toUpperCase()} 
            </button>
          </div>
          
          <div className='flex justify-center items-center mx-auto mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg' style={{ maxWidth: '100%', maxHeight: '475px', minHeight: '300px', }}>
            <img src={convertedImage} alt="Converted" className='mx-auto mt-2 shadow bg-gray-50 dark:bg-gray-800'
              style={{ maxWidth: '100%', maxHeight: '475px', }} />
          </div>
          
          {/* {activeTab === 'crop' && (
            <div>
              <Cropper src={convertedImage} ref={cropperRef} style={{ height: 400, width: '100%' }}
                aspectRatio={1} guides={false}
              />
              <button onClick={handleCrop} className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Crop</button>
            </div>
          )} */}
        </div>
        )}

        <div className="">
          <div className="mb-3 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
              <li className="me-2">
                <button className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg ${activeTab === 'resize' ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  onClick={() => handleTabClick('resize')} role="tab" aria-selected={activeTab === 'resize'}
                >
                  <MdPhotoSizeSelectLarge className="mr-2" /> Resizer
                </button>
              </li>
              <li className="me-2">
                <button className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg ${activeTab === 'crop' ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  onClick={() => handleTabClick('crop')} role="tab" aria-selected={activeTab === 'crop'}
                >
                  <CiCrop className="mr-2" /> Crop
                </button>
              </li>
              <li className="me-2">
                <button className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg ${activeTab === 'rotate' ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  onClick={() => handleTabClick('rotate')} role="tab" aria-selected={activeTab === 'rotate'}
                >
                  <MdOutlineCropRotate className="mr-2" /> Flip & Rotate
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === 'resize' ? 'block' : 'hidden'}`} role="tabpanel" 
              style={{ maxWidth: '100%', maxHeight: '475px', minHeight: '300px', }}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resize Image
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-auto space-x-4">
                  <label htmlFor="resizeWidth" className="mb-1">Width:</label>
                  <input
                    id="resizeWidth"
                    name="resizeWidth"
                    type="number"
                    placeholder="Width"
                    value={resizeWidth || ''}
                    onChange={(e) => handleResizeWidthChange(Number(e.target.value))}
                    className="border p-2 rounded max-w-[150px]"
                  />
                  <span className='ml-1'>px</span>
                </div>

                <div className="w-full sm:w-auto space-x-4">
                  <label htmlFor="resizeHeight" className="mb-1">Height:</label>
                  <input
                    id="resizeHeight"
                    name="resizeHeight"
                    type="number"
                    placeholder="Height"
                    value={resizeHeight || ''}
                    onChange={(e) => handleResizeHeightChange(Number(e.target.value))}
                    className="border p-2 rounded max-w-[150px]"
                  />
                  <span className='ml-1'>px</span>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                <div>
                  <button onClick={handleResize} className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    Apply Resize
                  </button>

                  <label htmlFor="aspectRatio" style={{ cursor: 'pointer' }} className='ml-4'>
                    <input type="checkbox" id="aspectRatio" name="aspectRatio" className='ml-1' checked={isAspectRatioLocked} onChange={() => toggleAspectRatioLock()} />
                    Lock Aspect Ratio
                  </label>
                </div>
              </div>
            </div>

              {activeTab === 'crop' && (
                  <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 `} role="tabpanel">
                  {convertedImage ? (
                    <div>
                      <button onClick={handleCrop} className="mb-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Crop</button>
                      <Cropper src={convertedImage} ref={cropperRef} style={{ height: 400, width: '100%' }}
                        aspectRatio={1} guides={true} responsive={true} autoCrop={true}
                      />
                    </div>
                  ) : ( <p> Please upload a image !</p> )}
                  {/* {croppedImage && (
                    <div>
                      <h3>Cropped Image:</h3>
                      <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
                    </div>
                  )} */}
                  </div>
              )}
                
              <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 grid grid-cols-2 gap-4 ${activeTab === 'rotate' ? 'block' : 'hidden'}`} role="tabpanel"
                style={{maxHeight: '475px', }}>
                  <div>
                    <div className="text-center w-full" onClick={handleFlipHorizontal}>
                      <div className="dark:bg-darkSurface-200 cursor-pointer w-full flex items-center justify-center rounded-2xl border-slate-200 dark:border-darkSurface-400 border py-8 my-2">
                        <LuFlipHorizontal2 className="text-3xl" />
                      </div>
                      <span>Flip Horizontal</span>
                    </div>

                    <div className="text-center w-full" onClick={handleFlipVertical}>
                      <div className="dark:bg-darkSurface-200 cursor-pointer w-full flex items-center justify-center rounded-2xl border-slate-200 dark:border-darkSurface-400 border py-8 my-2">
                        <LuFlipVertical2 className="text-3xl" />
                      </div>
                      <span>Flip Vertical</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-center w-full" onClick={() => handleRotate(90)}>
                      <div className="dark:bg-darkSurface-200 cursor-pointer w-full flex items-center justify-center rounded-2xl border-slate-200 dark:border-darkSurface-400 border py-8 my-2">
                        <FiRotateCw className="text-3xl" />
                      </div>
                      <span>Rotate 90°</span>
                    </div>

                    <div className="text-center w-full" onClick={() => handleRotate(-90)}>
                      <div className="dark:bg-darkSurface-200 cursor-pointer w-full flex items-center justify-center rounded-2xl border-slate-200 dark:border-darkSurface-400 border py-8 my-2">
                        <FiRotateCcw className="text-3xl" />
                      </div>
                      <span>Rotate -90°</span>
                    </div>
                  </div>
              </div>
          </div>
        </div>

      </div>
      
      {svg && <img src={svg} alt="Converted {outputFormat.toUpperCase()}" />}
    </div>
  );
};

export default ImageConverter;
