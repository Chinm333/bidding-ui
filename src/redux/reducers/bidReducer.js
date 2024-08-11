const initialState = {
    bids: [],
    currentBid: null,
    error: null,
};

const bidReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_BID_SUCCESS':
            return {
                ...state,
                bids: [...state.bids, action.payload],
                error: null,
            };
        case 'CREATE_BID_FAIL':
            return {
                ...state,
                error: action.payload,
            };
        case 'BID_PLACED':
            const updatedBids = state.bids.map(bid =>
                bid._id === action.payload.bidId
                    ? {
                        ...bid,
                        items: bid.items.map(item =>
                            item._id === action.payload.bidItemId
                                ? { ...item, currentBid: action.payload.amount }
                                : item
                        ),
                    }
                    : bid
            );
            return {
                ...state,
                bids: updatedBids,
            };
        default:
            return state;
    }
};

export default bidReducer;
