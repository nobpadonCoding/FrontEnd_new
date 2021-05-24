import axios from 'axios'
import * as CONST from '../../../../../../Constants';
import { encodeURLWithParams } from '../../../../Common/components/ParamsEncode';

const SMILESHOP_URL = `${CONST.API_URL}/SmileShop`

export const addOrder = (payload) => {
    return axios.post(`${SMILESHOP_URL}/Order`, payload);
};

export const getOrder = (id) => {
    return axios.get(`${SMILESHOP_URL}/Order/${id}`);
};

export const getOrderAll = () => {
    return axios.get(`${SMILESHOP_URL}/Order`);
};

export const getOrderFilter = (orderingField, ascendingOrder, page, recordsPerPage, OrderNumber, StartDate, EndDate) => {

    let payload = {
        page,
        recordsPerPage,
        orderingField,
        ascendingOrder,
        OrderNumber,
        StartDate,
        EndDate
    }
    return axios.get(encodeURLWithParams(`${SMILESHOP_URL}/Orders/filter`, payload));

};