import React from "react";
import * as RDXDialog from "@radix-ui/react-dialog";

import Actions from "./Actions";

import "./Success.css";

function Success({
  open,
  github,
  preview,
  onConfirm = () => {},
}: {
  open: boolean;
  github: string;
  preview: string;
  onConfirm?: () => void;
}) {
  return (
    <RDXDialog.Root open={open}>
      <RDXDialog.Portal>
        <RDXDialog.Overlay className="success__overlay" />
        <RDXDialog.Content className="success__content">
          <RDXDialog.Title className="success__title">
            🎉 Publish successfully!
          </RDXDialog.Title>
          <div className="success__description">
            We've set up a <a target="__blank" href={`${github}/actions`}>GitHub Action</a> for you. Once the process completes:
            <ol>
              <li>Review the generated <a target="__blank" href={`${github}/pulls`}>Pull Request</a> for the release</li>
              <li>Merge the PR</li>
              <li>Wait a few minutes</li>
            </ol>
            Your new icon library version will be automatically published.View your NPM icons on LSIcon: <a target="__blank" href={preview}>{preview?.replace('https://', '')}</a>
          </div>
          <Actions>
            <button
              className="button button--ghost"
              type="button"
              onClick={onConfirm}
            >
              Done
            </button>
          </Actions>
        </RDXDialog.Content>
      </RDXDialog.Portal>
    </RDXDialog.Root>
  );
}

export default Success;
