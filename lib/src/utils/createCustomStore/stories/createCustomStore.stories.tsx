import { Meta, StoryObj } from '@storybook/react';
import { createCustomStore } from '..';

type Story = StoryObj<Meta>;

// 具体情况,看想要什么参数进行可以受控,然后再下面args中进行配置
const Template = () => {

  interface IData {
    count: number;
    setCount: () => void,
  }

  /**
   * store 可在普通函数中使用
   * useStore hooks中使用
   */
  const [store, useStore,] = createCustomStore<IData>((cache, setState) => cache({
    count: 0,
    setCount: () => setState((state) => {
      state.count++;
      return {
        count: state.count,
      };
    }),
  }));

  return <></>;
};

export const Default = Template.bind({});
(Default as unknown as {source: {transform: (code: string) => string}}).source = {
  transform: (() => {
    let cacheCode = '';
    return (code: string) => {
      if (!cacheCode) cacheCode = code;
      return cacheCode;
    };
  })(),
};
(Default as Story).args = {};

export default {
  title: 'Utils/Hooks/createCustomStore',
  component: Template,
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs',],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: {},
} satisfies Meta;