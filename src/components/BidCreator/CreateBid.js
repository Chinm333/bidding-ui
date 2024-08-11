import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBid } from '../../redux/actions/bidActions';
import { getCurrentUser } from '../../redux/actions/authActions';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CreateBid.css';

const CreateBid = () => {
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([{ description: '', basePrice: 0 }]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        const creator = currentUser.email;
        const response = await dispatch(createBid({ title, items, startTime, endTime, creator }));
        if (response?.status === 201) {
            toast.success('Bid created successfully!');
            setTitle('');
            setItems([{ description: '', basePrice: 0 }]);
            setStartTime('');
            setEndTime('');
            navigate('/home');
        } else {
            toast.error('Bid creation failed!');
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', basePrice: 0 }]);
    };

    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };
    return (
        <div className="formBid">
            <Form className='shadow p-4 bg-white rounded' onSubmit={handleSubmit}>
                <div className="h4 mb-2 text-center">Create Bid</div>
                <Form.Group className="mb-3" controlId="Title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                {items.map((item, index) => (
                    <div key={index}>
                        <Form.Group className="mb-3" controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Item Description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Base Price"
                                value={item.basePrice}
                                onChange={(e) => handleItemChange(index, 'basePrice', e.target.value)} />
                        </Form.Group>
                        {items.length > 1 && <i
                            className="bi bi-x-lg d-flex justify-content-end text-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => deleteItem(index)}
                        ></i>}
                    </div>
                ))}
                <Button className='button' type="button" onClick={addItem}>
                    Add Item
                </Button>

                <Form.Group className="mb-3" controlId="start">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="end">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)} />
                </Form.Group>
                <Button className='button' type="submit">Create Bid</Button>
            </Form>
        </div>
    );
};

export default CreateBid;
