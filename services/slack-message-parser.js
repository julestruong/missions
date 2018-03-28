const moment = require("moment");
const _ = require("lodash");
const parser = {};

parser.parseMission = (userId, userName, text) => {
  // /mission {miseDeDépart} {Deadline} {description}

  let textSplitted = text.split(" ");
  if (parseFloat(textSplitted[0]) == NaN) {
    throw new Error("Price is not a number.");
  }

  // if (!moment(textSplitted[1]).isValid()) {
  //   throw new Error("Deadline is not a date. Accepted format is ...");
  // }

  const body = text.substr(textSplitted[0].length + 1);

  return {
    owner_id: userId,
    owner_name: userName,
    body: body,
    price: parseFloat(textSplitted[0])
    // deadline: moment(textSplitted[1]).toISOString()
  };
};

module.exports = parser;
