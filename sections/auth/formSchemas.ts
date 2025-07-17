import * as yup from 'yup'

export const signinSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

  firstName: yup
    .string()
    .min(2, "A minimum of 2 characters is required for first name")
    .max(20, 'Maximum of 20 characters')
    .required('First name is required'),

  lastName: yup
    .string()
    .min(2, "A minimum of 2 characters is required for last name")
    .max(20, 'Maximum of 20 characters')
    .required('Last name is required'),

  username: yup
    .string()
    .min(2, "A minimum of 2 characters is required for username")
    .max(20, 'Maximum of 20 characters')
    .required('Username is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});
