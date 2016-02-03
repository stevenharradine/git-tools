var CONFIG = require("./config");
var git_tools = require("./common");

var repos = [];

git_tools.getCurrentUser (function (current_user) {
  git_tools.getAllRepos (1, repos, function (repos) {
    var myRepos = git_tools.getMyRepos (repos, current_user);

    git_tools.checkoutRepos (myRepos, 0, function () {
      console.log ("Done")
    })
  })
});
