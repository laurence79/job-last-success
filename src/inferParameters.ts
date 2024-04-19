import * as core from '@actions/core';
import * as github from '@actions/github';
import { ApiType } from './ApiType';

const INPUT_KEYS = ['owner', 'repo', 'workflow', 'job'] as const;

type TupleToUnion<T extends readonly [...unknown[]]> = T[number];

type Parameters = Record<TupleToUnion<typeof INPUT_KEYS>, string>;

async function inferParameters(api: ApiType): Promise<Parameters | null> {
  const run = await api.request(
    'GET /repos/{owner}/{repo}/actions/runs/{run_id}',
    {
      ...github.context.repo,
      run_id: github.context.runId
    }
  );

  const defaults: Partial<Parameters> = {
    owner: github.context.repo.owner || undefined,
    repo: github.context.repo.repo || undefined,
    job: github.context.job || undefined,
    workflow: String(run.data.workflow_id)
  };

  const inputs: Partial<Parameters> = Object.fromEntries(
    INPUT_KEYS.compactMap(n => {
      const input = core.getInput(n);

      if (!input) return undefined;

      return [n, core.getInput(n) || undefined];
    })
  );

  const final: Partial<Parameters> = {
    ...defaults,
    ...inputs
  };

  core.debug(
    `[parameters] Combining defaults ${JSON.stringify(
      defaults,
      null,
      2
    )} with inputs ${JSON.stringify(inputs, null, 2)} to make ${JSON.stringify(
      final,
      null,
      2
    )}`
  );

  let failed = false;

  for (const [key, value] of Object.entries(final)) {
    if (!value) {
      core.setFailed(`${key} is required`);
      failed = true;
    }
  }

  if (failed) {
    return null;
  }

  return final as Parameters;
}

export default inferParameters;
