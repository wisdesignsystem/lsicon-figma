export interface File {
  path: string;
  content: string;
}

export interface Repository {
  owner: string;

  repo: string;

  status: () => Promise<number>;

  get: () => Promise<undefined | Record<string, unknown>>;

  branch: (from: string, to: string) => Promise<string>;

  commit: (files: File[], branch: { name: string; sha: string }) => Promise<void>;

  pull: (branch) => Promise<void>;
}
