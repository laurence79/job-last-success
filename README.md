# last-successful-commit

Finds the commit hash of the most recent successful conclusion of a job

## Inputs
| Name     | Description                  | Type   | Default              |
|----------|------------------------------|--------|----------------------|
| job      | The id of the job            | string | The current job      |
| owner    | The owner of the repo        | string | The current owner    |
| repo     | The repo                     | string | The current repo     |
| workflow | The filename of the workflow | string | The current workflow |

## Outputs
### commit_hash
The commit hash, if a successful job was foun