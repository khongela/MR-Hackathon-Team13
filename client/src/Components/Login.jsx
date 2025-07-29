import { useState } from "react";
import '../Styles/Login' 
import LoginValidation from '../Validation/LoginValidation';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

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
        const validationErrors = LoginValidation(values);
        setErrors(validationErrors);

        // If there are validation errors, don't proceed
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            const response = await fetch('http://localhost:3500/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log('Login successful:', data);
                
                // Store token if provided
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                
                // Store user data if provided
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Redirect to dashboard or home page
                // You can use React Router here
                window.location.href = '/dashboard'; // or use navigate() from react-router
                
            } else {
                // Login failed
                setApiError(data.message || 'Login failed. Please try again.');
            }

        } catch (error) {
            console.error('Login error:', error);
            setApiError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (

        <section className="login-Page">
            
            <section className="Login-Container">
                <h2 className="login-title">Log in with</h2>

                <button className="Social-button">
                    <img src={googleIcon} alt="Google icon" className="google-icon" />
                    Google
                </button>

                <p className="Separator">or</p>

                {/* Fixed: Use onSubmit instead of action */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Display API errors */}
                    {apiError && <div className="error api-error">{apiError}</div>}
                    
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

                    <a href="#" className="Forgot-pass-link">Forgot password?</a>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="signup-text">
                    Don't have an account? <a href="#" className="signup-link">Sign up</a>
                </p>
            </section>
        </section>
    );
}

export default Login;