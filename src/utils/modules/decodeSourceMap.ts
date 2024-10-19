import sourceMap, { BasicSourceMapConsumer } from 'source-map';
import mapWasmStr from 'source-map/lib/mappings.wasm?url';
import { createHighlighterCore, ShikiTransformer } from 'shiki/core';
import getWasm from 'shiki/wasm';

class DecodeSourceMap {
    private static instance: DecodeSourceMap;
    /** 高亮器 */
    private static highlighter: ReturnType<typeof createHighlighterCore>;
    /**
     * 高亮输出结构转换
     * @param startIndex 行号，起始索引
     * @returns
     */
    private static createTransformer = (startIndex: number) => {
        const obj: ShikiTransformer = {
            pre(node) {
                // console.log(node);
                const createLineNumberBar = (properties: typeof node['properties']) => {
                    const lineNumberCode: typeof node = {
                        type: 'element',
                        tagName: 'code',
                        children: [],
                        properties: {},
                    };

                    const lineNumberPre: typeof node = {
                        type: 'element',
                        tagName: 'pre',
                        children: [lineNumberCode,],
                        properties: properties,
                    };

                    const lineNumberRight: typeof node = {
                        type: 'element',
                        tagName: 'div',
                        children: [],
                        properties: {
                            style: 'width:1px;box-shadow: -2px 0px 2px 0px #8f8f8f;',
                        },
                    };

                    return { lineNumberPre, lineNumberCode, lineNumberRight, };
                };
                const rootClassName = node.properties.class as string || '';
                const rootStyle = node.properties.style as string || '';

                node.properties.class = '';
                node.properties.style = 'margin:0;';

                const { lineNumberPre, lineNumberCode, lineNumberRight, } = createLineNumberBar(node.properties);
                let count = startIndex;

                (node.children[0] as typeof node).children.forEach((lineNode) => {
                    if (lineNode.type === 'element') {
                        lineNode.properties.tagName = 'div';
                        lineNode.properties.style = 'padding: 2px 10px;';
                        lineNumberCode.children.push({
                            type: 'element',
                            tagName: 'span',
                            children: [{ type: 'text', value: `${++count}`, },],
                            properties: lineNode.properties,
                        });
                    }
                    else if (lineNode.type === 'text') {
                        lineNumberCode.children.push(lineNode);
                    }
                });


                return {
                    type: 'element',
                    tagName: 'div',
                    children: [lineNumberPre, lineNumberRight, node,],
                    properties: {
                        className: rootClassName,
                        style: 'display:flex;line-height:1.5;overflow:auto;font-size:16px;padding: 6px 0;border-radius: 4px;' + rootStyle,
                    },
                };
            },
        };
        return obj;
    };

    static getInstance() {
        if (!DecodeSourceMap.instance) {
            DecodeSourceMap.instance = new DecodeSourceMap();
        }

        return DecodeSourceMap.instance;
    }

    private constructor() {
        sourceMap.SourceMapConsumer.initialize({
            'lib/mappings.wasm': mapWasmStr,
        });

        DecodeSourceMap.highlighter = createHighlighterCore({
            themes: [
                import('shiki/themes/tokyo-night.mjs'),
            ],
            langs: [
                import('shiki/langs/typescript.mjs'),
            ],
            loadWasm: getWasm,
        });
    }

    /**
     * 从 URL 或 JSON 解码 sourceMap。
     * @param jsonOrUrl SourceMap 文件路径 或 JSON字符串(注意跨域问题)
     * @param line 行号
     * @param column 列号
     * @param offsetNum 保留错误代码片段前后行数
     * @returns
     */
    async decodeSourceMap(jsonOrUrl: string, line: number, column: number, offsetNum = 10) {
        const str = await this.fetchSourceMap(jsonOrUrl);
        return await this.parseSourceMap(str, line, column, offsetNum);
    }

    /** 解析 sourceMap 并提取相关代码片段。 */
    private async parseSourceMap(json: string, line: number, column: number, offsetNum: number) {
        const consumer = await new sourceMap.SourceMapConsumer(json) as BasicSourceMapConsumer;

        try {
            const position = consumer.originalPositionFor({ line, column, });

            if (!position.source || typeof position.line !== 'number') {
                throw new Error('解析失败：无法找到源映射中的位置。');
            }

            // 拿到文件内容
            const fileContent = consumer.sourcesContent[consumer.sources.indexOf(position.source)];
            const codeLines = fileContent.split(/\r?\n/g);

            // 生成代码片段
            const [start, end,] = [
                Math.max(position.line - 1 - offsetNum, 0),
                Math.min(position.line + offsetNum, codeLines.length),
            ];
            const snippet = codeLines.slice(start, end).join('\n');

            // 拿到真实的错误行、列
            const errorLine = position.line - start - 1;
            const errorColumn = codeLines[position.line - 1].length - 1;


            return {
                code: snippet,
                html: await this.highlightCode(snippet, errorLine, errorColumn, start),
            };
        }
        finally {
            consumer.destroy();
        }


    }

    /** 高亮代码 */
    private async highlightCode(code: string, line: number, column: number, startIndex: number) {
        const highlighter = await DecodeSourceMap.highlighter;

        const html = highlighter.codeToHtml(code, {
            lang: 'typescript',
            theme: 'tokyo-night',
            decorations: [
                {
                    // line 和 character 都是从 0 开始索引的
                    start: { line, character: 0, },
                    end: { line, character: column, },
                    properties: { style: 'border: 1px solid #fff', },
                },
            ],
            transformers: [DecodeSourceMap.createTransformer(startIndex),],
        });

        return html;
    }

    /** get请求 */
    private async fetchSourceMap(jsonOrUrl: string) {
        try {
            new URL(jsonOrUrl);
            const res = await fetch(jsonOrUrl);
            if (!res.ok) throw new Error(`请求失败: ${res.status}`);
            return await res.text();
        }
        catch (error) {
            console.error('无法获取 SourceMap:', error);
            return jsonOrUrl;
        }
    }
}

const instance = DecodeSourceMap.getInstance();
/**
 * 解码SourceMap
 * @param jsonOrUrl SourceMap 文件路径 或 JSON字符串(注意跨域问题)
 * @param line 行号
 * @param column 列号
 * @param offsetNum 保留错误代码片段前后行数
 * @returns
 */
export const decodeSourceMap = instance.decodeSourceMap.bind(instance);
