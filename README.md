# Yalc

> Better workflow than **npm | yarn link** for package authors.
> 给包开发者比 **npm | yarn link** 更好用的工作流程 

## Why

When developing and authoring multiple packages (private or public), you often find yourself in need of using the latest/WIP versions in other projects that you are working on in your local environment **without publishing those packages to the remote registry.** NPM and Yarn address this issue with a similar approach of [symlinked packages](https://docs.npmjs.com/cli/link) (`npm/yarn link`). Though this may work in many cases, it often brings nasty [constraints and problems](https://github.com/yarnpkg/yarn/issues/1761#issuecomment-259706202) with dependency resolution, symlink interoperability between file systems, etc.

*当开发多包(private 或 public)时，你会经常发现自己需要在本地环境中的其他项目中切换最新/半成品的版本，**而不需要将这些包发布到远程**，NPM和Yarn用类似符号链接包的方法解决了这个问题。虽然这在很多情况下可能有效，但它通常在依赖关系解析、文件系统之间的符号链接操作性等，带来令人讨厌的约束和问题*

## What

- `yalc` acts as very simple local repository for your locally developed packages that you want to share across your local environment.
  *`yalc` 是一个非常简单的本地存储库，用于存储你本地开发的、想要在本地共享的包*

- When you run `yalc publish` in the package directory, it grabs only files that should be published to NPM and _puts_ them in a special global store (located, for example, in `~/.yalc`).
  *当你在包文件夹中运行`yalc publish`时，它仅抓取应该发布到npm的文件，并把它放到一个特殊的全局存储中（例如，位于`~/.yalc`）*

- When you run `yalc add my-package` in your `project` it _pulls_ package content into `.yalc` in the current folder and injects a `file:`/`link:` dependency into `package.json`. Alternatively, you may use `yalc link my-package` which will create a symlink to the package content in `node_modules` and will not touch `package.json` (like `npm/yarn link` does), or you even may use it with **Pnmp/Yarn/Npm workspaces**.
  *当你在你的项目中运行`yalc add my-package`时，它会从`.yalc`中拉取包内容到当前文件夹，并且注入一个`file:`/`link:`依赖到`package.json`中。或者，你可以使用`yalc link my-package`，它将创建一个指向`node_modules`中的包内容的软链接，而不会改变`package.json`（就像使用`npm/yarn link`一样）。或者，你甚至可以将它与**Pnpm/Yarn/Npm workspaces**一起使用。*

- `yalc` creates a special `yalc.lock` file in your project (similar to `yarn.lock` and `package-lock.json`) that is used to ensure consistency while performing `yalc`'s routines.
  *`yalc`会在你的项目中创建一个特殊的`yalc.lock`文件(与`yarn.lock`和`package-lock.json`文件类似)，这用于确保使用`yalc`时的一致性。*

- `yalc` can be used with projects where `yarn` or `npm` package managers are used for managing `package.json` dependencies.
  *`yalc`可以用于使用`yarn`或`npm`包管理器来管理`package.json`依赖的项目*


## Installation

![npm (scoped)](https://img.shields.io/npm/v/yalc.svg?maxAge=86400) [![Build Status](https://travis-ci.org/whitecolor/yalc.svg?branch=master)](https://travis-ci.org/whitecolor/yalc)

Using NPM:

```
npm i yalc -g
```

Using Yarn:

```
yarn global add yalc
```

Some documented features might not have been published yet, see the [change log](./CHANGELOG.md).

## Usage

### Publish

- Run `yalc publish` in your dependency package `my-package`.
*在你的依赖包`my-package`中运行`yalc publish`*

- It will copy [all the files that should be published in remote NPM registry](https://docs.npmjs.com/files/package.json#files).
*它会拷贝[它应该发布到远程npm注册表的所有文件](https://docs.npmjs.com/files/package.json#file)*

- If your package has any of these lifecycle scripts: `prepublish`, `prepare`, `prepublishOnly`, `prepack`, `preyalcpublish`, they will run before in this order. If your package has any of these: `postyalcpublish`, `postpack`, `publish`, `postpublish`, they will run after in this order. Use `--no-scripts` to publish without running scripts.
*如果你的包中含有以下生命周期脚本：`prepublish`,`prepare`,`prepublishOnly`,`prepack`,`preyalcpublish`, 它们会按顺序在前面执行。如果你的包中含有以下脚本：`postyalcpublish`, `postpack`, `publish`, `postpublish`，他们会按顺序在后面执行。用`--no-scripts`可以在发布时不执行脚本。*

- While copying package content, `yalc` calculates the hash signature of all files and, by default, adds this signature to the package manifest `version`. You can disable this by using the `--no-sig` option.
  *复制包内容时，`yalc`计算所有文件的hash签名，默认情况下，将此签名添加到包清单的`version`中。你可以使用`--no-sig`参数来禁用它*
- You may also use `.yalcignore` to exclude files from publishing to yalc repo, for example, files like README.md, etc.
  *你同样可以使用`.yalcignore`来排除发布到yalc repo的文件，例如README.md等文件*
- `--content` flag will show included files in the published package
  *`--content`标记将显示发布包中包含的文件*
- **NB!** In terms of which files will be included in the package `yalc` fully supposed to emulate behavior of `npm` client (`npm pack`). [If you have nested `.yalc` folder in your package](https://github.com/whitecolor/yalc/issues/95) that you are going to publish with `yalc` and you use `package.json` `files` list, it should be included there explicitly.
  **注意** *关于哪些文件将被包括到`yalc`中，完全应该模拟`npm`客户端的行为（`npm pack`）。如果你的包中有嵌套的`。yakc`文件夹，你将使用`yack`发布，并且你用`package.json` `files`列表，他们应该显示的包含在其中*
- **NB!** Windows users should make sure the `LF` new line symbol is used in published sources; it may be needed for some packages to work correctly (for example, `bin` scripts). `yalc` won't convert line endings for you (because `npm` and `yarn` won't either).
  **注意！** *windows 用户应该确保在发布的源代码中使用`LF`作为换行符，某些软件包可能需要这么做才能正常工作（比如`bin`脚本）， `yalc`不会为你转换换行符(因为`npm`和`yarn` 也不会)*
- **NB!** Note that, if you want to include `.yalc` folder in published package content, you should add `!.yalc` line to `.npmignore`.
  **注意！** *如果你想在发布的内容中包含`.yalc`文件，你应该添加 `!.yalc` 到 `.npmignore`*
- [Easily propagate package updates everywhere.](#pushing-updates-automatically-to-all-installations)
  **[轻松的将软件包更新到任何地方.](#pushing-updates-automatically-to-all-installations)**
- Yalc by default resolve `workspace:` protocol in dependencies, to omit this use `-no-workspace-resolve` flag
  *默认情况下，yalc在依赖关系中解析 `workspace:`协议， 要忽略这一点，请使用`-no-workspace-resolve`标志*

### Add

- Run `yalc add my-package` in your dependent project, which
  will copy the current version from the store to your project's `.yalc` folder and inject a `file:.yalc/my-package` dependency into `package.json`.
  **
- You may specify a particular version with `yalc add my-package@version`. This version will be fixed in `yalc.lock` and will not affect newly published versions during updates.
- Use the `--link` option to add a `link:` dependency instead of `file:`.
- Use the `--dev` option to add yalc package to dev dependencies.
- With `--pure` flag it will not touch `package.json` file, nor it will touch modules folder, this is useful for example when working with [**Yarn workspaces**](https://yarnpkg.com/lang/en/docs/workspaces/) (read below in _Advanced usage_ section)
- With `--workspace` (or `-W`) it will add dependency with "workspace:" protocol.

### Link

- As an alternative to `add`, you can use the `link` command which is similar to `npm/yarn link`, except that the symlink source will be not the global link directory but the local `.yalc` folder of your project.
- After `yalc` copies package content to `.yalc` folder it will create a symlink:
  `project/.yalc/my-package ==> project/node_modules/my-package`. It will not touch `package.json` in this case.

### Update

- Run `yalc update my-package` to update the latest version from store.
- Run `yalc update` to update all the packages found in `yalc.lock`.
- `preyalc` and `postyalc` scripts will be executed in target package on add/update operations which are performed while `push`
- if need to perform pre/post `scripts` on update of particular package use `(pre|post)yalc.package-name` name for script in your `package.json`.
- update `--update` (`--upgrade`, `--up`) to run package managers's update command for packages.

### Remove

- Run `yalc remove my-package`, it will remove package info from `package.json` and `yalc.lock`
- Run `yalc remove --all` to remove all packages from project.

### Installations

- Run `yalc installations clean my-package` to unpublish a package published with `yalc publish`
- Run `yalc installations show my-package` to show all packages to which `my-package` has been installed.

## Advanced usage

### Pushing updates automatically to all installations

- When you run `yalc add|link|update`, the project's package locations are tracked and saved, so `yalc` knows where each package in the store is being used in your local environment.
- `yalc publish --push` will publish your package to the store and propagate all changes to existing `yalc` package installations (this will actually do `update` operation on the location).
- `yalc push` - is a use shortcut command for push operation (which will likely become your primarily used command for publication):
- `scripts` options is `false` by default, so it won't run `pre/post` scripts (may change this with passing `--scripts` flag).
- With `--changed` flag yalc will first check if package content has changed before publishing and pushing, it is a quick operation and may be useful for _file watching scenarios_ with pushing on changes.
- Use `--replace` option to force replacement of package content.
- Use `preyalc` and `postyalc` (read in `update` docs) to execute needed script on every push.
- Use `--update` to run `yarn/npm/pnpm update` command for pushed packages.

### Keep it out of git

- If you are using `yalc'ed` modules temporarily during development, first add `.yalc` and `yalc.lock` to `.gitignore`.
- Use `yalc link`, that won't touch `package.json`
- If you use `yalc add` it will change `package.json`, and ads `file:`/`link:` dependencies, if you may want to use `yalc check` in the [precommit hook](https://github.com/typicode/husky) which will check package.json for `yalc'ed` dependencies and exits with an error if you forgot to remove them.

### Keep it in git

- You may want to keep shared `yalc'ed` stuff within the projects you are working on and treat it as a part of the project's codebase. This may really simplify management and usage of shared _work in progress_ packages within your projects and help to make things consistent. So, then just do it, keep `.yalc` folder and `yalc.lock` in git.
- Replace it with published versions from remote repository when ready.
- **NB!** - standard non-code files like `README`, `LICENCE` etc. will be included also, so you may want to exclude them in `.gitignore` with a line like `**/.yalc/**/*.md` or you may use `.yalcignore` not to include those files in package content.

### Publish/push sub-projects

- Useful for monorepos (projects with multiple sub-projects/packages): `yalc publish some-project` will perform publish operation in the `./some-project` directory relative to `process.cwd()`

### Retreat and Restore

- Instead of completely removing package you may temporary set it back with `yalc retreat [--all]` for example before package publication to remote registry.
- After or later restore it with `yalc restore`.

### Use with **Yarn/Pnpm workspaces**

Use if you will try to `add` repo in `workspaces` enabled package, `--pure` option will be used by default, so `package.json` and modules folder will not be touched.

Then you add yalc'ed package folder to `workspaces` in `package.json` (you may just add `.yalc/*` and `.yalc/@*/*` patterns). While `update` (or `push`) operation, packages content will be updated automatically and `yarn` will care about everything else.

If you want to override default pure behavior use `--no-pure` flag.

### Clean up installations file

- While working with yalc for some time on the dev machine you may face the situation when you have locations where you added yalc'ed packages being removed from file system, and this will cause some warning messages when yalc will try to push package to removed location. To get rid of such messages, there is an explicit command for this: `yalc installations clean [package]`.

### Override default package store folder

- You may use `--store-folder` flag option to override default location for storing published packages.

### Control output

- Use `--quiet` to fully disable output (except of errors). Use `--no-colors` to disable colors.

### Set default options via .yalcrc

- For example add `workspace-resolve=false` line to the `.yalcrc` file to turn off `workspace:` protocol resolution or `sig=false` to disable package version hash signature.

## Related links

- [yarn probably shouldn't cache packages resolved with a file path](https://github.com/yarnpkg/yarn/issues/2165)
- ["yarn knit": a better "yarn link"](https://github.com/yarnpkg/yarn/issues/1213)
- [npm-link-shared](https://github.com/OrKoN/npm-link-shared)
- [yarn link does not install package dependencies](https://github.com/yarnpkg/yarn/issues/2914)
- [[npm] RFC: file: specifier changes](https://github.com/npm/npm/pull/15900)

## Licence

WTF.
