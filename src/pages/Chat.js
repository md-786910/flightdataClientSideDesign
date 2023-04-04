import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { createChatCompletionFn, handleUserInput } from '../components/chatGPTchatCompletion';
import { API } from "./api";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { addSpinner, generateQuotationPdfCart, removeSpinner, generateQuotation, generateProductTable } from "./utils";
import Model from "../components/Model";

const addToCartRegex = /add\s(.+?)(\sto\s(cart|basket))?|add\s(.+)/i;
const cartTotalRegex = /\b(cart|basket)\b.*\b(total|price)\b/i;
const cartItemsRegex = /(what is|show me|get) (my )?(cart items|cart|shopping cart)/i;
const generateQuotationRegex = /^(generate|create)\s(quotation|pdf)$/;

const showProductTableRegex = /(\d+)\s*(\w+)/g;

function Chat() {
    const [products, setProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState("");
    const [productFind, setProductFind] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);

    // model

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);


    const validateForm = useCallback(() => prompt !== "", [prompt]);
    const handleReset = useCallback((e) => {
        e.preventDefault();
        setPrompt("");
        setResponse("");
    }, []);

    const handleSubmit = useCallback(async (e) => {

        // e.preventDefault();

        if (validateForm()) {
            try {
                setLoading(true);
                if (addToCartRegex.test(prompt) || cartTotalRegex.test(prompt) || cartItemsRegex.exec(prompt)) {
                    const data = await handleUserInput(prompt, products, cartProducts);
                    console.log("userhandle");
                    setResponse(data);
                }
                else if (generateQuotationRegex.test(prompt) || generateQuotationRegex.exec(prompt)) {
                    // const resp = await generateQuotationPdfCart(e)
                    // console.log(resp);
                    await generateQuotation(e)

                } else if (showProductTableRegex.test(prompt) || showProductTableRegex.exec(prompt)) {
                    const { data } = await generateProductTable(prompt);
                    setProductFind(data.data);
                    setTotalPrice(data?.price);
                    setTotalQty(data?.qty);
                    setShow(true);
                }
                else {
                    const data = await createChatCompletionFn(prompt, products);
                    setResponse(data);
                }
            } catch (err) {
                console.log(err);
                setResponse("Error fetching data from open Ai");
            } finally {
                setLoading(false);
                setCartProducts([])
            }
        }
    }, [products, prompt, validateForm, cartProducts]);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter") {
                handleSubmit(e);
            }
        },
        [handleSubmit]
    );

    useEffect(() => {
        axios
            .get(`${API}/getProduct`)
            .then(({ data }) => {
                setProducts(data.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axios.get(`${API}/getCart`)
            .then(({ data }) => {
                setCartProducts(data?.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [response]);


    return (
        <>
            <Model />

            <div className="container spacer" >
                <div className="card">
                    <div className="card-body">
                        <div >

                            <div className="form-group mb-3">
                                <label className="chatbot-header">Ask your query</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    required
                                    placeholder="What is the price of iphone X?"
                                    onKeyDown={handleKeyPress}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                                <button
                                    type="reset"
                                    className="btn btn-secondary mx-2"
                                    onClick={handleReset}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className="chatbot-response">
                            <p>Answer:</p>
                            {loading ? 'Processing...' : response ? '' : 'Enter Your Query'}
                            {loading ? null : response && <p>{response}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/*Model */}
            <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Product Available</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="productExp">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Product Price (in Rs) </th>
                                    <th>Product Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productFind?.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product?.productName}</td>
                                        <td>{product.price}</td>
                                        <td>{product.qty}</td>

                                    </tr>
                                ))}
                            </tbody>
                            <tr>
                                <td>
                                    <h4>Total Quantity</h4>
                                </td>
                                <td> <h4> = </h4></td>
                                <td>
                                    <h4>{totalQty}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4>Total Price</h4>
                                </td>
                                <td> <h4> = </h4></td>
                                <td>
                                    <h4>{totalPrice.toLocaleString('en-IN')} Rs</h4>
                                </td>
                            </tr>
                        </Table>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
            {/*Model end */}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Product Description</th>
                        <th>Product Price (in Rs) </th>
                        <th>Product Qty</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product._id}>
                            <td>{product?._id}</td>
                            <td>{product?.productName}</td>
                            <td>{product?.description}</td>
                            <td>{product.price}</td>
                            <td>{product.qty}</td>
                            <td style={{ width: "10%" }}>
                                <img src={product.image} alt="img" style={{ width: "100%" }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>


        </>
    );
}

export default Chat;
