myth = require "myth"
fs = require "fs"

module.exports =
    activate: ->
        atom.commands.add 'atom-workspace', "myth", => @convert()

    convert: ->
        editor = atom.workspace.getActivePaneItem()
        text = editor.getText()

        return if !editor or editor.getGrammar().name isnt 'CSS'

        module.path = editor.getURI().replace('.css', '.output.css')

        try
            converted = myth(text)
            fs.writeFileSync(module.path, converted)
        catch error
            console.log(error)
            atom.beep()
            return false

        @updateStatusBar()

    updateStatusBar: ->
        @span = document.createElement("span")
        @span.id = "myth-statusbar"
        @span.innerHTML = "Myth output saved to #{module.path}"

        @statusBar?.addLeftTile(item: @span, priority: 100)
        setTimeout ->
            document.getElementById("myth-statusbar")?.remove()
        , 5000

    consumeStatusBar: (@statusBar) ->
        @convert()
