const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

function activate (context) {
  const json = fs.readFileSync(path.resolve(__dirname, 'fieldIds.json'), 'utf8')
  this.map = JSON.parse(json)

  const fieldLookUp = new FieldLookUp(JSON.parse(json))
  const eventHandlers = new EventHandlers(fieldLookUp)

  let aloha = vscode.commands.registerCommand('extension.aloha', () => {
    fieldLookUp.lookUpSelectedFieldID()
  })

  context.subscriptions.push(fieldLookUp)
  context.subscriptions.push(eventHandlers)
  context.subscriptions.push(aloha)
}
exports.activate = activate

// manages status bar updates
class FieldLookUp {
  constructor (map) {
    this.statusBar = vscode.window.createStatusBarItem()
    this.map = map
  }

  lookUpSelectedFieldID () {
    let editor = vscode.window.activeTextEditor
    const selection = editor.selection
    const text = editor.document.getText(selection)

    if (this.map[text]) {
      this.statusBar.text = `${this.map[text].type} | ${this.map[text].value}`
      this.statusBar.show()
    } else {
      this.statusBar.hide()
    }
  }

  dispose () {
    this.statusBar.dispose()
  }
}

// manages event handlers
class EventHandlers {
  constructor (fieldLookUp) {
    this.fieldLookUp = fieldLookUp
    vscode.window.onDidChangeTextEditorSelection(this.setFieldStatsOnStatusBar, this)
  }

  setFieldStatsOnStatusBar () {
    this.fieldLookUp.lookUpSelectedFieldID()
  }
}
