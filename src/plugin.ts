import { getSvgComponents } from "./libs/components"

figma.showUI(__html__, { width: 352, height: 600 });

figma.ui.onmessage = (action) => {
  const handle = actionsMapper[action.type];
  if (!handle) {
    return
  }
  handle(action);
};

const DATA_KEY = 'LSICON_FIGMA_DATA_KEY'

function setData(value) {
  figma.clientStorage.setAsync(DATA_KEY, JSON.stringify(value));
}

function getData() {
  try {
    return figma.clientStorage.getAsync(DATA_KEY)
    .then((data) => {
      if (data) {
        return JSON.parse(data)
      }
    })
  } catch (e) {
    // no action
  }
}

const actionsMapper = {
  async setup() {
    const data = await getData()
    figma.ui.postMessage({
      type: 'get',
      payload: data,
    });
  },

  set(action) {
    setData(action.payload)
  },

  close() {
    figma.closePlugin();
  },

  async publish() {
    const { meta, icons } = await getSvgComponents(figma.currentPage);
    figma.ui.postMessage({
      type: 'publish',
      payload: {
        meta,
        icons,
      }
    })
  },
}
