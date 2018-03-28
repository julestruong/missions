require("dotenv").config();

const Briq = require("briq-api").Client;
const briq = new Briq(process.env.BRIQS_TOKEN);
const briqService = {};

briqService.takeInitialBet = mission => {
  const transaction = {
    amount: mission.price,
    app: "give",
    comment: "Mission - " + mission.body.substr(0, 20),
    from: mission.owner_name
  };

  return briq
    .organization(process.env.BRIQS_ORGA)
    .createTransaction(transaction);
};

briqService.takeBid = (bidPrice, user) => {
  const transaction = {
    amount: bidPrice,
    app: "give",
    comment: "Mission bid",
    from: user.name
  };

  return briq
    .organization(process.env.BRIQS_ORGA)
    .createTransaction(transaction);
};

briqService.giveSatisfaction = (price, user) => {
  const transaction = {
    amount: price,
    app: "give",
    comment: "Well done mate",
    to: user.name
  };

  return briq
    .organization(process.env.BRIQS_ORGA)
    .createTransaction(transaction);
};

module.exports = briqService;
