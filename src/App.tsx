import React, { useLayoutEffect, useState } from "react";

import logo from "./logo.svg";
import Form from "./Form";
import "./App.css";

function App() {
  const [github, setGithub] = useState("");
  const [token, setToken] = useState("");
  const [npm, setNpm] = useState("");
  const [ready, setReady] = useState(false);

  function get(action) {
    setReady(true);

    if (!action.payload) {
      return;
    }

    setGithub(action.payload.github);
    setToken(action.payload.token);
    setNpm(action.payload.npm);
  }

  function handleChange(value) {
    setGithub(value.github);
    setToken(value.token);

    parent.postMessage(
      {
        pluginMessage: {
          type: "set",
          payload: { github: value?.github, token: value?.token, npm: value?.npm },
        },
      },
      "*"
    );
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    const actionsMapper = {
      get,
    };

    function handleAction(event) {
      const action = event.data.pluginMessage;
      const handle = actionsMapper[action.type];
      if (!handle) {
        return;
      }

      handle(action);
    }

    parent.postMessage(
      {
        pluginMessage: {
          type: "setup",
        },
      },
      "*"
    );

    window.addEventListener("message", handleAction);
    return () => {
      window.removeEventListener("message", handleAction);
    };
  }, []);

  return (
    <div className="app">
      <img className="logo" alt="Lsicon" src={logo} />
      <p className="description">
        Manage your icons through figma, we will convert them into react components and automate the publishing of icons to NPM for development use. View more detailed information please{" "}
        <a target="__blank" href="https://github.com/wisdesignsystem/lsicon-figma">clicked me</a>.
      </p>
      {ready && <Form value={{ github, token, npm }} onChange={handleChange} />}
    </div>
  );
}

export default App;
