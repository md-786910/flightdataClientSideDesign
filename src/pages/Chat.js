import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { createChatCompletionFn, handleUserInput } from '../components/chatGPTchatCompletion';
import { API } from "./api";
const addToCartRegex = /add\s(.+?)(\sto\s(cart|basket))?|add\s(.+)/i;
const cartTotalRegex = /\b(cart|basket)\b.*\b(total|price)\b/i;

function Chat () {
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
                if (addToCartRegex.test(prompt) || cartTotalRegex.test(prompt)) {
                    const data = handleUserInput(prompt, products, cartProducts);
                    setResponse(data);
                } else {
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
    }, [products, prompt, validateForm]);

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

    }, []);

    return (
        <>
            <div className="container " style={{ marginTop: "6em" }}>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
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
                                <button type="submit" className="btn btn-primary" >
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
                        </form>
                        <div className="chatbot-response">
                            <p>Answer:</p>
                            {loading ? 'Processing...' : response ? '' : 'Enter Your Query'}
                            {response && <p>{response}</p>}
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
