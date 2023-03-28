import React, { useEffect, useState } from 'react'

import Navbar from "./components/Header/Header";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css"
import Home from './pages/Home';
import Cart from './pages/Cart';
import Footer from './components/Footer/Footer';
import Chat from './pages/Chat';
import Quotation from './pages/Quotation';
function App() {


  const [len, setLen] = useState(0);

  const ScrollTop = () => {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
      });


    }, [location.pathname]);
    return null;
  };


  const getLen = (props) => {
    console.log(props);
    setLen(props);

  }


  return (
    <>
      <Router>
        <ScrollTop />
        <Navbar len={len.length} />
        <Routes>
          <Route path="/" element={<Home key={Math.random()} getLen={getLen} />} />
          <Route path="/carts" element={<Cart getLen={getLen} />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/getQuotation' element={<Quotation />} />

        </Routes>

      </Router>




    </>

  );
}

export default App;

