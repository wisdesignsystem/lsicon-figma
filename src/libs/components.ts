export interface SVGIcon {
  name: string;
  style: string;
  category: string;
  title: string;
  fileName: string;
  fileContent: string;
}

interface SVGCategoryMeta {
  type: "category";
  name: string;
  title: string;
  children: SVGIcon[];
}

interface SVGStyleMeta {
  type: "style";
  name: string;
  title: string;
  children: SVGCategoryMeta[];
}

export interface Lsicon {
  meta: SVGStyleMeta[];
  icons: SVGIcon[];
}

function toCamelCase(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^\S/, (c) => c.toUpperCase());
}

function getSvgCategory(componentSet: ComponentSetNode) {
  let currentNode = componentSet.parent;
  while (currentNode) {
    if (currentNode.type === "FRAME") {
      break;
    }

    currentNode = currentNode.parent;
  }

  if (currentNode) {
    return currentNode.name;
  }

  return "common";
}

function getSvgStyle(component: ComponentNode) {
  if (!component.name.startsWith("style=")) {
    return;
  }

  return component.name.slice(6);
}

function findAndCreateWhenNone(list, filter, create) {
  let item = list.find(filter);
  if (!item) {
    item = create();
    list.push(item);
  }

  return item;
}

export async function getSvgComponents(node: PageNode) {
  const componentSets = node.findAll((node) => {
    return node.type === "COMPONENT_SET";
  });

  const meta: SVGStyleMeta[] = [];
  const icons: SVGIcon[] = [];

  for (const componentSet of componentSets as ComponentSetNode[]) {
    // ignore the component set that starts with "_"
    if (componentSet.name.startsWith("_")) {
      continue;
    }

    const components = componentSet.findAll((node) => {
      return node.type === "COMPONENT";
    });

    const category = getSvgCategory(componentSet);

    for (const component of components as ComponentNode[]) {
      const content = await component.exportAsync({ format: "SVG" });

      const style = getSvgStyle(component);
      if (!style) {
        continue;
      }

      const currentStyleMeta = findAndCreateWhenNone(
        meta,
        (item) => item.name === style,
        () => {
          return {
            type: "style",
            name: style,
            title: toCamelCase(style),
            children: [],
          };
        }
      );

      const currentCategoryMeta = findAndCreateWhenNone(
        currentStyleMeta.children,
        (item) => item.name === category,
        () => {
          return {
            type: "category",
            name: category,
            title: toCamelCase(category),
            children: [],
          };
        }
      );

      const icon = {
        name: componentSet.name,
        style,
        category,
        title: toCamelCase(componentSet.name),
        fileName:
          style === "outline"
            ? `${toCamelCase(componentSet.name)}Icon`
            : `${toCamelCase(componentSet.name)}${toCamelCase(style)}Icon`,
        fileContent: content.reduce((result, item) => {
          return result + String.fromCharCode(item);
        }, ""),
      };

      currentCategoryMeta.children.push(icon);
      icons.push(icon);
    }
  }

  return { meta, icons };
}
