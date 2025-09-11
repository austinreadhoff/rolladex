## 2025.?.?
- [ ] Switch to CalVer
- [X] Multiple Window Support
- [X] Fancybar +/- Math
- [X] Handle changing of character names in recents list
- [X] Additional Special rules: Alert feat, Harenon race, Paladin aura of Protection, Watcher Paladin aura of the Sentinel
- [X] Allow more spell note delimiters in 5e
- [X] Actions in the Header
- [X] UI Bug Fixes

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

## Backlog

### PF2E
- pf2e has been ignored since 0.3.1, Generally update and bring up to speed with improvements
- Do feats and equipment need to be full catalogs?
- Spellbook logic should be different from 5e to account for duplicate prepped spells in slots.  Maybe even separate spontaneous/prepared UX
- Replace parens in spell names, to allow more spell note delimiters (fix spells.ts and character.hasSpell, see 5e)
- Action icons 
- Remove link text from spells 

### 5E
- Show a count of how many spells are currently prepared
- Signify spellbook spells using icon in catalog list
- Remove from spellbook button in catalog

### Both Games
- Rethink viewing descriptions in spellbook

### Nitpicks/Tweaks/Visuals
- fancy bars slight text offset
- Less ugly pdf export (including not showing the cursor)
- tooltips to show work for calculated fields, like ability checks
- Inconsistent 5e spell description formatting

### App Mgmt
- Automatic updates
- Is it possible to update content w/o version update?
- Uppercase the app name (windows and linux)

### High Effort, Low Demand
- gm tools: monster reference
    - integrate with turn tracker
- Character Pictures (how to store?)
- Non-PITA method of showing unsaved status in title bar
- Custom undo stack
- Roll dice from sheet by clicking on things
    - Abilities, save, skills, attacks, spells(?)
- Command Palatte
    - Roll abilities/skills/saves
    - Rests
    - Cast Spells
    - Make attacks
    - etc?
