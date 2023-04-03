import { toast } from 'react-toastify';
import axios from 'axios';
import { API, API_1 } from './api';

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
        const resp = await axios.get(`${API}/jsontopdf-1`);

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
        // const resp = await axios.get(`${API}/jsontopdf`, {
        //     url: `${API}/jsontopdf`

        // });

        addSpinner(event);


        axios.get(`${API}/jsontopdf`, { responseType: 'blob' }).then(res => {
            console.log(res);
            removeSpinner(event, "search")
            let ch = downloadFile(res);

        }).catch(err => {
            showToastError("unable to generate Quotation")
            return false;
        });

        const downloadFile = (res) => {
            const contentDisposition = res.headers['content-disposition'];
            const fileName = contentDisposition.split(';')[1].split('=')[1];

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}`);
            document.body.appendChild(link);
            link.click();
            return true
        }
    } catch (error) {
        showToastError("something error")
        return false;
    } finally {
        removeSpinner(event, "search")
    }

    return true;
}

export const generateProductTable = async (prompt) => {
    try {

        const split = prompt.split(/(,| and )/);
        const regex = /(\d+)\s+(\w+\s?\w+\s?[0-9]?)/g;
        let match;
        let products = [];
        split.forEach((item, index) => {
            if (index % 2 === 0) {
                while ((match = regex.exec(item)) !== null) {
                    products.push(({ product: match[2], quantity: match[1] }))
                }
            }
        })
        const productPresent = await axios.post(`${API}/getProductPresent`, { products });
        return productPresent
    } catch (error) {

    }
}

