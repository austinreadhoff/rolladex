# 🎲 RollaDex 🎲
Desktop app for RPG character sheets.  Written with ElectronJS, Knockout, and Bootstrap CSS.
Supported Games:
- DnD 5e
- Pathfinder 2e

Shoutout to [this repo](https://github.com/vorpalhex/srd_spells) for making a JSON collection of 5e SRD spell data freely available

## Usage
Grab the latest package for your OS and install

## Building from Source
`npm ci`

`tsc`

To run locally:

`npm start` or F5 in VS Code to debug

### Packaging for Debian Linux:

`npm run package-linux`

`npm run create-debian-installer`

### Packaging for Windows:

`npm run package-windows`

`npm run create-windows-installer`
