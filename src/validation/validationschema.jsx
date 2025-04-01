import Joi from "joi";

const loginValidationRules = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .max(100)
    .required()
    .messages({
      "string.empty": "Email is verplicht",
      "string.email": "Ongeldig email address",
      "string.pattern.base": "Ongeldig email address",
      "string.max": "Email mag niet meer dan 100 karakters zijn",
    }),
  password: Joi.string().min(4).max(30).required().messages({
    "string.empty": "Wachtwoord is verplicht",
    "string.min": "Wachtwoord minstens 4 karakters zijn",
    "string.max": "Wachtwoord mag niet meer dan 30 karakters zijn",
  }),
});

export {
  loginValidationRules,
};
