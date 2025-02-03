import React, { useState, useRef, useEffect } from "react";
import Github from "./Github";
import Publisher from "./Publisher";
import { validateFormData } from "./validate";
import type { ValidateError } from "./validate";

import "./Form.css";

interface Value {
  github: string;
  token: string;
  npm: string;
  versionMode?: "patch" | "minor" | "major";
}

interface FormProps {
  value: Value;
  onChange?: (value: Value) => void;
}

enum State {
  INIT = "init",
  RUNNING = "running",
  WAITING = "waiting",
  ERROR = "error",
  COMPLETED = "completed",
}

function Form({ value, onChange }: FormProps) {
  const form = useRef<HTMLFormElement>(null);
  const task = useRef(null);
  const [state, setState] = useState(State.INIT);
  const [changelog, setChangelog] = useState(undefined);
  const [errors, setErrors] = useState<ValidateError[]>([]);
  const [github, setGithub] = useState(undefined);
  const [visible, setVisible] = useState(false);

  function validate() {
    const data = getData();
    const currentErrors = validateFormData(data);
    setErrors(currentErrors || []);
    return !currentErrors.length;
  }

  function submit() {
    setState(State.RUNNING);

    const data = getData();
    onChange(data);

    parent.postMessage(
      {
        pluginMessage: {
          type: "publish",
        },
      },
      "*"
    );
  }

  async function publish(action) {
    const data = getData();
    const publisher = new Publisher(new Github(data.github, data.token));

    if (!action.payload.icons.length) {
      setErrors([{
        message: 'Icons not found. Please create icons first.',
      }]);
      setState(State.ERROR);
      return;
    }

    const changelog = await publisher.changelog({
      icons: action.payload.icons,
      npm: data.npm,
      versionMode: data.versionMode,
    });

    setState(State.WAITING);
    setChangelog(changelog);
    task.current = async () => {
      setChangelog(undefined);
      setState(State.RUNNING);
      const result = await publisher.publish({
        github: data.github,
        token: data.token,
        npm: data.npm,
        versionMode: data.versionMode,
        meta: action.payload.meta,
        icons: action.payload.icons,
        changelog,
      });

      if (result?.error) {
        setErrors(result.error);
        setState(State.ERROR);
      } else {
        setState(State.COMPLETED);
        setGithub(
          `https://github.com/${publisher.repository.owner}/${publisher.repository.repo}`
        );
      }

      task.current = null;
    };
  }

  function getData() {
    const element = new FormData(form.current);
    const result = {} as Value;
    for (const [key, value] of element.entries()) {
      result[key] = value;
    }
    return result;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const actionsMapper = {
      publish,
    };

    function handleAction(event) {
      const action = event.data.pluginMessage;
      const handle = actionsMapper[action.type];
      if (!handle) {
        return;
      }

      handle(action);
    }

    window.addEventListener("message", handleAction);
    return () => {
      window.removeEventListener("message", handleAction);
    };
  }, []);

  function clear() {
    task.current = null;
    setGithub(undefined);
    setChangelog(undefined);
    setState(State.INIT);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    clear();
    const isValid = validate();
    if (!isValid) {
      setState(State.ERROR);
      return;
    }
    submit();
  }

  function handleCancel() {
    clear();
  }

  function handlePublish() {
    if (task.current) {
      task.current();
    }
  }

  return (
    <form className="form" ref={form} onSubmit={handleSubmit}>
      <div className="item">
        <label className="label" htmlFor="github">
          Github Repository URL?
        </label>
        <div className="input">
          <input
            className="input__field"
            id="github"
            type="input"
            name="github"
            placeholder="Please enter the complete Github repository URL."
            defaultValue={value?.github}
          />
        </div>
      </div>
      <div className="item">
        <label className="label" htmlFor="token">
          Github Personal Access Token?
        </label>
        <div className="token input">
          <input
            className="input__field"
            id="token"
            type={visible ? "input" : "password"}
            name="token"
            placeholder="Please enter the Github personal access token."
            defaultValue={value?.token}
          />
          <div
            className={ visible ? "password-icon icon icon--visible" : "password-icon icon icon--hidden"}
            onKeyDown={() => {}}
            onClick={() => setVisible(!visible)}
          />
        </div>
      </div>
      <div className="item">
        <label className="label" htmlFor="npm">
          NPM Package Name?
        </label>
        <div className="input">
          <input
            className="input__field"
            id="npm"
            type="input"
            name="npm"
            placeholder="Please enter the npm package name."
            defaultValue={value?.npm}
          />
        </div>
      </div>
      <div className="item">
        <label className="label" htmlFor="versionMode">
          What Kind of Version?
        </label>
        <div className="radio-group">
          <div className="radio">
            <input
              className="radio__button"
              id="patch"
              type="radio"
              name="versionMode"
              value="patch"
              defaultChecked
            />
            <label className="radio__label" htmlFor="patch">
              Patch
            </label>
          </div>
          <div className="radio">
            <input
              className="radio__button"
              type="radio"
              name="versionMode"
              id="minor"
              value="minor"
            />
            <label className="radio__label" htmlFor="minor">
              Minor
            </label>
          </div>
          <div className="radio">
            <input
              className="radio__button"
              type="radio"
              name="versionMode"
              id="major"
              value="major"
            />
            <label className="radio__label" htmlFor="major">
              Major
            </label>
          </div>
        </div>
      </div>
      <div className="actions">
        <button
          className="button button--primary"
          type="submit"
          disabled={state === State.RUNNING}
        >
          {state === State.RUNNING ? <div className="loading" /> : "Publish"}
        </button>
        {state === State.WAITING && (
          <>
            <span
              className="label"
              style={{
                width: "auto",
                color: changelog.isEmpty ? "#959525" : undefined,
              }}
            >
              {changelog.isEmpty
                ? "Nothing will be updated, release new version?"
                : "New version about to be released, please confirm."}
            </span>
            <button
              className="button button--tertiary"
              type="button"
              onClick={handlePublish}
            >
              Confirm
            </button>
            <button
              className="button button--tertiary"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {state === State.WAITING && !changelog.isEmpty && (
        <div className="changelog">
          {!!changelog?.add?.length && (
            <div className="changelog-item">
              <div className="section-title">
                🚀 add icons({changelog.add.length}):
              </div>
              <div className="list">
                {changelog.add.map((icon) => {
                  return (
                    <div key={icon.fileName} className="list-item green">
                      {icon.fileName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!!changelog?.remove?.length && (
            <div className="changelog-item">
              <div className="section-title">
                🗑 remove icons({changelog.remove.length}):
              </div>
              <div className="list">
                {changelog.remove.map((icon) => {
                  return (
                    <div key={icon.fileName} className="list-item red">
                      {icon.fileName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!!changelog?.update?.length && (
            <div className="changelog-item">
              <div className="section-title">
                🔄 update icons({changelog.update.length}):
              </div>
              <div className="list">
                {changelog.update.map((icon) => {
                  return (
                    <div key={icon.fileName} className="list-item blue">
                      {icon.fileName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      {state === State.ERROR &&
        errors.map((error) => {
          return (
            <div key={error.message}>
              <div className="error">{error.message}</div>
              {error?.list?.map((item) => {
                return (
                  <div key={item} className="error">
                    {item}
                  </div>
                );
              })}
            </div>
          );
        })}
      {state === State.COMPLETED && (
        <div className="successful">
          🎉🎉🎉 Publish successfully! we created a{" "}
          <a target="__blank" href={`${github}/actions`}>
            github action
          </a>
          {" "}for you, once it completes, you will see a{" "}
           <a target="__blank" href={`${github}/pulls`}>
            pull request
          </a>
          {" "}for the release, merge it and wait for a few minutes and a new icon library version will be published.
        </div>
      )}
    </form>
  );
}

export default Form;
