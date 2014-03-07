'use strict';
var myth = require('myth');

module.exports.preprocess = function() {

  var editor = atom.workspace.activePaneItem,
    text, converted;

  if (!editor || editor.getGrammar().name !== 'CSS') {
    return;
  }

  text = editor.getText();

  try {
    converted = myth(text);
  }
  catch (err) {
    console.log(err);
    atom.beep();
    return;
  }

  editor.setText(converted);
};

module.exports.activate = function() {
  return atom.workspaceView.command('myth', this.preprocess);
};
