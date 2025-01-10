import { useStateData } from '@/hooks';

const Page1 = () => {

    const { state, update, } = useStateData(() => ({
        count: 0,
    }));

    return (
        <>
            页面1
            <button onClick={() => {
                state.count++;void update();
            }}>count: {state.count}</button>
        </>
    );
};

export default Page1;