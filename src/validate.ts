export interface ValidateError {
  message: string;
  list?: string[];
}

function isGithubURL(url: string) {
  return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(
    url
  );
}

// function validateName(name: string) {
//   if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(name)) {
//     return "Icon names can only consist of alphanumeric characters and hyphens, and the first character cannot be a number.";
//   }
// }

export function validateGithubMeta({ github, token }) {
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

  return errors;
}
