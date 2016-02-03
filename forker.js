var CONFIG    = require("./config"),
    git_tools = require("./common")

var repos        = [],
    current_user = process.argv[2]

git_tools.getAllRepos (1, repos, function (repos) {
  var orgsRepos = git_tools.getOrgsRepos (repos, current_user)

  git_tools.forkRepos (current_user, orgsRepos, 0, function () {
    console.log ("Done")
  })
})
