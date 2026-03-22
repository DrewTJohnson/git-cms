import{k as z,g as a,i as n,b as $,S as D,e as S,h as s,a as F,t as C,j as O}from"./index-BFU7e1BM.js";import{c as R}from"./github-Y2r8CeCi.js";import{M as U}from"./MarkdownEditor-DMlzBTb7.js";import"./purify.es-CkEwtMvV.js";var j=C('<div class="alert alert--error"role=alert>'),q=C('<form class="admin-page admin-editor"><div class=admin-page__header><div><h1 class=admin-page__title>New Page</h1></div><div class=admin-editor__actions><a href=/admin class="btn btn--ghost">Cancel</a><button type=submit class="btn btn--primary"></button></div></div><div class=form-group><label class=form-label for=slug>Page Slug (URL)</label><div class=slug-input-row><span class=slug-input-prefix>/page/</span><input id=slug class=form-input type=text placeholder=about-us pattern=[a-z0-9-]+ title="Lowercase letters, numbers, and hyphens only"required></div><p class=form-hint>Filename will be <code>.md');const H=`# Page Title

Write your content here using Markdown.

## Section Heading

Add paragraphs, lists, and more.

- Item one
- Item two
- Item three
`;function W(o){return o.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Q(){const o=z(),[r,d]=a(""),[w,x]=a(!1),[c,y]=a(H),[u,g]=a(!1),[m,p]=a(null);function E(e){if(y(e),!w()){const t=e.match(/^#\s+(.+)$/m);t&&d(W(t[1]))}}async function T(e){e.preventDefault();const t=s.token();if(!(!t||!r())){g(!0),p(null);try{await R(t,s.repoOwner(),s.repoName(),s.branch(),F.contentPath,r(),c()),o("/admin")}catch(i){p(i.message??String(i)),g(!1)}}}return(()=>{var e=q(),t=e.firstChild,i=t.firstChild,N=i.nextSibling,k=N.firstChild,h=k.nextSibling,f=t.nextSibling,L=f.firstChild,_=L.nextSibling,P=_.firstChild,v=P.nextSibling,A=_.nextSibling,I=A.firstChild,b=I.nextSibling,M=b.firstChild;return e.addEventListener("submit",T),n(h,()=>u()?"Saving…":"Save & Commit"),n(e,$(D,{get when(){return m()},get children(){var l=j();return n(l,m),l}}),f),v.$$input=l=>{d(l.currentTarget.value),x(!0)},n(b,()=>r()||"page-slug",M),n(e,$(U,{get value(){return c()},onChange:E,class:"admin-editor__editor"}),null),S(()=>h.disabled=u()),S(()=>v.value=r()),e})()}O(["input"]);export{Q as default};
