(()=>{var t={313:(t,e,i)=>{"use strict";i.d(e,{Z:()=>o});class o{onStart=()=>{};onUpdate=t=>{};onStop=()=>{};isStarted=!1;isStopped=!1;from=0;to=1;merge(t){const e=new o;return e.onStart=()=>{this.onStart(),t.onStart()},e.onUpdate=e=>{this.onUpdate(e),t.onUpdate(e)},e.onStop=()=>{this.onStop(),t.onStop()},e}run(t,e,i){this.isStarted&&!this.isStopped?i>e?(this.onUpdate(this.to),this.onStop(),this.isStopped=!0):this.onUpdate((i-t)/(e-t)*(this.to-this.from)):i>t&&(this.onStart(),this.onUpdate(this.from),this.isStarted=!0)}}},69:(t,e,i)=>{"use strict";var o=i(313),n=i(484);const s={actionList:new Map,minTime:1/0,maxTime:0,add:(t,e,i)=>{const a=new o.Z,r=s.actionList,m=[1e3*t,1e3*e];(0,n.J)(a,i),r.has(m)?r.set(m,a.merge(r.get(m))):r.set(m,a),s.minTime=Math.min(s.minTime,1e3*t),s.maxTime=Math.max(s.maxTime,1e3*e)},start:()=>{const t=+new Date;let e;!function i(){const o=+new Date-t,n=s.actionList;if(o<s.minTime)e=requestAnimationFrame(i);else if(o>s.maxTime)cancelAnimationFrame(e);else{for(const[t,e]of n)e.run(...t,o),e.isStopped&&n.delete(t);e=requestAnimationFrame(i)}}()}}},672:(t,e,i)=>{"use strict";i(69)},625:()=>{},347:(t,e,i)=>{},179:(t,e,i)=>{},160:(t,e,i)=>{},139:(t,e,i)=>{},91:(t,e,i)=>{},737:(t,e,i)=>{},461:(t,e,i)=>{},200:(t,e,i)=>{},484:(t,e,i)=>{"use strict";function o(t,...e){Object.assign(t,...e)}i.d(e,{J:()=>o})}},e={};function i(o){var n=e[o];if(void 0!==n)return n.exports;var s=e[o]={exports:{}};return t[o](s,s.exports,i),s.exports}i.d=(t,e)=>{for(var o in e)i.o(e,o)&&!i.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i(313),i(69),i(672),i(625),i(347),i(179),i(160),i(139),i(91),i(737),i(461),i(200),i(484)})();