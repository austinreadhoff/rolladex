<img src="/img/rolladex_title.png" width=500px/>
Desktop app for RPG character sheets.  Fully offline and saves characters as simple JSON files.  Also allows export to PDF.

Supported Games:
- DnD 5e
- Pathfinder 2e
- Simple GM Tools: iniatitive tracker, youtube-powered soundboard

## Usage
If it exists, grab the latest package for your OS and install.  Otherwise, you can always...

## Building from Source
`npm ci`

`tsc`

`npm start`

### Packaging for Debian Linux:

`npm run package-linux`

`npm run create-debian-installer`

### Packaging for Windows:

`npm run package-windows`

`npm run create-windows-installer`

### Packaging for MacOS:

`npm run package-macos`

`npm run create-macos-installer`

## Thanks
- [DnD 5e SRD Spells](https://github.com/vorpalhex/srd_spells)
- [Pathfinder 2e Content](https://github.com/foundryvtt/pf2e)
- [RPGUI](https://github.com/RonenNess/RPGUI/)
