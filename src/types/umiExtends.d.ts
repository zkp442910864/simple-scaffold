import 'umi';

import type rawAccess from '@/access';

/**
 * 扩展类型
 * https://segmentfault.com/a/1190000022842783
 */
declare module 'umi' {
    function useAccess(): ReturnType<typeof rawAccess>;
}
