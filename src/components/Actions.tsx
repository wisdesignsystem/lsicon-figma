import React from "react";

import "./Actions.css";

function Actions({ children }) {
  return (
    <>
      <div className="actions__placeholder">{children}</div>
      <div className="actions">{children}</div>
    </>
  );
}

export default Actions;
