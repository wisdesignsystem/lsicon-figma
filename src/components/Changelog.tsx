import React from "react";

import type { Changelog as ChangelogType } from "../libs/changelog";

import "./Changelog.css";

function Changelog({ changelog }: { changelog?: ChangelogType }) {
  if (changelog === undefined || changelog?.isEmpty) {
    return null;
  }

  return (
    <div className="changelog">
      {!!changelog.add.length && (
        <div className="changelog__item">
          <div className="changelog__label">
            🚀 add icons({changelog.add.length}):
          </div>
          <ul className="changelog__ul">
            {changelog.add.map((icon) => {
              return <li className="changelog__li" key={icon.fileName}>{icon.fileName}</li>;
            })}
          </ul>
        </div>
      )}
      {!!changelog.remove.length && (
        <div className="changelog__item">
          <div className="changelog__label">
            🗑 remove icons({changelog.remove.length}):
          </div>
          <ul className="changelog__ul">
            {changelog.remove.map((icon) => {
              return <li className="changelog__li" style={{ textDecoration: "line-through" }} key={icon.fileName}>{icon.fileName}</li>;
            })}
          </ul>
        </div>
      )}
      {!!changelog.update.length && (
        <div className="changelog__item">
          <div className="changelog__label">
            🔄 update icons({changelog.update.length}):
          </div>
          <ul className="changelog__ul">
            {changelog.update.map((icon) => {
              return <li className="changelog__li" key={icon.fileName}>{icon.fileName}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export type { ChangelogType };

export default Changelog;
