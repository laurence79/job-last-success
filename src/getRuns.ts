import * as core from '@actions/core';
import { ApiType } from './ApiType';

const PAGE_SIZE = 10;

async function* getRuns(
  api: ApiType,
  owner: string,
  repo: string,
  workflowId: string,
  page = 1
) {
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = page * PAGE_SIZE;

  core.info(
    `Loading workflow runs ${from} to ${to} for ${workflowId} workflow in ${owner}/${repo}`
  );

  const result = await api.request(
    'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
    {
      owner,
      repo,
      workflow_id: workflowId,
      per_page: PAGE_SIZE
    }
  );

  for (const element of result.data.workflow_runs) {
    core.info(`Run ${element.id} (${element.updated_at})`);
    core.debug(JSON.stringify(element, null, 2));
    yield element;
  }

  if (result.data.workflow_runs.length === PAGE_SIZE) {
    return getRuns(api, owner, repo, workflowId, page + 1);
  }
}

export default getRuns;
