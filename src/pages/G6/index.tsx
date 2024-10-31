/* eslint-disable prefer-const */
import { useEffect, useRef } from 'react';
import { Graph, GraphData, NodeData } from '@antv/g6';
import { metroData } from './modules/data';


const G6Page = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { current: cache, } = useRef({
        graph: null as Graph | null,
    });

    const downloadImage = async () => {
        // https://blog.csdn.net/qq_41887214/article/details/123173072
        window.devicePixelRatio = 2;
        const dataURL = await cache.graph!.toDataURL({
            encoderOptions: 1,
            mode: 'overall',
            type: 'image/bmp',
        });
        const [head, content,] = dataURL.split(',');
        const contentType = head.match(/:(.*?);/)![1];

        const bstr = atob(content);
        let length = bstr.length;
        const u8arr = new Uint8Array(length);

        while (length--) {
            u8arr[length] = bstr.charCodeAt(length);
        }

        const blob = new Blob([u8arr,], { type: contentType, });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph.png';
        a.click();
    };

    // window.downloadImage = downloadImage;

    useEffect(() => {
        void (() => {
            const data:GraphData = {
                nodes: [],
                edges: [],
            };

            const boxWidth = 700;
            const boxHeight = 700;
            const mapNode: Record<string, NodeData> = {};

            const handlerOneNumber = () => {
                const baseData = metroData.filter(ii => ii.lineName === '1号线');
                /** 分布的范围 */
                const width = boxWidth - 100;
                const height = boxHeight;
                const baseSpace = width / baseData.length + 5;
                const arr: Exclude<typeof data.nodes, undefined> = [];
                let index = 0;
                let yPlus = 0;
                baseData.forEach((item) => {
                    let [x, y, labelOffsetX, labelOffsetY,] = [
                        width - (baseSpace * index + baseSpace),
                        height * 0.7,
                        0,
                        index % 2 === 0 ? 0 : -20,
                    ];

                    if (item.current === '罗湖') {
                        y += 50;
                        labelOffsetY = 5;
                    }
                    else if (item.current === '国贸') {
                        y -= 10;
                        labelOffsetY = -12;
                        labelOffsetX = 20;
                    }
                    else if (item.current === '老街') {
                        y -= 120;
                        labelOffsetY = -20;
                        index++;
                    }
                    else if (item.current === '大剧院') {
                        // x = width - (baseSpace * 1 + baseSpace);
                        y -= 50;
                        index++;
                    }
                    else if (item.current === '大新') {
                        y -= 25;
                        labelOffsetX += 15;
                        labelOffsetY += 12;
                        index++;
                    }
                    else if (item.current === '鲤鱼门') {
                        y -= 50;
                        labelOffsetX += 20;
                        labelOffsetY -= 15;
                        // index++;
                    }
                    else if (item.current === '前海湾') {
                        y -= 100;
                        labelOffsetX += 20;
                        labelOffsetY -= 15;
                        // index++;
                    }
                    else if (item.current === '新安') {
                        y -= 150;
                        labelOffsetX += 20;
                        labelOffsetY -= 15;
                        index++;
                    }
                    else if (item.current === '宝安中心') {
                        y -= 200;
                        labelOffsetX -= 30;
                        labelOffsetY += 15;
                        index++;
                    }
                    else if (['宝体', '坪洲', '西乡', '固戍', '后瑞', '机场东',].includes(item.current)) {
                        y -= 250 + yPlus;
                        yPlus += 50;
                        labelOffsetX += 15;
                        labelOffsetY -= 10;
                    }
                    else {
                        index++;
                    }
                    mapNode[item.current] = {
                        id: item.current,
                        data: item,
                        style: {
                            x,
                            y,
                            labelText: item.current,
                            labelOffsetX,
                            labelOffsetY,
                            labelFontSize: 8,
                            // fill: 'rgb(35 173 85)',
                            fill: '#fff',
                            stroke: 'rgb(35 173 85)',
                            lineWidth: 2,
                            size: [6, 6,],
                        },
                    };
                    arr.push(mapNode[item.current]);
                    if (item.next) {
                        data.edges!.push({
                            source: item.current,
                            target: item.next,
                            style: {
                                stroke: 'rgb(35 173 85)',
                                lineWidth: 2,

                            },
                        });
                    }
                });

                data.nodes!.push(
                    {
                        id: 'start:1号线',
                        style: {
                            size: [0, 0,],
                            labelText: '1号线',
                            stroke: 'transparent',
                            x: mapNode['罗湖'].style!.x!,
                            y: mapNode['罗湖'].style!.y!,
                            // labelStroke: '#fff',
                            labelFill: '#fff',
                            labelFontWeight: 'bold',
                            labelOffsetX: 0,
                            labelOffsetY: 20,
                            labelBackground: true,
                            labelBackgroundFill: 'rgb(35 173 85)',
                            labelBackgroundRadius: 2,
                        },
                    },
                    ...arr,
                    {
                        id: 'end:1号线',
                        style: {
                            size: [0, 0,],
                            labelText: '1号线',
                            stroke: 'transparent',
                            x: mapNode['机场东'].style!.x!,
                            y: mapNode['机场东'].style!.y!,
                            // labelStroke: '#fff',
                            labelFill: '#fff',
                            labelFontWeight: 'bold',
                            labelOffsetX: 0,
                            labelOffsetY: -30,
                            labelBackground: true,
                            labelBackgroundFill: 'rgb(35 173 85)',
                            labelBackgroundRadius: 2,
                        },
                    }
                );
            };

            const handlerTwoNumber = () => {
                const baseData = metroData.filter(ii => ii.lineName === '2号线');
                /** 分布的范围 */
                const width = boxWidth - 100;
                // const height = boxHeight;
                const startX = mapNode['机场东'].style!.x!;
                const fixedY = mapNode['大剧院'].style!.y!;
                const baseSpace = width / baseData.length + 5;
                let index = 0;
                baseData.forEach((item) => {
                    let [x, y, labelOffsetX, labelOffsetY, labelText, stroke,] = [
                        startX + (baseSpace * index + baseSpace),
                        fixedY,
                        0,
                        index % 2 === 0 ? 0 : -20,
                        item.current,
                        'rgb(185 91 45)',
                    ];

                    if (item.current === '赤湾') {
                        x = startX;
                        y += 160;
                        index++;
                    }
                    else if (['蛇口港', '海上世界', '水湾', '东角头',].includes(item.current)) {
                        // x = startX;
                        y += 180;
                        index++;
                    }
                    else if (item.current === '湾厦') {
                        // x = startX;
                        y += 170;
                    }
                    else if (item.current === '海月') {
                        // x = startX;
                        y += 150;
                    }
                    else if (item.current === '登良') {
                        // x = startX;
                        y += 130;
                    }
                    else if (item.current === '后海') {
                        // x = startX;
                        y += 110;
                    }
                    else if (item.current === '科苑') {
                        x += 20;
                        y += 90;
                        index++;
                    }
                    else if (item.current === '红树湾') {
                        x = mapNode['世界之窗'].style!.x!;
                        y += 90;
                        // index++;
                    }
                    else if (item.current === '世界之窗2') {
                        labelText = '';
                        x = mapNode['世界之窗'].style!.x!;
                        y = mapNode['世界之窗'].style!.y!;
                        stroke = '#000';
                        // index++;
                    }
                    else if (item.current === '侨城北') {
                        x = mapNode['世界之窗'].style!.x!;
                        index++;
                    }
                    else if (item.current === '深康') {
                        x = mapNode['世界之窗'].style!.x!;
                        y -= 50;
                        index++;
                    }
                    else if (item.current === '安托山') {
                        // x = mapNode['世界之窗'].style!.x! + 20;
                        labelOffsetX -= 20;
                        labelOffsetY -= 20;
                        y -= 70;
                        index++;
                    }
                    else if (item.current === '侨香') {
                        y -= 70;
                        index++;
                    }
                    else if (item.current === '香蜜') {
                        y -= 70;
                        index++;
                    }
                    else if (item.current === '香梅北') {
                        y -= 70;
                        index++;
                    }
                    else if (item.current === '景田') {
                        x = mapNode['车公庙'].style!.x!;
                        y -= 70;
                        index++;
                    }
                    else if (item.current === '莲花西') {
                        // x = mapNode['车公庙'].style!.x!;
                        y -= 40;
                        index++;
                    }
                    else if (item.current === '福田') {
                        x = mapNode['购物公园'].style!.x!;
                        // y -= 40;
                        index++;
                    }
                    else if (item.current === '大剧院2') {
                        labelText = '';
                        stroke = '#000';
                        index++;
                    }
                    else {
                        index++;
                    }

                    mapNode[item.current] = {
                        id: item.current,
                        data: item,
                        style: {
                            x,
                            y,
                            labelText,
                            labelOffsetX,
                            labelOffsetY,
                            stroke,
                        },
                    };
                    data.nodes!.push(mapNode[item.current]);
                    if (item.next) {
                        data.edges!.push({
                            source: item.current,
                            target: item.next,
                            style: {
                                stroke: 'rgb(185 91 45)',
                            },
                        });
                    }
                });
            };

            const handlerThreeNumber = () => {
                const baseData = metroData.filter(ii => ii.lineName === '3号线');
                const startX = mapNode['购物公园'].style!.x!;
                const startY = mapNode['购物公园'].style!.y!;
                const width = boxWidth - 100;
                const baseSpace = width / baseData.length;
                let index = 0;
                let afterBUJI = false;

                baseData.forEach((item) => {
                    let [x, y, labelOffsetX, labelOffsetY, labelText, stroke,] = [
                        startX + (baseSpace * index + baseSpace),
                        startY - (baseSpace * index + baseSpace),
                        0,
                        index % 2 === 0 ? 0 : -20,
                        item.current,
                        'rgb(3 170 230)',
                    ];

                    if (item.current === '福保') {
                        x = startX;
                        y = startY + 100;
                    }
                    else if (item.current === '益田') {
                        x = startX;
                        y = startY + 80;
                    }
                    else if (item.current === '石厦') {
                        x = startX;
                        y = startY + 50;
                    }
                    else if (item.current === '购物公园3') {
                        x = startX;
                        y = startY;
                        labelText = '';
                        stroke = '#000';
                        index++;
                    }
                    else if (item.current === '福田3') {
                        x = startX;
                        y = mapNode['福田'].style!.y!;
                        labelText = '';
                        stroke = '#000';
                        index++;
                    }
                    else if (item.current === '少年宫') {
                        x = mapNode['市民中心'].style!.x!;
                        y = mapNode['景田'].style!.y!;
                        // labelText = '';
                        // stroke = '#000';
                        index++;
                    }
                    else if (item.current === '莲花村') {
                        x = mapNode['岗厦北'].style!.x!;
                        y = mapNode['景田'].style!.y!;
                        // labelText = '';
                        // stroke = '#000';
                        index++;
                    }
                    else if (item.current === '华新') {
                        x = mapNode['华强北'].style!.x!;
                        y = mapNode['景田'].style!.y!;
                        // labelText = '';
                        // stroke = '#000';
                        // index++;
                    }
                    else if (item.current === '通新岭') {
                        // x = mapNode['华强北'].style!.x!;
                        y = mapNode['景田'].style!.y!;
                        labelOffsetY = -20;
                        // labelText = '';
                        // stroke = '#000';
                        index++;
                    }
                    else if (item.current === '红岭') {
                        // x = mapNode['华强北'].style!.x!;
                        y = mapNode['景田'].style!.y!;
                        labelOffsetY = 0;
                        // labelText = '';
                        // stroke = '#000';
                        index++;
                    }
                    else if (item.current === '老街3') {
                        x = mapNode['老街'].style!.x!;
                        y = mapNode['老街'].style!.y!;
                        labelText = '';
                        stroke = '#000';
                        index++;
                    }
                    else if (item.current === '晒布') {
                        x += 20;
                        y += 20;
                        labelOffsetX += 14;
                        labelOffsetY += 10;
                        index++;
                    }
                    else if (item.current === '翠竹') {
                        x = mapNode['晒布'].style!.x!;
                        y = mapNode['晒布'].style!.y! - 30;
                        labelOffsetX += 14;
                        labelOffsetY -= 10;
                        index++;
                    }
                    else if (item.current === '田贝') {
                        x = mapNode['晒布'].style!.x!;
                        labelOffsetX += 14;
                        labelOffsetY += 10;
                        index++;
                    }
                    else if (item.current === '水贝') {
                        x = mapNode['晒布'].style!.x!;
                        labelOffsetX += 14;
                        labelOffsetY -= 10;
                        index++;
                    }
                    else if (item.current === '草埔') {
                        x = mapNode['晒布'].style!.x!;
                        // labelOffsetX += 14;
                        // labelOffsetY -= 10;
                        index++;
                    }
                    else if (item.current === '布吉') {
                        x = mapNode['晒布'].style!.x! + 30;
                        y = mapNode['草埔'].style!.y! - 20;
                        // labelOffsetX += 14;
                        // labelOffsetY -= 10;
                        index++;
                        afterBUJI = true;
                    }
                    else if (afterBUJI) {
                        // x = mapNode['晒布'].style!.x! + 30;
                        // y = mapNode['草埔'].style!.y! - 30;
                        x -= 50;
                        labelOffsetX = 14 + (item.current.length > 2 ? (item.current.length - 2) * 4 : 0);
                        labelOffsetY = -10;
                        index++;
                    }
                    else {
                        index++;
                    }

                    mapNode[item.current] = {
                        id: item.current,
                        data: item,
                        style: {
                            x,
                            y,
                            labelText,
                            labelOffsetX,
                            labelOffsetY,
                            stroke,
                        },
                    };
                    data.nodes!.push(mapNode[item.current]);
                    if (item.next) {
                        data.edges!.push({
                            source: item.current,
                            target: item.next,
                            style: {
                                stroke: 'rgb(3 170 230)',
                            },
                        });
                    }
                });

            };

            handlerOneNumber();
            handlerTwoNumber();
            handlerThreeNumber();
            console.log(data);

            if (cache.graph) {
                void cache.graph.clear().then(() => {
                    cache.graph!.setData(data);

                    void cache.graph!.render();
                });
            }
            else {
                // 初始化图表实例
                cache.graph = new Graph({
                    container: ref.current!,
                    data: data,
                    background: '#fff',
                    devicePixelRatio: 2,
                    // width: boxWidth,
                    // height: boxHeight,
                    node: {
                        // palette: 'spectral',
                        // palette: {
                        //     type: 'group',
                        //     field: 'cluster',
                        // },
                        style: {
                            // iconWidth: 5,
                            // iconHeight: 5,
                            // size: [10, 10,],
                            lineWidth: 2,
                            labelFontSize: 8,
                            size: [6, 6,],
                            fill: '#fff',
                        },
                    },
                    edge: {
                        type: 'polyline',
                        style: {
                            radius: 30,
                            lineWidth: 2,
                        },
                    },
                    layout: {
                        // type: 'fruchterman-gpu',
                        // type: 'compact-box',
                        type: 'combo-combined',
                        // cols: 30,
                        nodeSize: 10,
                        // preventOverlap: true,
                        // threads,
                    },
                    behaviors: ['drag-canvas', 'zoom-canvas', 'lasso-select',],
                    plugins: [ 'tooltip',],
                    // renderer: () => new Renderer(),
                });

                void cache.graph.render();
            }
        })();

        return () => {
            cache.graph?.destroy();
            cache.graph = null;
        };

    }, []);

    return (
        <>
            <div className="un-border un-border-indigo-600 un-h700px un-w700px un-border-solid" ref={ref}></div>
        </>
    );
};

export default G6Page;
