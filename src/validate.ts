export interface ValidateError {
  message: string;
  list?: string[];
}

function isGithubURL(url: string) {
  return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(
    url
  );
}

function validateNpmPackage(name) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-*~][a-z0-9-*._~]*$/.test(
    name
  );
}

export function validateFormData({ github, token, npm }) {
  const errors: ValidateError[] = [];

  if (!github) {
    errors.push({
      message: "Github repository URL is required.",
    });
  } else if (!isGithubURL(github)) {
    errors.push({
      message: "Invalid Github repository URL.",
    });
  }

  if (!token) {
    errors.push({
      message: "Github personal access token is required.",
    });
  }

  if (!npm) {
    errors.push({
      message: "NPM package name is required.",
    });
  } else if (!validateNpmPackage(npm)) {
    errors.push({
      message:
        "NPM package name can only start with '@' or a letter, and it can only contain letters, numbers, underscores, and hyphens.",
    });
  }

  return errors;
}
