import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('parentheses-newline.insertNewlineOrAcceptSuggestion', () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const selection = editor.selection;

      const cursorPosition = selection.active;
      const currentLine = document.lineAt(cursorPosition.line);
      const currentLineText = currentLine.text;
      const charBeforeCursor = currentLineText[cursorPosition.character - 1];
      const charAfterCursor = currentLineText[cursorPosition.character];

      // If we are inside empty parentheses, create a newline, otherwise accept the selected suggestion.
      if (charBeforeCursor === '(' && charAfterCursor === ')') {
        // Get the text after the cursor
        let textAfterCursor = currentLineText.substring(cursorPosition.character);

        // Get the current line's indentation
        let indent = currentLineText.substring(0, currentLine.firstNonWhitespaceCharacterIndex);

        // We want to insert the newline with increased indent, and the rest of the text with the original indentation
        let newText = '\n' + indent + '\t' + '\n' + indent + textAfterCursor;
        let replaceRange = new vscode.Range(cursorPosition, currentLine.range.end);

        // Replace the text after the cursor with the new text
        editor.edit((editBuilder) => {
          editBuilder.replace(replaceRange, newText);
        });

        // Move the cursor down to the newly added line
        vscode.commands.executeCommand('cursorMove', {
          to: 'down',
          by: 'line',
          value: 1,
        });
      } else {
        vscode.commands.executeCommand('acceptSelectedSuggestion');
      }
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
