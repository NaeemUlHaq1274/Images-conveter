import React from 'react'
import "./Header.css"

function Header() {
  return (
    <div>
      <div className="logo">
        <img src="https://png2jpg.com/images/png2jpg/logo.svg" alt="Logo" />
      </div>
      <div className="description">
        <p>This free online tool converts your PNG images to JPEG format, applying proper compression methods. Unlike other services, this tool does not ask for your email address, offers mass conversion and allows files up to 50 MB.</p>
        <div className="notes">
          <div className="note">
            <div className="counter"></div>
            <div className="counter_decription">Click the UPLOAD FILES button and select up to 20 .png images you wish to convert. You can also drag files to the drop area to start uploading</div>
          </div>
          <div className="note">
            <div className="counter"></div>
            <div className="counter_decription">Click the UPLOAD FILES button and select up to 20 .png images you wish to convert. You can also drag files to the drop area to start uploading</div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Header