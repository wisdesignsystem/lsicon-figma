import React from "react";
import * as RDXDialog from "@radix-ui/react-dialog";

import Actions from "./Actions";
import Changelog from "./Changelog";
import type { ChangelogType } from "./Changelog";

import "./Confirm.css";

function Confirm({
  open,
  changelog,
  onConfirm = () => {},
  onCancel = () => {},
}: {
  open: boolean;
  changelog?: ChangelogType;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <RDXDialog.Root open={open}>
      <RDXDialog.Portal>
        <RDXDialog.Overlay className="confirm__overlay" />
        <RDXDialog.Content className="confirm__content">
          <RDXDialog.Title className="confirm__title">
            New Version Release Pending
          </RDXDialog.Title>
          <RDXDialog.Description className="confirm__description">
            A new version is ready to be published. Please confirm to proceed.
          </RDXDialog.Description>
          <Changelog changelog={changelog} />
          <Actions>
            <button className="button" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className="button button--primary" type="button" onClick={onConfirm}>
              Confirm
            </button>
          </Actions>
        </RDXDialog.Content>
      </RDXDialog.Portal>
    </RDXDialog.Root>
  );
}

export default Confirm;
