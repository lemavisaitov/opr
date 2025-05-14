rule HelloWorldRule
{
    meta:
        description = "Ищет фразу 'hello world' в любом файле"
        author = "ChatGPT"
        date = "2025-05-13"

    strings:
        $hello_world = "hello world"

    condition:
        $hello_world
}
