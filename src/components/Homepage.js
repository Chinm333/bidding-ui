import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fetchBids, placeBid, sendInvitations, fetchLeaderboard, fetchBidSummary } from '../redux/actions/bidActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../redux/actions/authActions';
import axios from 'axios';
import * as CONSTANT from '../constant/constant';

const Homepage = () => {
    const [bids, setBids] = useState([]);
    const [showBidModal, setShowBidModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);
    const [selectedBidItem, setSelectedBidItem] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [emails, setEmails] = useState(['']);
    const [leaderboard, setLeaderboard] = useState([]);
    const [bidSummary, setBidSummary] = useState({});
    const [endTime, setEndTime] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    useEffect(() => {
        async function getBids() {
            const response = await dispatch(fetchBids());
            setBids(response.data);
        }
        getBids();
    }, [dispatch]);

    const handleBidClick = (bid) => {
        setSelectedBid(bid);
        setShowBidModal(true);
    };

    const handleInviteClick = (bid) => {
        setSelectedBid(bid);
        setShowInviteModal(true);
    };

    const handleLeaderboardClick = async (bid) => {
        setSelectedBid(bid);
        const response = await dispatch(fetchLeaderboard(bid.bidId));
        setLeaderboard(response.data);
        setShowLeaderboardModal(true);
    };

    const handleSummaryClick = async (bid) => {
        setSelectedBid(bid);
        const response = await dispatch(fetchBidSummary(bid.bidId));
        setBidSummary(response.data);
        setShowSummaryModal(true);
    };

    const handleSubmitBid = async (e) => {
        if (selectedBid && selectedBidItem && bidAmount) {
            if (formatDateTime(selectedBid.endTime) > formatDateTime(new Date())) {
                e.preventDefault();
                await dispatch(placeBid(selectedBid.bidId, selectedBidItem, bidAmount));
                setShowBidModal(false);
                setSelectedBidItem('');
                setBidAmount('');
            } else {
                toast.error('Bid time is over!');
                setShowBidModal(false);
                setSelectedBidItem('');
                setBidAmount('');
            }
        }
    };

    const handleInviteSubmit = async () => {
        if (selectedBid && emails.length > 0 && selectedBid.endTime < new Date()) {
            await dispatch(sendInvitations(selectedBid.bidId, emails));
            setShowInviteModal(false);
            setEmails(['']);
        } else {
            toast.error('Bid time is over!');
            setShowInviteModal(false);
            setEmails(['']);
        }
    };

    const handleEmailChange = (index, value) => {
        const newEmails = emails.map((email, i) => i === index ? value : email);
        setEmails(newEmails);
    };

    const addEmailField = () => {
        setEmails([...emails, '']);
    };

    const removeEmailField = (index) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const navigateToCreateBid = () => {
        if (currentUser.role === 'bid_creator') {
            navigate('/create-bid');
        } else {
            toast.error('Only Bid Creators can create bids!');
        }
    }
    const extendEndTime = async () => {
        try {
            const response = await axios.put(CONSTANT.API_BASE_URL +`/api/bid/${selectedBid.bidId}`, { endTime });
            toast.success('Bid end time updated successfully!');
            setShowEditModal(false);
            setBids([]);
            const bids = await dispatch(fetchBids());
            setBids(bids.data);
            setEndTime('');
        } catch (error) {
            console.error('Error updating bid end time:', error);
            toast.error('Failed to update bid end time');
            setShowEditModal(false);
        }
    };
    const handleActivateBid = async (bid) => {
        if (formatDateTime(bid.endTime) < formatDateTime(new Date())) {
            const utcDate = new Date(bid.endTime);
            const istOffset = 5.5 * 60 * 60 * 1000;
            const istDate = new Date(utcDate.getTime() + istOffset);
            const formattedEndTime = istDate.toISOString().slice(0, 16);

            setSelectedBid(bid);
            setEndTime(formattedEndTime);
            setShowEditModal(true);
        } else {
            toast.error('Bid is still active!');
        }
    };


    return (
        <div className="container">
            <div className='d-flex justify-content-end p-2'>
                <Button className='button' onClick={navigateToCreateBid}>
                    Create Bid
                </Button>
            </div>
            <h1>{currentUser.email}</h1>
            <h1>{currentUser.role}</h1>
            <h1>All Bids</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Bid ID</th>
                        <th>Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Creator</th>
                        <th>Item Count</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid) => (
                        <tr key={bid.bidId}>
                            <td>{bid.bidId}</td>
                            <td>{bid.title}</td>
                            <td>{formatDateTime(bid.startTime)}</td>
                            <td>{formatDateTime(bid.endTime)}</td>
                            <td>{bid.creator}</td>
                            <td>{bid.items.length}</td>
                            <td>
                                {
                                    formatDateTime(bid.endTime) < formatDateTime(new Date()) ? (
                                        <Button className='button' onClick={() => handleActivateBid(bid)}>
                                            Activate Bid
                                        </Button>
                                    ) : (
                                        <>
                                            <Button className='button' onClick={() => handleBidClick(bid)}>
                                                Place Bid
                                            </Button>
                                            <Button className='button ml-2' onClick={() => handleInviteClick(bid)}>
                                                Invite Bidders
                                            </Button>
                                        </>
                                    )
                                }

                                <Button className='button ml-2' onClick={() => handleLeaderboardClick(bid)}>
                                    Show Leaderboard
                                </Button>
                                <Button className='button ml-2' onClick={() => handleSummaryClick(bid)}>
                                    Show Summary
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Placing a Bid */}
            <Modal show={showBidModal} onHide={() => setShowBidModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Bid for {selectedBid?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select Bid Item</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedBidItem}
                                onChange={(e) => setSelectedBidItem(e.target.value)}
                            >
                                <option value="">Select Item</option>
                                {selectedBid?.items.map(item => (
                                    <option key={item.bidItemId} value={item.bidItemId}>
                                        {item.description}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Bid Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter your bid amount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button' onClick={() => setShowBidModal(false)}>
                        Close
                    </Button>
                    <Button className='button' onClick={handleSubmitBid}>
                        Submit Bid
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Inviting Bidders */}
            <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Bidders for {selectedBid?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {emails.map((email, index) => (
                            <div key={index} className="email-group mb-3 position-relative">
                                <Form.Control
                                    type="email"
                                    placeholder="Bidder Email"
                                    value={email}
                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                />
                                {emails.length > 1 && (
                                    <i
                                        className="bi bi-x-lg position-absolute text-danger"
                                        style={{ top: '0', right: '0', cursor: 'pointer' }}
                                        onClick={() => removeEmailField(index)}
                                    ></i>
                                )}
                            </div>
                        ))}
                        <Button className='button' type="button" onClick={addEmailField}>
                            Add Email
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button' onClick={() => setShowInviteModal(false)}>
                        Close
                    </Button>
                    <Button className='button' onClick={handleInviteSubmit}>
                        Send Invitations
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Showing Leaderboard */}
            <Modal show={showLeaderboardModal} onHide={() => setShowLeaderboardModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Leaderboard for {selectedBid?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Participant ID</th>
                                <th>Bid Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.participantId}</td>
                                    <td>{entry.totalBidAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button' onClick={() => setShowLeaderboardModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Showing Bid Summary */}
            <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bid Summary for {selectedBid?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Bid Details</h5>
                    <p><strong>Title:</strong> {bidSummary.title}</p>
                    <p><strong>Description:</strong> {bidSummary.description}</p>
                    <p><strong>Start Time:</strong> {formatDateTime(bidSummary.startTime)}</p>
                    <p><strong>End Time:</strong> {formatDateTime(bidSummary.endTime)}</p>

                    {/* Bid Items Table */}
                    <h5>Bid Items</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Bid Item ID</th>
                                <th>Description</th>
                                <th>Starting Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bidSummary.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.bidItemId}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* participants table */}
                    <h5>Participants</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Participant ID</th>
                                <th>Bid Item</th>
                                <th>Bid Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bidSummary.participants?.map((participant, index) => (
                                participant.bidAmounts.map((bidAmount, bidIndex) => (
                                    <tr key={`${index}-${bidIndex}`}>
                                        <td>{participant.participantId}</td>
                                        <td>{bidAmount.bidItemId}</td>
                                        <td>{bidAmount.amount}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button' onClick={() => setShowSummaryModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Editing Bidders */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit BidItem for {selectedBid?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="end">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button' onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button className='button' type="button" onClick={extendEndTime}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );


};

export default Homepage;
