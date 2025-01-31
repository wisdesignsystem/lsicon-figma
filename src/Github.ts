import { Octokit } from "@octokit/rest";

import type { Repository } from "./Repository";

class Github implements Repository {
  octokit: Octokit;

  owner: string;

  repo: string;

  token: string;

  constructor(github: string, token: string) {
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const matched = github.match(regex);

    if (matched) {
      this.owner = matched[1];
      this.repo = matched[2];
    }

    this.octokit = new Octokit({
      auth: token,
    });
    this.token = token;
  }

  async get() {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${this.owner}/${this.repo}/refs/heads/main/package.json`
      ).then((res) => res.json());
      return response;
    } catch (error) {
      return;
    }
  }

  async status() {
    try {
      const res = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      return res.status;
    } catch (error) {
      return error.status;
    }
  }

  async branch(from, to) {
    const { data: fromBranch } = await this.octokit.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: from,
    });

    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${to}`,
      sha: fromBranch.commit.sha,
    });

    const { data: toBranch } = await this.octokit.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: to,
    });

    return toBranch.commit.sha;
  }

  async commit(files, branch) {
    const data = [];
    for (const file of files) {
      const { data: fileBlob } = await this.octokit.git.createBlob({
        owner: this.owner,
        repo: this.repo,
        content: file.content,
        encoding: "utf-8",
      });

      data.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: fileBlob.sha,
      });
    }

    const { data: tree } = await this.octokit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: branch.sha,
      tree: data,
    });

    const { data: commit } = await this.octokit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: "Publish new icons",
      tree: tree.sha,
      parents: [branch.sha],
    });

    await this.octokit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branch.name}`,
      sha: commit.sha,
    });
  }

  async pull(branchName) {
    const { data: pr } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      head: branchName,
      base: "main",
      title: "Merge new icons.",
    });

    await this.octokit.pulls.merge({
      owner: this.owner,
      repo: this.repo,
      pull_number: pr.number,
      commit_title: `Merge pull request #${pr.number} from ${branchName}`,
      merge_method: "merge",
    });
  }
}

export default Github;
