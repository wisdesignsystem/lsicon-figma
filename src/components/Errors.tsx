import React from "react";
import { CircleInformationIcon } from "@wisdesign/lsicon";

import type { ValidateError } from "../libs/validate";

import "./Errors.css";

function Errors({ errors }: { errors: ValidateError[] }) {
  if (!errors.length) {
    return null;
  }

  return (
    <div className="errors">
      <div className="errors__title">
        <CircleInformationIcon /> Error
      </div>
      <ul className="errors__ul">
        {errors.map((error) => {
          return (
            <li className="errors__li" key={error.message}>
              {error.message}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Errors;
