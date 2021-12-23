var z=(o,e,t)=>{if(!e.has(o))throw TypeError("Cannot "+t)};var R=(o,e,t)=>(z(o,e,"read from private field"),t?t.call(o):e.get(o)),b=(o,e,t)=>{if(e.has(o))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(o):e.set(o,t)},y=(o,e,t,a)=>(z(o,e,"write to private field"),a?a.call(o,t):e.set(o,t),t);import{s as f,R as r,w as ee,r as D,a as N,b as u,W as te,u as oe,c as ne,d as re,_ as ae,h as se,e as ce}from"./vendor.852caec6.js";const ie=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerpolicy&&(s.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?s.credentials="include":n.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}};ie();var le="assets/logo.a895bf6f.svg",he="assets/github-logo.10428db4.svg";const me=()=>r.createElement(ue,null,r.createElement(de,{src:le,alt:"logo"}),r.createElement(fe,null,"Genetic Image Generation"),r.createElement("a",{href:"https://github.com/marklai1998/genetic-image-generation"},r.createElement(ge,{src:he,alt:"git-hub-logo"}))),ue=f.header`
  background-color: #242424;
  height: 50px;
  flex-shrink: 0;
  display: flex;
`,de=f.img`
  height: 30px;
  padding: 10px;
  background-color: #2d3034;
  color: #e6e6e6;
`,fe=f.div`
  line-height: 50px;
  color: #e6e6e6;
  font-size: 20px;
  padding-left: 15px;
  font-weight: bold;
  width: 100%;
  overflow: hidden;
`,ge=f.img`
  height: 30px;
  padding: 10px;
  background-color: #2d3034;
  color: #e6e6e6;
  transition: 0.5s;

  &:hover {
    background-color: rgb(53, 53, 53);
  }
`,U=(o,e)=>new Promise(t=>{const a=e.getContext("2d");if(!a)return;const n=new Image;n.onload=async()=>{const{width:s,height:c}=n,{width:i,height:l}=e;a.clearRect(0,0,i,l);const g=Math.min(i/s,l/c);a.drawImage(n,0,0,s*g,c*g),t(g)},n.src=o}),$=(o,e)=>{const t=e.getContext("2d");if(!t)return;const{width:a,height:n}=e;t.clearRect(0,0,a,n),o.polygons.forEach(s=>{const[c,...i]=s.vertices,l=s.color;t.fillStyle=`rgba(${l[0]*255}, ${l[1]*255}, ${l[2]*255}, ${l[3]})`,t.beginPath(),t.moveTo(c.x*a,c.y*n),i.forEach(g=>{t.lineTo(g.x*a,g.y*n)}),t.closePath(),t.fill()})},Y=o=>{const e=o.getContext("2d");if(!e)return new Uint8ClampedArray;const{data:t}=e.getImageData(0,0,o.width,o.height);return t},J=(o,e)=>{const t=e.getContext("2d");!t||(t.font="16px Rajdhani",t.fillStyle="white",t.fillText(`Generation: ${F}`,10,16),t.fillText(`Fitness: ${o.fitness}`,10,32))};function pe(){return new Worker("assets/worker.03e41df9.js",{type:"module"})}const we=new pe,ye=ee(we);var x,M;const V=class{constructor(){b(this,x,0);b(this,M,0);y(this,x,Math.random()),y(this,M,Math.random())}get x(){return R(this,x)}set x(e){y(this,x,e<0||e>1?Math.random():e)}get y(){return R(this,M)}set y(e){y(this,M,e<0||e>1?Math.random():e)}mutate(e){Math.random()<.25&&(this.x=Math.random()<.5?this.x+Math.random()/e:this.x-Math.random()/e),Math.random()<.25&&(this.y=Math.random()<.5?this.y+Math.random()/e:this.y-Math.random()/e)}static clone(e){const t=new V;return t.x=e.x,t.y=e.y,t}};let B=V;x=new WeakMap,M=new WeakMap;var E,I;const _=class{constructor(e){b(this,E,[]);b(this,I,[0,0,0,0]);y(this,E,D(0,e).map(()=>new B)),y(this,I,[Math.random(),Math.random(),Math.random(),.15])}get vertices(){return R(this,E).map(e=>B.clone(e))}set vertices(e){y(this,E,e)}get color(){return[...R(this,I)]}set color(e){y(this,I,e.map(t=>t<0||t>1?Math.random():t))}mutate(e){this.color=this.color.map(t=>Math.random()<.25?Math.random()<.5?t+10*Math.random()/e:t-10*Math.random()/e:t),this.vertices.forEach(t=>{t.mutate(e)})}static clone(e){const t=new _(e.vertices.length);return t.color=e.color,t.vertices=e.vertices,t}};let H=_;E=new WeakMap,I=new WeakMap;const v=class{constructor(){this.fitness=0,this.polygons=[],this.polygons=D(0,v.polyCount).map(()=>new H(v.verticesCount))}async calculateFitness(){$(this,v.refChromoCanvas);const o=Y(v.refChromoCanvas),e=await ye(o,v.refImageData);this.fitness=e}compare(o){return this.fitness===o.fitness?0:this.fitness>=o.fitness?-1:1}mutate(o){this.polygons.forEach(e=>{e.mutate(o)})}};let m=v;m.refImageData=new Uint8ClampedArray;m.refChromoCanvas=document.createElement("canvas");m.imgScale=1;m.polyCount=0;m.verticesCount=0;const Ce=.95,ve=.95,xe=(o,e)=>{const t=new m,a=t.polygons.length;return t.polygons=D(0,a).map((n,s)=>{const c=Math.random()<.5?o.polygons[s]:e.polygons[s];return H.clone(c)}),t},Me=async o=>{const e=o.length,t=o.sort((p,w)=>p.compare(w)),[a,n]=N(Math.ceil(e*(1/2)),t),[s,c]=N(Math.floor(a.length*(1/5)),a),i=a.length,l=await Promise.all(c.map(async p=>{let w=p;if(Math.random()<Ce){const L=Math.round(Math.random()*(i-1)),S=Math.round(Math.random()*(i-1));w=xe(a[L],a[S])}else Math.random()<ve?p.mutate(500*Math.random()):w=new m;return await w.calculateFitness(),w})),g=await Promise.all(n.map(async()=>{const p=new m;return await p.calculateFitness(),p}));return[...s,...l,...g]};let F=0,k=[],j=!1;const Ee=async({refImage:o,popSize:e,polyCount:t,vertices:a})=>{F=0,m.polyCount=t,m.verticesCount=a;const n=100,s=100;m.refChromoCanvas.width=s,m.refChromoCanvas.height=n;const c=document.createElement("canvas");c.width=s,c.height=n;const i=await U(o,c);m.imgScale=i,m.refImageData=Y(c),c.remove();const l=D(0,e).map(()=>new m);await Promise.all(l.map(g=>g.calculateFitness())),k=l},Ie=async()=>{for(;j;)F=F+1,k=await Me(k)},Se=()=>{j=!0,Ie()},X=()=>{j=!1};var Re="assets/mona.86d8a6c3.png";const be=u.exports.forwardRef(({containerWidth:o,containerHeight:e,chromo:t,maxWidth:a,onDraw:n},s)=>{const c=u.exports.useRef(null);return u.exports.useEffect(()=>{const i=c.current;if(!i)return;const l=a?Math.min(o,e,a):Math.min(o,e);i.width=l,i.height=l},[o,e,a]),u.exports.useEffect(()=>{const i=c.current;!i||!t||($(t,i),n&&n(t,i))},[t,n]),r.createElement("canvas",{ref:c})}),ke=50,Pe=150,Le=3,De=()=>{const[o,e]=oe([]),[t,a]=u.exports.useState(!1),[n,s]=u.exports.useState(!1),[c,i]=u.exports.useState(!1),[l,g]=u.exports.useState(Re),[p,{width:w,height:L}]=ne(),S=u.exports.useRef(null),O=u.exports.useRef(null),A=u.exports.useRef(null);u.exports.useEffect(()=>{const h=S.current;if(!h)return;const d=Math.min(w,L,350);h.width=d,h.height=d;const C=O.current;!C||(C.width=d,C.height=d)},[w,L]);const[T,K]=re(async()=>{c&&e(k);const h=k[0],d=S.current;!d||($(h,d),J(h,d))},!1),G=u.exports.useCallback(async()=>{X(),a(!1),T(),await Ee({refImage:l,popSize:ke,vertices:Le,polyCount:Pe});const h=O.current;!h||await U(l,h)},[l,T]);u.exports.useEffect(()=>{G()},[G]);const Z=()=>{t?(a(!1),T(),X()):(a(!0),K(),Se())},Q=h=>{const d=Array.from(h.target.files||[]),C=se(d);if(!C)return;const W=new FileReader;W.readAsDataURL(C),W.onload=()=>g(String(W.result))};return r.createElement(r.Fragment,null,r.createElement(Fe,null),r.createElement(me,null),r.createElement(Oe,{ref:p},r.createElement("div",null,r.createElement(P,{color:"#3c4043",onClick:()=>{s(h=>!h)}},n?"View Generation":"View Source Image"),r.createElement(ae,{isFlipped:n,flipDirection:"horizontal"},r.createElement("div",null,r.createElement(q,{ref:S}),r.createElement(Ae,null,r.createElement(P,{color:t?"#f50057":"#1565c0",onClick:Z},t?"Pause":"Start"),r.createElement(P,{color:"#f50057",onClick:G},"Reset"))),r.createElement("div",null,r.createElement(q,{ref:O}),r.createElement(P,{color:"#3c4043",onClick:()=>{A.current&&A.current.click()}},"Change Image"),r.createElement(Te,{type:"file",name:"source",accept:"image/*",onChange:Q,ref:A})))),r.createElement(Ge,null,r.createElement(P,{color:"#3c4043",onClick:()=>{i(h=>!h)}},"View All Chromo"),r.createElement(We,{show:c},c&&r.createElement(r.Fragment,null,o.map((h,d)=>r.createElement($e,null,r.createElement(Be,null,"#",d),r.createElement(be,{chromo:h,containerHeight:230,containerWidth:230,key:d+1,onDraw:J}))))))))},Fe=te`
html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Rajdhani', Microsoft JhengHei, sans-serif;
  background-color: #151515;
  height: 100%;
}

button{
  font-family: 'Rajdhani', Microsoft JhengHei, sans-serif;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
`,Oe=f.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`,q=f.canvas`
  background-color: #000000;
`,P=f.button`
  display: block;
  width: 100%;
  padding: 5px 10px;
  background-color: ${({color:o})=>o};
  border: 0;
  color: #fff;
  position: relative;
  cursor: pointer;
`,Ae=f.div`
  display: flex;
`,Te=f.input`
  display: none;
`,Ge=f.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`,We=f.div`
  background-color: #242424;
  width: 100%;

  height: ${({show:o})=>o?250:0}px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`,$e=f.div`
  position: relative;
  display: inline-block;
`,Be=f.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 4px 8px;
  color: #fff;
  background-color: #3c4043;
`;ce.render(r.createElement(r.StrictMode,null,r.createElement(De,null)),document.getElementById("app"));
