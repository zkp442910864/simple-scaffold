import { useStateExtend } from '@/hooks';
import { useBaseData } from '@/store';
import { useMemo, useRef, useState } from 'react';
import ErrorData from '../ErrorData';
import { useLifeCycle } from '@/layout';
import { useLocation } from 'react-router';

const HomeTest1 = () => {

    const updateTest = useBaseData((state) => state.updateTest);
    const [, update,] = useStateExtend({});
    const { current: data, } = useRef({
        componentError: false,
        loadSource: false,
    });

    if (data.componentError) {
        throw new Error('组件渲染报错');
    }

    useLifeCycle((type, local) => {
        console.log(type, local);
        // console.log(type);
    });

    return (
        <div
            onClick={() => {
                updateTest();
            }}
        >
            HomeTest1 页面 {Math.random()}
            {
                data.loadSource &&

                    <div id="qqqqqqqq">
                        <img src="https://cn.vitejs.dev/asdqwe/qweqwe.png"/>
                        <video src="https://cn.vitejs.dev/asdqwe/qweqwe.mp4"/>
                        <audio src="https://cn.vitejs.dev/asdqwe/qweqwe.mp3"/>
                    </div>

            }


            <div>
                <button onClick={() => {
                    data.componentError = true;
                    void update({});
                }}>组件渲染报错</button>
                <br/>

                <button onClick={() => {
                    throw new Error('逻辑错误');
                }}>逻辑错误</button>
                <br/>

                <button onClick={() => {
                    void (() => {
                        if (Math.random() > 0.5) {
                            return Promise.resolve();
                        }
                        else {
                            return Promise.reject(new Error('promise未处理reject'));
                        }
                    })();
                }}>promise未处理reject 50%概率错误</button>
                <br/>

                <button onClick={() => {
                    data.loadSource = !data.loadSource;
                    void update({}).then(() => {
                        if (!data.loadSource) return;
                        const content = document.querySelector('#qqqqqqqq')!;
                        const script = document.createElement('script');
                        script.src = 'https://cn.vitejs.dev/qweqwe/sdfs.js';
                        script.async = true;
                        content.appendChild(script);

                        const link = document.createElement('link');
                        link.href = 'https://cn.vitejs.dev/qweqwe/sdfs.js';
                        link.rel = 'stylesheet';
                        content.appendChild(link);
                    });
                }}>资源加载错误</button>
                <br/>
                <br/>

                <button onClick={() => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', `${window.location.origin}/qweqwe.jsddd`);
                    xhr.send();
                }}>xhr请求</button>
                <br/>

                <button onClick={() => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', 'https://api.ipify.org?format=json');
                    xhr.send();
                }}>xhr请求</button>
                <br/>

                <button onClick={() => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', 'https://api.ipify.org?format=json');
                    xhr.timeout = 10;
                    xhr.send();
                }}>xhr请求 超时</button>
                <br/>

                <button onClick={() => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', 'https://api.ipify.org?format=json');
                    xhr.send();
                    xhr.abort();
                }}>xhr请求 中断</button>
                <br/>

                <button onClick={() => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', 'https://juejin.cn/post/7270028440036294711#heading-4');
                    xhr.send();
                }}>xhr请求 跨域</button>
                <br/>
                <br/>

                <button onClick={() => {
                    void fetch(`${window.location.origin}/qweqwe.jsddd`);
                }}>fetch请求</button>
                <br/>

                <button onClick={() => {
                    void fetch('https://api.ipify.org?format=json');
                }}>fetch请求</button>
                <br/>

                <button onClick={() => {
                    const controller = new AbortController();
                    const request = new Request('https://api.ipify.org?format=json', {
                        signal: controller.signal,
                    });
                    void fetch(request);
                    setTimeout(() => {
                        controller.abort(new Error('中断'));
                    }, 10);
                }}>fetch请求 中断/超时</button>
                <br/>

                <button onClick={() => {
                    void fetch('https://juejin.cn/post/7270028440036294711#heading-4');
                }}>fetch请求 跨域</button>
                <br/>
                <br/>

            </div>

            {/* {useMemo(() => <ErrorData/>, [])} */}
        </div>
    );
};

export default HomeTest1;