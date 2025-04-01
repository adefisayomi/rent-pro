import * as yup from 'yup';

export const propertySearchSchema = yup.object().shape({
  type: yup.string().default("all type").optional(),
  listedIn: yup.string().default("all").optional(),
  // location: yup
  // .lazy((value) =>
  //   typeof value === "object"
  //     ? yup
  //         .object()
  //         .shape({
  //           display_address: yup.string().optional(),
  //           address: yup
  //             .object()
  //             .shape({
  //               country: yup.string().optional(),
  //               state: yup.string().optional(),
  //               county: yup.string().optional(),
  //             })
  //             .optional(),
  //           lat: yup.number().optional(),
  //           lon: yup.number().optional(),
  //         })
  //         .default({})
  //     : yup.mixed().default({})
  // )
  // .optional(),
  min: yup.string().optional(),
  max: yup.string().optional(),
});
