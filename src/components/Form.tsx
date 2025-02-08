import React, { useState, useRef, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@wisdesign/lsicon";

import Github from "../libs/Github";
import Publisher from "../libs/Publisher";
import Actions from "./Actions";
import Loading from "./Loading";
import Confirm from "./Confirm";
import Errors from "./Errors"
import Success from "./Success";
import { validateFormData } from "../libs/validate";
import type { ValidateError } from "../libs/validate";

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
  CONFIRM = "confirm",
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
  const [preview, setPreview] = useState(undefined);
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
      setErrors([
        {
          message: "Icons not found. Please create icons first.",
        },
      ]);
      setState(State.ERROR);
      return;
    }

    const changelog = await publisher.changelog({
      icons: action.payload.icons,
      npm: data.npm,
      versionMode: data.versionMode,
    });

    setState(State.CONFIRM);
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
        setPreview(`https://lsicon/${data.npm}`);
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
    setPreview(undefined);
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

  function handleDone() {
    clear();
  }

  return (
    <>
      <form className="form" ref={form} onSubmit={handleSubmit}>
        <div className="item">
          <label className="label" htmlFor="github">
            Github Repository URL
          </label>
          <div className="value">
            <input
              className="input__field"
              id="github"
              type="input"
              name="github"
              placeholder="Please input"
              defaultValue={value?.github}
            />
          </div>
        </div>
        <div className="item">
          <label className="label" htmlFor="token">
            Github Personal Access Token
          </label>
          <div className="value">
            <input
              className="password__field"
              id="token"
              type={visible ? "input" : "password"}
              name="token"
              placeholder="Please input"
              defaultValue={value?.token}
            />
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div className="eye" onClick={() => setVisible(!visible)}>
              {visible ? <ViewIcon /> : <ViewOffIcon />}
            </div>
          </div>
        </div>
        <div className="item">
          <label className="label" htmlFor="npm">
            NPM Package Name
          </label>
          <div className="input">
            <input
              className="input__field"
              id="npm"
              type="input"
              name="npm"
              placeholder="Please input"
              defaultValue={value?.npm}
            />
          </div>
        </div>
        <div className="item">
          <label className="label" htmlFor="versionMode">
            What Kind of Version?
          </label>
          <div className="value radio-group">
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
        <Errors errors={errors} />
        <Actions>
          <button className="button button--primary" type="submit">
            Publish
          </button>
        </Actions>
      </form>
      <Loading loading={state === State.RUNNING} />
      <Confirm
        open={state === State.CONFIRM}
        changelog={changelog}
        onConfirm={handlePublish}
        onCancel={handleCancel}
      />
      <Success open={state === State.COMPLETED} preview={preview} github={github} onConfirm={handleDone} />
    </>
  );
}

export default Form;
