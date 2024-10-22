import { NonIndexRouteObject } from 'react-router-dom';

export type ServerDataModel = unknown;

export interface ICustomRouteObject extends NonIndexRouteObject {
    title?: string;
    children?: ICustomRouteObject[];
}
