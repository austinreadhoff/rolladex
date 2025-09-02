export enum IPCMessage{
    RequestSaveJson = "request-save-json",
    SendSaveJson = "send-save-json",
    SendSaveJsonToCheck = "send-save-json-to-check",
    SendLoadedJson = "send-loaded-json",
    
    CheckRecentLoad = "check-recent-load",
    LoadRecent = "load-recent",
    SendRecentsJson = "send-recents-json",
    SendRecentsClear = "send-recents-clear",

    SetGameMenu = "set-game-menu",
    SendSwitchTab = "send-switch-tab",
    SendSwitchToTab = "send-switch-to-tab",
    SendTakeRest = "send-take-rest",
    SendOpenDiceRoller = "send-open-dice-roller"
}