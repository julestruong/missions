const moment = require("moment");
const Database = {};

Database.getRunningMissions = knex => {
  return (
    knex
      .select([
        "mission.id",
        "owner_name",
        "body",
        "price",
        // "deadline",
        "executor_name",
        "executor_id",
        knex.raw("ARRAY_AGG(bidder_name) as bidders"),
        knex.raw("ARRAY_AGG(bid_price) as bids")
      ])
      .from("mission")
      .leftJoin("mission_histo", "mission.id", "mission_histo.id_mission")
      .whereNull("executor_id")
      // .whereRaw("deadline > ?", moment().toISOString())
      .groupBy("mission.id")
  );
};

Database.getAllMissions = knex => {
  return knex
    .select(
      "mission.id",
      "owner_name",
      "body",
      "price",
      // "deadline",
      "executor_name",
      "executor_id",
      knex.raw("ARRAY_AGG(bidder_name) as bidders"),
      knex.raw("ARRAY_AGG(bid_price) as bids")
    )
    .from("mission")
    .leftJoin("mission_histo", "mission.id", "mission_histo.id_mission")
    .groupBy("mission.id");
};

Database.updatePriceMission = (knex, trx, id, price) => {
  return knex("mission")
    .transacting(trx)
    .where("id", parseInt(id))
    .update({
      price: knex.raw("?? + ??", ["price", price])
    });
};

Database.createBid = (knex, trx, idMission, bidPrice, user) => {
  const missionHisto = {
    id_mission: idMission,
    bidder_name: user.name,
    bidder_id: user.id,
    reason: "",
    bid_price: parseInt(bidPrice)
  };

  return knex("mission_histo")
    .insert(missionHisto)
    .returning("id");
};

Database.cancelMission = (knex, id) => {
  s = knex("mission")
    .where("id", parseInt(id))
    .del();

  return s;
};

Database.postMission = (knex, mission) => {
  s = knex("mission")
    .insert(mission)
    .returning("id");
  return s;
};

module.exports = Database;
