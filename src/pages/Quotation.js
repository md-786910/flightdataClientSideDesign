import React, { createElement, useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';
import { addSpinner, showToastError, removeSpinner, showToastSuccess } from './utils';
import { Link } from 'react-router-dom';

function Quotation(props) {

    const [link, setLink] = useState("");

    const getQuotation = async () => {
        try {
            const resp = await axios.get(`${API}/getQuotation`);

            console.log("resp" + resp.data.data);
            if (resp.data.success) {
                setLink(resp.data.data);
            } else {
                showToastError("unable to get Quotation")
            }

        } catch (error) {
            console.log(error);
            showToastError("something error")
        }

    }
    useEffect(() => {
        getQuotation();
    }, [])

    return (
        <Container fluid className="p-0">
            <div className="spacer">

                <div className="qoutationBox d-flex gap-4">



                    <a href={link} download={"quotation"} className='d-block'>
                        <button className=" btn btn-success" >generate quotation</button>
                    </a>

                </div>



            </div>


        </Container>

    )
}

export default Quotation