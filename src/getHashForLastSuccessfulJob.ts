import getJobs from './getJobs';
import getRuns from './getRuns';
import { ApiType } from './ApiType';

async function getHashForLastSuccessfulJob(
  api: ApiType,
  owner: string,
  repo: string,
  workflowId: string,
  jobName: string
): Promise<string | undefined> {
  for await (const run of getRuns(api, owner, repo, workflowId)) {
    for await (const job of getJobs(api, owner, repo, run.id)) {
      if (job.name === jobName && job.conclusion === 'success') {
        return run.head_commit?.id;
      }
    }
  }

  return undefined;
}

export default getHashForLastSuccessfulJob;
