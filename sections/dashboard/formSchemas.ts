import * as yup from 'yup'

export const changePasswordFormSchema = yup.object({
    oldPassword: yup.string().required('Old Password is required').min(6, 'Password must be at least 6 characters'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), undefined], 'Passwords must match')
        .nullable()
        .required('Confirm Password is required')
});

export const socialsFormSchema = yup.object({
    facebook: yup.string().url().optional(),
    linkedin: yup.string().url().optional(),
    instagram: yup.string().url().optional(),
    twitter: yup.string().url().optional(),
});

export const accountInformationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required').trim().min(1, 'First name cannot be empty'),
    lastName: yup.string().required('Last name is required').trim().min(1, 'Last name cannot be empty'),
    username: yup.string().optional().trim(),
    photoUrl: yup.string().url('Must be a valid URL').optional().trim(),
    gender: yup.string().optional(),
    email: yup.string().email('Must be a valid email').required('Email is required').trim(),
    phone: yup.string().matches(/^[0-9\-+() ]*$/, 'Must be a valid phone number'),
  });


  export const professionalDetailsSchema = yup.object().shape({
    experience: yup
      .string()
      .optional(),
    specialization: yup
      .string()
      .optional(),
    bio: yup
      .string()
      .optional(),
  
    address: yup
      .string()
      .optional(),
    agency: yup.string().optional().trim(),
    license: yup
      .string()
      .trim()
  });

export type ProfessionalDetailType = yup.InferType<typeof professionalDetailsSchema>;