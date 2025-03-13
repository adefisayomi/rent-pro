import * as yup from 'yup'

export const propertySearchSchema = yup.object().shape({
      type: yup.string(),
      location: yup.object(),
      minPrice: yup
        .string(),
      maxPrice: yup
        .string(),
      propertyType: yup
        .string(),
      bedrooms: yup
        .string().default("any"),
    //   bathrooms: yup
    //     .number()
    //     .min(0, 'Number of bathrooms cannot be negative')
    //     .integer('Number of bathrooms must be an integer')
    //     .required('Number of bathrooms is required'),
    //   furnished: yup.boolean().required('Furnished status is required'),
    });