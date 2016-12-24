# git-tools
set of tools for git

[![Licence](https://img.shields.io/badge/Licence-ISC-blue.svg)](https://opensource.org/licenses/ISC) [![Code Climate](https://codeclimate.com/github/stevenharradine/git-tools/badges/gpa.svg)](https://codeclimate.com/github/stevenharradine/git-tools) [![Issue Count](https://codeclimate.com/github/stevenharradine/git-tools/badges/issue_count.svg)](https://codeclimate.com/github/stevenharradine/git-tools)

## tools
### forker
Forks all of a organisations repositories to yours
```
node forker {{ organization_name }}
```
### cloner
Clones all your repositories to the path defined in config.js
```
node cloner
```
### upstreamer
Make sure all your organizations repositories that you have forked are linked to the organisation as the parent. Run against the repositories in config.js.
```
node upstreamer {{ organization_name }} {{ your_github_id }}
```

### note
Its best to run the tools in order as failing to do so can result in data sets (github vs your local) not to align and the script will break.