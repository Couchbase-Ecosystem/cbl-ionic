function sync(doc, oldDoc) {
  console.log("********Processing Team Docs");
  validateNotEmpty("team", doc.team); 
  if (!isDelete()) {
    var team = getTeam();
    var channelId = "channel." + team;
    console.log("********Setting Channel to " + channelId);
    channel(channelId);

    requireRole(team); 
    access("role:team1", "channel.team1");
    access("role:team2", "channel.team2");
    access("role:team3", "channel.team3");
    access("role:team4", "channel.team4");
    access("role:team5", "channel.team5");
    access("role:team6", "channel.team6");
    access("role:team7", "channel.team7");
    access("role:team8", "channel.team8");
    access("role:team9", "channel.team9");
    access("role:team10", "channel.team10");
  }

  function getTeam() {
    return isDelete() ? oldDoc.team : doc.team;
  }

  function isDelete() {
    return doc._deleted == true;
  }

  function validateNotEmpty(key, value) {
    if (!value) {
      throw { forbidden: key + " is not provided." };
    }
  }
}
