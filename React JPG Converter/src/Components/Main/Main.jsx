import React, { useCallback, useState } from "react";
import "./Main.css";
import { useDropzone } from "react-dropzone";
import { ImCross } from "react-icons/im";
import { MdOutlineDownloading } from "react-icons/md";
import DownloadButton from "./Components/DownloadButton/DownloadButton";
import DownloadAllButton from "./Components/DownloadAllButton/DownloadAllButton";
import { Button } from "react-bootstrap";
import VideoPlayer from "./Components/VideoPlayer";

function Main() {
  const [images, setImages] = useState([]);
  // console.log(images);
  const [format, setFormat] = useState("png");
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgBoxes, setImagBoxes] = useState([]);

  // console.log(loading);
  // console.log(ids)

  const convertImages = async (file) => {
    try {
      const fileName =file.name.substring(0, file.name.lastIndexOf(".")) + "." + format;
      const formData = new FormData();
      formData.append("image", file);
      formData.append("format", format);
      formData.append("imgName", fileName);

      // Introduce a 2-second delay using setTimeout
      // await new Promise((resolve) => {
      //   setTimeout(resolve, 2000);
      // });

      const response = await fetch("http://127.0.0.1:5000/upload_image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data Add Successfully:", response.status);
        // console.log("Id:", data.id);
        setIds((preIds) => [...preIds, data.id]);
        return data.id;
        // Assuming you have a function to set the converted image
      } else {
        const data = await response.json();
        console.error(data.error);
        return null;
      }
    } catch (error) {
      console.error("API request failed:", error);
      return null;
    }
  };

  ////onDrop Function//////////
  const onDrop = async (files) => {
    const new_images = await Promise.all(
      files.map(async (file) => {
        try {
          const fileExtension = file.name.split(".").pop().toLowerCase();

          const allowedFormats = ["jpg", "jpeg"];
          if (!allowedFormats.includes(fileExtension)) {
            alert("Format not allowed. Only " +allowedFormats.join(", ") +" will be allowed.");
            return null;
          }

          setLoading(true);
          setImagBoxes((pre) => [...pre, 1]);

          let id = await convertImages(file);
          const newImgBoxes = [...imgBoxes];
          newImgBoxes.pop();
          setImagBoxes(newImgBoxes);
          // console.log(fileName)
          if (id) {
            return {
              url: URL.createObjectURL(file),
              imgName: file.name,
              id,
            };
          } else {
            console.error("NO 'id' FOUND");
            return null;
          }
        } catch (error) {
          console.error("Error converting image:", error);
          return null; // Handle the error gracefully, you can also omit this line if you want to skip the failed conversions
        }
      })
    );
    const validImages = new_images.filter((result) => result.file !== null);
    setImages([...images, ...validImages]);
    setLoading(false);
  };
  //////changeUpload Function//////////
  const handleUpload = async (e) => {
    const files = e.target.files;
    const new_images = await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const fileExtension = file.name.split(".").pop().toLowerCase();

          const allowedFormats = ["jpg", "jpeg"];
          if (!allowedFormats.includes(fileExtension)) {
            alert("Format not allowed. Only " +allowedFormats.join(", ") +" will be allowed.");
            return null;
          }

          setLoading(true);
          setImagBoxes((pre) => [...pre, 1]);

          let id = await convertImages(file);
          const newImgBoxes = [...imgBoxes];
          newImgBoxes.pop();
          setImagBoxes(newImgBoxes);

          if (id) {
            return {
              url: URL.createObjectURL(file),
              imgName: file.name,
              id,
            };
          } else {
            console.error("NO 'id' FOUND");
            return null;
          }
        } catch (error) {
          console.error("Error converting image:", error);
          return null; // Handle the error gracefully, you can also omit this line if you want to skip the failed conversions
        }
      })
    );
    const validImages = new_images.filter((result) => result.file !== null);
    setImages([...images, ...validImages]);
    setLoading(false);

    e.target.value = null;
  };
  // console.log(imgBoxes);
  ///////clearAllImages Function////////////////
  const handleCrossIconClick = (index, id) => {
    const updatedImages = images.filter(
      (_, imageIndex) => imageIndex !== index
    );
    const updatedIds = ids.filter((idValue) => idValue !== id);
    console.log("Updated Ids::: ", updatedIds);
    setImages(updatedImages);
    setIds(updatedIds);
  };

  let { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: "image/png",
  });

  //////////ChatGpt Code///////////////
  ////////Remove onClick EventHandler//////
  getRootProps = (function (originalGetRootProps) {
    return function () {
      var rootProps = originalGetRootProps.apply(this, arguments);
      // Override the onClick property with a no-op function
      rootProps.onClick = function () {};
      return rootProps;
    };
  })(getRootProps);
  /////////////////////////////////////

  const clearAllImages = () => {
    setImages([]);
    setIds([]);
  };

  const handleOptionChange = (e) => {
    setFormat(e.target.value);
    setImages([]);
    setIds([]);
  };
  // console.log(ids)

  return (
    <div className="main-container">
      <ul className="main-top">
        <li>
          <input
            type="radio"
            id="jpgToPng"
            name="select-img-converter"
            defaultChecked
            value="png"
            onChange={handleOptionChange}
          />
          <label htmlFor="jpgToPng" className="converter-button">
            PNG To PNG
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="jpgToWebp"
            name="select-img-converter"
            value="webp"
            onChange={handleOptionChange}
          />
          <label htmlFor="jpgToWebp" className="converter-button">
            WEBP To Webp
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="jpgToGif"
            name="select-img-converter"
            value="gif"
            onChange={handleOptionChange}
          />
          <label htmlFor="jpgToGif" className="converter-button">
            GIf To GIF
          </label>
        </li>
      </ul>

      <div className="main-bottom">
        <div className="upload-delete-images-container">
          <label
            className="converter-button"
            style={{ backgroundColor: "#3498db", borderRadius: "0" }}
          >
            Upload Images
            <input
              type="file"
              multiple
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>
          <button
            className="converter-button"
            onClick={clearAllImages}
            style={{ backgroundColor: "#D44D3B", borderRadius: "0" }}
          >
            Clear All Images
          </button>
        </div>

        <div className="drag-drop-images-container">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} multiple />
            {/* <div>{loading}</div> */}
            {images.map((image, index) => (
              <div key={index} className="images-container">
                <img src={image.url} alt="image" />

                <div className="empty-div">
                  <p>
                    {image.imgName.length > 16
                      ? image.imgName.slice(0, 12) + image.imgName.slice(-4)
                      : image.imgName}
                  </p>
                  <ImCross
                    className="cross-icon"
                    onClick={() => handleCrossIconClick(index, image.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <h1>{format}</h1>
                  <DownloadButton id={image.id} />
                </div>
              </div>
            ))}

            {loading &&
              imgBoxes.map((_, index) => {
                return (
                  <div key={index} className="images-container video-container">
                    <div className="empty-div video-div">
                      <VideoPlayer />
                    </div>
                  </div>
                );
              })}
            {!images.length && (
              <p style={{ margin: "auto" }}>Drag &amp; drop a PNG image here</p>
            )}
          </div>
        </div>

        <div className="download-all-container">
          <DownloadAllButton ids={ids} />
        </div>
      </div>
    </div>
  );
}

export default Main;
