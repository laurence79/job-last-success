import * as core from '@actions/core';
import * as github from '@actions/github';

const INPUT_KEYS = [
  'github_token',
  'owner',
  'repo',
  'workflow',
  'job'
] as const;

type TupleToUnion<T extends readonly [...unknown[]]> = T[number];

type Parameters = Record<TupleToUnion<typeof INPUT_KEYS>, string>;

function inferParameters(): Parameters | null {
  const defaults: Partial<Parameters> = {
    github_token: process.env.GITHUB_TOKEN || undefined,
    owner: github.context.repo.owner || undefined,
    repo: github.context.repo.repo || undefined,
    workflow: github.context.workflow || undefined,
    job: github.context.job || undefined
  };

  const inputs: Partial<Parameters> = Object.fromEntries(
    INPUT_KEYS.map(n => [n, core.getInput(n) || undefined])
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
