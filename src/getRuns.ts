import * as core from '@actions/core';
import { ApiType } from './ApiType';

const RUNS_PAGE_SIZE = 10;

async function* getRuns(
  api: ApiType,
  owner: string,
  repo: string,
  workflowId: string,
  page = 1
) {
  core.debug(
    `Loading workflow runs ${(page - 1) * RUNS_PAGE_SIZE} to ${
      page * RUNS_PAGE_SIZE
    } for ${workflowId} workflow in ${owner}/${repo}`
  );

  const result = await api.request(
    'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
    {
      owner,
      repo,
      workflow_id: workflowId,
      per_page: RUNS_PAGE_SIZE
    }
  );

  for (const element of result.data.workflow_runs) {
    yield element;
  }

  if (result.data.workflow_runs.length === RUNS_PAGE_SIZE) {
    return getRuns(api, owner, repo, workflowId, page + 1);
  }
}

export default getRuns;
