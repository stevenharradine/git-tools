var CONFIG    = require("./config"),
    git_tools = require("./common")

var repos     = [],
    user_name = process.argv[2],
    org_name  = process.argv[3]

var exec = require('child_process').execSync;

var audit_upstreamed_count        = 0,
    audit_upstreams_added         = 0,
    audit_upstream_already_exists = 0,
    audit_upstream_error_count    = 0,
    aduit_pull_success            = 0,
    aduit_pull_error              = 0,
    aduit_push_success            = 0,
    aduit_push_error              = 0;

var error_log = "";

git_tools.getAllRepos (1, repos, function (repos) {
	var orgsRepos = git_tools.getOrgsRepos (repos, org_name)
	var myRepos = git_tools.getMyRepos (repos, user_name)

	for (i = 0; i < orgsRepos.length; i++) {
		if (myRepos.indexOf ("git@github.com:" + user_name + "/" + orgsRepos[i] + ".git") >= 0) {
			audit_upstreamed_count++;
			var cmd_change_directory = "cd " + CONFIG.REPOSITORIES + "/" + orgsRepos[i] + " && ";
			var cmd        = "";
			var cmd_return = "";

			// make sure the upstream remote is added
			cmd_return = "";	// reset
			cmd = cmd_change_directory + "git remote add upstream git@github.com:" + org_name + "/" + orgsRepos[i] + ".git";
			console.log (cmd);

			try {
				cmd_return = exec(cmd).toString();
				audit_upstreams_added++;
			} catch (error) {
				if (error.toString().indexOf("remote upstream already exists") >= 0) {
					audit_upstream_already_exists++;
				} else {
					error_log += "adding upstream error: " + error;
					audit_upstream_error_count++;
				}
			}

			// pull the latest code from the parent organisation
			cmd_return = "";	// reset
			cmd = cmd_change_directory + "git pull upstream HEAD";
			console.log (cmd);

			try {
				cmd_return = exec(cmd).toString();
				aduit_pull_success++;
			} catch (error) {
				error_log += "git pull error: " + error;
				aduit_pull_error++;
			}

			// push the code back to personal git repo
			cmd_return = "";	// reset
			cmd = cmd_change_directory + "git push";
			console.log (cmd);

			try {
				cmd_return = exec(cmd).toString();
				aduit_push_success++;
			} catch (error) {
				error_log += "git push error: " + error;
				aduit_push_error++;
			}
		}
	}

	console.log ();
	console.log ();
	console.log ("Error log:");
	console.log ("**********");
	console.log (error_log);
	console.log ();
	console.log ();
	console.log ("Audit:");
	console.log ("******");
	console.log ("         Number of your repos: " + myRepos.length);

	console.log ("Number of organisations repos: " + orgsRepos.length);
	console.log ("     Number of upstream repos: " + audit_upstreamed_count);

	console.log ("              Upstreams added: " + audit_upstreams_added);
	console.log ("    Upstreams already existed: " + audit_upstream_already_exists);
	console.log ("             Upstreams errors: " + audit_upstream_error_count);
	console.log ("                 Pull success: " + aduit_pull_success);
	console.log ("                  Pull errors: " + aduit_pull_error);
	console.log ("                 Push success: " + aduit_push_success);
	console.log ("                  Push errors: " + aduit_push_error);
})
