import axios from 'axios'
import * as CONST from '../../../../../../Constants';
import { encodeURLWithParams } from '../../../../Common/components/ParamsEncode';

const SMILESHOP_URL = `${CONST.API_URL}/SmileShop`

export const addOrder = (payload) => {
    return axios.post(`${SMILESHOP_URL}/Order`, payload);
};