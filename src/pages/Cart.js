import React, { useState } from 'react'

import { Col, Container, Row, Spinner } from 'react-bootstrap'

function Cart(props) {
    const [loader, setLoader] = useState(false);

    const [cart, setCart] = useState(props.cart);
    const removeCart = (id) => {
        props.removeCartById(id);
    }

    return (

        <Container fluid className="p-0">
            <div className="spacer">
                <h2 className='topH1Space'>
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
                    cart.length > 0 ? <Row>
                        {
                            cart && cart.map((d, index) => {
                                return (
                                    <Col lg={3} className="mb-4" key={index}>
                                        <div class="card" >
                                            <img src={d.image} class="card-img-top" alt="img" />
                                            <div class="card-body">
                                                <h5 class="card-title">{d.title}</h5>
                                                <p class="card-text">{d.description}</p>
                                                <button className='btn btn-danger' onClick={() => removeCart(index)}>Remove </button>
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