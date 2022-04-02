import { unified } from "unified"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { selectAll } from "hast-util-select"

export interface TagDecorator {
  tag: string,
  properties: { [key: string]: string }
}

export function markdownToHTML(content: string, decorations: Array<TagDecorator>): string {
  const vfile = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(decorateTags, decorations)
    .use(rehypeStringify)
    .processSync(content)

  return String(vfile)
}

function decorateTags(decorators: Array<TagDecorator>): any {
  return function (tree: any, _: any) {
    for (const decorator of decorators) {
      selectAll(decorator.tag, tree).forEach((node: any) => {
        node.properties = Object.assign(node.properties, decorator.properties)
      })
    }
  }
}

export function decorate(tag: string, properties: { [key:string]: string }): TagDecorator {
  return {
    tag,
    properties
  }
}