import * as core from '@actions/core';
import * as github from '@actions/github';
import getHashForLastSuccessfulJob from './getHashForLastSuccessfulJob';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run(): Promise<void> {
  try {
    const token = core.getInput('github_token');
    const api = github.getOctokit(token);

    const owner = core.getInput('owner') ?? github.context.repo.owner;
    const repo = core.getInput('repo') ?? github.context.repo.repo;
    const workflowId = core.getInput('workflow') ?? github.context.workflow;
    const jobName = core.getInput('job') ?? github.context.job;

    const sha = await getHashForLastSuccessfulJob(
      api,
      owner,
      repo,
      workflowId,
      jobName
    );

    core.setOutput('commit_hash', sha);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

export default run;
