# sveil-cli

> Note: for now sveil have very limited features and can only generate svelte components, but there're big plans.

> Required node >= 16

  <details>
    <summary>FAQ</summary>
    
  **What:**

The sveil. Generation tool for svelte. Sveil will generate svelte resources.

**Why:**

Why not? Svelte is pretty mature framework, but for some reason have no any generation tool that widely used. Generation tool could save some time, scale application, and set structure. I didn't find any other generation tools for svelte, only nx have one, but it's comes with monorepos only, nx workspace and other configs (and last time I tried it svelte plugin didn't work well). And Lets say, svelte plugin for nx isn't looks official, nx mostly focused on react or angular.

The Sveil on other hand is standalone tool that you can use without any config files.

  </details>

---

  <details>
    <summary>TL;DR;</summary>

**Philosophy:**

Freedom without structure is chaos. Svelte let us deside how to organize project freely, there're only several restrictions/rules. Since svelte trying to bind to native js way without any built in design patterns, we as developers are on our own.

I see 3 main goals of such tool:

- Generation
- Structure
- Scale

For now it's limited generation, but with time sveil will get to structure svelte project and scale it (like nest cli or angular).

  </details>

---

## Instalation

    ```
    npm i @sveil/cli -g
    ```

---

## Getting started

You can easily run:

```
sveil --help
```

In any situation to find desired command.

---

## Usage

Here's auto documentation, that you can run by your own in any time:

```
sveil
Usage: sveil [options] [command]

Options:
  -h, --help        display help for command

Commands:
  init|i [options]  Init sveil and create sveil config
  generate|g        Genearate sveil resource
  help [command]    display help for command
```

---

### Init

Command creates _sveil-cli.json_ in root directory.

> You need it only if in your project using non standart named directories.

For example common path in svelte for lib is **src/lib/**, but if you have **src/library/**, then you need sveil configuration file (you can create it manually, doesn't matter really). Same for inner lib directories, like "components", "store", etc. Or even **source/** instead of **src/**, all path values are configurable.

In all other cases you don't need config file and nobody ever will know that you used sveil (●'◡'●)

```
sveil i --help
Usage: sveil init|i [options]

Init sveil and create sveil config

Options:
  -d, --dry                    Run comman dry-run(no changes will be applied)
  -y, --skip                   Skip interactive tour and init with default values
  -srcd, --source-dir <dir>    Set source directory of project
  -ld, --lib-dir <dir>         Set lib directory of project
  -cd, --components-dir <dir>  Set components directory of project
  -h, --help                   display help for command
```

---

### Generate

```
sveil g c --help
Usage: sveil generate component|c [options] <componentName>

Generate svelte component

Arguments:
  componentName                      Component name

Options:
  -d, --dry                          Run comman dry-run (no changes will be applied)
  -sl, --script-language <language>  Set component script language (choices: "ts", "js")
  -ce, --css-external                Put component styles out of component
  -cl, --css-language <language>     Set component style language, e.g. 'scss' (choices: "scss", "postcss")
  -o, --overwrite                    WARNING: Overwriting existed component
  -s, --separate                     Generate component in separate folder
  -h, --help                         display help for command
```

#### Examples:

Basic usage

```
sveil g c main
```

OR

```
sveil generate component main
```

Output:

```
- file main.svelte generated in ...\src\lib\components\main.svelte
```

Basic svelte component template:

```
<script>
  let name = "main";
</script>

<div class="main">
  {name}
</div>

<style>
  .main {
    margin: 0;
    padding: 0;
  }
</style>

```

By default sveil use plain css and js for component template, but if project use typescript - it automatically add lang="ts".
It's possible to overwrite default script/style languages with -sl and -cl options.

> Sveil supports typescript only in script languages and scss/postcss in style preprocessors (for now).
>
> Please, be aware there's no auto detection for style preprocessors yet.

You can move styles out of component with -ce option

```
sveil g c example -ce
```

Or create component in separate folder with -s option

```
sveil g c example -s
```

If component already existed, then you can use -o option with little confirmation prompt (need to write component name)

```
sveil g c example -o
```
