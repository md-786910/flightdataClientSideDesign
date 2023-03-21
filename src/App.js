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
function App() {

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

  const [data, setData] = useState([
    {
      id: 1,
      title: "camera",
      description: "Product Image A marketing image that will be visible to customers in search results and other marketing channels.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFoesbUsZNz3TSilBs5i6P1XA25xv30EZ-r7ohFd9Pw&s"
    },
    {
      id: 2,
      title: "camera",
      description: "Product Image A marketing image that will be visible to customers in search results and other marketing channels.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFoesbUsZNz3TSilBs5i6P1XA25xv30EZ-r7ohFd9Pw&s"
    },
    {
      id: 3,
      title: "camera",
      description: "Product Image A marketing image that will be visible to customers in search results and other marketing channels.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFoesbUsZNz3TSilBs5i6P1XA25xv30EZ-r7ohFd9Pw&s"
    },
    {
      id: 4,
      title: "camera",
      description: "Product Image A marketing image that will be visible to customers in search results and other marketing channels.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFoesbUsZNz3TSilBs5i6P1XA25xv30EZ-r7ohFd9Pw&s"
    },

  ])

  const [cart, setCart] = useState([])
  const addToCart = (item) => {
    setCart([...cart, item])
  }
  const removeCartById = (id) => {
    console.log(cart);
    const filterData = cart.filter((i, index) => index !== id);
    setCart(filterData);
  }

  return (
    <>
      <Router>
        <ScrollTop />
        <Navbar len={cart && cart.length} />
        <Routes>
          <Route path="/" element={<Home data={data} addToCart={addToCart} />} />
          <Route path="/carts" element={<Cart cart={cart} removeCartById={removeCartById} key={Math.random()} />} />
        </Routes>
      </Router>




    </>

  );
}

export default App;

