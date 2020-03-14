(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{149:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return s}));var r=n(1),a=n(9),o=(n(0),n(163)),i={id:"advanced-ci",title:"Continuous Integration"},c={id:"guides/advanced-ci",title:"Continuous Integration",description:"## Uploading a new build",source:"@site/docs/guides/advanced-ci.md",permalink:"/docs/guides/advanced-ci",editUrl:"https://github.com/paularmstrong/build-tracker/edit/next/docs/docs/guides/advanced-ci.md",sidebar:"docs",previous:{title:"GitHub Actions",permalink:"/docs/guides/github-actions"},next:{title:"Contributing to Build Tracker",permalink:"/docs/guides/contributing"}},l=[{value:"Uploading a new build",id:"uploading-a-new-build",children:[{value:"Reporting budget results",id:"reporting-budget-results",children:[]},{value:"Linking directly to a build comparison",id:"linking-directly-to-a-build-comparison",children:[]}]}],u={rightToc:l};function s(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"uploading-a-new-build"},"Uploading a new build"),Object(o.b)("p",null,"Using the API integration from ",Object(o.b)("inlineCode",{parentName:"p"},"@build-tracker/cli"),", once you've set up your ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/packages/api-client#configuration"}),"configuration file")," you can upload a new build with a single command:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-shell"}),"yarn bt-cli upload-build\n")),Object(o.b)("h3",{id:"reporting-budget-results"},"Reporting budget results"),Object(o.b)("p",null,"The response from the Build Tracker API is sent back to the ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/packages/api-client#oncompare-data-apiresponse-promise-void"}),Object(o.b)("inlineCode",{parentName:"a"},"onCompare"))," callback function in your configuration and has many useful pieces of information."),Object(o.b)("p",null,"There are two items that are particularly useful here: ",Object(o.b)("inlineCode",{parentName:"p"},"groupDeltas")," and ",Object(o.b)("inlineCode",{parentName:"p"},"artifactDeltas"),". We can use these and filter on those with failing budgets to format a nice message."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"const Comparator = require('@build-tracker/comparator').default;\n\nconst applicationUrl = 'https://my-application-url.local';\n\nconst last = xs => xs[xs.length - 1];\n\nmodule.exports = {\n  applicationUrl,\n  // ... other config options\n  onCompare: async data => {\n    const { comparatorData, summary } = data;\n    // Reconstruct a comparator from the serialized data\n    const comparator = Comparator.deserialize(comparatorData);\n\n    const build = last(comparator.builds);\n\n    const table = comparator.toMarkdown({ artifactFilter });\n    const revisions = `${build.getMetaValue('parentRevision')}/${build.getMetaValue('revision')}`;\n    const output = `${summary.join('\\n')}\n\n${table}\n\nSee the full comparison at [${applicationUrl}/builds/${revisions}](${applicationUrl}/builds/${revisions})`;\n\n    // Post the constructed markdown as a comment\n    return await GithubApi.postComment(output);\n  }\n};\n\n// Filter out any rows from the markdown table that are not failing or did not have a hash change\nconst artifactFilter = row => {\n  return row.some(cell => {\n    if (cell.type === 'delta') {\n      return cell.failingBudgets.length > 0 || cell.hashChanged;\n    }\n    return false;\n  });\n};\n")),Object(o.b)("h3",{id:"linking-directly-to-a-build-comparison"},"Linking directly to a build comparison"),Object(o.b)("p",null,"The Build Tracker web application accept links directly to a comparison of one or more builds in the format: ",Object(o.b)("inlineCode",{parentName:"p"},"/builds/:revisions+"),"."),Object(o.b)("p",null,"For example, to link to a comparison of two builds:"),Object(o.b)("p",null,Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://build-tracker-demo.herokuapp.com/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744"}),"/builds/ee6e071ef38eabf07a0f88d27bc6a0c9fce95e73/ffef391677992f0fae65702b94ec993bb7fb1744")))}s.isMDXComponent=!0},163:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),s=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c({},t,{},e)),n},p=function(e){var t=s(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=Object(r.forwardRef)((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=s(n),b=r,f=p["".concat(i,".").concat(b)]||p[b]||d[b]||o;return n?a.a.createElement(f,c({ref:t},u,{components:n})):a.a.createElement(f,c({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var u=2;u<o;u++)i[u]=n[u];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);