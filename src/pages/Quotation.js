import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';

function Quotation(props) {

    return (
        <Container fluid className="p-0">
            <div className="spacer">

                <div className="qoutationBox d-flex gap-4">

                    <button className="btn btn-outline-success">generate quotation</button>
                    <button className="btn btn-outline-primary">create a quotation</button>
                    <button className="btn btn-info">make a pdf file</button>

                </div>



            </div>


        </Container>

    )
}

export default Quotation