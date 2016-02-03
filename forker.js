var CONFIG = require("./config"),
    COMMON = require("./common")

var repos = [],
    current_user = process.argv[2]

COMMON.getAllRepos (1, repos, function (repos) {
  var orgsRepos = COMMON.getOrgsRepos (repos, current_user)

  COMMON.forkRepos (current_user, orgsRepos, 0, function () {
    console.log ("Done")
  })
})
