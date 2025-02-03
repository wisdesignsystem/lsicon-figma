import merge from "merge";

import { getFiles, getPackageJson } from "./files";
import { getChangelog } from "./changelog";
import type { Repository, File } from "./Repository";
import type { ValidateError } from "./validate";
import type { Lsicon } from "./components";

interface PublishResult {
  error?: ValidateError[];
  result?: unknown;
}

interface PackageJSON {
  name?: string;
  version?: string;
  lsicon?: Lsicon;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

class Publisher {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  templates(): File[] {
    return getFiles({
      owner: this.repository.owner,
      repo: this.repository.repo,
    });
  }

  async getNPMPackage(name) {
    const response = await fetch(
      `https://registry.npmjs.org/${name}/latest`
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
    const prevPackageJson = await this.getNPMPackage(data.npm);
    const prevIcons = prevPackageJson.lsicon?.icons || [];

    return getChangelog({
      icons: data.icons,
      preIcons: prevIcons,
      npm: data.npm,
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

      const oldPackageJson = await this.repository.get();
      const defaultPackageJson = getPackageJson({
        owner: this.repository.owner,
        repo: this.repository.repo,
        npm: data.npm,
      });

      const packageJson: PackageJSON = {};
      merge.recursive(packageJson, oldPackageJson, defaultPackageJson);

      let version = packageJson.version;
      try {
        const npmPackage = await this.getNPMPackage(data.npm);
        version = npmPackage.version;
      } catch (e) {
        // no action
      }
      packageJson.name = data.npm;
      packageJson.version = version;

      packageJson.lsicon = {
        meta: data.meta,
        icons: data.icons,
      };

      const lsicon = await this.getNPMPackage("lsicon");
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
