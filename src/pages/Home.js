import React, { useState } from 'react'

import { Col, Container, Row, Spinner } from 'react-bootstrap'

function Home(props) {
    const data = props.data
    const [loader, setLoader] = useState(false);

    const addToCartBtn = (item) => {
        props.addToCart(item)
    }


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
                        data && data.map((d, index) => {
                            return (
                                <Col lg={3} className="mb-4" key={index}>
                                    <div class="card" >
                                        <img src={d.image} class="card-img-top" alt="img" />
                                        <div class="card-body">
                                            <h5 class="card-title">{d.title}</h5>
                                            <p class="card-text">{d.description}</p>
                                            <button className='btn btn-secondary' onClick={() => addToCartBtn(d)}>Add to cart</button>
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