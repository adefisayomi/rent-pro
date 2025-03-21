import * as yup from 'yup'


export const extractSchemaKeys = (schema: yup.ObjectSchema<any>): string[] => {
  return Object.keys(schema.fields);
};



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
export type SocialsType = yup.InferType<typeof socialsFormSchema>;

export const accountInformationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required').trim().min(1, 'First name cannot be empty'),
    lastName: yup.string().required('Last name is required').trim().min(1, 'Last name cannot be empty'),
    // username: yup.string().optional().trim(),
    // gender: yup.string().optional(),
    email: yup.string().email('Must be a valid email').required('Email is required').trim(),
    phone: yup.string().optional(),
  });

  export type AccountinformationType = yup.InferType<typeof accountInformationSchema>


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

export const notificationsSchema = yup.object().shape({
    getNews: yup.boolean().default(Math.random() < 0.5),
    getAccountUpdate: yup.boolean().default(Math.random() < 0.5),
    getClientEmail: yup.boolean().default(Math.random() < 0.5),
    getMeetupNews: yup.boolean().default(Math.random() < 0.5),
    getListingUpdates: yup.boolean().default(Math.random() < 0.5),
    getInquiryNotification: yup.boolean().default(Math.random() < 0.5),
    getCommentNotification: yup.boolean().default(Math.random() < 0.5),
    getMentionNotification: yup.boolean().default(Math.random() < 0.5),
    getExpiryNotification: yup.boolean().default(Math.random() < 0.5),
    getScheduleNotification: yup.boolean().default(Math.random() < 0.5),
    getBookmarkNotification: yup.boolean().default(Math.random() < 0.5),
    getMarketInsight: yup.boolean().default(Math.random() < 0.5),
    getOpportunity: yup.boolean().default(Math.random() < 0.5),
    getInsiderNews: yup.boolean().default(Math.random() < 0.5),
    getInspirations: yup.boolean().default(Math.random() < 0.5),
})

export type NotificationType = yup.InferType<typeof notificationsSchema>;


export const newPropertySchema = yup.object().shape({
  title: yup.string().required('Property title is required').trim().min(6),
  description: yup.string().required('Property description is required').min(20),
  type: yup.string().required(),
  listedIn: yup.string().required('Listed in is required'),
  status: yup.string().required('Status is required'),
  price: yup.string().required('Property price is required'),
  taxRate: yup.string().required('Yearly tax rate is required').default('10'),
  bedrooms: yup.string().required('Number of bedrooms is required').default('2'),
  bathrooms: yup.string().required('Number of bathrooms is required').default('2'),
  kitchens: yup.string().required('Number of kitchens is required').default('1'),
  parking: yup.string().required('Number of parking space is required').default("1"),
  country: yup.string().required().default('nigeria'),
  state: yup.string().required().default("lagos"),
  city: yup.string().required(),
  zip: yup.string(),
  address: yup.string().required(),
  cordinates: yup.string(),
  videoFrom: yup.string(),
  videoLink: yup.string(),
  images: yup
  .array()
  .of(yup.mixed<File | string>().required())
  .required()
  .min(5, 'At least 5 pictures of the property are required')
  .max(10, 'You can upload up to 10 pictures'),
  general: yup.array().of(yup.string()).default([]),
  indoor: yup.array().of(yup.string()).default([]),
  outdoor: yup.array().of(yup.string()).default([]),
  climate: yup.array().of(yup.string()).default([]),
  special: yup.array().of(yup.string()).default([]),
  published: yup.boolean().default(true)
});

export type NewPropertySchemaType = yup.InferType<typeof newPropertySchema>
export const newPropertyKeys = Object.keys(newPropertySchema.fields) as Array<keyof NewPropertySchemaType>;

