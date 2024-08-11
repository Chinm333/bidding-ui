import axios from 'axios';
import io from 'socket.io-client';
import * as CONSTANT from '../../constant/constant.js';
import { getCurrentUser } from '../../redux/actions/authActions';

const socket = io('/');

export const createBid = (bid) => async dispatch => {
    try {
        const response = await axios.post(CONSTANT.API_BASE_URL + '/api/bid', bid);
        dispatch({ type: 'CREATE_BID_SUCCESS', payload: response.data });
        return response;
    } catch (error) {
        dispatch({ type: 'CREATE_BID_FAIL', payload: error.response.data });
    }
};

export const placeBid = (bidId, bidItemId, amount) => async (dispatch) => {
    try {
        const currentUser = getCurrentUser();
        const participantId = currentUser.email;
        const bidAmounts = [{ bidItemId, amount }];
        const response = await axios.post(
            CONSTANT.API_BASE_URL + `/api/bid/${bidId}/participants/${participantId}`,
            { bidAmounts }
        );
        dispatch({ type: 'PLACE_BID_SUCCESS', payload: response.data });
        socket.emit('placeBid', { bidId, bidItemId, amount, participantId });

        return response;
    } catch (error) {
        dispatch({ type: 'PLACE_BID_FAIL', payload: error.response });
        console.log(error);

    }
};


export const joinBid = (bidId) => dispatch => {
    socket.emit('joinBid', bidId);
    socket.on('bidPlaced', (data) => {
        dispatch({ type: 'BID_PLACED', payload: data });
    });
};

export const leaveBid = (bidId) => dispatch => {
    socket.emit('leaveBid', bidId);
    socket.off('bidPlaced');
};

export const fetchBids = () => async (dispatch) => {
    const response = await axios.get(CONSTANT.API_BASE_URL + '/api/bid');
    dispatch({ type: 'FETCH_BIDS', payload: response.data });
    return response;
};

export const sendInvitations = (bidId, emails) => async (dispatch) => {
    try {
        const response = await axios.post(CONSTANT.API_BASE_URL + `/api/bid/${bidId}/invitation`, { emails });
        dispatch({ type: 'SEND_INVITATIONS_SUCCESS', payload: response.data });
        return response;
    } catch (error) {
        dispatch({ type: 'SEND_INVITATIONS_FAIL', payload: error.response.data });
    }
}

export const fetchLeaderboard = (bidId) => async (dispatch) => {
    const response = await axios.get(CONSTANT.API_BASE_URL + `/api/bid/${bidId}/leaderboard`);
    dispatch({ type: 'FETCH_LEADERBOARD', payload: response.data });
    return response;
}

export const fetchBidSummary = (bidId) => async (dispatch) => {
    const response = await axios.get(CONSTANT.API_BASE_URL + `/api/bid/${bidId}/summary`);
    dispatch({ type: 'FETCH_BID_SUMMARY', payload: response.data });
    return response;
}