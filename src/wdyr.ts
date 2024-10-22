import React from 'react';

if (import.meta.env.DEV) {
    const { default: wdyr, } = await import('@welldone-software/why-did-you-render');

    wdyr(React, {
        include: [/.*/,],
        exclude: [/^BrowserRouter/, /^Link/, /^Route/,],
        trackHooks: true,
        trackAllPureComponents: true,
    });
}