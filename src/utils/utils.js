const toJSON = (obj) => {
  const newObj = obj?.toObject?.() ?? obj;

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

function getTimeStamp() {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes().toString().padStart(2, '0');
  const meridiem = hour < 12 ? 'am' : 'pm';
  const timeStamp = `${hour}:${min} ${meridiem}`;
  return timeStamp;
}

export { generatePassword, toJSON, getTimeStamp };
