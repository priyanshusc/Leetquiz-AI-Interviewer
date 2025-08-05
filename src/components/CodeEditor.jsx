import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

// A map of language names to their default code snippets
const languageSnippets = {
  javascript: `function solve(arr) {\n  // Write your code here...\n}`,
  python: `def solve(arr):\n    # Write your code here...\n    pass`,
  java: `class Solution {\n    public int[] solve(int[] arr) {\n        // Write your code here...\n        return arr;\n    }\n}`,
  cpp: `#include <vector>\n\nstd::vector<int> solve(std::vector<int>& arr) {\n    // Write your code here...\n    return arr;\n}`,
  c: `#include <stdio.h>\n\nvoid solve(int arr[], int size) {\n    // Write your code here...\n}`,
  go: `package main\n\nfunc solve(arr []int) []int {\n    // Write your code here...\n    return arr\n}`,
};

// The component now accepts a "language" prop
function CodeEditor({ onChange, language }) {
  const [code, setCode] = useState(languageSnippets[language]);
  const editorRef = useRef(null);

  // This effect runs whenever the language prop changes
  useEffect(() => {
    const newSnippet = languageSnippets[language];
    setCode(newSnippet);
    // Directly set the value in the Monaco editor instance if it exists
    if (editorRef.current) {
      editorRef.current.setValue(newSnippet);
    }
  }, [language]);

  // Store the editor instance on mount
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    onChange(value);
  }

  return (
    <Editor
      height="100%"
      language={language} // Use the language prop for syntax highlighting
      theme="vs-dark"
      value={code} // Use "value" to control the editor's content
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        padding: {
          top: 10,
          
        },
      }}
    />
  );
}

export default CodeEditor;
