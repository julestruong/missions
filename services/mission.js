const _ = require("lodash");
const database = require("../database/mission");
const parser = require("./slack-message-parser");
const briqs = require("./briqs");
const service = {};

service.getRunningMissions = knex => {
  return database.getRunningMissions(knex);
};

service.getAllMissions = knex => {
  return database.getAllMissions(knex);
};

service.cancelMission = (knex, id) => {
  return database.cancelMission(knex, id);
};

service.bidMission = (knex, idMission, bidPrice, user) => {
  return briqs.takeBid(bidPrice, user).then(() => {
    knex.transaction(trx => {
      database.createBid(knex, trx, idMission, bidPrice, user).then(() => {
        return database
          .updatePriceMission(knex, trx, idMission, bidPrice)
          .then(() => {
            trx.commit();
          });
      });
    });
  });
};

service.doneMission = (knex, executor, missionId) => {
  return knex
    .select("id", "body", "price")
    .where("id", parseInt(missionId))
    .from("mission")
    .then(missions => {
      return briqs.giveSatisfaction(missions[0].price, executor).then(() => {
        return knex("mission")
          .where("id", parseInt(missionId))
          .update({
            executor_id: executor.id,
            executor_name: executor.name
          });
      });
    });
};

service.postMission = (knex, request) => {
  // req.body.user_name,
  // req.body.text

  const mission = parser.parseMission(
    request.body.user_id,
    request.body.user_name,
    request.body.text
  );

  const promise = database.postMission(knex, mission);
  return promise.then(id => {
    return briqs.takeInitialBet(mission).catch(e => {
      return service.cancelMission(knex, id).then(() => {
        return {
          cancel: true
        };
      });
    });
  });
};

module.exports = service;
