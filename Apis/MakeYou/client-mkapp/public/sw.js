if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/137-9598eab4ff025283.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/322-db5415f6c49fca92.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/45-95960d58ff9e9ccc.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/605-2d5755da6f8a97bb.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/826-65f89ab3e33444db.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/929-69a2e281bcf597ba.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/997-85311cf233ba3192.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/_not-found/page-bbc3aa86fccbe1a7.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/auth/login/page-6b15c1cba08a6e5a.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/auth/recovery/page-cda2bb6635b1b250.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/auth/register/page-7f50da602113347e.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/dashboard/layout-87f6113071e252a9.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/dashboard/maps/page-a88896ce05b33073.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/dashboard/page-6f20d7ccf8cffde5.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/layout-0a69419d77c17f97.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/app/page-8c242ec702ba9ebd.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/fd9d1056-953192b21254a659.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/main-app-bce63ddf0cef68b5.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/main-ea9201f4cc9761dc.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-b204d6c0ca2f72e9.js",revision:"dgR6S1eMBgkbNYN92_8bA"},{url:"/_next/static/css/c16770d3c3b8d5a8.css",revision:"c16770d3c3b8d5a8"},{url:"/_next/static/dgR6S1eMBgkbNYN92_8bA/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/dgR6S1eMBgkbNYN92_8bA/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/icons/icon-128x128.png",revision:"b90d406eabfb5c8a4f0d2592733b0d35"},{url:"/icons/icon-144x144.png",revision:"e85e0ad6922d1c9ad340dccf9d7c6fce"},{url:"/icons/icon-152x152.png",revision:"c3d8bb0d648fc2c04a89459d272d8678"},{url:"/icons/icon-192x192.png",revision:"bfe4f62d6ff5d3d727e80a0f3e5b25ed"},{url:"/icons/icon-256x256.png",revision:"4f84d499de89d725013cd34b3cb3af52"},{url:"/icons/icon-384x384.png",revision:"0a66c1ba3ccd9f45b58101cce2551bf3"},{url:"/icons/icon-48x48.png",revision:"9da72b22a48d5701c26447ffd101254c"},{url:"/icons/icon-512x512.png",revision:"fc7cb8b8089d2b6205e7d16b4f0740c1"},{url:"/icons/icon-72x72.png",revision:"0a30bfcc7a8c984b0015cedc98c4c724"},{url:"/icons/icon-96x96.png",revision:"e688f3eb46669f872bebce144460ef25"},{url:"/manifest.json",revision:"2c9ea020144bdf7b62cdfc9fc2011da0"},{url:"/marcela-koury-logo.jpg",revision:"1dac102b5365d6c44f7b70888f2f7f09"},{url:"/marcelakoury.jpg",revision:"f2316548b3091726f24c1f8aefaeb78a"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/placeholder-qr.svg",revision:"67c54d0804fa785a14c770c8af851357"},{url:"/placeholder-user.jpg",revision:"7ee6562646feae6d6d77e2c72e204591"},{url:"/placeholder.svg",revision:"35707bd9960ba5281c72af927b79291f"},{url:"/places-details.json",revision:"4ecd402ab2c36009c96fef2f0608b62a"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
