(()=>{"use strict";var t={69:(t,e,i)=>{var s=i(672);class n{constructor(t){const e=this,i=new Map;this.events=i,this.isStarted=!1,this.isEnded=!1,i.set("start",(function(){t.start&&t.start(),e.isStarted=!0})),i.set("update",(function(e){t.update&&t.update(e)})),i.set("end",(function(){t.end&&t.end(),e.isEnded=!0}))}add(t){return new n({start:()=>{this.events.get("start")(),t.events.get("start")()},update:e=>{this.events.get("update")(e),t.events.get("update")(e)},end:()=>{this.events.get("end")(),t.events.get("end")()}})}}s.Z.animation={frameList:new Map,start(){const t=+new Date,e=this.startTime,i=this.endTime,n=this.frameList;this.add(e/1e3,i/1e3,{update:()=>{s.Z.background(),s.Z.draw()}}),function s(){const o=+new Date-t;let r;if(o>i&&0===n.size)cancelAnimationFrame(r);else if(o>e){for(let[t,e]of n)o>t[0]&&t[1]>o?(e.isStarted||e.events.get("start")(),e.events.get("update")((o-t[0])/(t[1]-t[0]))):o>t[1]&&(e.events.get("update")(1),e.events.get("end")(),n.delete(t));r=requestAnimationFrame(s)}else r=requestAnimationFrame(s)}()},add(t,e,i){const s=[t*=1e3,e*=1e3],o=this.frameList,r=new n(i);o.has(s)?o.set(s,r.add(o.get(s))):o.set(s,r),void 0!==this.startTime?t<this.startTime&&(this.startTime=t):this.startTime=t,void 0!==this.endTime?e>this.endTime&&(this.endTime=e):this.endTime=e}}},672:(t,e,i)=>{i.d(e,{Z:()=>s}),window.Mraph={elements:[],setup(t,e){const i=document.createElement("canvas");t.appendChild(i),e&&(e.width&&(i.width=3*e.width,i.style.width=e.width+"px"),e.height&&(i.height=3*e.height,i.style.height=e.height+"px")),this.canvas=i},draw(){const t=this.elements;for(const e of t)e.draw()},background(t="white"){this.ctx2d.fillStyle=t;const e=this.canvas.width,i=this.canvas.height;this.ctx2d.fillRect(-e/2,-i/2,e,i)},set canvas(t){this._canvas=t;const e=t.getContext("2d");this.ctx2d=e,e.translate(t.width/2,t.height/2),e.scale(1,-1)},get canvas(){return this._canvas}};const s=Mraph},905:(t,e,i)=>{var s=i(672),n=i(245),o=i(357);class r extends n.Z{constructor(t,e,i){if(super(i),this.size=5,this.color="#F05D11FF",this.fillColor="#F05D1199",this.point1=o.Z.getPoint(t),"[object Number]"==Object.prototype.toString.call(e)){const t=new s.Z.Point(this.point1.x+e,this.point1.y);t.visible=!1,this.point2=t}else this.point2=o.Z.getPoint(e)}draw(){if(!this.visible)return;const t=s.Z.ctx2d;return t.beginPath(),t.strokeStyle=this.color,t.fillStyle=this.fillColor,t.lineWidth=this.size,t.arc(this.point1.x,this.point1.y,this.radius,0,2*Math.PI),t.stroke(),t.fill(),this}get radius(){return Math.hypot(this.point2.x-this.point1.x,this.point2.y-this.point1.y)}}s.Z.Circle=r},245:(t,e,i)=>{i.d(e,{Z:()=>s});const s=class{constructor(...t){this.color="black",this.visible=!0,this.fillColor="rgba(0,0,0,0)",!1!==t[t.length-1]&&Mraph.elements.push(this)}resizeTo(t,e,i){let s,n;Mraph.animation.add(e,i,{start:()=>{s=this.size,n=s*t-s},update:t=>{this.size=s+n*t}})}}},556:(t,e,i)=>{var s=i(672),n=i(750);class o extends n.Z{constructor(...t){super(...t),this.color="#C61C1CFF"}draw(){if(!this.visible)return;const t=s.Z.ctx2d;t.beginPath(),t.lineWidth=this.size,t.strokeStyle=this.color;const e=s.Z.canvas.width,i=s.Z.canvas.height,n=this.point1,o=this.point2;if(o.x-n.x!=0){const i=this.slope;t.moveTo(-e/2,n.y+(-e/2-n.x)*i),t.lineTo(e/2,o.y+(e/2-o.x)*i)}else t.moveTo(n.x,-i/2),t.lineTo(n.x,i/2);return t.stroke(),this}}s.Z.Line=o},357:(t,e,i)=>{i.d(e,{Z:()=>r});var s=i(672),n=i(245);class o extends n.Z{constructor(t,e,i){super(i),this.size=10,this.x=t,this.y=e}draw(){if(!this.visible)return;const t=s.Z.ctx2d;return t.beginPath(),t.lineWidth=2*this.size,t.fillStyle=this.color,t.arc(this.x,this.y,this.size,0,2*Math.PI),t.fill(),this}moveTo(t,e,i){let n,r,h,a;const c=this;s.Z.animation.add(e,i,{start:()=>{t=o.getPos(t),n=c.x,r=c.y,h=t[0]-n,a=t[1]-r},update:t=>{c.x=n+h*t,c.y=r+a*t}})}static getPoint(t){return t instanceof o?t:new o(...t,!1)}static getPos(t){return t instanceof o?[t.x,t.y]:t}}s.Z.Point=o;const r=o},566:(t,e,i)=>{var s=i(672),n=i(245),o=i(357);class r extends n.Z{constructor(...t){super(...t),this.size=5,this.points=t[0].map((t=>o.Z.getPoint(t)))}draw(){if(!this.visible)return;const t=s.Z.ctx2d,e=this.points;t.beginPath(),t.lineWidth=this.size,t.strokeStyle=this.color,t.fillStyle=this.fillColor,t.moveTo(e[0].x,e[0].y);for(const i of e)t.lineTo(i.x,i.y);return t.closePath(),t.stroke(),t.fill(),this}}s.Z.Polygon=r},750:(t,e,i)=>{i.d(e,{Z:()=>h});var s=i(672),n=i(245),o=i(357);class r extends n.Z{constructor(t,e,i){super(i),this.size=5,this.point1=o.Z.getPoint(t),this.point2=o.Z.getPoint(e)}draw(){if(!this.visible)return;const t=s.Z.ctx2d;return t.beginPath(),t.lineWidth=this.size,t.strokeStyle=this.color,t.moveTo(this.point1.x,this.point1.y),t.lineTo(this.point2.x,this.point2.y),t.stroke(),this}get length(){return Math.hypot(this.point2.x-this.point1.x,this.point2.y-this.point1.y)}get slope(){return(this.point2.y-this.point1.y)/(this.point2.x-this.point1.x)}}s.Z.Segment=r;const h=r}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var o=e[s]={exports:{}};return t[s](o,o.exports,i),o.exports}i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i(69),i(672),i(905),i(245),i(556),i(357),i(566),i(750)})();