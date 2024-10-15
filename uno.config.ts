import { defineConfig, presetIcons, presetUno } from 'unocss';

export default defineConfig({
    // ...UnoCSS options
    presets: [
        presetUno({ prefix: 'un-', }),
        // presetIcons({}),
    ],
    variants: [
        // 支持 `!` 前缀，使规则优先级更高
        (matcher) => {

            if (!matcher.startsWith('!')) return matcher;

            return {
                matcher: matcher.slice(1),
                selector: (input, body) => {
                    body.forEach((item) => {
                        item[1] = `${item[1]} !important`;
                    });
                    return input;
                },
            };
        },
    ],
    rules: [
        // m-l-1 m-r-5 m-t-5 m-b-5 m-y-10 m-x-10 m-tb-10 m-lr-10 m-10
        // p-l-1 p-r-5 p-t-5 p-b-5 p-y-10 p-x-10 p-tb-10 p-lr-10 p-10
        [
            /^([m|p])-([a-z|A-Z]+|\d+)-?(-?\d+)?/,
            ([, v1, v2, v3,]) => {
                const prefix = v1 === 'm' ? 'margin' : 'padding';

                if (!isNaN(+v2)) {
                    return {
                        [prefix]: `${v2}px`,
                    };
                }

                const map: Record<string, string | undefined> = {
                    l: 'left',
                    r: 'right',
                    t: 'top',
                    b: 'bottom',
                };

                if (v2 === 'tb' || v2 === 'y') {
                    return {
                        [`${prefix}-bottom`]: `${v3}px`,
                        [`${prefix}-top`]: `${v3}px`,
                    };
                }

                if (v2 === 'lr' || v2 === 'x') {
                    return {
                        [`${prefix}-left`]: `${v3}px`,
                        [`${prefix}-right`]: `${v3}px`,
                    };
                }

                if (!map[v2]) return undefined;

                return {
                    [`${prefix}-${map[v2]}`]: `${v3}px`,
                };
            },
        ],

        /** 文字居中 */
        ['text-center', { 'text-align': 'center', },],
        /** 文字右对齐 */
        ['text-right', { 'text-align': 'right', },],
        /** 文字左对齐 */
        ['text-left', { 'text-align': 'left', },],

        /** 灰色 */
        ['color-gray', { color: '#999', },],
        ['border-gray', { border: '1px solid #999', },],
        /** 错误色 */
        ['color-error', { color: '#f5222d', },],
        ['border-error', { border: '1px solid #f5222d', },],
        /** 红色 */
        ['color-red', { color: '#f5222d', },],
        ['border-red', { border: '1px solid #f5222d', },],
        /** 主色调 */
        ['color-main', { color: '#1890ff', },],
        ['border-main', { border: '1px solid #1890ff', },],
        ['color-await', { color: '#F59A23', },],
        ['color-success', { color: '#02790E', },],
        /** 背景色 */
        ['bg-f', { 'background-color': '#fff', },],

        // 禁止选择
        ['disabled-select', { 'user-select': 'none', },],
        // 禁止事件
        ['disabled-event', { 'pointer-events': 'none', },],

        // 鼠标手势
        ['pointer', { cursor: 'pointer', },],
        // 定位类型
        ['abs', { position: 'absolute', },],
        ['rel', { position: 'relative', },],
        ['fixed', { position: 'fixed', },],
        ['static', { position: 'static', },],
        // 隐藏
        ['hidden', { display: 'none', },],

        ['inline-block', { display: 'inline-block', },],
        ['block', { display: 'block', },],
        ['inline', { display: 'inline', },],

        // flex 盒子
        ['flex', { display: 'flex', },],
        ['f-1', { flex: 1, },],
        ['f-initial', { flex: 'initial', },],
        ['f-none', { flex: 'none', },],
        ['f-wrap', { 'flex-wrap': 'wrap', },],
        ['f-nowrap', { 'flex-wrap': 'nowrap', },],
        ['f-reverse', { 'flex-wrap': 'wrap-reverse', },],
        ['f-row', { 'flex-direction': 'row', },],
        ['f-col', { 'flex-direction': 'column', },],
        // flex的对齐属性
        ['f-justify-center', { 'justify-content': 'center', },],
        ['f-justify-end', { 'justify-content': 'flex-end', },],
        ['f-justify-start', { 'justify-content': 'flex-start', },],
        ['f-justify-around', { 'justify-content': 'space-around', },],
        ['f-justify-between', { 'justify-content': 'space-between', },],
        ['f-justify-evenly', { 'justify-content': 'space-evenly', },],

        ['f-items-center', { 'align-items': 'center', },],
        ['f-items-end', { 'align-items': 'flex-end', },],
        ['f-items-start', { 'align-items': 'flex-start', },],

        ['f-content-center', { 'align-content': 'center', },],
        ['f-content-end', { 'align-content': 'flex-end', },],
        ['f-content-start', { 'align-content': 'flex-start', },],
        ['f-content-around', { 'align-content': 'space-around', },],
        ['f-content-between', { 'align-content': 'space-between', },],
        ['f-content-evenly', { 'align-content': 'space-evenly', },],

        /** 左浮动 */
        ['float-left', { float: 'left', },],
        /** 右浮动 */
        ['float-right', { float: 'right', },],

        // 排版
        ['align-middle', { 'vertical-align': 'middle', },],
        ['align-bottom', { 'vertical-align': 'bottom', },],
        ['align-top', { 'vertical-align': 'top', },],
    ],
});