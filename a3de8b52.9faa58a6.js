(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{151:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return b})),n.d(t,"default",(function(){return d}));var r=n(1),a=n(9),c=(n(0),n(164)),l={id:"types",title:"@build-tracker/types",sidebar_label:"@build-tracker/types"},i={id:"packages/types",title:"@build-tracker/types",description:"This package includes types and enums for working with other Build Tracker packages.",source:"@site/docs/packages/types.md",permalink:"/docs/packages/types",editUrl:"https://github.com/paularmstrong/build-tracker/edit/next/docs/docs/packages/types.md",sidebar_label:"@build-tracker/types",sidebar:"docs",previous:{title:"@build-tracker/server",permalink:"/docs/packages/server"},next:{title:"Plugins",permalink:"/docs/plugins/plugins"}},b=[{value:"<code>BudgetType</code>",id:"budgettype",children:[{value:"<code>BudgetType.SIZE</code>",id:"budgettypesize",children:[]},{value:"<code>BudgetType.DELTA</code>",id:"budgettypedelta",children:[]},{value:"<code>BudgetType.PERCENT_DELTA</code>",id:"budgettypepercent_delta",children:[]}]},{value:"<code>BudgetType</code>",id:"budgettype-1",children:[{value:"<code>BudgetLevel.ERROR</code>",id:"budgetlevelerror",children:[]},{value:"<code>BudgetLevel.WARN</code>",id:"budgetlevelwarn",children:[]}]}],o={rightToc:b};function d(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},o,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,"This package includes types and enums for working with other Build Tracker packages."),Object(c.b)("h1",{id:"exports"},"Exports"),Object(c.b)("h2",{id:"budgettype"},Object(c.b)("inlineCode",{parentName:"h2"},"BudgetType")),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"import { BudgetType } from '@build-tracker/types';\n")),Object(c.b)("h3",{id:"budgettypesize"},Object(c.b)("inlineCode",{parentName:"h3"},"BudgetType.SIZE")),Object(c.b)("p",null,"A size budget is an absolute limite on the total size of an artifact. This is the most simple budget, because passing or failing can be seen with a single build and no math."),Object(c.b)("h3",{id:"budgettypedelta"},Object(c.b)("inlineCode",{parentName:"h3"},"BudgetType.DELTA")),Object(c.b)("p",null,"A budget delta is a limit on the amount of change allowed for one or more artifacts from one build to the next."),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null})),Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"First build"),Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"Second build"),Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"\u0394 (delta)"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"main.js"),Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"40 KiB"),Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"48 KiB"),Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"+8 KiB")))),Object(c.b)("h3",{id:"budgettypepercent_delta"},Object(c.b)("inlineCode",{parentName:"h3"},"BudgetType.PERCENT_DELTA")),Object(c.b)("p",null,"The percent delta budget is a limit on the artifacts total size percent change from one build to the next. For this, we divide the delta by the size of the first build:"),Object(c.b)("blockquote",null,Object(c.b)("p",{parentName:"blockquote"},"Note: this is a simplified version of the formula that does not account for edge cases")),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"function percentDelta(firstSize, secondSize) {\n  return (secondSize - firstSize) / firstSize;\n}\n\npercentDelta(40, 48);\n")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null})),Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"First build"),Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"Second build"),Object(c.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"\u0394% (percent delta)"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"main.js"),Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"40 KiB"),Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"48 KiB"),Object(c.b)("td",Object(r.a)({parentName:"tr"},{align:null}),"+ 20%")))),Object(c.b)("h2",{id:"budgettype-1"},Object(c.b)("inlineCode",{parentName:"h2"},"BudgetType")),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"import { BudgetType } from '@build-tracker/types';\n")),Object(c.b)("h3",{id:"budgetlevelerror"},Object(c.b)("inlineCode",{parentName:"h3"},"BudgetLevel.ERROR")),Object(c.b)("h3",{id:"budgetlevelwarn"},Object(c.b)("inlineCode",{parentName:"h3"},"BudgetLevel.WARN")))}d.isMDXComponent=!0},164:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return O}));var r=n(0),a=n.n(r);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function b(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=a.a.createContext({}),d=function(e){var t=a.a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):i({},t,{},e)),n},p=function(e){var t=d(e.components);return a.a.createElement(o.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},s=Object(r.forwardRef)((function(e,t){var n=e.components,r=e.mdxType,c=e.originalType,l=e.parentName,o=b(e,["components","mdxType","originalType","parentName"]),p=d(n),s=r,O=p["".concat(l,".").concat(s)]||p[s]||u[s]||c;return n?a.a.createElement(O,i({ref:t},o,{components:n})):a.a.createElement(O,i({ref:t},o))}));function O(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var c=n.length,l=new Array(c);l[0]=s;var i={};for(var b in t)hasOwnProperty.call(t,b)&&(i[b]=t[b]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var o=2;o<c;o++)l[o]=n[o];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,n)}s.displayName="MDXCreateElement"}}]);