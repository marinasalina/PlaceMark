import Joi from "joi";
// A valid ID can be either a string or an object (for MongoDB ObjectId)
export const IdSpec = Joi.alternatives()
  .try(Joi.string(), Joi.object())
  .description("a valid ID");

//User validation schemas
// Schema for login credentials
export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().example("homer@simpson.com").required(),
  password: Joi.string().example("secret").required(),
}).label("UserCredentials");
// Schema for full user details (used during signup)
export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
  isAdmin: Joi.boolean().default(false),
}).label("UserDetails");
// Schema for user objects returned from the database (includes _id and __v)
export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");
// Array of user objects
export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

// placemark validation schemas

// Schema for incoming placemark data (used when adding/editing)
export const PlacemarkSpec = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  location: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  isPrivate: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid("on"))
    .optional(),

  userId: IdSpec.optional(),
  img: Joi.array().items(Joi.string()).default([]),
}).label("Placemark");

// Schema for placemark objects returned from the database
export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkPlus");

// Array of placemark object
export const PlacemarkArray = Joi.array()
  .items(PlacemarkSpecPlus)
  .label("PlacemarkArray");
