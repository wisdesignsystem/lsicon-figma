import type { SVGIcon } from "./components"

function getListContent({ title, prefix = '', suffix = '', icons }) {
  if (!icons.length) {
    return "";
  }

  return `${title}

${icons.map((icon) => `  - ${prefix}${icon.fileName}${suffix}`).join("\n")}
`;
}

export interface Changelog {
  add: SVGIcon[];
  remove: SVGIcon[];
  update: SVGIcon[];
  isEmpty: boolean;
  fileContent: string;
}

export function getChangelog({
  icons = [],
  preIcons = [],
  npm,
  versionMode,
}) {
  const newIconMap = icons.reduce((result, item) => {
    result[item.fileName] = item;
    return result;
  }, {});

  const oldIconMap = preIcons.reduce((result, item) => {
    result[item.fileName] = item;
    return result;
  }, {});

  const addIcons = icons.filter(
    (item) => !oldIconMap[item.fileName]
  );
  const removeIcons = preIcons.filter(
    (item) => !newIconMap[item.fileName]
  );
  const updateIcons = icons.filter((item) => {
    const oldItem = oldIconMap[item.fileName];
    return oldItem && oldItem.fileContent !== item.fileContent;
  });

  const result = [];
  result.push(getListContent({ title: `🚀 add icons(${addIcons.length}):`, icons: addIcons }));
  result.push(getListContent({ title: `🗑 remove icons(${removeIcons.length}):`, icons: removeIcons, prefix: '~~', suffix: '~~' }));
  result.push(getListContent({ title: `🔄 update icons(${updateIcons.length}):`, icons: updateIcons }));

  return {
    add: addIcons,
    remove: removeIcons,
    update: updateIcons,
    isEmpty: !addIcons.length && !removeIcons.length && !updateIcons.length,
    fileContent: `---
"${npm}": ${versionMode}
---

Release new icon version

${result.filter(Boolean).join("\n")}
`,
  };
}
