# last-successful-commit

Finds the commit hash of the most recent successful conclusion of a job

## Inputs
| Name         | Description                                                            | Type   | Required | Default              |
|--------------|------------------------------------------------------------------------|--------|----------|----------------------|
| job          | The id of the job                                                      | string | N        | The current job      |
| owner        | The owner of the repo                                                  | string | N        | The current owner    |
| repo         | The repo                                                               | string | N        | The current repo     |
| workflow     | The filename of the workflow                                           | string | N        | The current workflow |
| github_token | The token to use with the GitHub API `Use ${{ secrets.GITHUB_TOKEN }}` | string | Y        |                      |

## Outputs
### commit_hash
The commit hash, if a successful job was found