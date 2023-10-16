import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import "./Test.css"

function ImageUploader() {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the uploaded files (acceptedFiles).
    console.log('Accepted Files:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png', // Specify the accepted file type(s)
  });

  //// ** getRootProps inculde **
  // onClick
  // onDragEnter
  // onDragLeave
  // onDrop
  // className

  //// ** getInputProps **
  // type
  // accept 



  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input  {...getInputProps()} multiple />
      <p>Drag &amp; drop a PNG image here, or click to select one</p>
    </div>
  );
}

export default ImageUploader;
