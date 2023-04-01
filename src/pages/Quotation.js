import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { API } from './api';
import { addSpinner, showToastError, generateQuotation } from './utils';
import { Link } from 'react-router-dom';

function Quotation(props) {

    const [data, setData] = useState([]);

    const getQuotation = async () => {
        try {
            const resp = await axios.get(`${API}/getQuotation`);

            if (resp.data.success) {
                setData(resp.data.data);
            } else {
                showToastError("unable to fetch Quotation")
            }

        } catch (error) {
            showToastError("something error")
        }
    }

    const generateQuotationBtn = async (event) => {
        const resp = await generateQuotation(event)
        if (resp) {
            getQuotation();
        }
    }




    useEffect(() => {
        getQuotation();
    }, [])

    return (
        <Container fluid className="p-0">
            <div className="spacer">

                <div className="qoutationBox d-flex gap-4">
                    <button className=" btn btn-success" onClick={(event) => generateQuotationBtn(event)}>generate quotation</button>
                </div>


                <div className="mt-5">
                    <h6>
                        All Quotation
                    </h6>
                    <div className="mt-4">

                        <div>

                            <table class="table table-group-divider table-bordered table-striped ">
                                <thead>
                                    <tr>
                                        <th scope="col">S No.</th>
                                        <th scope="col">Pdf Url</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.map((d, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>
                                                        <a href={d.cloudinaryUrl} download="quote" target="_blank" rel="noreferrer">{d.cloudinaryUrl}</a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>


            </div>


        </Container>

    )
}

export default Quotation
