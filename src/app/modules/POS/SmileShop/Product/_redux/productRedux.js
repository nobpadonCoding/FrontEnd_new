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

  SET_OPENMODAL_STOCK: "[SET_OPENMODAL_STOCK] Action",
  RESET_OPENMODAL_STOCK: "[RESET_OPENMODAL_STOCK] Action",
  RESET_PRODUCT_STOCK: "[RESET_PRODUCT_STOCK] Action",
  UPDATE_STOCK: '[UPDATE_STOCK] Action'
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

  openModalStock: {
    stockId: 0,
    stockModalOpen: false
  },

  stockToAdd: {
    productId: 0,
    storeTypeId: 0,
    quantity: 0,
    productStockCount: "",
    stockAfter: ""
  }
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

    case actionTypes.SET_OPENMODAL_STOCK: {
      return { ...state, openModalStock: action.payload };
    }

    case actionTypes.RESET_OPENMODAL: {
      return {
        ...state,
        openModal: initialState.openModal,
      };
    }

    case actionTypes.RESET_OPENMODAL_STOCK: {
      return {
        ...state,
        openModalStock: initialState.openModalStock,
      };
    }

    case actionTypes.RESET_PRODUCT_STOCK: {
      return {
        ...state, stockToAdd: initialState.stockToAdd,
      };
    }

    case actionTypes.UPDATE_STOCK: {
      return { ...state, stockToAdd: action.payload };
    }

    default:
      return state;
  }
};

//action เอาไว้เรียกจากข้างนอก เพื่อเปลี่ยน state
export const actions = {

  resetOpenModal: () => ({ type: actionTypes.RESET_OPENMODAL }),
  setOpenModal: (payload) => ({ type: actionTypes.SET_OPENMODAL, payload, }),
  updateProduct: (payload) => ({ type: actionTypes.UPDATE_PRODUCT, payload }),
  resetProduct: () => ({ type: actionTypes.RESET_PRODUCT }),

  setOpenModalStock: (payload) => ({ type: actionTypes.SET_OPENMODAL_STOCK, payload, }),
  updateStockProduct: (payload) => ({ type: actionTypes.UPDATE_STOCK, payload }),
  resetOpenModalStock: () => ({ type: actionTypes.RESET_OPENMODAL_STOCK }),
  resetProductStock: () => ({ type: actionTypes.RESET_PRODUCT_STOCK }),
};
