'use strict';
var myth = require('myth'),
  fs = require('fs');

module.exports.preprocess = function() {

  var editor = atom.workspace.activePaneItem,
    text, converted, path;

  if (!editor || editor.getGrammar().name !== 'CSS') {
    return;
  }

  text = editor.getText(),
    path = editor.getUri().replace('.css', '.output.css');;

  try {
    converted = myth(text);
    fs.writeFileSync(path, converted);
  }
  catch (err) {
    console.log(err);
    atom.beep();
    return;
  }

  this.updateStatusbar(path);
};

module.exports.updateStatusbar = function(path) {
  var statusBar = atom.workspaceView.statusBar;
  statusBar.appendLeft('<span id="myth-statusbar">Myth output saved to ' + path + '</span>');
  setTimeout(function(){
    statusBar.find('#myth-statusbar').fadeOut(250, function() {
      statusBar.find('#myth-statusbar').remove();
    });
  }, 5000);
}

module.exports.activate = function() {
  return atom.workspaceView.command('myth', this.preprocess.bind(this));
};
