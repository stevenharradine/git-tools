var CONFIG = require("./config");
var COMMON = require("./common");

var repos = [];
var current_user = "telusdigital"
//COMMON.getCurrentUser (function (current_user) {
  COMMON.getAllRepos (1, repos, function (repos) {
    var orgsRepos = COMMON.getOrgsRepos (repos, current_user);
    COMMON.forkRepos (current_user, orgsRepos, 0, function () {
      console.log ("Done")
    })
  })
//});
