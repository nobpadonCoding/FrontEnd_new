// connect api
import axios from 'axios'
import * as CONST from '../../../../../../Constants';
import { encodeURLWithParams } from '../../../../Common/components/ParamsEncode';

const SMILESHOP_URL = `${CONST.API_URL}/SmileShop`

export const deleteProduct = (id) => {
    return axios.delete(`${SMILESHOP_URL}/Product/${id}`);
};

export const addProduct = (payload) => {
    return axios.post(`${SMILESHOP_URL}/Products`, payload);
};

export const editProduct = (payload, id) => {
    return axios.put(`${SMILESHOP_URL}/Product/Update/${id}`, payload);
};

export const getProduct = (id) => {
    return axios.get(`${SMILESHOP_URL}/Product/${id}`);
};
export const getProductsFilter = (orderingField, ascendingOrder, page, recordsPerPage, productName, productGroupName) => {
    let payload = {
        page,
        recordsPerPage,
        orderingField,
        ascendingOrder,
        productName,
        productGroupName
    }
    return axios.get(encodeURLWithParams(`${SMILESHOP_URL}/Products/filter`, payload))


};

export const getStockFilter = (orderingField, ascendingOrder, page, recordsPerPage, productName) => {
    let payload = {
        page,
        recordsPerPage,
        orderingField,
        ascendingOrder,
        productName
    }
    return axios.get(encodeURLWithParams(`${SMILESHOP_URL}/Stock/filter`, payload))


}