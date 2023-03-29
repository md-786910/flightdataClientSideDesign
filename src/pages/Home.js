import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';
import { addSpinner, removeSpinner, showToast, showToastError, showToastSuccess } from './utils';

function Home(props) {
    const [loader, setLoader] = useState(true);
    const [product, setProduct] = useState([])

    const fetchProduct = async () => {
        try {
            const resp = await axios(`${API}/getProduct`)
            if (resp.data.success) {
                setProduct(resp.data.data)
                // showToastSuccess("fetch data product")
                setLoader(false)
            } else {
                return;
            }
        } catch (error) {
            showToastError("fetching data product failed")
        }
    }




    const addToCart = async (event, id) => {
        addSpinner(event);
        try {
            const resp = await fetch(`${API}/carts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            })
            const data = await resp.json();
            if (data.success) {
                props.getLen(Math.random())
                showToastSuccess("add to cart successfully")
                removeSpinner(event, "add to cart")
            } else {
                return;
            }
        } catch (error) {
            showToastError("add to cart failed")

        }

    }



    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line
    }, [])

    return (
        <Container fluid className="p-0">
            <div className="spacer">
                <h2 className=''>
                    Your Product
                </h2>
                <div className="loader mt-4">
                    {
                        loader && <Spinner size={30} variant='success' animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    }
                </div>
                <Row>
                    {
                        product && product.map((d, index) => {
                            return (
                                <Col lg={3} className="mb-4" key={index} >
                                    <div class="card" >
                                        <img src={d.image} class="card-img-top img-size" alt="img" />
                                        <div class="card-body">
                                            <h5 class="card-title">{d.productName}</h5>
                                            <p class="card-text">{d.description}</p>
                                            Rs : <span class="card-text">{d.price}</span>
                                            <br />
                                            <br />
                                            <button className='btn btn-success w-100' onClick={(event) => addToCart(event, d._id)}>
                                                add to cart
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    }


                </Row>


            </div>


        </Container>

    )
}

export default Home