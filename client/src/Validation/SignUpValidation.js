function SignUpValidation(values){

    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    //email validation

    if(!values.email){

        errors.email = "Email is required";
    }
    else if(!emailRegex.test(values.email)){

        errors.email = " Email is invalid"
    }

    //password validation

    if (!values.password){ 

        errors.password = "Password is required"
    }
    else if(!passwordRegex.test(values.password)){
        
        errors.password = "Password must contain uppercase, lowercase, and a number";
    }
    else if(values.password.length < 8 ){

        errors.password = "Password must be at least more 8 characters";
    }

      if (!values.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        }
    else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

export default SignUpValidation;