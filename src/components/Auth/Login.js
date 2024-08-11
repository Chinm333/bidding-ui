import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import background from '../../assets/images/background.jpg';
import bid from '../../assets/images/bid.png';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(login(email, password));
        if (response?.status === 201) {
            toast.success('Login successful');
            setEmail('');
            setPassword('');
            navigate('/home');
        } else {
            toast.error('Login failed! Please check your credentials.');
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
                <div className="h4 mb-2 text-center">Login</div>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <a className='link' href='/register'>Create an account</a>
                <div className='text-center'>
                    <Button className='button' variant="primary" type="submit">
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Login;
