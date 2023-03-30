import { toast } from 'react-toastify';
import axios from 'axios';
import { API } from './api';

export const addSpinner = (event) => {
    event.target.innerHTML = '<div class="spinner-border spinner-border-sm text-white " role="status" />';
    event.target.disabled = true;
}
export const removeSpinner = (event, text = "add to cart") => {
    event.target.innerHTML = text;
    event.target.disabled = false;
}

export const showToastSuccess = (text) => {
    toast.success(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

}
export const showToastError = (text) => {
    toast.error(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

}

export const generateQuotation = async (event) => {
    addSpinner(event);
    try {
        const resp = await axios.get(`${API}/generate-pdf`);

        console.log(resp.data.data);
        if (resp.data.success) {
            showToastSuccess("successfully quotation generated")
            return true;
        } else {
            showToastError("unable to generate Quotation")
            return false;
        }

    } catch (error) {
        showToastError("something error")
        return false;
    } finally {
        removeSpinner(event, "generate quotation")
    }
}



export const generateQuotationPdfCart = async (event) => {
    try {
        const resp = await axios.get(`${API}/jsontopdf`);
        if (resp.data) {
            showToastSuccess("successfully quotation generated")
            const url = `${API}/pdf/cart.pdf`;
            await window.open(url, '_blank').focus();

            return true;
        } else {
            showToastError("unable to generate Quotation")
            return false;
        }

    } catch (error) {
        showToastError("something error")
        return false;
    }
}