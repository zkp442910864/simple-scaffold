import { NonIndexRouteObject } from 'react-router';

export type ServerDataModel = unknown;

export interface ICustomRouteObject extends NonIndexRouteObject {
    title?: string;
    children?: ICustomRouteObject[];
}
