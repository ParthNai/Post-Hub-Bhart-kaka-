const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (!value || value.length < 1) {
    return helpers.message('password cannot be empty');
  }
  return value;
};

const mobile = (value, helpers) => {
  if (value.length > 10) {
    return helpers.message('Mobile number must be 10 characters');
  }
  if (!value.match(/^[0-9]{10}$/)) {
    return helpers.message('Invalid mobile number');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  mobile
};
