import * as core from '@actions/core';
import * as github from '@actions/github';
import getLastSuccessfulJob from './getLastSuccessfulJob';
import inferParameters from './inferParameters';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run(): Promise<void> {
  try {
    const token = process.env.GITHUB_TOKEN || core.getInput('github_token');

    if (!token) {
      core.setFailed('github_token is required');
      return;
    }

    const api = github.getOctokit(token);

    const params = await inferParameters(api);

    if (!params) return;

    const { owner, repo, workflow, job } = params;

    const jobData = await getLastSuccessfulJob(api, owner, repo, workflow, job);

    core.setOutput('commit_sha', jobData?.head_sha);
    core.setOutput('run_id', jobData?.run_id);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

export default run;
