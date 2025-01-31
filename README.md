<p align="center">
  <a href="https://lsicon.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.seergb.com/lsicon-logo-white.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://img.seergb.com/lsicon-logo-black.svg">
      <img alt="lsicon" width="216" height="56" style="max-width: 100%" src="https://img.seergb.com/lsicon-logo-black.svg">
    </picture>
  </a>
</p>

# Lsicon Figma Plugin

Lsicon Figma 图标管理工具是一个致力于帮助设计师通过 [Figma](https://figma.com) 工具快捷管理图标的插件，它将自动完成从 figma 中的导出svg资源，传输到 [Github](https://github.com) 转换为 React 组件并发布到 [npm](https://npmjs.com)，供研发快速使用，整个过程无需了解研发细节。

## 它是如何工作的？

<img alt="lsicon" style="width: 100%" src="/images/how-to-work.jpg">

整个流程很长，但绝大多数流程都是自动完成的，你需要做的只是如下三个步骤：

1. 按照图标规范在figma中管理你的图标。
2. 运行 Lsicon Figma 插件，点击发布，等待发布完成。
3. 前往 Github 仓库确认发布信息并合并 Release 的 Pull Request即可自动完成后续的发布。

## 环境准备

在使用这个插件前，你需要确保你已经具备如下环境，如果没有请先创建

1. 你需要准备一个github的账号，请移步这里 [Github](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home)
2. 你需要准备一个npm的账号，请移步这里 [NPM](https://www.npmjs.com/signup)
3. 了解figma的使用，并创建一个专门用于管理图标的figma页面。

## 使用步骤

如果你是第一次使用本插件，你需要先初始化一个 Github 仓库。

### 创建Github仓库

由于该工具会通过 Github 进行资源托管，我们需要你在首次使用该插件时创建一个新的仓库，创建步骤请参照如下规则：

#### step1

<img alt="github" style="width: 100%" src="/images/github-step1.jpg">

#### step2

<img alt="github" style="width: 100%" src="/images/github-step2.jpg">

⚠️注意：
1. 仓库的名称请使用字母开头，且仅能包含字母、数字、下划线、中横线。
2. 仓库的名称同时会作为 NPM 包名称进行发布，请确保你使用的名称没有被其他人占用，否则将发布失败。

#### step3

由于发布到 NPM 包需要您的授权，因此我们采用 Github Action 读取 Token 的形式，你需要在 Github 仓库中提供 NPM Token.

首先登陆 [NPM](https://npmjs.com) 通过如图所示创建 NPM 发布包所需的 Token

<img alt="github" style="width: 100%" src="/images/npm-step1.jpg">
<img alt="github" style="width: 100%" src="/images/npm-step2.jpg">
<img alt="github" style="width: 100%" src="/images/npm-step3.jpg">
<img alt="github" style="width: 100%" src="/images/npm-step4.jpg">

此时你已经获取到了 NPM Token, 请将它输入到 Github secret 中，这是安全的密钥管理方式。

<img alt="github" style="width: 100%" src="/images/github-token-step1.jpg">
<img alt="github" style="width: 100%" src="/images/github-token-step2.jpg">


### Figma中管理图标

图标的管理并不是随心所欲的，为了方便结合[lsicon官网](https://lsicon.com)对你的图标进行展示和查找，我们制定了一套图标管理规范，你可以对你的图标进行分类管理。

待补充

### 发布图标

当你完成了所有的准备工作，并且已经创建好了你的图标，你希望发布一个新版本时，请前往 Figma 图标所在页面通过插件列表搜索 lsicon点击发布即可，这个过程