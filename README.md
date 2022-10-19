# Yalc

> Better workflow than **npm | yarn link** for package authors.
> 
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
  
  *在你的项目中运行`yalc add my-package`, 会从存储中拷贝当前版本到你的项目`.yalc`文件夹，并且将`file:.yalc/my-package`注入到`package.json`中*

- You may specify a particular version with `yalc add my-package@version`. This version will be fixed in `yalc.lock` and will not affect newly published versions during updates.
  
  *你可以像`yalc add my-package@version`一样指定一个特别的版本。此版本会在`yalc.lock`文件中更改，并且在更新期间不会影响新发布的版本*

- Use the `--link` option to add a `link:` dependency instead of `file:`.
  
  *使用`--link`参数将不会使用`file:`协议，而是使用`link:`替代*

- Use the `--dev` option to add yalc package to dev dependencies.
  
  *使用`--dev`参数会将 yalc 包 添加到 devDependencies*

- With `--pure` flag it will not touch `package.json` file, nor it will touch modules folder, this is useful for example when working with [**Yarn workspaces**](https://yarnpkg.com/lang/en/docs/workspaces/) (read below in _Advanced usage_ section)
  
  *使用`--pure`标志，它将不会更改`package.json`文件， 也不会修改`node_modules`文件夹， 这在使用像[**Yarn workspaces**]项目时很有用*

- With `--workspace` (or `-W`) it will add dependency with "workspace:" protocol.
  
  *使用`--workspace` （或者 `-W`），它会使用 "workspace:"协议添加依赖*

### Link

- As an alternative to `add`, you can use the `link` command which is similar to `npm/yarn link`, except that the symlink source will be not the global link directory but the local `.yalc` folder of your project.
  
  *作为`add`的替代方法，你可以使用类似`npm/yarn link`的`link`命令， 只是软链接的源不是全局链接目录， 而是项目本地的`.yalc`文件夹*
  
- After `yalc` copies package content to `.yalc` folder it will create a symlink:
  `project/.yalc/my-package ==> project/node_modules/my-package`. It will not touch `package.json` in this case.

  *yalc将包内容复制到`.yalc`文件夹后，它将创建一个软连接`project/.yalc/my-package ==> project/node_modules/my-package`，这种情况下不会更改`package.json`*

### Update

- Run `yalc update my-package` to update the latest version from store.
  
  *运行`yalc update my-package`来从存储中更新最新版本*

- Run `yalc update` to update all the packages found in `yalc.lock`.
  
  *运行`yalc update`来更新`yalc.lock`中所有包*

- `preyalc` and `postyalc` scripts will be executed in target package on add/update operations which are performed while `push`
  
  *`preyalc` 和 `postyalc` 脚本将在目标包执行`push`的 add/update 操作时执行*

- if need to perform pre/post `scripts` on update of particular package use `(pre|post)yalc.package-name` name for script in your `package.json`.
  
  *如果需要子更新特定包时执行 pre/post `scripts`, 请在你的`package.json`中使用`(pre|post)yalc.package-name`名称脚本*

- update `--update` (`--upgrade`, `--up`) to run package managers's update command for packages.
  
  *更新命令 `--update` (`--upgrade`, `--up`) 用于包管理者对软件包的更新命令*

### Remove

- Run `yalc remove my-package`, it will remove package info from `package.json` and `yalc.lock`
  
  *运行`yalc remove my-package`，这将从`package.json`和`yalc.lock`中移除包信息*

- Run `yalc remove --all` to remove all packages from project.
  
  *`yalc remove --all` 用来移除项目中所有 yalc包*

### Installations

- Run `yalc installations clean my-package` to unpublish a package published with `yalc publish`
  
  *运行`yalc installations clean my-package`取消一个用`yalc publish`发布的的包*

- Run `yalc installations show my-package` to show all packages to which `my-package` has been installed.
  
  *运行`yalc installations show my-package`显示所有安装了`my-package`的包*

## Advanced usage

*高级用法*

### Pushing updates automatically to all installations

*将更新自动推送到所有安装*

- When you run `yalc add|link|update`, the project's package locations are tracked and saved, so `yalc` knows where each package in the store is being used in your local environment.
  
  *当你运行`yalc add|link|update`时，会跟踪并保存项目包位置， 所有`yalc`知道存储中每个包在你本地环境中的使用情况*

- `yalc publish --push` will publish your package to the store and propagate all changes to existing `yalc` package installations (this will actually do `update` operation on the location).
  
  *`yalc publish --push`会发布你的包到本地存储， 并将所有更改发送到现有的`yalc`安装包 (这实际上会对该位置进行`update`操作)*

- `yalc push` - is a use shortcut command for push operation (which will likely become your primarily used command for publication):
  
  *`yalc push` - 是一个用于推送的快捷命令，这可能会成为成为你发布时主要使用的命令*

- `scripts` options is `false` by default, so it won't run `pre/post` scripts (may change this with passing `--scripts` flag).
  
  *`scripts` 参数默认未 `false`， 所有它不会运行 `pre/post` 脚本 （可以通过传递`--scripts`标志来更改这一点）*

- With `--changed` flag yalc will first check if package content has changed before publishing and pushing, it is a quick operation and may be useful for _file watching scenarios_ with pushing on changes.
  
  *使用`--changed`标记， yalc会在发布和推送之前首先检查包内容是否已修改，这是一个快速操作，可能对推动更改的 _文件监听场景_ 比较有用*

- Use `--replace` option to force replacement of package content.
  
  *使用`--replace`参数来强制更换包内容*

- Use `preyalc` and `postyalc` (read in `update` docs) to execute needed script on every push.
  
  *使用`preyalc` 和 `postyalc`（参考`update`说明）用来在每次推送时运行需要的脚本*

- Use `--update` to run `yarn/npm/pnpm update` command for pushed packages.
  
  *使用 `--update` 来为已推送的包运行 `yarn/npm/pnpm update`命令*

### Keep it out of git

*从git中移除*

- If you are using `yalc'ed` modules temporarily during development, first add `.yalc` and `yalc.lock` to `.gitignore`.
  
  *如果在开发过程中临时使用`yalc'ed`模块，需要先将`.yalc`和`yalc.lock`添加到`.gitignore`*

- Use `yalc link`, that won't touch `package.json`
  
  *使用`yalc link`， 这不会影响`package.json`*

- If you use `yalc add` it will change `package.json`, and ads `file:`/`link:` dependencies, if you may want to use `yalc check` in the [precommit hook](https://github.com/typicode/husky) which will check package.json for `yalc'ed` dependencies and exits with an error if you forgot to remove them.
  
  *如果你使用`yalc add`，这将修改`package.json`，并且添加`file:`/`link:`到依赖。如果你想要在[precommit hoot][(_](https://github.com/typicode/husky))使用`yalc check`,它将检查package.json中是否有使用`yalc'ed`的依赖项，如果你忘记删除他们，它将退出，并显示一个错误。*

### Keep it in git

*在git中保留*

- You may want to keep shared `yalc'ed` stuff within the projects you are working on and treat it as a part of the project's codebase. This may really simplify management and usage of shared _work in progress_ packages within your projects and help to make things consistent. So, then just do it, keep `.yalc` folder and `yalc.lock` in git.
  
  *你可能希望在你的项目中保留共享的`yalc'ed`内容， 并且将它视为项目代码的一部分。这可能真的会简化项目中共享的 _work in progress_ 包的管理和使用， 并有助于一致性。那么就这么做吧，把`.yalc`和`yalc.lock`放在git中*

- Replace it with published versions from remote repository when ready.
  
  *准备好了之后，用来自远程存储库的已发布版本来替换它*

- **NB!** - standard non-code files like `README`, `LICENCE` etc. will be included also, so you may want to exclude them in `.gitignore` with a line like `**/.yalc/**/*.md` or you may use `.yalcignore` not to include those files in package content.
  
  **注意！** - 标准的非代码文件， 如`README`,`LICENCE`也将包括在内，如果你想要排除他们，可以在`.gitignore`中添加像`**/.yalc/**/*.md`, 或者你可以使用`.yalcignore`把他们从包内容中排除。

### Publish/push sub-projects

*子项目发布/推送*

- Useful for monorepos (projects with multiple sub-projects/packages): `yalc publish some-project` will perform publish operation in the `./some-project` directory relative to `process.cwd()`
  
  *对于monorepos(有多个子项目/包的项目)有用：`yalc publish some-project`将在相对于`process.cwd()`的`./some-project`文件夹中执行发布操作*

### Retreat and Restore

*撤回和恢复*

- Instead of completely removing package you may temporary set it back with `yalc retreat [--all]` for example before package publication to remote registry.
  
  *例如，在将软件包发布到远程仓库之前，你可以使用`yalc retreat [--all]`临时将它设置回原位，而不是完全删除包*

- After or later restore it with `yalc restore`.
  
  *之后你可以用`yalc restore`来恢复它*

### Use with **Yarn/Pnpm workspaces**

*使用**Yarn/Pnpm 工作区** *

Use if you will try to `add` repo in `workspaces` enabled package, `--pure` option will be used by default, so `package.json` and modules folder will not be touched.

*如果你尝试在启用了`workspace`的包中添加repo，`--pure`选项将被默认使用，所以`package.json`和module文件夹不会被影响*

Then you add yalc'ed package folder to `workspaces` in `package.json` (you may just add `.yalc/*` and `.yalc/@*/*` patterns). While `update` (or `push`) operation, packages content will be updated automatically and `yarn` will care about everything else.

*然后， 将yalc的包文件夹添加到`package.json`的`workspace`中（你可以只添加`.yalc/*`和`.yalc/@*/*`模式），在update或push操作时，包内容将自动更新，而`yarn`将关心其他的一切*

If you want to override default pure behavior use `--no-pure` flag.

*如果你想覆盖pure的默认行为，可以使用`--no-pure`标志*

### Clean up installations file

*清理安装的文件*

- While working with yalc for some time on the dev machine you may face the situation when you have locations where you added yalc'ed packages being removed from file system, and this will cause some warning messages when yalc will try to push package to removed location. To get rid of such messages, there is an explicit command for this: `yalc installations clean [package]`.
  
  *当你在开发机器上使用yalc一段时间后，你可能遇到这样的情况：当你添加的yalc包的位置从文件系统中被删除，yalc试图将包推到删除位置时，会导致一些警告信息。有一个明确的命令`yalc installations clean [package]`为了消除这样的信息*

### Override default package store folder

*修改默认本地存储包文件夹*

- You may use `--store-folder` flag option to override default location for storing published packages.
  
  *你可以使用`--store-folder`标志来改写默认的已发布包的存储位置*

### Control output

*控制输出*

- Use `--quiet` to fully disable output (except of errors). Use `--no-colors` to disable colors.
  *使用`--quiet`来完全禁用输出（error除外）。使用`--no-colors`来禁用颜色*

### Set default options via .yalcrc

*通过 .yalcrc 来设置默认选项*

- For example add `workspace-resolve=false` line to the `.yalcrc` file to turn off `workspace:` protocol resolution or `sig=false` to disable package version hash signature.
  
  *例如，添加`workspace-resolve=false`到`.yalcrc`文件来关闭`workspace:`协议解析， 或添加`sig=false`来禁用包版本的hash签名*

## Related links

- [yarn probably shouldn't cache packages resolved with a file path](https://github.com/yarnpkg/yarn/issues/2165)
- ["yarn knit": a better "yarn link"](https://github.com/yarnpkg/yarn/issues/1213)
- [npm-link-shared](https://github.com/OrKoN/npm-link-shared)
- [yarn link does not install package dependencies](https://github.com/yarnpkg/yarn/issues/2914)
- [[npm] RFC: file: specifier changes](https://github.com/npm/npm/pull/15900)

## Licence

WTF.
