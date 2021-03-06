import { combineReducers } from "redux";
import { all } from "redux-saga/effects";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import * as demo from '../app/modules/_Demo/_redux/demoRedux';
import * as employee from '../app/modules/_EmployeeDemo/_redux/employeeRedux';
import * as product from '../app/modules/POS/SmileShop/Product/_redux/productRedux';
import * as productGroup from '../app/modules/POS/SmileShop/ProductGroup/_redux/productgroupRedux';
import * as order from '../app/modules/POS/SmileShop/Order/_redux/orderRedux'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  demo: demo.reducer,
  employee: employee.reducer,
  product: product.reducer,
  productGroup: productGroup.reducer,
  order: order.reducer
});


export function* rootSaga() {
  yield all([order.saga()]);
}

