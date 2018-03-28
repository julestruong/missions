const express = require("express");
const app = express();
const contextualize = require("express-context");
const bodyParser = require("body-parser");
const service = require("./services/mission");
const Knex = require("knex");
const slackMessageFormatter = require("./services/slack-message-formatter");
const slack = require("slack");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.enable("trust proxy");

function connect() {
  console.log(process.env);
  const config = {
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.SQL_DATABASE
  };

  // if (
  //   process.env.INSTANCE_CONNECTION_NAME &&
  //   process.env.NODE_ENV === "production"
  // ) {
  //   config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  // }

  // Connect to the database
  console.log(config);
  const knex = Knex({
    client: "pg",
    connection: config
  });

  return knex;
}

const knex = connect();

const token = process.env.SLACK_TOKEN;

/**
 * Retourne la liste des missions en cours
 */
app.post("/slack/missions", (req, res) => {
  const user = {
    id: req.body.user_id,
    name: req.body.user_name
  };

  if (req.body.text === "all") {
    service
      .getAllMissions(knex)
      .then(missions => {
        res.send(slackMessageFormatter.formatList(missions, user, false));
      })
      .catch(e => console.log(e));
  } else {
    service
      .getRunningMissions(knex)
      .then(missions => {
        res.send(slackMessageFormatter.formatList(missions, user, true));
      })
      .catch(e => console.log(e));
  }
});

/**
 * Créer une mission
 *
 * @param User
 * @param Body mission
 * @param Price
 *
 * @return id
 */
app.post("/slack/mission", (req, res) => {
  service
    .postMission(knex, req)
    .then(result => {
      res.send({
        text: !result.cancel
          ? "Your mission has been validated (/missions to list available missions)"
          : "An error occured with Briqs (maybe you dont have even Briqs)"
      });
    })
    .catch(e => {
      res.send({
        text: "An error occured " + JSON.stringify(e)
      });
    });
});

/**
 * Termine une mission
 *
 * @param id_mission
 *
 * @return {mission}
 */
app.post("/slack/mission/done", (req, res) => {
  console.log(req.body);
});

/**
 * Enchèrise une mission
 *
 * @param id_mission
 * @param price
 *
 * @return {mission}
 */
app.post("/slack/mission/bid", (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const action = payload.actions[0].name;
  const tab = payload.callback_id.split("_");
  const missionId = tab[tab.length - 1];

  if (action === "bid") {
    const bidPrice = parseInt(payload.actions[0].selected_options[0].value);
    service.bidMission(knex, missionId, bidPrice, payload.user).then(() => {
      res.send({
        response_type: "ephemeral",
        replace_original: true,
        text: "Thanks !",
        attachments: [
          {
            color: "#006600",
            text: "Thx for bidding this mission for " + bidPrice + " Briqs!"
          }
        ]
      });
    });
  } else if (action === "cancel") {
    // service.userCancelMission(knex, missionId).then(() => {
    //   res.send({
    //     response_type: "ephemeral",
    //     replace_original: true,
    //     text: "Thanks !",
    //     attachments: [
    //       {
    //         color: "#006600",
    //         text: "Your mission has been"
    //       }
    //     ]
    //   });
    // });
  } else if (action === "done") {
    idExecutor = payload.actions[0].selected_options[0].value;

    slack.users
      .info({ token, user: idExecutor })
      .then(result => {
        const executor = result.user;
        service.doneMission(knex, executor, missionId).then(() => {
          res.send({
            response_type: "ephemeral",
            replace_original: true,
            text: "Thanks !",
            attachments: [
              {
                color: "#006600",
                text:
                  idExecutor === req.body.user_id
                    ? "Thanks for doing it yourself !"
                    : "Thx for letting us now, this fellow executor has received its amount of gold he was going to claim!"
              }
            ]
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
});

app.listen(8080, () => console.log("Server is listening to port 8080."));
