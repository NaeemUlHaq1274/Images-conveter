import React from 'react';
import "./DownloadAllButton.css";
import JSZip from 'jszip';
import download from 'downloadjs';


// const imageIds = [36, 37, 38, 39, 40];
// const imageIdsString = imageIds.join(',');
// const imageBlob = await response.blob();

function DownloadAllButton({ ids }) {
  
  const createZipAndDownload = () => {
    if (ids.length > 0){
      const downloadUrl = `http://127.0.0.1:5000/download_multiple_images?image_ids=${ids.join(',')}`;
      window.location.href = downloadUrl;
    };
  };

  return (
    <button className="converter-button" onClick={createZipAndDownload} style={{ backgroundColor: "green", borderRadius: "0" }}>Download All</button>
  );
}

export default DownloadAllButton;
