# vscode-accelerated README

Accelerates cursor up and down, like [accelerated-jk](https://github.com/rhysd/accelerated-jk) for Vim.

## Features

When you holding `up` or `down` key, this extension accelerates cursor moving.
When `up` or `down` key repeated 7 times, cursor moves 2 lines per repeat (by default).
The repeat count will be reset after 150 ms (also by default).

## Requirements

Currently VSCodeVim and native cursorMove are supported.

## Setup

No default keymap is provided, because this extension is almost intended to use with Vim extension.
For VSCodeVim, place the snippet on below to your User Settings:

```json
{
  "vim.otherModesKeyBindingsNonRecursive": [
    {
      "before": ["j"],
      "commands": [{
        "command": "accelerated.cursorDown"
      }]
    },
    {
      "before": ["k"],
      "commands": [{
        "command": "accelerated.cursorUp"
      }]
    },
  ],
}
```

If you don't use Vim extension, you can simply map `up` and `down` keys to `accelerated.cursorUp` and `accelerated.cursorDown` commands.
Then do not forget to set `accelerated.commandMode` to `cursorMove`.

## Extension Settings

This extension contributes the following settings:

* `accelerated.accelerationTable`: Number of key presses required to add 1 up/down motion per key press.
* `accelerated.resetTime`: Acceleration will be reset after specified time in millisecond elapsed.
* `accelerated.commandMode`: Select command to be used for up/down motion. Currently `vscodevim`, `vscodevim-gj-gk` and `cursormove` are supported.
