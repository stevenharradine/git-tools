var http   = require("https");
var CONFIG = require("./config");
var sys    = require('sys');
var exec   = require('child_process').exec;

var PER_PAGE = 100;
var repos = [];

getCurrentUser (function (current_user) {
  getAllRepos (1, function (repos) {
    var myRepos = []

    for (var index in repos) {
      var current_repo_owner = repos[index].owner.login;
      var current_repo_name = repos[index].owner.name;

      if (current_user == current_repo_owner) {
        var ssh_repo_address = repos[index].ssh_url

        myRepos.push (ssh_repo_address)
      }
    }

    checkoutRepos (myRepos, 0, function () {
      console.log ("Done")
    })
  })
});

function checkoutRepos (repos, index, callback) {
  var address = repos[index]

  exec ("cd " + CONFIG.REPOSITORIES + " && git clone " + address, function (error, stdout, stderr) {
    console.log (address);
    
    if (error) {
      console.log (error)
    }

    if (repos.length - 1 == index) {
      callback ()
    } else {
      checkoutRepos (repos, ++index, callback)
    }

    console.log ("\n")
  })
}

function getCurrentUser (callback) {
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

function getAllRepos (page, callback) {
  var options = {
    host: "api.github.com",
    port: 443,
    path: "/user/repos?page=" + page + "&per_page=" + PER_PAGE,
    method: 'GET',
    headers: {
      "Authorization": "token " + CONFIG.GITHUB_TOKEN,
      "User-Agent": "git-tools-cloner"
    }
  };

  var req = http.request(options, function(res) {
    var buffered_output = "";

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      buffered_output += chunk;
    });

    res.on('end', function () {
      var current_json_object = JSON.parse (buffered_output);
      var current_page_length = current_json_object.length;

      if (current_page_length > 0) {
        repos = add_repos (repos, current_json_object);
      }

      if (current_page_length == PER_PAGE) {
        getAllRepos (++page, callback);
      } else {
        if (current_page_length > 0) {
          if (typeof callback === "function") {
            callback(repos);
          }
        }
      }
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

function add_repos (repos, append_repos) {
  for (var index in append_repos) {
    repos.push (append_repos[index]);
  }

  return repos;
}