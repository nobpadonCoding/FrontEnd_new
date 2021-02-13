// connect api
import axios from 'axios'
import * as CONST from '../../../../../../Constants';
import { encodeURLWithParams } from '../../../../Common/components/ParamsEncode';

const SMILESHOP_URL = `${CONST.API_URL}/SmileShop`

export const deleteProductGroup = (id) => {
    return axios.delete(`${SMILESHOP_URL}/ProductGroup/${id}`);
};

export const addProductGroup = (payload) => {
    return axios.post(`${SMILESHOP_URL}/ProductGroups`, payload);
};

export const editProductGroup = (payload, id) => {
    return axios.put(`${SMILESHOP_URL}/ProductGroup/Update/${id}`, payload);
};

export const getProductGroup = (id) => {
    return axios.get(`${SMILESHOP_URL}/ProductGroups/${id}`);
};
export const getProductsGroupFilter = (orderingField, ascendingOrder, page, recordsPerPage, productGroupName) => {
    let payload = {
        page,
        recordsPerPage,
        orderingField,
        ascendingOrder,
        productGroupName
    }
    return axios.get(encodeURLWithParams(`${SMILESHOP_URL}/ProductGroup/filter`, payload))
}