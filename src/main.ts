import * as core from '@actions/core';
import * as github from '@actions/github';
import getHashForLastSuccessfulJob from './getHashForLastSuccessfulJob';
import inferParameters from './inferParameters';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run(): Promise<void> {
  try {
    const params = inferParameters();

    if (!params) return;

    const { github_token: token, owner, repo, workflow, job } = params;

    const api = github.getOctokit(token);

    const sha = await getHashForLastSuccessfulJob(
      api,
      owner,
      repo,
      workflow,
      job
    );

    core.setOutput('commit_hash', sha);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

export default run;
