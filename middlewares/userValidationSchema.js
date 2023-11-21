const yup = require("yup")
const userValidationSchema = yup.object().shape({
    userName : yup
    .string()
    .min(2, "Username is too short")
    .max(50, "Too long")
    .required("Username is required")
    .matches(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
    email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
    password: yup
    .string()
    .required("Password is required")
    .min(8, "password is too short")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/, "Please input a strong password")
})

module.exports = {userValidationSchema}