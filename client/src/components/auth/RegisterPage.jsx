import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../components/context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!name || !email || !password || !address) {
            setError('Please fill out all fields.');
            return;
        }

        const result = await register(name, email, password, address);

        if (result.success) {
            // The context handles navigation to the login page.
            // We could pass state via navigate if we want to show a success message on the login page.
            navigate('/login', { state: { message: result.message } });
        } else {
            setError(result.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Create your free account</h2>
                <p className="auth-subtitle">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>

                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-success">{message}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input id="name" name="name" type="text" required className="form-input" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input id="email" name="email" type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input id="address" name="address" type="text" required className="form-input" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input id="password" name="password" type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-full">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;