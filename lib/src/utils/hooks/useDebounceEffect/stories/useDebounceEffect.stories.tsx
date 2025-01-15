import { Meta, StoryObj } from '@storybook/react';
import { useDebounceEffect } from '..';
import { useState } from 'react';

const Template = (props: Parameters<typeof useDebounceEffect>[2]) => {
  const [value, setValue,] = useState('');
  const [debouncedValue, setDebouncedValue,] = useState('');

  useDebounceEffect(
    () => {
      setDebouncedValue(value);
    },
    [value,],
    props
  );

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p>Debounced Value: {debouncedValue}</p>
    </div>
  );
};

const meta: Meta = {
  title: 'Utils/Hooks/useDebounceEffect',
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
  args: {
    interval: 500,
    immediate: false,
  },
};

type Story = StoryObj<typeof meta>;

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

export default meta;