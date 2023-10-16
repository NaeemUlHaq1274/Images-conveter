import { useState } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import Main from './Components/Main/Main'
import Footer from './Components/Footer/Footer'
import ImageUploader from './Components/Test/Test'

function App() {

  return (
    <div className='app'>
      <Header />
      <Main />
      {/* <ImageUploader /> */}
      <Footer />
    </div>
  )
}

export default App
