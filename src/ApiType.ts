import type * as github from '@actions/github';

export type ApiType = ReturnType<(typeof github)['getOctokit']>;
