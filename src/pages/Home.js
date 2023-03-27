import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';

function Home(props) {


    const [loader, setLoader] = useState(true);
    const [product, setProduct] = useState([])

    const fetchProduct = async () => {
        try {
            const resp = await axios(`${API}/getProduct`)
            if (resp.data.success) {
                setProduct(resp.data.data)
                setLoader(false)
            } else {
                return;
            }
        } catch (error) {
            alert(error.message)
        }
    }


    const addToCart = async (id) => {
        try {
            const resp = await fetch(`${API}/carts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            })
            setLoader(true)
            const data = await resp.json();
            if (data.success) {
                // window.location.reload();
                setLoader(false)
                fetchProduct();
            } else {
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line
    }, [])






    return (
        <Container fluid className="p-0">
            <div className="spacer">
                <h2 className='topH1Space'>
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
                                <Col lg={3} className="mb-4" key={index} style={{ width: "25%" }}>
                                    <div class="card" >
                                        <img src={d.image} class="card-img-top img-size" alt="img" />
                                        <div class="card-body">
                                            <h5 class="card-title">{d.productName}</h5>
                                            <p class="card-text">{d.description}</p>
                                            Rs : <span class="card-text">{d.price}</span>
                                            <br />
                                            <br />
                                            <button className='btn btn-secondary' onClick={() => addToCart(d._id)}>Add to cart</button>
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