import{d as _,u as d,a as p,c as m,b as u,r as h,o as s,e as n,f as t,t as o,g as r,F as f,h as g,n as v,i as x,j as y,k as b,l as k,m as N,_ as w}from"./index-DGUAjwF6.js";import{N as P}from"./NoteDisplay-BQtvXWj2.js";const V={class:"m-4"},L={class:"mb-10"},S={class:"text-4xl font-bold mt-2"},T={class:"opacity-50"},B={class:"text-lg"},D={class:"font-bold flex gap-2"},H={class:"opacity-50"},j=t("div",{class:"flex-auto"},null,-1),z={key:0,class:"border-gray-400/50 mb-8"},C=_({__name:"PresenterPrint",setup(F){d(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),p({title:`Notes - ${m.title}`});const i=u(()=>h.map(a=>{var l;return(l=a.meta)==null?void 0:l.slide}).filter(a=>a!==void 0&&a.noteHTML!==""));return(a,l)=>(s(),n("div",{id:"page-root",style:v(r(x))},[t("div",V,[t("div",L,[t("h1",S,o(r(m).title),1),t("div",T,o(new Date().toLocaleString()),1)]),(s(!0),n(f,null,g(i.value,(e,c)=>(s(),n("div",{key:c,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",B,[t("div",D,[t("div",H,o(e==null?void 0:e.no)+"/"+o(r(y)),1),b(" "+o(e==null?void 0:e.title)+" ",1),j])]),k(P,{"note-html":e.noteHTML,class:"max-w-full"},null,8,["note-html"])]),c<i.value.length-1?(s(),n("hr",z)):N("v-if",!0)]))),128))])],4))}}),E=w(C,[["__file","/home/runner/work/managed_explanation/managed_explanation/node_modules/@slidev/client/internals/PresenterPrint.vue"]]);export{E as default};
