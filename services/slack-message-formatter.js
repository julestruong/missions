const moment = require("moment");

const formatter = {};

const colors = ["#1de9b6", "#1a2035", "#fa9ab3", "#f74044"];

formatter.formatList = (missionsList, user, displayAll) => {
  const attachments = missionsList.map((mission, index) => {
    let bids = [];

    if (
      mission.bidders &&
      mission.bidders.length > 0 &&
      mission.bidders[0] != null
    ) {
      mission.bidders.forEach((bidder, index) => {
        bids.push(bidder + "(+" + mission.bids[index] + ")");
      });
    }

    userIsOwner = mission.owner_name === user.name;
    isMissionFinished = mission.executor_id;
    //   || moment(mission.deadline).isBefore();
    userHasAlreadyBid = mission.bidders.indexOf(user.name) != -1;

    let actions = [];

    let bidAction = {
      name: "bid",
      text: "How much do you want to bid ?",
      type: "select",
      style: "primary",
      confirm: {
        title: "Are you sure?",
        text: "Are you sure ?",
        ok_text: "Yes",
        dismiss_text: "No"
      },
      options: [
        {
          text: "1 Briq",
          value: 1
        },
        {
          text: "2 Briqs",
          value: 2
        },
        {
          text: "5 Briqs",
          value: 5
        },
        {
          text: "10 Briqs",
          value: 10
        },
        {
          text: "20 Briqs",
          value: 20
        },
        {
          text: "50 Briqs",
          value: 50
        },
        {
          text: "100 Briqs",
          value: 100
        }
      ]
    };

    const cancelAction = {
      //   name: "cancel",
      //   text: "Cancel Mission !",
      //   style: "danger",
      //   type: "button",
      //   value: "cancel",
      //   confirm: {
      //     title: "Are you sure ?",
      //     text: "Are you sure to cancel this mission and refund your briqs ?",
      //     ok_text: "Yes",
      //     dismiss_text: "No"
      //   }
    };

    const doneAction = {
      name: "done",
      text: "Who dit it? ",
      style: "primary",
      type: "select",
      data_source: "users",
      confirm: {
        title: "Are you sure he or she (;)) did it?",
        text: "Are you sure it is done",
        ok_text: "Yes",
        dismiss_text: "No"
      }
    };

    if (userIsOwner && !isMissionFinished) {
      actions.push(doneAction);
    }

    if (userIsOwner && !mission.executor_name) {
      actions.push(cancelAction);
    }

    if (!userIsOwner && !isMissionFinished && !userHasAlreadyBid) {
      actions.push(bidAction);
    }

    const attachment = {
      color: colors[index % 4],
      author_name: mission.owner_name || "",
      text: mission.body || "",
      callback_id: "mission_id_" + mission.id,
      actions: actions,
      fields: [
        // {
        //   title: "Deadline",
        //   value: mission.deadline
        //     ? moment(mission.deadline).format("MMMM Do YYYY, h:mm:ss")
        //     : "No deadline",
        //   short: true
        // },
        {
          title: "Price",
          value: (mission.price ? mission.price : 0) + " Briqs",
          short: true
        },
        {
          title: "Bidders",
          value: bids.length > 0 ? bids.join(",") : "No bidders",
          short: true
        },
        {
          title: "Executor",
          value: mission.executor_name || "No executor",
          short: true
        }
        // mission.bidders.indexOf(user.name) != -1
        //   ? {
        //       title: "You've already bid this mission !"
        //     }
        //   : {}
      ],
      //   image_url: "http://my-website.com/path/to/image.jpg",
      //   thumb_url: "http://example.com/path/to/thumb.png",
      footer: "Mission created ",
      //   footer_icon:
      // "https://platform.slack-edge.com/img/default_application_icon.png",
      ts: moment(mission.created_at).unix()
    };

    return attachment;
  });

  return {
    text: "List of available missions",
    attachments: attachments
  };
};

module.exports = formatter;
