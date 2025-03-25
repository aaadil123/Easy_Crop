import './App.css'
import React, { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import Button from "@mui/material/Button";
import { Slider } from "@mui/material";
import { generateDownload } from "./utils/cropImage";
import upload from './utils/upload.png'

export default function ImageEditor() {
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const inputRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onDownload = () => {
		generateDownload(image, croppedArea);
	};

  

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    console.log(croppedAreaPercentage, croppedAreaPixels);
    setCroppedArea(croppedAreaPixels);
  }
  
  const replaceImage = () => inputRef.current.click();

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 h-screen">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={onFileChange}
        accept="image/*"
      />
      <div className="w-[50vw] h-full border rounded overflow-hidden px-4 py-4">
        {image ? (
          <>
            <div className="h-[90%] relative">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                rotation={rotation}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
                  },
                }}
              />
            </div>

            <div className="h-[10%] flex items-center m-auto w-[80%] gap-8">
              <div className="flex items-center justify-center w-full gap-4">
                <p>Zoom</p>
                <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e, zoom) => setZoom(zoom)}/>
              </div>

              <div className="flex justify-center items-center w-full gap-4">
                <p>Rotate</p>
                <Slider value={rotation} min={0} max={360} step={1}
                onChange={(e, newValue) => setRotation(newValue)}
                />
              </div>
            </div>
          </>
        ):(
          <div className='w-full h-full bg-contain bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${upload})` }}>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button className="border border-gray-900 rounded-md px-4 py-2" onClick={replaceImage}>Choose Image</button>

        <div className="flex justify-center gap-2">
          {/* <Button onClick={rotateImage}>Rotate</Button> */}
          <Button onClick={() => setFlipX(!flipX)}>Flip X</Button>
          <Button onClick={() => setFlipY(!flipY)}>Flip Y</Button>
        </div>

        <button className="border border-gray-900 rounded-md px-4 py-2" onClick={onDownload}>Download Cropped Image</button>
      </div>
    </div>
  );
}
