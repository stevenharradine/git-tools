var CONFIG = require("./config");
var COMMON = require("./common");

var repos = [];

COMMON.getCurrentUser (function (current_user) {
  COMMON.getAllRepos (1, repos, function (repos) {
    var myRepos = COMMON.getMyRepos (repos, current_user);

    COMMON.checkoutRepos (myRepos, 0, function () {
      console.log ("Done")
    })
  })
});
