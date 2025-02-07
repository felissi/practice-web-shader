import { useState } from "react";
import "./App.css";
import { Opening, Scene } from "./Scene";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

if (import.meta.env.DEV) {
  studio.initialize();
  studio.extend(extension);
}

function App() {
  return (
    <>
      <Opening />
    </>
  );
}

export default App;
