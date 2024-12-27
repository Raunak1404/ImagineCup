import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const Judge0_URL = "https://judge0-ce.p.rapidapi.com";
const API_KEY = "67bda0df96msh8460a9ec3f94054p16bbd6jsn631f77905c2f"; // Replace with your RapidAPI Judge0 key

const EditorComponent = () => {
  const [code, setCode] = useState("// Write your code here");
  const [languageId, setLanguageId] = useState(71); // Default: Python 3 (71)
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput(""); // Clear previous output
    try {
      // Step 1: Submit Code to Judge0
      const response = await axios.post(
        `${Judge0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageId,
          stdin: input,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      // Step 2: Get Output from Response
      const { stdout, stderr, compile_output, status } = response.data;
      if (status.description === "Accepted") {
        setOutput(stdout || "No output");
      } else {
        setOutput(compile_output || stderr || "Error occurred");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Panel: Code Editor */}
      <div style={{ flex: 1, padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h2>Code Editor</h2>
        <select
          value={languageId}
          onChange={(e) => setLanguageId(Number(e.target.value))}
          style={{ marginBottom: "1rem" }}
        >
          <option value={71}>Python 3</option>
          <option value={63}>JavaScript (Node.js)</option>
          <option value={54}>C++</option>
          <option value={62}>Java</option>
        </select>
        <Editor
          height="70vh"
          defaultLanguage="python"
          defaultValue="// Write your code here"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>

      {/* Right Panel: Input and Output */}
      <div style={{ flex: 1, padding: "1rem" }}>
        <h2>Input</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input data here"
          rows={10}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <button onClick={handleSubmit} disabled={loading} style={{ marginBottom: "1rem" }}>
          {loading ? "Submitting..." : "Submit Code"}
        </button>

        <h2>Output</h2>
        <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "5px" }}>
          {output || "Output will be displayed here"}
        </pre>
      </div>
    </div>
  );
};

export default EditorComponent;
