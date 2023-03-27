import React, { useState } from 'react';
import "./header.css";
import { Link } from 'react-router-dom'
import { AiOutlineShoppingCart } from "react-icons/ai"
const Navbar = (props) => {

    const cartLenght = props.len || 0
    // console.log(props);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top">
                <div className="container-fluid ">
                    <Link className="navbar-brand" to="/">
                        <span className="logo fw-bold">
                            FlightData
                        </span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item ">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>

                            <li className="nav-item ">
                                <Link className="nav-link active" aria-current="page" to="/chat">Chat</Link>
                            </li>

                        </ul>

                        <div className="menuBox" style={{ marginLeft: "1em" }}>
                            <Link to="/carts">
                                <div className="cartIconsBox">
                                    <AiOutlineShoppingCart className='iconCart' size={25} color={"white"} />
                                    <span class="badge bg-danger">{cartLenght}</span>
                                </div>
                            </Link>
                        </div>

                    </div>

                </div>

            </nav>
        </>
    );
};

export default Navbar;
