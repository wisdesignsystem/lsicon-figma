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

Lsicon Figma 图标管理工具是一个致力于帮助设计师通过 [Figma](https://figma.com) 工具快捷管理图标的插件，它将自动完成对 figma 的svg资源导出为 React 组件，传输到 [Github](https://github.com) 并发布到 [npm](https://npmjs.com)，供研发快速使用，整个过程无需了解研发细节。

## 它是如何工作的？

<img alt="lsicon" style="width: 100%" src="/images/how-to-work.jpg">

整个流程很长，但绝大多数流程都是自动完成的，你需要做的只是如下三个步骤：

1. 按照图标规范在figma中管理你的图标。
2. 运行该插件，点击发布。
3. 等待几分钟后，你将会在你的github仓库中看到一个发布用的Release pull request，确认发布信息无误后，点击合并等待几分钟即可完成发布。

## 环境准备

在使用这个插件前，你需要确保你已经具备如下环境，如果没有请先创建

1. 你需要准备一个github的账号，请移步这里 [Github](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home)
2. 你需要准备一个npm的账号，请移步这里 [NPM](https://www.npmjs.com/signup)
3. 了解figma的使用，并创建一个专门用于管理图标的figma页面。

## 使用步骤

图标的管理并不是随心所欲的，为了方便结合[lsicon官网](https://lsicon.com)对你的图标进行展示和查找，我们制定了一套图标管理规范，你可以对你的图标进行分类管理。

待补充