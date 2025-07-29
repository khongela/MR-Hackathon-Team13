import { useState } from 'react';
import SignUpValidation from '../Validation/SignUpValidation';
import '../assets/Styles/SignUp.css'

function SignUp() {
    const [values, setValues] = useState({
        name: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInput = (event) => {
        // Fixed: Remove the extra array wrapper
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
        
        // Clear errors when user starts typing
        if (errors[event.target.name]) {
            setErrors(prev => ({...prev, [event.target.name]: ''}));
        }
        
        // Clear API error when user makes changes
        if (apiError) {
            setApiError('');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate form inputs
        const validationErrors = SignUpValidation(values);
        setErrors(validationErrors);

        // If there are validation errors, don't proceed
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);
        setApiError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:3500/api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    address: values.address,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                console.log('Registration successful:', data);
                
                setSuccessMessage('Account created successfully! Redirecting to login...');
                
                // Store token if provided (auto-login after registration)
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                
                // Store user data if provided
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Clear form
                setValues({
                    name: '',
                    address: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = '/login'; // or use navigate() from react-router
                }, 2000);
                
            } else {
                // Registration failed
                setApiError(data.message || 'Registration failed. Please try again.');
            }

        } catch (error) {
            console.error('Registration error:', error);
            setApiError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="SignUp-Page">
            <section className="SignUp-Container">
                <h2 className="login-title">Sign Up</h2>
                
                {/* Fixed: Use onSubmit instead of action */}
                <form className="SignUp-form" onSubmit={handleSubmit}>
                    
                    {/* Display API errors */}
                    {apiError && <div className="error api-error">{apiError}</div>}
                    
                    {/* Display success messages */}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <div className="input-wrapper">
                        <input 
                            placeholder="Enter your name" 
                            type="text" 
                            className="input-field" 
                            required 
                            onChange={handleInput}
                            name="name"
                            value={values.name}
                        />
                        {errors.name && <div className="error">{errors.name}</div>}
                    </div>

                    <div className="input-wrapper">
                        <input 
                            placeholder="Address" 
                            type="text" 
                            className="input-field" 
                            required 
                            onChange={handleInput}
                            name="address"
                            value={values.address}
                        />
                        {errors.address && <div className="error">{errors.address}</div>}
                    </div>

                    <div className="input-wrapper">
                        <input 
                            placeholder="Email address" 
                            type="email" 
                            className="input-field" 
                            required 
                            onChange={handleInput}
                            name="email"
                            value={values.email}
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>

                    <div className="input-wrapper">
                        <input 
                            placeholder="Password" 
                            type="password" 
                            className="input-field" 
                            required 
                            onChange={handleInput}
                            name="password"
                            value={values.password}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>

                    <div className="input-wrapper">
                        <input 
                            placeholder="Confirm password" 
                            type="password" 
                            className="input-field" 
                            required 
                            onChange={handleInput}
                            name="confirmPassword"
                            value={values.confirmPassword}
                        />
                        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                    </div>

                    <button 
                        type="submit" 
                        className="SignUp-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                </form>

                <p className="login-text">
                    Already have an account? <a href="/login" className="login-link">Log in</a>
                </p>

            </section>
        </section>
    );
}

export default SignUp;