import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  app.renderer.on(MarkdownPageEvent.BEGIN, (context) => {
    // page.contents = page.contents?.replace('foo', 'bar');
    // page.model
    context.model.children?.reverse();
    context.model.childrenIncludingDocuments?.reverse();
    context.model.groups?.reverse();
  });
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    page.contents = page.contents?.replace(/\(README.md#/g, '(#');
  });

}
