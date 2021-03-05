require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

//http://uat.siamsmile.co.th:9188/swagger/index.html
//https://json-to-js.com/
// action type บอกว่า Redux ตัวนี้ สามารถทำอะไรได้บ้าง
export const actionTypes = {

	UPDATE_PRODUCT: '[UPDATE_PRODUCT] Action',
	RESET_DIALOG: '[RESET_DIALOG] Action',
	GET_PRODUCT: "[GET_PRODUCT] Action",
	SET_OPENDIALOG: "[SET_DIALOG] action",
	GET_PRODUCT_DETAIL: "[GET_PRODUCT_DETAIL] Action",
	UPDATE_ORDER_DETAIL: "[UPDATE_ORDER_DETAIL] Action",
	REMOVE_QUANTITY_ORDER_DETAIL: "[REMOVE_QUANTITY_ORDER_DETAIL] Action"

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
	productObj: {
		productId: 0,
		productName: "",
		productPrice: 0,
		stockCount: 0,
		productGroupId: 0,
	},
	orderDetail: []
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

		case actionTypes.GET_PRODUCT_DETAIL: {
			return { ...state, orderDetail: action.payload };
		}

		case actionTypes.UPDATE_ORDER_DETAIL: {

			return { ...state, orderDetail: action.payload };
		}

		case actionTypes.REMOVE_QUANTITY_ORDER_DETAIL: {

			//remove product quantity = 0
			return { ...state, orderDetail: state.orderDetail.filter(i => i !== action.payload) };
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
	getProductDetail: (payload) => ({ type: actionTypes.GET_PRODUCT_DETAIL, payload }),
	updateProductDetail: (payload) => ({ type: actionTypes.UPDATE_ORDER_DETAIL, payload }),
	deleteorderDetail: (payload) => ({ type: actionTypes.REMOVE_QUANTITY_ORDER_DETAIL, payload }),
}