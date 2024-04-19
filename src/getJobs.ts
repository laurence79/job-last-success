import * as core from '@actions/core';
import { ApiType } from './ApiType';

const JOBS_PAGE_SIZE = 50;

async function* getJobs(
  api: ApiType,
  owner: string,
  repo: string,
  runId: number,
  page = 1
) {
  core.debug(
    `Loading jobs ${(page - 1) * JOBS_PAGE_SIZE} to ${
      page * JOBS_PAGE_SIZE
    } for workflow run ${runId} in ${owner}/${repo} `
  );

  const result = await api.request(
    'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs',
    {
      owner,
      repo,
      run_id: runId,
      per_page: JOBS_PAGE_SIZE
    }
  );

  for (const element of result.data.jobs) {
    yield element;
  }

  if (result.data.jobs.length === JOBS_PAGE_SIZE) {
    return getJobs(api, owner, repo, runId, page + 1);
  }
}

export default getJobs;
