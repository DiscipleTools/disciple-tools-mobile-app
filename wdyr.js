import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackHooks: true
    //onlyLogs: true,
    //titleColor: "green",
    //diffNameColor: "darkturquoise"
    //trackAllPureComponents: false, //true,
    //trackExtraHooks: [
    //  [ReactRedux, 'useSelector']
    //]
  });
}
