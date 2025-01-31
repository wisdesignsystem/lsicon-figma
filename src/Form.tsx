import React, { useState, useRef, useEffect } from "react";
import Github from "./Github";
import Publisher from "./Publisher";
import { validateGithubMeta } from "./validate";
import type { ValidateError } from "./validate";

import "./Form.css";

interface Value {
  github: string;
  token: string;
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

  function validate() {
    const data = getData();
    const currentErrors = validateGithubMeta(data);
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

    const changelog = await publisher.changelog({
      icons: action.payload.icons,
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

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      setState(State.ERROR);
      return;
    }
    submit();
  }

  function handleCancel() {
    task.current = null;
    setChangelog(undefined);
    setState(State.INIT);
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
          Github repository URL?
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
          Github personal access token?
        </label>
        <div className="input">
          <input
            className="input__field"
            id="token"
            type="input"
            name="token"
            placeholder="Please enter the Github personal access token."
            defaultValue={value?.token}
          />
        </div>
      </div>
      <div className="item">
        <label className="label" htmlFor="versionMode">
          What kind of version?
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
            <span className="label" style={{ width: "auto", color: changelog.isEmpty ? '#959525' : undefined }}>
              {changelog.isEmpty ? 'None updates, confirm release a new version?' : 'About to release a new version, please confirm.'}
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
          {!!changelog?.add?.length && <div className="changelog-item">
            <div className="section-title">🚀 add icons:</div>
            <div className="list">
              {changelog.add.map((icon) => {
                return (
                  <div key={icon.fileName} className="list-item green">
                    {icon.fileName}
                  </div>
                );
              })}
            </div>
          </div>}
          {!!changelog?.remove?.length && <div className="changelog-item">
            <div className="section-title">🗑 remove icons:</div>
            <div className="list">
              {changelog.remove.map((icon) => {
                return (
                  <div key={icon.fileName} className="list-item red">
                    {icon.fileName}
                  </div>
                );
              })}
            </div>
          </div>}
          {!!changelog?.update?.length && <div className="changelog-item">
            <div className="section-title">🔄 update icons:</div>
            <div className="list">
              {changelog.update.map((icon) => {
                return (
                  <div key={icon.fileName} className="list-item blue">
                    {icon.fileName}
                  </div>
                );
              })}
            </div>
          </div>}
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
    </form>
  );
}

export default Form;
