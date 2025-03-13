import * as yup from 'yup'

export const filterFormSchema = yup.object({
    type: yup.array().of(yup.string()).optional(),
    amenities: yup.array().of(yup.string()).optional(),
    security: yup.array().of(yup.string()).optional(),
    min: yup.string().optional(),
    max: yup.string().optional(),
    bedrooms: yup.number().optional().default(1),
    bathrooms: yup.number().optional().default(1),
    garages: yup.number().optional().default(1),
    parkings: yup.number().optional().default(1),
});