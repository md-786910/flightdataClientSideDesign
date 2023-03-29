import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import axios from 'axios';
import { API } from './pages/api';
function App() {
  const [len, setLen] = useState(0);
  const [render, setRender] = useState(0);


  const fetchCart = async () => {
    try {
      const resp = await axios(`${API}/getCart`)
      if (resp.data.success) {
        setLen(resp.data.data)
      } else {
        return;
      }
    } catch (error) {
      alert(error.message)
    }
  }
  const getLen = (props) => {
    setRender(props);
  }


  useEffect(() => {
    fetchCart();
  }, [render])


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
  // <ScrollTop />
  return (
    <>
      <Router>
        <Navbar len={len.length || 0} />
        <Routes>
          <Route path="/" element={<Home getLen={getLen} />} />
          <Route path="/carts" element={<Cart getLen={getLen} />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/getQuotation' element={<Quotation />} />
        </Routes>
        <ToastContainer />
      </Router>




    </>

  );
}

export default App;

