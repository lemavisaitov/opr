rule BebraRule
{
    meta:
        description = "Ищет фразу 'бебра' в любом файле"
        author = "ChatGPT"
        date = "2025-05-13"

    strings:
        $bebra = "бебра"

    condition:
        $bebra
}
