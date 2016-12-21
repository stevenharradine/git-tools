var CONFIG = require("./config");
var http   = require("https");
var exec   = require('child_process').exec;

module.exports.getOrgsRepos = function (repos, organization_name) {
  var orgsRepos = []
  for (var index in repos) {
    var current_repo_owner = repos[index].owner.login;
    var current_repo_name = repos[index].owner.name;

    if (organization_name === current_repo_owner) {
      var repo_name = repos[index].name

      orgsRepos.push (repo_name)
    }
  }

  return orgsRepos;
}

module.exports.getMyRepos = function (repos, current_user) {
  var myRepos = []

  for (var index in repos) {
    var current_repo_owner = repos[index].owner.login;
    var current_repo_name = repos[index].owner.name;

    if (current_user === current_repo_owner) {
      var ssh_repo_address = repos[index].ssh_url

      myRepos.push (ssh_repo_address)
    }
  }

  return myRepos;
}

module.exports.forkRepos = function (owner, repos, index, callback) {
  var repo_name = repos[index]

  var options = {
    host: "api.github.com",
    port: 443,
    path: "/repos/" + owner + "/" + repo_name + "/forks",
    method: 'POST',
    headers: {
      "Authorization": "token " + CONFIG.GITHUB_TOKEN,
      "User-Agent": "git-tools-cloner"
    }
  };

  var req = http.request(options, function(res) {
    var username = "";

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      username += chunk;
    });

    res.on('end', function () {
      console.log (options.path)

      if (repos.length - 1 === index) {
        callback ()
      } else {
        module.exports.forkRepos (owner, repos, ++index, callback)
      }
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write('');
  req.end();
}

module.exports.checkoutRepos = function (repos, index, callback) {
  var address = repos[index]

  exec ("cd " + CONFIG.REPOSITORIES + " && git clone " + address, function (error, stdout, stderr) {
    console.log (address);
    
    if (error) {
      return console.log (error)
    }

    if (repos.length - 1 === index) {
      callback ()
    } else {
      module.exports.checkoutRepos (repos, ++index, callback)
    }

    console.log ("\n")
  })
}

module.exports.getCurrentUser = function (callback) {
  var options = {
    host: "api.github.com",
    port: 443,
    path: "/user",
    method: 'GET',
    headers: {
      "Authorization": "token " + CONFIG.GITHUB_TOKEN,
      "User-Agent": "git-tools-cloner"
    }
  };

  var req = http.request(options, function(res) {
    var username = "";

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      username += chunk;
    });

    res.on('end', function () {
      callback(JSON.parse (username).login);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write('data\n');
  req.write('data\n');
  req.end();
}

module.exports.getAllRepos = function (page, repos, callback) {
  var options = {
    host: "api.github.com",
    port: 443,
    path: "/user/repos?page=" + page + "&per_page=" + CONFIG.PER_PAGE,
    method: 'GET',
    headers: {
      "Authorization": "token " + CONFIG.GITHUB_TOKEN,
      "User-Agent": "git-tools-cloner"
    }
  }

  var req = http.request(options, function(res) {
    var buffered_output = ""

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      buffered_output += chunk
    });

    res.on('end', function () {
      var current_json_object = JSON.parse (buffered_output)
      var current_page_length = current_json_object.length

      if (current_page_length > 0) {
        repos = module.exports.add_repos (repos, current_json_object)
      }

      if (current_page_length === CONFIG.PER_PAGE) {
        module.exports.getAllRepos (++page, repos, callback)
      } else {
        if (current_page_length > 0) {
          if (typeof callback === "function") {
            callback(repos)
          }
        }
      }
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message)
  });

  // write data to request body
  req.write('data\n')
  req.write('data\n')
  req.end();
}

module.exports.add_repos = function (repos, append_repos) {
  for (var index in append_repos) {
    repos.push (append_repos[index]);
  }

  return repos;
}
