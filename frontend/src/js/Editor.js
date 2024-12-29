import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import '../css/Editor.css';

const Judge0_URL = "https://judge0-ce.p.rapidapi.com";
const API_KEY = "67bda0df96msh8460a9ec3f94054p16bbd6jsn631f77905c2f"; // Replace with your RapidAPI key

const problems = [
  {
    id: 1,
    name: "Sum of Two Numbers",
    description: "Write a program that takes two integers as input and outputs their sum.",
    sampleInput: "2\n3",
    sampleOutput: "5",
    hiddenTestCases: [
      { input: "100\n200", output: "300" },
      { input: "-5\n10", output: "5" },
    ],
  },
  {
    id: 2,
    name: "Reverse a String",
    description: "Write a program that takes a string as input and outputs the reversed string.",
    sampleInput: "hello",
    sampleOutput: "olleh",
    hiddenTestCases: [
      { input: "world", output: "dlrow" },
      { input: "12345", output: "54321" },
    ],
  },
  {
    id: 3,
    name: "Check Even or Odd",
    description: "Write a program that checks if a given number is even or odd.",
    sampleInput: "7",
    sampleOutput: "Odd",
    hiddenTestCases: [
      { input: "10", output: "Even" },
      { input: "15", output: "Odd" },
    ],
  },
];

const EditorComponent = () => {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [code, setCode] = useState("// Write your code here");
  const [languageId, setLanguageId] = useState(62); // Default: Java (62)
  const [input, setInput] = useState(selectedProblem.sampleInput); // User-provided input
  const [output, setOutput] = useState(""); // Output after code submission
  const [hiddenResults, setHiddenResults] = useState([]); // Results of hidden test cases
  const [loading, setLoading] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput(""); // Clear previous output
    setHiddenResults([]); // Clear hidden test case results
    setAllPassed(false);

    try {
      // Test sample case
      const sampleResponse = await axios.post(
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

      const { stdout, stderr, compile_output, status } = sampleResponse.data;
      if (status.description === "Accepted") {
        setOutput(stdout || "No output");
      } else {
        setOutput(compile_output || stderr || "Error occurred");
      }

      // Test hidden cases
      const results = [];
      let allHiddenPassed = true;

      for (const testCase of selectedProblem.hiddenTestCases) {
        const hiddenResponse = await axios.post(
          `${Judge0_URL}/submissions?base64_encoded=false&wait=true`,
          {
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
          },
          {
            headers: {
              "content-type": "application/json",
              "x-rapidapi-key": API_KEY,
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const { stdout: hiddenOutput, status: hiddenStatus } = hiddenResponse.data;
        const passed = hiddenStatus.description === "Accepted" && testCase.output.trim() === hiddenOutput?.trim();

        if (!passed) {
          allHiddenPassed = false;
          results.push({
            input: testCase.input,
            expected: testCase.output,
            actual: hiddenOutput?.trim() || "",
            status: "Fail",
          });
        }
      }

      setHiddenResults(results);
      setAllPassed(allHiddenPassed);
    } catch (error) {
      console.error("Error during submission:", error);
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProblemChange = (id) => {
    const problem = problems.find((p) => p.id === Number(id));
    setSelectedProblem(problem);
    setCode("// Write your code here");
    setInput(problem.sampleInput);
    setOutput("");
    setHiddenResults([]);
    setAllPassed(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Panel: Problem Details and Code Editor */}
      <div style={{ flex: 1, padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h2>Problems</h2>
        <select
          onChange={(e) => handleProblemChange(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        >
          {problems.map((problem) => (
            <option key={problem.id} value={problem.id}>
              {problem.name}
            </option>
          ))}
        </select>

        {selectedProblem && (
          <div style={{ marginBottom: "1rem" }}>
            <h3>{selectedProblem.name}</h3>
            <p>{selectedProblem.description}</p>
            <p>
              <strong>Sample Input:</strong>
              <pre>{selectedProblem.sampleInput}</pre>
            </p>
            <p>
              <strong>Sample Output:</strong>
              <pre>{selectedProblem.sampleOutput}</pre>
            </p>
          </div>
        )}

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
          height="50vh"
          value={code}
          onChange={handleEditorChange}
          language={{
            71: "python",
            63: "javascript",
            54: "cpp",
            62: "java",
          }[languageId]}
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
          rows={5}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginBottom: "1rem" }}
        >
          {loading ? "Submitting..." : "Submit Code"}
        </button>

        <h2>Output</h2>
        <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "5px" }}>
          {output || "Output will be displayed here"}
        </pre>

        {allPassed && <p style={{ color: "green", fontWeight: "bold" }}>All hidden test cases passed!</p>}

        {hiddenResults.length > 0 && (
          <div>
            <h2>Failed Hidden Test Cases</h2>
            {hiddenResults.map((result, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <p>
                  <strong>Input:</strong> <pre>{result.input}</pre>
                </p>
                <p>
                  <strong>Expected:</strong> {result.expected}
                </p>
                <p>
                  <strong>Actual:</strong> {result.actual}
                </p>
                <p>
                  <strong>Status:</strong> {result.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;
