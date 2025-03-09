import React, { FC } from 'react';
import { TFoo } from './Foo.types';

export const Foo: FC<TFoo> = (props) => {
  return <h4>{props.title}23</h4>;
};
