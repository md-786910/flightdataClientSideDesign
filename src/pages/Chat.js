import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { createChatCompletionFn, handleUserInput } from '../components/chatGPTchatCompletion';
import { API } from "./api";
import { generateQuotation, generateQuotationPdfCart } from "./utils";
const addToCartRegex = /add\s(.+?)(\sto\s(cart|basket))?|add\s(.+)/i;
const cartTotalRegex = /\b(cart|basket)\b.*\b(total|price)\b/i;
const cartItemsRegex = /(what is|show me|get) (my )?(cart items|cart|shopping cart)/i;
const generateQuotationRegex = /^(generate|create)\s(quotation|pdf)$/;

function Chat() {
    const [products, setProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState("");

    const validateForm = useCallback(() => prompt !== "", [prompt]);
    const handleReset = useCallback((e) => {
        e.preventDefault();
        setPrompt("");
        setResponse("");
    }, []);

    const handleSubmit = useCallback(async (e) => {

        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                if (addToCartRegex.test(prompt) || cartTotalRegex.test(prompt) || cartItemsRegex.exec(prompt)) {
                    const data = await handleUserInput(prompt, products, cartProducts);
                    console.log("userhandle");
                    setResponse(data);
                }
                else if (generateQuotationRegex.test(prompt) || generateQuotationRegex.exec(prompt)) {
                    const resp = await generateQuotationPdfCart(e)
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
                                    className="btn btn-secondary ml-2"
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
