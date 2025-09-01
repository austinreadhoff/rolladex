## 2025.?.?
- [ ] Switch to CalVer
- [X] Handle changing of character names in recents list
- [X] Additional Special rules: Alert feat, Harenon race, Paladin aura of Protection, Watcher Paladin aura of the Sentinel
- [X] Add to Spellbook grey-out doesn't account for spell note delimiters
- [X] Allow more spell note delimiters in 5e
- [X] Fix a few spell names
- [X] Opening a modal now closes all others
- [X] Multiple Window Support
- [X] Spell Save DC shouldn't have a "+"
- [ ] BUG: when force quitting and saving multiple windows at once, recents file gets corrupted json
- [ ] Dev: constants for game values, used for both menu and saved files.  Also ipc message name magic strings.
- [ ] New landing page logo?
- [ ] Automatic update support?

## 0.3.3
- [X] Fix Bestow Curse description
- [X] Allow modifiers to spell attack/dc
- [X] "Special Rules" menu
- [X] Recently opened viewable on landing page - replaces auto-open
- [X] Misc UI Improvements

## 0.3.2
- [X] Simplify save warning dialog logic
- [X] GM Tools UI Improvements
- [X] Catalogs available for reference in GM Tools
- [X] 5e Spellbook: Handle multiclass casters
- [X] 5e: Regain half hit dice on long rest
- [X] 5e: Attack calculations
- [X] Ignore bracketed text in spellbook rows
- [X] Dice Roller available on all pages
- [X] Show Individual dice in dice roller
- [X] Misc bug fixes

## 0.3.1
- [X] Visual Overhaul
- [X] GM Tools
- [X] pf2e spells missing area property
- [X] autocomplete doesn't work with apostrophes

## 0.3.0
- [X] MacOS Compatilibity
- [X] Added Support for pf2e
- [X] Survival is Wisdom in 5e 🤦‍♂️
- [X] Track spell attack/dc by choosing ability in 5e

## 0.2.1
- [X] Small bug fixes

## 0.2.0
- [X] Data Binding
- [X] TypeScript conversion
- [X] Fixes to Class Spell Lists and spell content
- [X] Clear Recents List

## 0.1.0
- [X] MVP

---

## Backlog, low-priority items, and Stray Thoughts, in no particular order
- Replace parens in pf2e spell names, to allow more spell note delimiters (fix spells.ts and character.hasSpell)
- Show a count of how many spells are currently prepared
- Spell catalog mark already added spells
- fancybar math (like roll20) - how UI?
- Rethink spellbook UI for viewing descrptions
- pf2e has been ignored since 0.3.1,  Update and bring up to speed with improvements
- roll20 iframe?
- fancy bars slight text offset
- Less ugly pdf export (including not showing the cursor)
- gm tools: monster reference
    - integrate with turn tracker
- Signify spellbook spells using icon in catalog list
- Roll dice from sheet by clicking on things
- Command Palatte
    - Roll abilities/skills/saves
    - Rests
    - Cast Spells
    - Make attacks
    - etc?
- Figure out a way to update content w/o version update
- tooltips to show work for calculated fields, like ability checks
- Dock Tabs?
- Rich Text for text areas?
- Character Pictures (how to store?)
- pf2e: Action icons 
- Uppercase the goddamn name (windows and linux)
- Inconsistent 5e spell description formatting
- Alternate search titles for certain spells srd vs 5e phb
- Remove link text from pf2e spells 
- Remove from spellbook button in catalog
- Non-PITA method of showing unsaved status in title bar
- Custom undo stack