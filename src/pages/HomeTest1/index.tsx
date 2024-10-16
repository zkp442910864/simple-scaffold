import { useBaseData } from '@/store';

const HomeTest1 = () => {

    const updateTest = useBaseData((state) => state.updateTest);

    throw new Error('测试错误');


    return (
        <div
            onClick={() => {
                updateTest();console.log(123);
            }}
        >
            HomeTest1 页面 {Math.random()}
        </div>
    );
};

export default HomeTest1;