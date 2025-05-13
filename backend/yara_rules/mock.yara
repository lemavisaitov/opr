rule Detect_Cmd_Exe {
    strings:
        $cmd_ascii = "cmd.exe" ascii nocase
        $cmd_unicode = "cmd.exe" wide nocase
    condition:
        $cmd_ascii or $cmd_unicode
}