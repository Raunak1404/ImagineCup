import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "../css/Editor.css"; // Add custom styles if needed

const CodeEditor = ({ problemDescription }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(""); // Reset code when language changes
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Code Editor</h2>
        <div>
          <label htmlFor="language-select">Language: </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      <div className="editor-main">
        <div className="problem-description">
          <h3>Problem</h3>
          <p>{problemDescription}</p>
        </div>
        <div className="code-editor">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
