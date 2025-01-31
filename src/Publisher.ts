import { getFiles, getPackageJson, getChangelog } from "./files";
import type { Repository, File } from "./Repository";
import type { ValidateError } from "./validate";

interface PublishResult {
  error?: ValidateError[];
  result?: unknown;
}

class Publisher {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  templates(): File[] {
    return getFiles(this.repository.owner, this.repository.repo);
  }

  async getLsiconPackageJson() {
    const response = await fetch(
      "https://registry.npmjs.org/lsicon/latest"
    ).then((res) => res.json());
    return response;
  }

  async getPackageJson() {
    const response = await fetch(
      `https://registry.npmjs.org/${this.repository.repo}/latest`
    ).then((res) => res.json());
    return response;
  }

  validateStatus(status) {
    if (status >= 200 && status < 300) {
      return;
    }

    switch (status) {
      case 404:
        return {
          error: [
            {
              message:
                "Github repository not found. Please go to gitHub and create the repository.",
            },
          ],
        };
      case 401:
      case 403:
        return {
          error: [
            {
              message: "Unauthorized. Please check your personal access token.",
            },
          ],
        };
      default:
        return {
          error: [
            {
              message: "Network error. Please check you network connection.",
            },
          ],
        };
    }
  }

  async changelog(data) {
    const prevPackageJson = await this.getPackageJson();
    const prevIcons = prevPackageJson.lsicon?.icons || [];

    return getChangelog({
      icons: data.icons,
      preIcons: prevIcons,
      repo: this.repository.repo,
      versionMode: data.versionMode,
    });
  }

  async publish(data): Promise<PublishResult> {
    const status = await this.repository.status();
    const error = this.validateStatus(status);
    if (error) {
      return error;
    }

    try {
      const files: File[] = this.templates();
      const packageJson = getPackageJson(
        this.repository.owner,
        this.repository.repo
      );

      // @ts-ignore
      packageJson.lsicon = {
        meta: data.meta,
        icons: data.icons,
      };

      const lsicon = await this.getLsiconPackageJson();

      // @ts-ignore
      packageJson.dependencies.lsicon = lsicon.version;

      files.push({
        path: "package.json",
        content: JSON.stringify(packageJson, null, 2),
      });

      files.push({
        path: ".changeset/version-new-changelog.md",
        content: data.changelog.fileContent,
      });

      const branchName = `icon_${Date.now()}`;
      const branch = await this.repository.branch("main", branchName);
      await this.repository.commit(files, { name: branchName, sha: branch });
      await this.repository.pull(branchName);
    } catch (error) {
      return {
        error: [{ message: error.message }],
      };
    }
  }
}

export default Publisher;
