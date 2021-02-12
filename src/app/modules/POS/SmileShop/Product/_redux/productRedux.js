require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

//http://uat.siamsmile.co.th:9188/swagger/index.html
//https://json-to-js.com/
// action type บอกว่า Redux ตัวนี้ สามารถทำอะไรได้บ้าง
export const actionTypes = {
  // ADD_PLAYER: '[Add player] Action',
  UPDATE_PRODUCT: '[UPDATE_PRODUCT] Action',
  RESET_PRODUCT: '[RESET_PRODUCT] Action',
  SET_OPENMODAL: "[SET_OPENMODAL] Action",
  RESET_OPENMODAL: "[RESET_OPENMODAL] Action",
  SET_OPENMODAL_ADD: "[SET_OPENMODAL_ADD] Action"
};

// state ค่าที่ถูกเก็บไว้
const initialState = {
  productToAdd: {
    //Id:0,
    productName: "",
    productPrice: 0,
    stockCount: 0,
    productGroupId: 0,
    productStatus: true
  },

  openModal: {
    productId: 0,
    modalOpen: false
  },

  paginated: {
    page: 1,
    recordsPerPage: 10,
    orderingField: "",
    ascendingOrder: true,
  },



};

// reducer แต่ละ Action จะไป update State อย่างไร
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_PRODUCT: {
      return { ...state, productToAdd: action.payload };
    }

    case actionTypes.RESET_PRODUCT: {
      return { ...state, productToAdd: initialState.productToAdd, currentPage: 0 };
    }

    case actionTypes.SET_OPENMODAL: {
      return { ...state, openModal: action.payload };
    }

    case actionTypes.RESET_OPENMODAL: {
      return {
        ...state,
        openModal: initialState.openModal,
      };
    }

    default:
      return state;
  }
};

//action เอาไว้เรียกจากข้างนอก เพื่อเปลี่ยน state
export const actions = {

  resetOpenModal: () => ({ type: actionTypes.RESET_OPENMODAL, }),
  setOpenModal: (payload) => ({ type: actionTypes.SET_OPENMODAL, payload, }),
  updateProduct: (payload) => ({ type: actionTypes.UPDATE_PRODUCT, payload }),
  resetProduct: () => ({ type: actionTypes.RESET_PRODUCT }),
};
