import React, { createElement, useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';
import { addSpinner, showToastError, removeSpinner, showToastSuccess } from './utils';

function Quotation(props) {

    const getQuotation = async (event) => {
        try {
            addSpinner(event)
            const resp = await axios.get("http://localhost:5000/getQuotation");
            if (resp.data.success) {

                // event.target.download = resp.data.data;
                window.location.href = resp.data.data;

                // resp.data.data
                removeSpinner(event, "generate quotation")
                showToastSuccess("Quotation download successfully")
            } else {
                showToastError("unable to download Quotation")
            }

        } catch (error) {
            showToastError("unable to download Quotation")
        }

    }

    return (
        <Container fluid className="p-0">
            <div className="spacer">

                <div className="qoutationBox d-flex gap-4">

                    <button className=" btn btn-success" onClick={(event) => getQuotation(event)} style={{ width: "15%" }}>generate quotation</button>

                </div>



            </div>


        </Container>

    )
}

export default Quotation