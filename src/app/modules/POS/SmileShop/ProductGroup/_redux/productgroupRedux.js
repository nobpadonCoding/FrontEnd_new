require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

//http://uat.siamsmile.co.th:9188/swagger/index.html
//https://json-to-js.com/
// action type บอกว่า Redux ตัวนี้ สามารถทำอะไรได้บ้าง
export const actionTypes = {
  // ADD_PLAYER: '[Add player] Action',
  UPDATE_PRODUCT_GROUP: '[UPDATE_PRODUCT_GROUP] Action',
  RESET_PRODUCT_GROUP: '[RESET_PRODUCT_GROUP] Action',
  SET_OPENMODAL: "[SET_OPENMODAL] Action",
  RESET_OPENMODAL: "[RESET_OPENMODAL] Action",
};

// state ค่าที่ถูกเก็บไว้
const initialState = {
  productGroupToAdd: {
    //Id:0,
    productGroupName: "",
    productGroupStatus: true
  },

  openModalProductGroup: {
    productGroupId: 0,
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
    case actionTypes.UPDATE_PRODUCT_GROUP: {
      return { ...state, productGroupToAdd: action.payload };
    }

    case actionTypes.RESET_PRODUCT_GROUP: {
      return { ...state, productGroupToAdd: initialState.productGroupToAdd, currentPage: 0 };
    }

    case actionTypes.SET_OPENMODAL: {
      return { ...state, openModalProductGroup: action.payload };
    }

    case actionTypes.RESET_OPENMODAL: {
      return {
        ...state,
        openModalProductGroup: initialState.openModalProductGroup,
      };
    }

    default:
      return state;
  }
};

//action เอาไว้เรียกจากข้างนอก เพื่อเปลี่ยน state
export const actions = {

  resetOpenModalProductGroup: () => ({ type: actionTypes.RESET_OPENMODAL, }),
  setOpenModalProductGroup: (payload) => ({ type: actionTypes.SET_OPENMODAL, payload, }),
  updateProductGroup: (payload) => ({ type: actionTypes.UPDATE_PRODUCT_GROUP, payload }),
  resetProductGroup: () => ({ type: actionTypes.RESET_PRODUCT_GROUP }),
};
