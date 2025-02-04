<p align="center">
  <a href="https://lsicon.com" target="_blank">
    <picture>
      <img alt="lsicon" width="216" height="56" style="max-width: 100%" src="https://img.seergb.com/lsicon-logo-black.svg">
    </picture>
  </a>
</p>

# Lsicon Icon Tool

Lsicon Icon Management Tool is a plugin dedicated to helping designers manage icons in Figma more conveniently. It automatically exports Figma SVG assets, transfers them to GitHub, and converts them into React icon components through a build tool. These components are then published to [npm](https://npmjs.com), enabling developers to quickly integrate them into projects. The entire workflow is efficient and minimizes your manual involvement.

## How It Works

![how-to-work](https://github.com/user-attachments/assets/b5c1b110-ac2e-4b70-9295-612c9d673aa0)

Although the process seems long, most tasks are automated. You only need minimal input and do not have to worry about the details.

## Environment Setup

Before using the plugin, ensure you have the following prerequisites:

1. A GitHub account (see [Github Signup](https://github.com/signup)).
2. An npm account (see [NPM Signup](https://www.npmjs.com/signup)).

## Usage Steps

If this is your first time, follow the tutorial to understand the plugin in detail. If you are already familiar with it, feel free to jump to any section as needed.

#### Create a GitHub Repository

You need a GitHub repository to host your icon assets. If you are unsure about the creation process, refer to this brief video:

https://github.com/user-attachments/assets/00253f35-6f58-4f75-9ccb-1af858173491

#### Create a GitHub Personal Access Token

While using the plugin, actions such as committing, creating PRs, and merging PRs require specific permissions. We request minimal privileges for these operations. You must create a dedicated GitHub personal access token. Since GitHub does not allow re-checking the token, copy and save it securely. Refer to this video for details:

https://github.com/user-attachments/assets/4317f802-8477-453d-8f2d-d3427f766780

#### Create an NPM Token

Because icons are eventually published to [npm](https://npmjs.com), you need an npm token for publication. After creating it, be sure to copy and store it securely. If you need help, watch this brief video:

https://github.com/user-attachments/assets/9f07f405-5529-44f0-ad59-879abf80c5f2

#### Create a GitHub Secret

To keep your account secure, we use GitHub repository secrets to manage your npm token. This method is safe. For guidance, watch the short video below:

> [!IMPORTANT]
> Use the name `NPM_TOKEN` as specified without modifying it.

https://github.com/user-attachments/assets/d8da6b5a-b5eb-4ed2-bc8c-17e5312d6950

#### Manage Icons in Figma

TODO

#### Use the Plugin in Figma

When your icons are ready for release and developers need them, we will show you how to use the plugin: