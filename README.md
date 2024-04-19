# last-successful-commit

Finds the commit hash of the most recent successful conclusion of a job.

```yaml
jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Check last
        uses: laurence79/last-successful-commit@v1.2.0
        with:
          github_token: ${{ github.token }}
```

## Inputs
| Name         | Description                                                            | Type   | Required | Default              |
|--------------|------------------------------------------------------------------------|--------|----------|----------------------|
| job*         | The yaml key of the job, or name                                      | string | N        | The current job      |
| owner        | The owner of the repo                                                  | string | N        | The current owner    |
| repo         | The repo                                                               | string | N        | The current repo     |
| workflow     | The filename of the workflow                                           | string | N        | The current workflow |
| github_token | The token to use with the GitHub API `Use ${{ secrets.GITHUB_TOKEN }}` | string | Y        |                      |

### IMPORTANT CAVEAT
If the job has a name, e.g.
```yaml
jobs:
  lint-and-test:
    name: Some string
    runs-on: ubuntu-latest
```
Then you **have** to use `"Some string"` as the `job` input, the default won't work.

If it doesn't e.g.
```yaml
jobs:
  lint-and-test:
    name: Some string
    runs-on: ubuntu-latest
```
Then you can use `lint-and-test`, or omit and the action will find it.

Why? https://github.com/orgs/community/discussions/8945


## Outputs

### commit_sha
The commit SHA of the run

### run_id
The run ID containing the successful job