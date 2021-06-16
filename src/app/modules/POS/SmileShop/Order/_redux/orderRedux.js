import { put, takeLatest } from "redux-saga/effects";

require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

//http://uat.siamsmile.co.th:9188/swagger/index.html
//https://json-to-js.com/
// action type บอกว่า Redux ตัวนี้ สามารถทำอะไรได้บ้าง
export const actionTypes = {

	UPDATE_PRODUCT: '[UPDATE_PRODUCT] Action',
	GET_PRODUCT: "[GET_PRODUCT] Action",

	SET_OPENDIALOG: "[SET_DIALOG] action",
	SET_OPENDIALOG_SUMMARY: "[SET_OPENDIALOG_SUMMARY] action",

	ADD_ORDER_DETAIL: "[ADD_ORDER_DETAIL] Action",
	UPDATE_ORDER_DETAIL: "[UPDATE_ORDER_DETAIL] Action",
	REMOVE_QUANTITY_ORDER_DETAIL: "[REMOVE_QUANTITY_ORDER_DETAIL] Action",
	SUM_ORDER_SUBTOTAL: "[SUM_ORDER_SUBTOTAL] Action",

	RESET_ORDER_DETAIL: "[RESET_ORDER_DETAIL] Action",
	RESET_ORDER_SUBTOTAL: "[RESET_ORDER_SUBTOTAL] Action",
	RESET_DIALOG: '[RESET_DIALOG] Action',
	RESET_DIALOG_ORDER_SUMMARY: '[RESET_DIALOG_ORDER_SUMMARY] Action',

	RESET_ORDER_HEADER: '[RESET_ORDER_HEADER] Action',

	GET_ORDER_DETAIL: '[GET_ORDER_DETAIL] Action',

	CALCULATE: "[Calculate] Action",

	//charts
	SET_CHARTS: "[SET_CHARTS] action"

};

// state ค่าที่ถูกเก็บไว้
const initialState = {

	productGet: {
		productGroupId: 0,
		clickProductGroup: false
	},

	dialogOrder: {
		openDialog: false
	},

	dialogOrderSummary: {
		openDialog: false
	},

	productObj: {
		productId: 0,
		productName: "",
		productPrice: 0,
		stockCount: 0,
		productGroupId: 0,
	},

	orderDetail: [],

	orderHeader: {
		total: 0,
		discount: 0,
		totalAmount: 0,
		productQuantity: 0,
		openDialogOrderDetail: false,
		orderDetail: []
	},

	orderSubtotal: {
		subtotal: 0
	},
	//charts
	charts: {
		name: 'NULL',
		categoriesList: [],
		attributeData: [],
		discount: [],
		totalAmount: []
	}
};

// reducer แต่ละ Action จะไป update State อย่างไร
export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_PRODUCT: {
			return { ...state, productGet: action.payload };
		}

		case actionTypes.SET_OPENDIALOG: {
			return { ...state, dialogOrder: action.payload };
		}

		case actionTypes.UPDATE_PRODUCT: {
			return { ...state, productObj: action.payload };
		}

		case actionTypes.RESET_DIALOG: {
			return { ...state, dialogOrder: initialState.dialogOrder };
		}

		case actionTypes.ADD_ORDER_DETAIL: {
			let orderDetailUpdate = [...state.orderDetail];
			let count = [...state.orderDetail].length;
			if (count > 0) {
				let hasOrder = state.orderDetail.find(obj => obj.productId === action.payload.productId);
				if (!hasOrder) {

					//ไม่มี product ใน array add เข้าไป
					let orderDetail = [...state.orderDetail, action.payload];
					return { ...state, orderDetail: orderDetail };

				} else {

					// มี product ใน array + qty
					hasOrder.productQuantity += action.payload.productQuantity;
					return { ...state, orderDetailUpdate };
				}

			} else {
				let orderDetail = [...state.orderDetail, action.payload];
				return { ...state, orderDetail: orderDetail };
			}
		}

		case actionTypes.REMOVE_QUANTITY_ORDER_DETAIL: {

			//remove product quantity = 0
			return { ...state, orderDetail: state.orderDetail.filter(i => i !== action.payload) };
		}

		case actionTypes.SUM_ORDER_SUBTOTAL: {

			return { ...state, orderSubtotal: action.payload };
		}

		case actionTypes.SET_OPENDIALOG_SUMMARY: {
			return { ...state, dialogOrderSummary: action.payload };
		}

		case actionTypes.RESET_ORDER_DETAIL: {
			return { ...state, orderDetail: initialState.orderDetail };
		}

		case actionTypes.RESET_ORDER_SUBTOTAL: {
			return { ...state, orderSubtotal: initialState.orderSubtotal };
		}

		case actionTypes.RESET_DIALOG_ORDER_SUMMARY: {
			return { ...state, dialogOrderSummary: initialState.dialogOrderSummary };
		}
		case actionTypes.RESET_ORDER_HEADER: {
			return { ...state, orderHeader: initialState.orderHeader };
		}

		case actionTypes.GET_ORDER_DETAIL: {
			return { ...state, orderHeader: action.payload };
		}
		case actionTypes.SET_CHARTS: {
			debugger
			return { ...state, charts: action.payload };
		}

		case actionTypes.CALCULATE: {

			let subtotal = [...state.orderDetail].reduce((prev, curr) => prev + curr.productPrice * curr.productQuantity, 0);
			return { ...state, orderSubtotal: { subtotal } };
		}

		default:
			return state;
	}
};

//action เอาไว้เรียกจากข้างนอก เพื่อเปลี่ยน state
export const actions = {

	updateProduct: (payload) => ({ type: actionTypes.UPDATE_PRODUCT, payload }),
	getProduct: (payload) => ({ type: actionTypes.GET_PRODUCT, payload }),
	setOpenDialog: (payload) => ({ type: actionTypes.SET_OPENDIALOG, payload, }),
	resetDialog: () => ({ type: actionTypes.RESET_DIALOG }),

	addOrderDetail: (payload) => ({ type: actionTypes.ADD_ORDER_DETAIL, payload }),
	updateOrderDetail: (payload) => ({ type: actionTypes.ADD_ORDER_DETAIL, payload }),
	deleteorderDetail: (payload) => ({ type: actionTypes.REMOVE_QUANTITY_ORDER_DETAIL, payload }),
	sumOrderSubtotal: (payload) => ({ type: actionTypes.SUM_ORDER_SUBTOTAL, payload }),
	setOpenDialogSummary: (payload) => ({ type: actionTypes.SET_OPENDIALOG_SUMMARY, payload, }),
	resetOrderDetail: () => ({ type: actionTypes.RESET_ORDER_DETAIL }),
	resetOrderSubtotal: () => ({ type: actionTypes.RESET_ORDER_SUBTOTAL }),
	resetOrderDialogSummary: () => ({ type: actionTypes.RESET_DIALOG_ORDER_SUMMARY }),
	resetOrderHeader: () => ({ type: actionTypes.RESET_ORDER_HEADER }),
	getOrderDetail: (payload) => ({ type: actionTypes.GET_ORDER_DETAIL, payload }),
	setCharts: (payload) => ({ type: actionTypes.SET_CHARTS, payload }),

	calculate: () => ({ type: actionTypes.CALCULATE }),
}

export function* saga() {
	// yield takeLatest(actionTypes.ACTIONTYPE, function* actionNameSaga() {
	//   yield put(actions.actionToExecute());
	// });

	yield takeLatest(actionTypes.ADD_ORDER_DETAIL, function* updateOrderSaga() {
		yield put(actions.calculate());
	});
}