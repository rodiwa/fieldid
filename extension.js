const vscode = require('vscode')
const fs = require('fs')

function activate (context) {
  const fieldLookUp = new FieldLookUp()
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
  constructor () {
    this.statusBar = vscode.window.createStatusBarItem()
  }

  lookUpSelectedFieldID () {
    let editor = vscode.window.activeTextEditor
    const selection = editor.selection
    const text = editor.document.getText(selection)

    if (map[text]) {
      this.statusBar.text = map[text]
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

// this will be replaced by JSON
const map = {
  '123': 'Screen | Loan Purpose',
  '456': 'Field | Whats you name?',
  '789': 'seven eight nine 4444'
}
