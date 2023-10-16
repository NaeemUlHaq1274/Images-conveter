import React from 'react'
import "./DownloadButton.css"


function DownloadButton({id}) {

  const downloadFileAtUrl = ()=>{
    const downloadUrl = `http://127.0.0.1:5000/download_single_image/${id}`;
    window.location.href = downloadUrl;
}
  return (
    <button className="download-image" onClick={downloadFileAtUrl} ><span>DOWNLOAD</span></button>
  )
}

export default DownloadButton