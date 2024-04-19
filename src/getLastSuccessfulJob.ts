import getJobs from './getJobs';
import getRuns from './getRuns';
import { ApiType } from './ApiType';

async function getLastSuccessfulJob(
  api: ApiType,
  owner: string,
  repo: string,
  workflowId: string,
  jobName: string
) {
  for await (const run of getRuns(api, owner, repo, workflowId)) {
    for await (const job of getJobs(api, owner, repo, run.id)) {
      if (job.name === jobName && job.conclusion === 'success') {
        return job;
      }
    }
  }

  return undefined;
}

export default getLastSuccessfulJob;
