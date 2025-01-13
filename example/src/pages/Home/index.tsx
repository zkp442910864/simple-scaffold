import { TestButton, useStateData } from 'inline-lib';


const Home = () => {

  const { state, update, } = useStateData(() => ({
    count: 0,
  }));

  return (
    <div>
      <TestButton className="a123" onClick={() => {
        state.count++;
        void update();
      }}>{state.count}</TestButton>
      234
    </div>
  );
};

export default Home;