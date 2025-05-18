import jsonwebtoken from "jsonwebtoken";

const validate = (token) => {
  try {
    const decoded = jsonwebtoken.verify(token, Netlify.env.get('JWT_SECRET'));
    return true;
  } catch (error) {
    return false;
  }
};

export default validate;