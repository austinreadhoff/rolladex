# 🎲 RollaDex 🎲
A no-frills desktop application for creation and in-game management of 5e characters

**Key Features**
- A fast, simple interface designed to mimic the layout of the official paper character sheet
- Auto-calculation of ability modifiers
- Custom counters for tracking class resources, item charges, and anything else
- Track spell slots and known/prepared spells
- Browse and sort the entire catalog of available spells (SRD only by default)
- Add spells to the catalog via a JSON config file
- Hover over spells in your spellbook to view a full description.  No peeking back and forth between your character sheet and your handbook.
- Characters are saved as simple .json files for ease of storage and backup
- Export to a reader-friendly PDF to show your DM your terrible ideas

RollaDex is largely rules-agnostic, meaning it won't do a lot of "smart" things like auto-populating race and class features, calculating item effects, or preventing you from breaking game rules.  It's designed to be used in conjunction with your own collection of books and content.  This isn't a replacement for DnD Beyond, it's just a character sheet with some bells and whistles; it's your job to know the rules.  This does, however, make it fitting for homebrew, since non-official content looks the same as official content when typed into a textbox.

Big thanks to [this repo](https://github.com/vorpalhex/srd_spells) for making a JSON collection of SRD spells freely available