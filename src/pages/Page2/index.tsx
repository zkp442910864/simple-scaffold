import { useStateData } from '@/hooks';

const Page2 = () => {

    const { state, update, } = useStateData(() => ({
        count: 0,
    }));

    return (
        <>
            页面2
            <button onClick={() => {
                state.count++;void update();
            }}>count: {state.count}</button>
        </>
    );
};

export default Page2;