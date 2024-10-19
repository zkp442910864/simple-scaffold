import { useDebounceEffect } from '@/hooks';
import { useSystemErrorStore } from '@/store';
import { EMonitoringErrorType } from '@/utils/modules/monitoring';
import { useRef, useState } from 'react';

const ErrorData = () => {
    const errorData = useSystemErrorStore((state) => state.errorData);
    const [, update,] = useState({});
    const { current: state, } = useRef({
        sourceMapList: [] as object[],
    });

    const getSourceMapFiles = async () => {
        const url = window.location.origin + `${window.location.pathname}/maps`.replaceAll('//', '/');
        const res = await fetch(url);
        const text = await res.text();
        // 创建一个DOMParser实例
        const parser = new DOMParser();

        // 使用DOMParser的parseFromString方法将字符串转换为document对象
        const doc = parser.parseFromString(text, 'text/html');
        const fileListData: object[] = [];

        ([...doc.querySelectorAll('#files span[class="name"]'),] as HTMLElement[]).forEach((dom) => {
            const name = dom.innerText;
            if (name.endsWith('.js.map')) {
                fileListData.push({ url: `${url}/${name}`, name, });
            }
        });
        state.sourceMapList = fileListData;
        update({});
    };

    useDebounceEffect(() => {
        void getSourceMapFiles();
    }, []);

    return (
        <>
            {
                errorData.map((item, index) =>
                    <div className="un-border un-border-black un-border-solid m-b-20 p-4">
                        <div className="color-error">错误信息: {item.message}</div>
                        <div>资源: {item.source}</div>
                        <pre className="un-whitespace-pre-wrap">
                            {item.stack}
                        </pre>
                        {
                            item.type !== EMonitoringErrorType.RESOURCE_ERROR &&
                            <div >
                                <div className="flex f-items-center un-gap8px un-border un-border-indigo-500 un-border-solid p-4">
                                    <span>sourceMap文件:</span>
                                    <input list={`options-${index}`} id={`select-${index}`}/>
                                    <datalist id={`options-${index}`}>
                                        {/* <option value="http://127.0.0.1:5500/dist/maps/pagesHomeTest1Index-L_-LXr4e.js.map">测试用</option> */}
                                        {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            state.sourceMapList.map((mapItem: any) =>
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                                                <option value={mapItem.url}>{mapItem.name}</option>
                                            )
                                        }
                                    </datalist>
                                    <span>行/列号:</span>
                                    <input placeholder="1:938" id={`value-${index}`} />
                                    <button onClick={() => {
                                        void (async () => {
                                            const fileUrl = (document.querySelector(`#select-${index}`) as HTMLInputElement).value;
                                            const [line, column,] = (document.querySelector(`#value-${index}`) as HTMLInputElement).value.split(':');
                                            document.querySelector(`#content-${index}`)!.innerHTML = 'loading';
                                            const decodeSourceMap = (await import('@/utils/modules/decodeSourceMap')).decodeSourceMap;
                                            const data = await decodeSourceMap(fileUrl, +line, +column);
                                            document.querySelector(`#content-${index}`)!.innerHTML = data.html;
                                            // console.log(fileUrl);
                                        })().catch((err) => {
                                            console.log(err);
                                        });
                                    }}>定位</button>
                                </div>
                                <div className="m-t-10" id={`content-${index}`}></div>
                            </div>
                        }
                        {/* <div>{JSON.stringify(item)}</div> */}
                    </div>
                )
            }
        </>
    );
};

export default ErrorData;
