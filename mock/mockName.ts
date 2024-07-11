export default {
    'GET /api-text/getMenuData': (_req: any, res: any) => {
        res.json({
            status: 'success',
            message: '',
            data: [
                {
                    name: '首页11',
                    icon: null,
                    path: '/',
                    operateCodes: [
                        'R1',
                        'O2',
                    ],
                },
                {
                    name: '菜单0',
                    path: '/parent0',
                    operateCodes: [],
                    children: [
                        {
                            name: '菜单0-1',
                            icon: null,
                            path: '/parent0/child1',
                            operateCodes: [
                                'R1',
                                'O2',
                            ],
                            children: [],
                        },
                    ],
                },
                {
                    name: '菜单1',
                    locale: null,
                    icon: 'shopping-cart',
                    path: '/parent1',
                    operateCodes: [],
                    children: [
                        {
                            name: '菜单1-2',
                            locale: null,
                            icon: null,
                            path: '/parent1/child1',
                            operateCodes: [
                                'R1',
                            ],
                            children: [],
                        },
                        {
                            name: '菜单1-3',
                            locale: null,
                            icon: null,
                            path: '/parent1/child2',
                            operateCodes: [],
                            children: [
                                {
                                    name: '菜单1-3-1',
                                    locale: null,
                                    icon: null,
                                    path: '/parent1/child2/sub1',
                                    operateCodes: [
                                        'R1',
                                    ],
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: '菜单2',
                    icon: null,
                    path: '/parent2',
                    operateCodes: [
                        'R1',
                        'O2',
                    ],
                    children: [],
                },
            ],
        });
    },

    'GET /api-text/getUserData': (_req: any, res: any) => {
        res.json({
            status: 'success',
            message: '',
            data: {
                UserId: 11111,
                UserName: 'ADMIN9',
                RealName: '。。。',
            },
        });
    },

    'GET /api-text/getDictionaries': (_req: any, res: any) => {
        res.json({
            status: 'success',
            message: '',
            data: [
                {
                    Type: 'CustomType1',
                    TypeName: '字典1',
                    Selects: [
                        {
                            title: '值1',
                            key: '1',
                            value: '1',
                            isLeaf: false,
                            children: null,
                        },
                        {
                            title: '值2',
                            key: '2',
                            value: '2',
                            isLeaf: false,
                            children: null,
                        },
                    ],
                },
                {
                    Type: 'CustomType2',
                    TypeName: '字典2',
                    Selects: [
                        {
                            title: '值0',
                            key: '0',
                            value: '0',
                            isLeaf: false,
                            children: null,
                        },
                        {
                            title: '值1',
                            key: '1',
                            value: '1',
                            isLeaf: false,
                            children: null,
                        },
                        {
                            title: '值2',
                            key: '2',
                            value: '2',
                            isLeaf: false,
                            children: null,
                        },
                        {
                            title: '值3',
                            key: '3',
                            value: '3',
                            isLeaf: false,
                            children: null,
                        },
                        {
                            title: '值4',
                            key: '4',
                            value: '4',
                            isLeaf: false,
                            children: null,
                        },
                        {
                            title: '值5',
                            key: '5',
                            value: '5',
                            isLeaf: false,
                            children: null,
                        },
                    ],
                },
            ],
        });
    },
};
