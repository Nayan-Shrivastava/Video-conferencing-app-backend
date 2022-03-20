const toJSON = (obj) => {
  const newObj = obj.toObject();

  if (newObj.password) {
    delete newObj.password;
  }

  if (newObj.tokens) {
    delete newObj.tokens;
  }

  if (newObj.changedDefaultPassword !== undefined) {
    delete newObj.changedDefaultPassword;
  }
  return newObj;
};

const generatePassword = () => {
  const pwd = (Math.random() + 1).toString(36).substring(2);
  return pwd;
};

export { generatePassword, toJSON };
