import * as Yup from 'yup';
export  const signInSchema =Yup.object().shape({
    email:Yup.string()
    .email('Invalid email address')
    .required('email is required'),
    password: Yup.string()
    .min(8,'Password must be at least 8 characters')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
    )
    .required('Password is required'),
})