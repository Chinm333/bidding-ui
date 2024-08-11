import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/actions/authActions';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import background from '../../assets/images/background.jpg';
import bid from '../../assets/images/bid.png';
import './Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('bidder');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(register({ username, email, password, role }));
        if (response?.status === 201) {
            toast.success('Register successful');
            setUsername('');
            setPassword('');
            setEmail('');
            setPassword('');
            navigate('/home');
        } else {
            toast.error('Register failed! Please check your credentials.');
        }
    };

    return (
        <div className="sign-in__wrapper"
            style={{ backgroundImage: `url(${background})` }}>
            <div className="sign-in__backdrop"></div>
            <Form className='shadow p-4 bg-white rounded' onSubmit={handleSubmit}>
                <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={bid}
                    alt="logo"
                />
                <div className="h4 mb-2 text-center">Register</div>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Select role</Form.Label>
                    <Form.Select aria-label="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="bidder">Bidder</option>
                        <option value="bid_creator">Bid Creator</option>
                    </Form.Select>
                </Form.Group>
                <div className='text-center'>
                    <Button className='button' variant="primary" type="submit">
                        Register
                    </Button>
                </div>
                <a className='link' href='/'>Click here to login</a>
            </Form>
        </div>
    );
};

export default Register;
