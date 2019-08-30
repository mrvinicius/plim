import { actionTypes } from './shopping-list.actions';

const {
    ADD_PRODUCT,
    CHANGE_PRODUCT,
    LIST_PRODUCTS,
    FILTER_PRODUCTS
} = actionTypes;

const initialState = {
    products: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_PRODUCT: {
            return {
                ...state
            }
        }
        case CHANGE_PRODUCT: {
            return {
                ...state
            }
        }
        case LIST_PRODUCTS: {
            return {
                ...state
            }
        }
        case FILTER_PRODUCTS: {
            return {
                ...state
            }
        }
        default:
            return state;
    }
}