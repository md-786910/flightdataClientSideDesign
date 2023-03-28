import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';

function Cart(props) {



    const [loader, setLoader] = useState(true);
    const [product, setProduct] = useState([])

    const fetchCart = async () => {
        try {
            const resp = await axios(`${API}/getCart`)
            if (resp.data.success) {
                setProduct(resp.data.data)
                props.getLen(resp.data.data)
                setLoader(false)
            } else {
                return;
            }
        } catch (error) {
            alert(error.message)
        }
    }

    const deleteCart = async (id) => {
        try {
            const resp = await fetch(`${API}/deleteCart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            })
            setLoader(true)
            const data = await resp.json();
            if (data.success) {
                setLoader(false)
                fetchCart();
                // window.location.reload();

            } else {
                return;
            }
        } catch (error) {
            // alert(error.message)
            console.log(error);
        }
    }


    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line
    }, [])




    return (

        <Container fluid className="p-0 ">
            <div className="spacer">
                <h2 className=''>
                    Your Cart
                </h2>
                <div className="loader mt-4">
                    {
                        loader && <Spinner size={30} variant='success' animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    }
                </div>

                {
                    product.length > 0 ? <Row>
                        {
                            product && product.map((d, index) => {
                                return (
                                    <Col lg={3} className="mb-4" key={index}>
                                        <div class="card" >
                                            <img src={d.image} class="card-img-top" alt="img" />
                                            <div class="card-body">
                                                <h5 class="card-title">{d.productName}</h5>
                                                <p class="card-text">{d.description}</p>
                                                Rs : <span class="card-text">{d.price}</span>
                                                <br />
                                                <br />
                                                <button className='btn btn-danger' onClick={() => deleteCart(d._id)}>Remove </button>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }

                    </Row> : <h3>Your Cart Empty</h3>
                }


            </div>


        </Container>

    )
}

export default Cart