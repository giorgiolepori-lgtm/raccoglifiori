/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/
!function(f){typeof module!='undefined'&&typeof exports=='object'?module.exports=f():typeof define!='undefined'&&define.amd?define(['fflate',f]):(typeof self!='undefined'?self:this).fflate=f()}(function(){var _e={};"use strict";var t=(typeof module!='undefined'&&typeof exports=='object'?function(_f){"use strict";var e,t=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{e=require("worker_threads").Worker}catch(e){}exports.default=e?function(r,n,o,a,s){var u=!1,i=new e(r+t,{eval:!0}).on("error",(function(e){return s(e,null)})).on("message",(function(e){return s(null,e)})).on("exit",(function(e){e&&!u&&s(Error("exited with code "+e),null)}));return i.postMessage(o,a),i.terminate=function(){return u=!0,e.prototype.terminate.call(i)},i}:function(e,t,r,n,o){setImmediate((function(){return o(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)}));var a=function(){};return{terminate:a,postMessage:a}};return _f}:function(_f){"use strict";var e={},r=function(e){return URL.createObjectURL(new Blob([e],{type:"text/javascript"}))},t=function(e){return new Worker(e)};try{URL.revokeObjectURL(r(""))}catch(e){r=function(e){return"data:application/javascript;charset=UTF-8,"+encodeURI(e)},t=function(e){return new Worker(e,{type:"module"})}}_f.default=function(n,o,u,a,c){var i=t(e[o]||(e[o]=r(n)));return i.onerror=function(e){return c(e.error,null)},i.onmessage=function(e){return c(null,e.data)},i.postMessage(u,a),i};return _f})({}),n=Uint8Array,r=Uint16Array,e=Uint32Array,i=new n([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),o=new n([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),a=new n([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=function(t,n){for(var i=new r(31),o=0;o<31;++o)i[o]=n+=1<<t[o-1];var a=new e(i[30]);for(o=1;o<30;++o)for(var s=i[o];s<i[o+1];++s)a[s]=s-i[o]<<5|o;return[i,a]},f=s(i,2),u=f[0],h=f[1];u[28]=258,h[258]=28;for(var c=s(o,0),l=c[0],p=c[1],v=new r(32768),d=0;d<32768;++d){var g=(43690&d)>>>1|(21845&d)<<1;v[d]=((65280&(g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4))>>>8|(255&g)<<8)>>>1}var w=function(t,n,e){for(var i=t.length,o=0,a=new r(n);o<i;++o)++a[t[o]-1];var s,f=new r(n);for(o=0;o<n;++o)f[o]=f[o-1]+a[o-1]<<1;if(e){s=new r(1<<n);var u=15-n;for(o=0;o<i;++o)if(t[o])for(var h=o<<4|t[o],c=n-t[o],l=f[t[o]-1]++<<c,p=l|(1<<c)-1;l<=p;++l)s[v[l]>>>u]=h}else for(s=new r(i),o=0;o<i;++o)t[o]&&(s[o]=v[f[t[o]-1]++]>>>15-t[o]);return s},y=new n(288);for(d=0;d<144;++d)y[d]=8;for(d=144;d<256;++d)y[d]=9;for(d=256;d<280;++d)y[d]=7;for(d=280;d<288;++d)y[d]=8;var m=new n(32);for(d=0;d<32;++d)m[d]=5;var b=w(y,9,0),x=w(y,9,1),z=w(m,5,0),k=w(m,5,1),M=function(t){for(var n=t[0],r=1;r<t.length;++r)t[r]>n&&(n=t[r]);return n},A=function(t,n,r){var e=n/8|0;return(t[e]|t[e+1]<<8)>>(7&n)&r},S=function(t,n){var r=n/8|0;return(t[r]|t[r+1]<<8|t[r+2]<<16)>>(7&n)},D=function(t){return(t/8|0)+(7&t&&1)},C=function(t,i,o){(null==i||i<0)&&(i=0),(null==o||o>t.length)&&(o=t.length);var a=new(t instanceof r?r:t instanceof e?e:n)(o-i);return a.set(t.subarray(i,o)),a},U=function(t,r,e){var s=t.length;if(!s||e&&!e.l&&s<5)return r||new n(0);var f=!r||e,h=!e||e.i;e||(e={}),r||(r=new n(3*s));var c=function(t){var e=r.length;if(t>e){var i=new n(Math.max(2*e,t));i.set(r),r=i}},p=e.f||0,v=e.p||0,d=e.b||0,g=e.l,y=e.d,m=e.m,b=e.n,z=8*s;do{if(!g){e.f=p=A(t,v,1);var U=A(t,v+1,3);if(v+=3,!U){var O=t[(Y=D(v)+4)-4]|t[Y-3]<<8,T=Y+O;if(T>s){if(h)throw"unexpected EOF";break}f&&c(d+O),r.set(t.subarray(Y,T),d),e.b=d+=O,e.p=v=8*T;continue}if(1==U)g=x,y=k,m=9,b=5;else{if(2!=U)throw"invalid block type";var Z=A(t,v,31)+257,I=A(t,v+10,15)+4,F=Z+A(t,v+5,31)+1;v+=14;for(var E=new n(F),G=new n(19),P=0;P<I;++P)G[a[P]]=A(t,v+3*P,7);v+=3*I;var j=M(G),q=(1<<j)-1,H=w(G,j,1);for(P=0;P<F;){var Y,B=H[A(t,v,q)];if(v+=15&B,(Y=B>>>4)<16)E[P++]=Y;else{var J=0,K=0;for(16==Y?(K=3+A(t,v,3),v+=2,J=E[P-1]):17==Y?(K=3+A(t,v,7),v+=3):18==Y&&(K=11+A(t,v,127),v+=7);K--;)E[P++]=J}}var L=E.subarray(0,Z),N=E.subarray(Z);m=M(L),b=M(N),g=w(L,m,1),y=w(N,b,1)}if(v>z){if(h)throw"unexpected EOF";break}}f&&c(d+131072);for(var Q=(1<<m)-1,R=(1<<b)-1,V=v;;V=v){var W=(J=g[S(t,v)&Q])>>>4;if((v+=15&J)>z){if(h)throw"unexpected EOF";break}if(!J)throw"invalid length/literal";if(W<256)r[d++]=W;else{if(256==W){V=v,g=null;break}var X=W-254;W>264&&(X=A(t,v,(1<<(tt=i[P=W-257]))-1)+u[P],v+=tt);var $=y[S(t,v)&R],_=$>>>4;if(!$)throw"invalid distance";if(v+=15&$,N=l[_],_>3){var tt=o[_];N+=S(t,v)&(1<<tt)-1,v+=tt}if(v>z){if(h)throw"unexpected EOF";break}f&&c(d+131072);for(var nt=d+X;d<nt;d+=4)r[d]=r[d-N],r[d+1]=r[d+1-N],r[d+2]=r[d+2-N],r[d+3]=r[d+3-N];d=nt}}e.l=g,e.p=V,e.b=d,g&&(p=1,e.m=m,e.d=y,e.n=b)}while(!p);return d==r.length?r:C(r,0,d)},O=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>>8},T=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>>8,t[e+2]|=r>>>16},Z=function(t,e){for(var i=[],o=0;o<t.length;++o)t[o]&&i.push({s:o,f:t[o]});var a=i.length,s=i.slice();if(!a)return[q,0];if(1==a){var f=new n(i[0].s+1);return f[i[0].s]=1,[f,1]}i.sort((function(t,n){return t.f-n.f})),i.push({s:-1,f:25001});var u=i[0],h=i[1],c=0,l=1,p=2;for(i[0]={s:-1,f:u.f+h.f,l:u,r:h};l!=a-1;)u=i[i[c].f<i[p].f?c++:p++],h=i[c!=l&&i[c].f<i[p].f?c++:p++],i[l++]={s:-1,f:u.f+h.f,l:u,r:h};var v=s[0].s;for(o=1;o<a;++o)s[o].s>v&&(v=s[o].s);var d=new r(v+1),g=I(i[l-1],d,0);if(g>e){o=0;var w=0,y=g-e,m=1<<y;for(s.sort((function(t,n){return d[n.s]-d[t.s]||t.f-n.f}));o<a;++o){var b=s[o].s;if(!(d[b]>e))break;w+=m-(1<<g-d[b]),d[b]=e}for(w>>>=y;w>0;){var x=s[o].s;d[x]<e?w-=1<<e-d[x]++-1:++o}for(;o>=0&&w;--o){var z=s[o].s;d[z]==e&&(--d[z],++w)}g=e}return[new n(d),g]},I=function(t,n,r){return-1==t.s?Math.max(I(t.l,n,r+1),I(t.r,n,r+1)):n[t.s]=r},F=function(t){for(var n=t.length;n&&!t[--n];);for(var e=new r(++n),i=0,o=t[0],a=1,s=function(t){e[i++]=t},f=1;f<=n;++f)if(t[f]==o&&f!=n)++a;else{if(!o&&a>2){for(;a>138;a-=138)s(32754);a>2&&(s(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(s(o),--a;a>6;a-=6)s(8304);a>2&&(s(a-3<<5|8208),a=0)}for(;a--;)s(o);a=1,o=t[f]}return[e.subarray(0,i),n]},E=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},G=function(t,n,r){var e=r.length,i=D(n+2);t[i]=255&e,t[i+1]=e>>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var o=0;o<e;++o)t[i+o+4]=r[o];return 8*(i+4+e)},P=function(t,n,e,s,f,u,h,c,l,p,v){O(n,v++,e),++f[256];for(var d=Z(f,15),g=d[0],x=d[1],k=Z(u,15),M=k[0],A=k[1],S=F(g),D=S[0],C=S[1],U=F(M),I=U[0],P=U[1],j=new r(19),q=0;q<D.length;++q)j[31&D[q]]++;for(q=0;q<I.length;++q)j[31&I[q]]++;for(var H=Z(j,7),Y=H[0],B=H[1],J=19;J>4&&!Y[a[J-1]];--J);var K,L,N,Q,R=p+5<<3,V=E(f,y)+E(u,m)+h,W=E(f,g)+E(u,M)+h+14+3*J+E(j,Y)+(2*j[16]+3*j[17]+7*j[18]);if(R<=V&&R<=W)return G(n,v,t.subarray(l,l+p));if(O(n,v,1+(W<V)),v+=2,W<V){K=w(g,x,0),L=g,N=w(M,A,0),Q=M;var X=w(Y,B,0);for(O(n,v,C-257),O(n,v+5,P-1),O(n,v+10,J-4),v+=14,q=0;q<J;++q)O(n,v+3*q,Y[a[q]]);v+=3*J;for(var $=[D,I],_=0;_<2;++_){var tt=$[_];for(q=0;q<tt.length;++q)O(n,v,X[nt=31&tt[q]]),v+=Y[nt],nt>15&&(O(n,v,tt[q]>>>5&127),v+=tt[q]>>>12)}}else K=b,L=y,N=z,Q=m;for(q=0;q<c;++q)if(s[q]>255){var nt;T(n,v,K[257+(nt=s[q]>>>18&31)]),v+=L[nt+257],nt>7&&(O(n,v,s[q]>>>23&31),v+=i[nt]);var rt=31&s[q];T(n,v,N[rt]),v+=Q[rt],rt>3&&(T(n,v,s[q]>>>5&8191),v+=o[rt])}else T(n,v,K[s[q]]),v+=L[s[q]];return T(n,v,K[256]),v+L[256]},j=new e([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),q=new n(0),H=function(t,a,s,f,u,c){var l=t.length,v=new n(f+l+5*(1+Math.ceil(l/7e3))+u),d=v.subarray(f,v.length-u),g=0;if(!a||l<8)for(var w=0;w<=l;w+=65535){var y=w+65535;y<l?g=G(d,g,t.subarray(w,y)):(d[w]=c,g=G(d,g,t.subarray(w,l)))}else{for(var m=j[a-1],b=m>>>13,x=8191&m,z=(1<<s)-1,k=new r(32768),M=new r(z+1),A=Math.ceil(s/3),S=2*A,U=function(n){return(t[n]^t[n+1]<<A^t[n+2]<<S)&z},O=new e(25e3),T=new r(288),Z=new r(32),I=0,F=0,E=(w=0,0),H=0,Y=0;w<l;++w){var B=U(w),J=32767&w,K=M[B];if(k[J]=K,M[B]=J,H<=w){var L=l-w;if((I>7e3||E>24576)&&L>423){g=P(t,d,0,O,T,Z,F,E,Y,w-Y,g),E=I=F=0,Y=w;for(var N=0;N<286;++N)T[N]=0;for(N=0;N<30;++N)Z[N]=0}var Q=2,R=0,V=x,W=J-K&32767;if(L>2&&B==U(w-W))for(var X=Math.min(b,L)-1,$=Math.min(32767,w),_=Math.min(258,L);W<=$&&--V&&J!=K;){if(t[w+Q]==t[w+Q-W]){for(var tt=0;tt<_&&t[w+tt]==t[w+tt-W];++tt);if(tt>Q){if(Q=tt,R=W,tt>X)break;var nt=Math.min(W,tt-2),rt=0;for(N=0;N<nt;++N){var et=w-W+N+32768&32767,it=et-k[et]+32768&32767;it>rt&&(rt=it,K=et)}}}W+=(J=K)-(K=k[J])+32768&32767}if(R){O[E++]=268435456|h[Q]<<18|p[R];var ot=31&h[Q],at=31&p[R];F+=i[ot]+o[at],++T[257+ot],++Z[at],H=w+Q,++I}else O[E++]=t[w],++T[t[w]]}}g=P(t,d,c,O,T,Z,F,E,Y,w-Y,g),!c&&7&g&&(g=G(d,g+1,q))}return C(v,0,f+D(g)+u)},Y=function(){for(var t=new e(256),n=0;n<256;++n){for(var r=n,i=9;--i;)r=(1&r&&3988292384)^r>>>1;t[n]=r}return t}(),B=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=Y[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}},J=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,o=r.length,a=0;a!=o;){for(var s=Math.min(a+2655,o);a<s;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|t>>>8<<16|(255&(n%=65521))<<8|n>>>8}}},K=function(t,n,r,e,i){return H(t,null==n.level?6:n.level,null==n.mem?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(t.length)))):12+n.mem,r,e,!i)},L=function(t,n){var r={};for(var e in t)r[e]=t[e];for(var e in n)r[e]=n[e];return r},N=function(t,n,r){for(var e=t(),i=""+t,o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/ /g,"").split(","),a=0;a<e.length;++a){var s=e[a],f=o[a];if("function"==typeof s){n+=";"+f+"=";var u=""+s;if(s.prototype)if(-1!=u.indexOf("[native code]")){var h=u.indexOf(" ",8)+1;n+=u.slice(h,u.indexOf("(",h))}else for(var c in n+=u,s.prototype)n+=";"+f+".prototype."+c+"="+s.prototype[c];else n+=u}else r[f]=s}return[n,r]},Q=[],R=function(t){var i=[];for(var o in t)(t[o]instanceof n||t[o]instanceof r||t[o]instanceof e)&&i.push((t[o]=new t[o].constructor(t[o])).buffer);return i},V=function(n,r,e,i){var o;if(!Q[e]){for(var a="",s={},f=n.length-1,u=0;u<f;++u)a=(o=N(n[u],a,s))[0],s=o[1];Q[e]=N(n[f],a,s)}var h=L({},Q[e][1]);return t.default(Q[e][0]+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+r+"}",e,h,R(h),i)},W=function(){return[n,r,e,i,o,a,u,l,x,k,v,w,M,A,S,D,C,U,At,rt,et]},X=function(){return[n,r,e,i,o,a,h,p,b,y,z,m,v,j,q,w,O,T,Z,I,F,E,G,P,D,C,H,K,xt,rt]},$=function(){return[ct,vt,ht,B,Y]},_=function(){return[lt,pt]},tt=function(){return[dt,ht,J]},nt=function(){return[gt]},rt=function(t){return postMessage(t,[t.buffer])},et=function(t){return t&&t.size&&new n(t.size)},it=function(t,n,r,e,i,o){var a=V(r,e,i,(function(t,n){a.terminate(),o(t,n)}));return a.postMessage([t,n],n.consume?[t.buffer]:[]),function(){a.terminate()}},ot=function(t){return t.ondata=function(t,n){return postMessage([t,n],[t.buffer])},function(n){return t.push(n.data[0],n.data[1])}},at=function(t,n,r,e,i){var o,a=V(t,e,i,(function(t,r){t?(a.terminate(),n.ondata.call(n,t)):(r[1]&&a.terminate(),n.ondata.call(n,t,r[0],r[1]))}));a.postMessage(r),n.push=function(t,r){if(o)throw"stream finished";if(!n.ondata)throw"no stream handler";a.postMessage([t,o=r],[t.buffer])},n.terminate=function(){a.terminate()}},st=function(t,n){return t[n]|t[n+1]<<8},ft=function(t,n){return(t[n]|t[n+1]<<8|t[n+2]<<16|t[n+3]<<24)>>>0},ut=function(t,n){return ft(t,n)+4294967296*ft(t,n+4)},ht=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},ct=function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&ht(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}},lt=function(t){if(31!=t[0]||139!=t[1]||8!=t[2])throw"invalid gzip data";var n=t[3],r=10;4&n&&(r+=t[10]|2+(t[11]<<8));for(var e=(n>>3&1)+(n>>4&1);e>0;e-=!t[r++]);return r+(2&n)},pt=function(t){var n=t.length;return(t[n-4]|t[n-3]<<8|t[n-2]<<16|t[n-1]<<24)>>>0},vt=function(t){return 10+(t.filename&&t.filename.length+1||0)},dt=function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;t[0]=120,t[1]=e<<6|(e?32-2*e:1)},gt=function(t){if(8!=(15&t[0])||t[0]>>>4>7||(t[0]<<8|t[1])%31)throw"invalid zlib data";if(32&t[1])throw"invalid zlib data: preset dictionaries not supported"};function wt(t,n){return n||"function"!=typeof t||(n=t,t={}),this.ondata=n,t}var yt=function(){function t(t,n){n||"function"!=typeof t||(n=t,t={}),this.ondata=n,this.o=t||{}}return t.prototype.p=function(t,n){this.ondata(K(t,this.o,0,0,!n),n)},t.prototype.push=function(t,n){if(this.d)throw"stream finished";if(!this.ondata)throw"no stream handler";this.d=n,this.p(t,n||!1)},t}();_e.Deflate=yt;var mt=function(){return function(t,n){at([X,function(){return[ot,yt]}],this,wt.call(this,t,n),(function(t){var n=new yt(t.data);onmessage=ot(n)}),6)}}();function bt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[X],(function(t){return rt(xt(t.data[0],t.data[1]))}),0,r)}function xt(t,n){return K(t,n||{},0,0)}_e.AsyncDeflate=mt,_e.deflate=bt,_e.deflateSync=xt;var zt=function(){function t(t){this.s={},this.p=new n(0),this.ondata=t}return t.prototype.e=function(t){if(this.d)throw"stream finished";if(!this.ondata)throw"no stream handler";var r=this.p.length,e=new n(r+t.length);e.set(this.p),e.set(t,r),this.p=e},t.prototype.c=function(t){this.d=this.s.i=t||!1;var n=this.s.b,r=U(this.p,this.o,this.s);this.ondata(C(r,n,this.s.b),this.d),this.o=C(r,this.s.b-32768),this.s.b=this.o.length,this.p=C(this.p,this.s.p/8|0),this.s.p&=7},t.prototype.push=function(t,n){this.e(t),this.c(n)},t}();_e.Inflate=zt;var kt=function(){return function(t){this.ondata=t,at([W,function(){return[ot,zt]}],this,0,(function(){var t=new zt;onmessage=ot(t)}),7)}}();function Mt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[W],(function(t){return rt(At(t.data[0],et(t.data[1])))}),1,r)}function At(t,n){return U(t,n)}_e.AsyncInflate=kt,_e.inflate=Mt,_e.inflateSync=At;var St=function(){function t(t,n){this.c=B(),this.l=0,this.v=1,yt.call(this,t,n)}return t.prototype.push=function(t,n){yt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){this.c.p(t),this.l+=t.length;var r=K(t,this.o,this.v&&vt(this.o),n&&8,!n);this.v&&(ct(r,this.o),this.v=0),n&&(ht(r,r.length-8,this.c.d()),ht(r,r.length-4,this.l)),this.ondata(r,n)},t}();_e.Gzip=St,_e.Compress=St;var Dt=function(){return function(t,n){at([X,$,function(){return[ot,yt,St]}],this,wt.call(this,t,n),(function(t){var n=new St(t.data);onmessage=ot(n)}),8)}}();function Ct(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[X,$,function(){return[Ut]}],(function(t){return rt(Ut(t.data[0],t.data[1]))}),2,r)}function Ut(t,n){n||(n={});var r=B(),e=t.length;r.p(t);var i=K(t,n,vt(n),8),o=i.length;return ct(i,n),ht(i,o-8,r.d()),ht(i,o-4,e),i}_e.AsyncGzip=Dt,_e.AsyncCompress=Dt,_e.gzip=Ct,_e.compress=Ct,_e.gzipSync=Ut,_e.compressSync=Ut;var Ot=function(){function t(t){this.v=1,zt.call(this,t)}return t.prototype.push=function(t,n){if(zt.prototype.e.call(this,t),this.v){var r=this.p.length>3?lt(this.p):4;if(r>=this.p.length&&!n)return;this.p=this.p.subarray(r),this.v=0}if(n){if(this.p.length<8)throw"invalid gzip stream";this.p=this.p.subarray(0,-8)}zt.prototype.c.call(this,n)},t}();_e.Gunzip=Ot;var Tt=function(){return function(t){this.ondata=t,at([W,_,function(){return[ot,zt,Ot]}],this,0,(function(){var t=new Ot;onmessage=ot(t)}),9)}}();function Zt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[W,_,function(){return[It]}],(function(t){return rt(It(t.data[0]))}),3,r)}function It(t,r){return U(t.subarray(lt(t),-8),r||new n(pt(t)))}_e.AsyncGunzip=Tt,_e.gunzip=Zt,_e.gunzipSync=It;var Ft=function(){function t(t,n){this.c=J(),this.v=1,yt.call(this,t,n)}return t.prototype.push=function(t,n){yt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){this.c.p(t);var r=K(t,this.o,this.v&&2,n&&4,!n);this.v&&(dt(r,this.o),this.v=0),n&&ht(r,r.length-4,this.c.d()),this.ondata(r,n)},t}();_e.Zlib=Ft;var Et=function(){return function(t,n){at([X,tt,function(){return[ot,yt,Ft]}],this,wt.call(this,t,n),(function(t){var n=new Ft(t.data);onmessage=ot(n)}),10)}}();function Gt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[X,tt,function(){return[Pt]}],(function(t){return rt(Pt(t.data[0],t.data[1]))}),4,r)}function Pt(t,n){n||(n={});var r=J();r.p(t);var e=K(t,n,2,4);return dt(e,n),ht(e,e.length-4,r.d()),e}_e.AsyncZlib=Et,_e.zlib=Gt,_e.zlibSync=Pt;var jt=function(){function t(t){this.v=1,zt.call(this,t)}return t.prototype.push=function(t,n){if(zt.prototype.e.call(this,t),this.v){if(this.p.length<2&&!n)return;this.p=this.p.subarray(2),this.v=0}if(n){if(this.p.length<4)throw"invalid zlib stream";this.p=this.p.subarray(0,-4)}zt.prototype.c.call(this,n)},t}();_e.Unzlib=jt;var qt=function(){return function(t){this.ondata=t,at([W,nt,function(){return[ot,zt,jt]}],this,0,(function(){var t=new jt;onmessage=ot(t)}),11)}}();function Ht(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[W,nt,function(){return[Yt]}],(function(t){return rt(Yt(t.data[0],et(t.data[1])))}),5,r)}function Yt(t,n){return U((gt(t),t.subarray(2,-4)),n)}_e.AsyncUnzlib=qt,_e.unzlib=Ht,_e.unzlibSync=Yt;var Bt=function(){function t(t){this.G=Ot,this.I=zt,this.Z=jt,this.ondata=t}return t.prototype.push=function(t,r){if(!this.ondata)throw"no stream handler";if(this.s)this.s.push(t,r);else{if(this.p&&this.p.length){var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length)}else this.p=t;if(this.p.length>2){var i=this,o=function(){i.ondata.apply(i,arguments)};this.s=31==this.p[0]&&139==this.p[1]&&8==this.p[2]?new this.G(o):8!=(15&this.p[0])||this.p[0]>>4>7||(this.p[0]<<8|this.p[1])%31?new this.I(o):new this.Z(o),this.s.push(this.p,r),this.p=null}}},t}();_e.Decompress=Bt;var Jt=function(){function t(t){this.G=Tt,this.I=kt,this.Z=qt,this.ondata=t}return t.prototype.push=function(t,n){Bt.prototype.push.call(this,t,n)},t}();function Kt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return 31==t[0]&&139==t[1]&&8==t[2]?Zt(t,n,r):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?Mt(t,n,r):Ht(t,n,r)}function Lt(t,n){return 31==t[0]&&139==t[1]&&8==t[2]?It(t,n):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?At(t,n):Yt(t,n)}_e.AsyncDecompress=Jt,_e.decompress=Kt,_e.decompressSync=Lt;var Nt=function(t,r,e,i){for(var o in t){var a=t[o],s=r+o;a instanceof n?e[s]=[a,i]:Array.isArray(a)?e[s]=[a[0],L(i,a[1])]:Nt(a,s+"/",e,i)}},Qt="undefined"!=typeof TextEncoder&&new TextEncoder,Rt="undefined"!=typeof TextDecoder&&new TextDecoder,Vt=0;try{Rt.decode(q,{stream:!0}),Vt=1}catch(t){}var Wt=function(t){for(var n="",r=0;;){var e=t[r++],i=(e>127)+(e>223)+(e>239);if(r+i>t.length)return[n,C(t,r-1)];i?3==i?(e=((15&e)<<18|(63&t[r++])<<12|(63&t[r++])<<6|63&t[r++])-65536,n+=String.fromCharCode(55296|e>>10,56320|1023&e)):n+=String.fromCharCode(1&i?(31&e)<<6|63&t[r++]:(15&e)<<12|(63&t[r++])<<6|63&t[r++]):n+=String.fromCharCode(e)}},Xt=function(){function t(t){this.ondata=t,Vt?this.t=new TextDecoder:this.p=q}return t.prototype.push=function(t,r){if(!this.ondata)throw"no callback";if(r=!!r,this.t){if(this.ondata(this.t.decode(t,{stream:!0}),r),r){if(this.t.decode().length)throw"invalid utf-8 data";this.t=null}}else{if(!this.p)throw"stream finished";var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length);var i=Wt(e),o=i[0],a=i[1];if(r){if(a.length)throw"invalid utf-8 data";this.p=null}else this.p=a;this.ondata(o,r)}},t}();_e.DecodeUTF8=Xt;var $t=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){if(!this.ondata)throw"no callback";if(this.d)throw"stream finished";this.ondata(_t(t),this.d=n||!1)},t}();function _t(t,r){if(r){for(var e=new n(t.length),i=0;i<t.length;++i)e[i]=t.charCodeAt(i);return e}if(Qt)return Qt.encode(t);var o=t.length,a=new n(t.length+(t.length>>1)),s=0,f=function(t){a[s++]=t};for(i=0;i<o;++i){if(s+5>a.length){var u=new n(s+8+(o-i<<1));u.set(a),a=u}var h=t.charCodeAt(i);h<128||r?f(h):h<2048?(f(192|h>>6),f(128|63&h)):h>55295&&h<57344?(f(240|(h=65536+(1047552&h)|1023&t.charCodeAt(++i))>>18),f(128|h>>12&63),f(128|h>>6&63),f(128|63&h)):(f(224|h>>12),f(128|h>>6&63),f(128|63&h))}return C(a,0,s)}function tn(t,n){if(n){for(var r="",e=0;e<t.length;e+=16384)r+=String.fromCharCode.apply(null,t.subarray(e,e+16384));return r}if(Rt)return Rt.decode(t);var i=Wt(t);if(i[1].length)throw"invalid utf-8 data";return i[0]}_e.EncodeUTF8=$t,_e.strToU8=_t,_e.strFromU8=tn;var nn=function(t){return 1==t?3:t<6?2:9==t?1:0},rn=function(t,n){return n+30+st(t,n+26)+st(t,n+28)},en=function(t,n,r){var e=st(t,n+28),i=tn(t.subarray(n+46,n+46+e),!(2048&st(t,n+8))),o=n+46+e,a=ft(t,n+20),s=r&&4294967295==a?on(t,o):[a,ft(t,n+24),ft(t,n+42)],f=s[0],u=s[1],h=s[2];return[st(t,n+10),f,u,i,o+st(t,n+30)+st(t,n+32),h]},on=function(t,n){for(;1!=st(t,n);n+=4+st(t,n+2));return[ut(t,n+12),ut(t,n+4),ut(t,n+20)]},an=function(t){var n=0;if(t)for(var r in t){var e=t[r].length;if(e>65535)throw"extra field too long";n+=e+4}return n},sn=function(t,n,r,e,i,o,a,s){var f=e.length,u=r.extra,h=s&&s.length,c=an(u);ht(t,n,null!=a?33639248:67324752),n+=4,null!=a&&(t[n++]=20,t[n++]=r.os),t[n]=20,n+=2,t[n++]=r.flag<<1|(null==o&&8),t[n++]=i&&8,t[n++]=255&r.compression,t[n++]=r.compression>>8;var l=new Date(null==r.mtime?Date.now():r.mtime),p=l.getFullYear()-1980;if(p<0||p>119)throw"date not in range 1980-2099";if(ht(t,n,p<<25|l.getMonth()+1<<21|l.getDate()<<16|l.getHours()<<11|l.getMinutes()<<5|l.getSeconds()>>>1),n+=4,null!=o&&(ht(t,n,r.crc),ht(t,n+4,o),ht(t,n+8,r.size)),ht(t,n+12,f),ht(t,n+14,c),n+=16,null!=a&&(ht(t,n,h),ht(t,n+6,r.attrs),ht(t,n+10,a),n+=14),t.set(e,n),n+=f,c)for(var v in u){var d=u[v],g=d.length;ht(t,n,+v),ht(t,n+2,g),t.set(d,n+4),n+=4+g}return h&&(t.set(s,n),n+=h),n},fn=function(t,n,r,e,i){ht(t,n,101010256),ht(t,n+8,r),ht(t,n+10,r),ht(t,n+12,e),ht(t,n+16,i)},un=function(){function t(t){this.filename=t,this.c=B(),this.size=0,this.compression=0}return t.prototype.process=function(t,n){this.ondata(null,t,n)},t.prototype.push=function(t,n){if(!this.ondata)throw"no callback - add to ZIP archive before pushing";this.c.p(t),this.size+=t.length,n&&(this.crc=this.c.d()),this.process(t,n||!1)},t}();_e.ZipPassThrough=un;var hn=function(){function t(t,n){var r=this;n||(n={}),un.call(this,t),this.d=new yt(n,(function(t,n){r.ondata(null,t,n)})),this.compression=8,this.flag=nn(n.level)}return t.prototype.process=function(t,n){try{this.d.push(t,n)}catch(t){this.ondata(t,null,n)}},t.prototype.push=function(t,n){un.prototype.push.call(this,t,n)},t}();_e.ZipDeflate=hn;var cn=function(){function t(t,n){var r=this;n||(n={}),un.call(this,t),this.d=new mt(n,(function(t,n,e){r.ondata(t,n,e)})),this.compression=8,this.flag=nn(n.level),this.terminate=this.d.terminate}return t.prototype.process=function(t,n){this.d.push(t,n)},t.prototype.push=function(t,n){un.prototype.push.call(this,t,n)},t}();_e.AsyncZipDeflate=cn;var ln=function(){function t(t){this.ondata=t,this.u=[],this.d=1}return t.prototype.add=function(t){var r=this;if(2&this.d)throw"stream finished";var e=_t(t.filename),i=e.length,o=t.comment,a=o&&_t(o),s=i!=t.filename.length||a&&o.length!=a.length,f=i+an(t.extra)+30;if(i>65535)throw"filename too long";var u=new n(f);sn(u,0,t,e,s);var h=[u],c=function(){for(var t=0,n=h;t<n.length;t++)r.ondata(null,n[t],!1);h=[]},l=this.d;this.d=0;var p=this.u.length,v=L(t,{f:e,u:s,o:a,t:function(){t.terminate&&t.terminate()},r:function(){if(c(),l){var t=r.u[p+1];t?t.r():r.d=1}l=1}}),d=0;t.ondata=function(e,i,o){if(e)r.ondata(e,i,o),r.terminate();else if(d+=i.length,h.push(i),o){var a=new n(16);ht(a,0,134695760),ht(a,4,t.crc),ht(a,8,d),ht(a,12,t.size),h.push(a),v.c=d,v.b=f+d+16,v.crc=t.crc,v.size=t.size,l&&v.r(),l=1}else l&&c()},this.u.push(v)},t.prototype.end=function(){var t=this;if(2&this.d){if(1&this.d)throw"stream finishing";throw"stream finished"}this.d?this.e():this.u.push({r:function(){1&t.d&&(t.u.splice(-1,1),t.e())},t:function(){}}),this.d=3},t.prototype.e=function(){for(var t=0,r=0,e=0,i=0,o=this.u;i<o.length;i++)e+=46+(u=o[i]).f.length+an(u.extra)+(u.o?u.o.length:0);for(var a=new n(e+22),s=0,f=this.u;s<f.length;s++){var u;sn(a,t,u=f[s],u.f,u.u,u.c,r,u.o),t+=46+u.f.length+an(u.extra)+(u.o?u.o.length:0),r+=u.b}fn(a,t,this.u.length,e,r),this.ondata(null,a,!0),this.d=2},t.prototype.terminate=function(){for(var t=0,n=this.u;t<n.length;t++)n[t].t();this.d=2},t}();function pn(t,r,e){if(e||(e=r,r={}),"function"!=typeof e)throw"no callback";var i={};Nt(t,"",i,r);var o=Object.keys(i),a=o.length,s=0,f=0,u=a,h=Array(a),c=[],l=function(){for(var t=0;t<c.length;++t)c[t]()},p=function(){var t=new n(f+22),r=s,i=f-s;f=0;for(var o=0;o<u;++o){var a=h[o];try{var c=a.c.length;sn(t,f,a,a.f,a.u,c);var l=30+a.f.length+an(a.extra),p=f+l;t.set(a.c,p),sn(t,s,a,a.f,a.u,c,f,a.m),s+=16+l+(a.m?a.m.length:0),f=p+c}catch(t){return e(t,null)}}fn(t,s,h.length,i,r),e(null,t)};a||p();for(var v=function(t){var n=o[t],r=i[n],u=r[0],v=r[1],d=B(),g=u.length;d.p(u);var w=_t(n),y=w.length,m=v.comment,b=m&&_t(m),x=b&&b.length,z=an(v.extra),k=0==v.level?0:8,M=function(r,i){if(r)l(),e(r,null);else{var o=i.length;h[t]=L(v,{size:g,crc:d.d(),c:i,f:w,m:b,u:y!=n.length||b&&m.length!=x,compression:k}),s+=30+y+z+o,f+=76+2*(y+z)+(x||0)+o,--a||p()}};if(y>65535&&M("filename too long",null),k)if(g<16e4)try{M(null,xt(u,v))}catch(t){M(t,null)}else c.push(bt(u,v,M));else M(null,u)},d=0;d<u;++d)v(d);return l}function vn(t,r){r||(r={});var e={},i=[];Nt(t,"",e,r);var o=0,a=0;for(var s in e){var f=e[s],u=f[0],h=f[1],c=0==h.level?0:8,l=(M=_t(s)).length,p=h.comment,v=p&&_t(p),d=v&&v.length,g=an(h.extra);if(l>65535)throw"filename too long";var w=c?xt(u,h):u,y=w.length,m=B();m.p(u),i.push(L(h,{size:u.length,crc:m.d(),c:w,f:M,m:v,u:l!=s.length||v&&p.length!=d,o:o,compression:c})),o+=30+l+g+y,a+=76+2*(l+g)+(d||0)+y}for(var b=new n(a+22),x=o,z=a-o,k=0;k<i.length;++k){var M;sn(b,(M=i[k]).o,M,M.f,M.u,M.c.length);var A=30+M.f.length+an(M.extra);b.set(M.c,M.o+A),sn(b,o,M,M.f,M.u,M.c.length,M.o,M.m),o+=16+A+(M.m?M.m.length:0)}return fn(b,o,i.length,z,x),b}_e.Zip=ln,_e.zip=pn,_e.zipSync=vn;var dn=function(){function t(){}return t.prototype.push=function(t,n){this.ondata(null,t,n)},t.compression=0,t}();_e.UnzipPassThrough=dn;var gn=function(){function t(){var t=this;this.i=new zt((function(n,r){t.ondata(null,n,r)}))}return t.prototype.push=function(t,n){try{this.i.push(t,n)}catch(r){this.ondata(r,t,n)}},t.compression=8,t}();_e.UnzipInflate=gn;var wn=function(){function t(t,n){var r=this;n<32e4?this.i=new zt((function(t,n){r.ondata(null,t,n)})):(this.i=new kt((function(t,n,e){r.ondata(t,n,e)})),this.terminate=this.i.terminate)}return t.prototype.push=function(t,n){this.i.terminate&&(t=C(t,0)),this.i.push(t,n)},t.compression=8,t}();_e.AsyncUnzipInflate=wn;var yn=function(){function t(t){this.onfile=t,this.k=[],this.o={0:dn},this.p=q}return t.prototype.push=function(t,r){var e=this;if(!this.onfile)throw"no callback";if(!this.p)throw"stream finished";if(this.c>0){var i=Math.min(this.c,t.length),o=t.subarray(0,i);if(this.c-=i,this.d?this.d.push(o,!this.c):this.k[0].push(o),(t=t.subarray(i)).length)return this.push(t,r)}else{var a=0,s=0,f=void 0,u=void 0;this.p.length?t.length?((u=new n(this.p.length+t.length)).set(this.p),u.set(t,this.p.length)):u=this.p:u=t;for(var h=u.length,c=this.c,l=c&&this.d,p=function(){var t,n=ft(u,s);if(67324752==n){a=1,f=s,v.d=null,v.c=0;var r=st(u,s+6),i=st(u,s+8),o=2048&r,l=8&r,p=st(u,s+26),d=st(u,s+28);if(h>s+30+p+d){var g=[];v.k.unshift(g),a=2;var w,y=ft(u,s+18),m=ft(u,s+22),b=tn(u.subarray(s+30,s+=30+p),!o);4294967295==y?(t=l?[-2]:on(u,s),y=t[0],m=t[1]):l&&(y=-1),s+=d,v.c=y;var x={name:b,compression:i,start:function(){if(!x.ondata)throw"no callback";if(y){var t=e.o[i];if(!t)throw"unknown compression type "+i;(w=y<0?new t(b):new t(b,y,m)).ondata=function(t,n,r){x.ondata(t,n,r)};for(var n=0,r=g;n<r.length;n++)w.push(r[n],!1);e.k[0]==g&&e.c?e.d=w:w.push(q,!0)}else x.ondata(null,q,!0)},terminate:function(){w&&w.terminate&&w.terminate()}};y>=0&&(x.size=y,x.originalSize=m),v.onfile(x)}return"break"}if(c){if(134695760==n)return f=s+=12+(-2==c&&8),a=3,v.c=0,"break";if(33639248==n)return f=s-=4,a=3,v.c=0,"break"}},v=this;s<h-4&&"break"!==p();++s);if(this.p=q,c<0){var d=u.subarray(0,a?f-12-(-2==c&&8)-(134695760==ft(u,f-16)&&4):s);l?l.push(d,!!a):this.k[+(2==a)].push(d)}if(2&a)return this.push(u.subarray(s),r);this.p=u.subarray(s)}if(r){if(this.c)throw"invalid zip file";this.p=null}},t.prototype.register=function(t){this.o[t.compression]=t},t}();function mn(t,r){if("function"!=typeof r)throw"no callback";for(var e=[],i=function(){for(var t=0;t<e.length;++t)e[t]()},o={},a=t.length-22;101010256!=ft(t,a);--a)if(!a||t.length-a>65558)return void r("invalid zip file",null);var s=st(t,a+8);s||r(null,{});var f=s,u=ft(t,a+16),h=4294967295==u;if(h){if(a=ft(t,a-12),101075792!=ft(t,a))return void r("invalid zip file",null);f=s=ft(t,a+32),u=ft(t,a+48)}for(var c=function(a){var f=en(t,u,h),c=f[0],l=f[1],p=f[2],v=f[3],d=f[4],g=rn(t,f[5]);u=d;var w=function(t,n){t?(i(),r(t,null)):(o[v]=n,--s||r(null,o))};if(c)if(8==c){var y=t.subarray(g,g+l);if(l<32e4)try{w(null,At(y,new n(p)))}catch(t){w(t,null)}else e.push(Mt(y,{size:p},w))}else w("unknown compression type "+c,null);else w(null,C(t,g,g+l))},l=0;l<f;++l)c();return i}function bn(t){for(var r={},e=t.length-22;101010256!=ft(t,e);--e)if(!e||t.length-e>65558)throw"invalid zip file";var i=st(t,e+8);if(!i)return{};var o=ft(t,e+16),a=4294967295==o;if(a){if(e=ft(t,e-12),101075792!=ft(t,e))throw"invalid zip file";i=ft(t,e+32),o=ft(t,e+48)}for(var s=0;s<i;++s){var f=en(t,o,a),u=f[0],h=f[1],c=f[2],l=f[3],p=f[4],v=rn(t,f[5]);if(o=p,u){if(8!=u)throw"unknown compression type "+u;r[l]=At(t.subarray(v,v+h),new n(c))}else r[l]=C(t,v,v+h)}return r}_e.Unzip=yn,_e.unzip=mn,_e.unzipSync=bn;return _e})

;
( function () {

	/**
 * THREE.Loader loads FBX file and generates THREE.Group representing FBX scene.
 * Requires FBX file to be >= 7.0 and in ASCII or >= 6400 in Binary format
 * Versions lower than this may load but will probably have errors
 *
 * Needs Support:
 *  Morph normals / blend shape normals
 *
 * FBX format references:
 * 	https://wiki.blender.org/index.php/User:Mont29/Foundation/FBX_File_Structure
 * 	http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_index_html (C++ SDK reference)
 *
 * 	Binary format specification:
 *		https://code.blender.org/2013/08/fbx-binary-file-format-specification/
 */

	let fbxTree;
	let connections;
	let sceneGraph;

	class FBXLoader extends THREE.Loader {

		constructor( manager ) {

			super( manager );

		}

		load( url, onLoad, onProgress, onError ) {

			const scope = this;
			const path = scope.path === '' ? THREE.LoaderUtils.extractUrlBase( url ) : scope.path;
			const loader = new THREE.FileLoader( this.manager );
			loader.setPath( scope.path );
			loader.setResponseType( 'arraybuffer' );
			loader.setRequestHeader( scope.requestHeader );
			loader.setWithCredentials( scope.withCredentials );
			loader.load( url, function ( buffer ) {

				try {

					onLoad( scope.parse( buffer, path ) );

				} catch ( e ) {

					if ( onError ) {

						onError( e );

					} else {

						console.error( e );

					}

					scope.manager.itemError( url );

				}

			}, onProgress, onError );

		}

		parse( FBXBuffer, path ) {

			if ( isFbxFormatBinary( FBXBuffer ) ) {

				fbxTree = new BinaryParser().parse( FBXBuffer );

			} else {

				const FBXText = convertArrayBufferToString( FBXBuffer );

				if ( ! isFbxFormatASCII( FBXText ) ) {

					throw new Error( 'THREE.FBXLoader: Unknown format.' );

				}

				if ( getFbxVersion( FBXText ) < 7000 ) {

					throw new Error( 'THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion( FBXText ) );

				}

				fbxTree = new TextParser().parse( FBXText );

			} // console.log( fbxTree );


			const textureLoader = new THREE.TextureLoader( this.manager ).setPath( this.resourcePath || path ).setCrossOrigin( this.crossOrigin );
			return new FBXTreeParser( textureLoader, this.manager ).parse( fbxTree );

		}

	} // Parse the FBXTree object returned by the BinaryParser or TextParser and return a THREE.Group


	class FBXTreeParser {

		constructor( textureLoader, manager ) {

			this.textureLoader = textureLoader;
			this.manager = manager;

		}

		parse() {

			connections = this.parseConnections();
			const images = this.parseImages();
			const textures = this.parseTextures( images );
			const materials = this.parseMaterials( textures );
			const deformers = this.parseDeformers();
			const geometryMap = new GeometryParser().parse( deformers );
			this.parseScene( deformers, geometryMap, materials );
			return sceneGraph;

		} // Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
		// and details the connection type


		parseConnections() {

			const connectionMap = new Map();

			if ( 'Connections' in fbxTree ) {

				const rawConnections = fbxTree.Connections.connections;
				rawConnections.forEach( function ( rawConnection ) {

					const fromID = rawConnection[ 0 ];
					const toID = rawConnection[ 1 ];
					const relationship = rawConnection[ 2 ];

					if ( ! connectionMap.has( fromID ) ) {

						connectionMap.set( fromID, {
							parents: [],
							children: []
						} );

					}

					const parentRelationship = {
						ID: toID,
						relationship: relationship
					};
					connectionMap.get( fromID ).parents.push( parentRelationship );

					if ( ! connectionMap.has( toID ) ) {

						connectionMap.set( toID, {
							parents: [],
							children: []
						} );

					}

					const childRelationship = {
						ID: fromID,
						relationship: relationship
					};
					connectionMap.get( toID ).children.push( childRelationship );

				} );

			}

			return connectionMap;

		} // Parse FBXTree.Objects.Video for embedded image data
		// These images are connected to textures in FBXTree.Objects.Textures
		// via FBXTree.Connections.


		parseImages() {

			const images = {};
			const blobs = {};

			if ( 'Video' in fbxTree.Objects ) {

				const videoNodes = fbxTree.Objects.Video;

				for ( const nodeID in videoNodes ) {

					const videoNode = videoNodes[ nodeID ];
					const id = parseInt( nodeID );
					images[ id ] = videoNode.RelativeFilename || videoNode.Filename; // raw image data is in videoNode.Content

					if ( 'Content' in videoNode ) {

						const arrayBufferContent = videoNode.Content instanceof ArrayBuffer && videoNode.Content.byteLength > 0;
						const base64Content = typeof videoNode.Content === 'string' && videoNode.Content !== '';

						if ( arrayBufferContent || base64Content ) {

							const image = this.parseImage( videoNodes[ nodeID ] );
							blobs[ videoNode.RelativeFilename || videoNode.Filename ] = image;

						}

					}

				}

			}

			for ( const id in images ) {

				const filename = images[ id ];
				if ( blobs[ filename ] !== undefined ) images[ id ] = blobs[ filename ]; else images[ id ] = images[ id ].split( '\\' ).pop();

			}

			return images;

		} // Parse embedded image data in FBXTree.Video.Content


		parseImage( videoNode ) {

			const content = videoNode.Content;
			const fileName = videoNode.RelativeFilename || videoNode.Filename;
			const extension = fileName.slice( fileName.lastIndexOf( '.' ) + 1 ).toLowerCase();
			let type;

			switch ( extension ) {

				case 'bmp':
					type = 'image/bmp';
					break;

				case 'jpg':
				case 'jpeg':
					type = 'image/jpeg';
					break;

				case 'png':
					type = 'image/png';
					break;

				case 'tif':
					type = 'image/tiff';
					break;

				case 'tga':
					if ( this.manager.getHandler( '.tga' ) === null ) {

						console.warn( 'FBXLoader: TGA loader not found, skipping ', fileName );

					}

					type = 'image/tga';
					break;

				default:
					console.warn( 'FBXLoader: Image type "' + extension + '" is not supported.' );
					return;

			}

			if ( typeof content === 'string' ) {

				// ASCII format
				return 'data:' + type + ';base64,' + content;

			} else {

				// Binary Format
				const array = new Uint8Array( content );
				return window.URL.createObjectURL( new Blob( [ array ], {
					type: type
				} ) );

			}

		} // Parse nodes in FBXTree.Objects.Texture
		// These contain details such as UV scaling, cropping, rotation etc and are connected
		// to images in FBXTree.Objects.Video


		parseTextures( images ) {

			const textureMap = new Map();

			if ( 'Texture' in fbxTree.Objects ) {

				const textureNodes = fbxTree.Objects.Texture;

				for ( const nodeID in textureNodes ) {

					const texture = this.parseTexture( textureNodes[ nodeID ], images );
					textureMap.set( parseInt( nodeID ), texture );

				}

			}

			return textureMap;

		} // Parse individual node in FBXTree.Objects.Texture


		parseTexture( textureNode, images ) {

			const texture = this.loadTexture( textureNode, images );
			texture.ID = textureNode.id;
			texture.name = textureNode.attrName;
			const wrapModeU = textureNode.WrapModeU;
			const wrapModeV = textureNode.WrapModeV;
			const valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
			const valueV = wrapModeV !== undefined ? wrapModeV.value : 0; // http://download.autodesk.com/us/fbx/SDKdocs/FBX_SDK_Help/files/fbxsdkref/class_k_fbx_texture.html#889640e63e2e681259ea81061b85143a
			// 0: repeat(default), 1: clamp

			texture.wrapS = valueU === 0 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
			texture.wrapT = valueV === 0 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

			if ( 'Scaling' in textureNode ) {

				const values = textureNode.Scaling.value;
				texture.repeat.x = values[ 0 ];
				texture.repeat.y = values[ 1 ];

			}

			return texture;

		} // load a texture specified as a blob or data URI, or via an external URL using THREE.TextureLoader


		loadTexture( textureNode, images ) {

			let fileName;
			const currentPath = this.textureLoader.path;
			const children = connections.get( textureNode.id ).children;

			if ( children !== undefined && children.length > 0 && images[ children[ 0 ].ID ] !== undefined ) {

				fileName = images[ children[ 0 ].ID ];

				if ( fileName.indexOf( 'blob:' ) === 0 || fileName.indexOf( 'data:' ) === 0 ) {

					this.textureLoader.setPath( undefined );

				}

			}

			let texture;
			const extension = textureNode.FileName.slice( - 3 ).toLowerCase();

			if ( extension === 'tga' ) {

				const loader = this.manager.getHandler( '.tga' );

				if ( loader === null ) {

					console.warn( 'FBXLoader: TGA loader not found, creating placeholder texture for', textureNode.RelativeFilename );
					texture = new THREE.Texture();

				} else {

					texture = loader.load( fileName );

				}

			} else if ( extension === 'psd' ) {

				console.warn( 'FBXLoader: PSD textures are not supported, creating placeholder texture for', textureNode.RelativeFilename );
				texture = new THREE.Texture();

			} else {

				texture = this.textureLoader.load( fileName );

			}

			this.textureLoader.setPath( currentPath );
			return texture;

		} // Parse nodes in FBXTree.Objects.Material


		parseMaterials( textureMap ) {

			const materialMap = new Map();

			if ( 'Material' in fbxTree.Objects ) {

				const materialNodes = fbxTree.Objects.Material;

				for ( const nodeID in materialNodes ) {

					const material = this.parseMaterial( materialNodes[ nodeID ], textureMap );
					if ( material !== null ) materialMap.set( parseInt( nodeID ), material );

				}

			}

			return materialMap;

		} // Parse single node in FBXTree.Objects.Material
		// Materials are connected to texture maps in FBXTree.Objects.Textures
		// FBX format currently only supports Lambert and Phong shading models


		parseMaterial( materialNode, textureMap ) {

			const ID = materialNode.id;
			const name = materialNode.attrName;
			let type = materialNode.ShadingModel; // Case where FBX wraps shading model in property object.

			if ( typeof type === 'object' ) {

				type = type.value;

			} // Ignore unused materials which don't have any connections.


			if ( ! connections.has( ID ) ) return null;
			const parameters = this.parseParameters( materialNode, textureMap, ID );
			let material;

			switch ( type.toLowerCase() ) {

				case 'phong':
					material = new THREE.MeshPhongMaterial();
					break;

				case 'lambert':
					material = new THREE.MeshLambertMaterial();
					break;

				default:
					console.warn( 'THREE.FBXLoader: unknown material type "%s". Defaulting to THREE.MeshPhongMaterial.', type );
					material = new THREE.MeshPhongMaterial();
					break;

			}

			material.setValues( parameters );
			material.name = name;
			return material;

		} // Parse FBX material and return parameters suitable for a three.js material
		// Also parse the texture map and return any textures associated with the material


		parseParameters( materialNode, textureMap, ID ) {

			const parameters = {};

			if ( materialNode.BumpFactor ) {

				parameters.bumpScale = materialNode.BumpFactor.value;

			}

			if ( materialNode.Diffuse ) {

				parameters.color = new THREE.Color().fromArray( materialNode.Diffuse.value );

			} else if ( materialNode.DiffuseColor && ( materialNode.DiffuseColor.type === 'Color' || materialNode.DiffuseColor.type === 'ColorRGB' ) ) {

				// The blender exporter exports diffuse here instead of in materialNode.Diffuse
				parameters.color = new THREE.Color().fromArray( materialNode.DiffuseColor.value );

			}

			if ( materialNode.DisplacementFactor ) {

				parameters.displacementScale = materialNode.DisplacementFactor.value;

			}

			if ( materialNode.Emissive ) {

				parameters.emissive = new THREE.Color().fromArray( materialNode.Emissive.value );

			} else if ( materialNode.EmissiveColor && ( materialNode.EmissiveColor.type === 'Color' || materialNode.EmissiveColor.type === 'ColorRGB' ) ) {

				// The blender exporter exports emissive color here instead of in materialNode.Emissive
				parameters.emissive = new THREE.Color().fromArray( materialNode.EmissiveColor.value );

			}

			if ( materialNode.EmissiveFactor ) {

				parameters.emissiveIntensity = parseFloat( materialNode.EmissiveFactor.value );

			}

			if ( materialNode.Opacity ) {

				parameters.opacity = parseFloat( materialNode.Opacity.value );

			}

			if ( parameters.opacity < 1.0 ) {

				parameters.transparent = true;

			}

			if ( materialNode.ReflectionFactor ) {

				parameters.reflectivity = materialNode.ReflectionFactor.value;

			}

			if ( materialNode.Shininess ) {

				parameters.shininess = materialNode.Shininess.value;

			}

			if ( materialNode.Specular ) {

				parameters.specular = new THREE.Color().fromArray( materialNode.Specular.value );

			} else if ( materialNode.SpecularColor && materialNode.SpecularColor.type === 'Color' ) {

				// The blender exporter exports specular color here instead of in materialNode.Specular
				parameters.specular = new THREE.Color().fromArray( materialNode.SpecularColor.value );

			}

			const scope = this;
			connections.get( ID ).children.forEach( function ( child ) {

				const type = child.relationship;

				switch ( type ) {

					case 'Bump':
						parameters.bumpMap = scope.getTexture( textureMap, child.ID );
						break;

					case 'Maya|TEX_ao_map':
						parameters.aoMap = scope.getTexture( textureMap, child.ID );
						break;

					case 'DiffuseColor':
					case 'Maya|TEX_color_map':
						parameters.map = scope.getTexture( textureMap, child.ID );
						parameters.map.encoding = THREE.sRGBEncoding;
						break;

					case 'DisplacementColor':
						parameters.displacementMap = scope.getTexture( textureMap, child.ID );
						break;

					case 'EmissiveColor':
						parameters.emissiveMap = scope.getTexture( textureMap, child.ID );
						parameters.emissiveMap.encoding = THREE.sRGBEncoding;
						break;

					case 'NormalMap':
					case 'Maya|TEX_normal_map':
						parameters.normalMap = scope.getTexture( textureMap, child.ID );
						break;

					case 'ReflectionColor':
						parameters.envMap = scope.getTexture( textureMap, child.ID );
						parameters.envMap.mapping = THREE.EquirectangularReflectionMapping;
						parameters.envMap.encoding = THREE.sRGBEncoding;
						break;

					case 'SpecularColor':
						parameters.specularMap = scope.getTexture( textureMap, child.ID );
						parameters.specularMap.encoding = THREE.sRGBEncoding;
						break;

					case 'TransparentColor':
					case 'TransparencyFactor':
						parameters.alphaMap = scope.getTexture( textureMap, child.ID );
						parameters.transparent = true;
						break;

					case 'AmbientColor':
					case 'ShininessExponent': // AKA glossiness map

					case 'SpecularFactor': // AKA specularLevel

					case 'VectorDisplacementColor': // NOTE: Seems to be a copy of DisplacementColor

					default:
						console.warn( 'THREE.FBXLoader: %s map is not supported in three.js, skipping texture.', type );
						break;

				}

			} );
			return parameters;

		} // get a texture from the textureMap for use by a material.


		getTexture( textureMap, id ) {

			// if the texture is a layered texture, just use the first layer and issue a warning
			if ( 'LayeredTexture' in fbxTree.Objects && id in fbxTree.Objects.LayeredTexture ) {

				console.warn( 'THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.' );
				id = connections.get( id ).children[ 0 ].ID;

			}

			return textureMap.get( id );

		} // Parse nodes in FBXTree.Objects.Deformer
		// Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
		// Generates map of THREE.Skeleton-like objects for use later when generating and binding skeletons.


		parseDeformers() {

			const skeletons = {};
			const morphTargets = {};

			if ( 'Deformer' in fbxTree.Objects ) {

				const DeformerNodes = fbxTree.Objects.Deformer;

				for ( const nodeID in DeformerNodes ) {

					const deformerNode = DeformerNodes[ nodeID ];
					const relationships = connections.get( parseInt( nodeID ) );

					if ( deformerNode.attrType === 'Skin' ) {

						const skeleton = this.parseSkeleton( relationships, DeformerNodes );
						skeleton.ID = nodeID;
						if ( relationships.parents.length > 1 ) console.warn( 'THREE.FBXLoader: skeleton attached to more than one geometry is not supported.' );
						skeleton.geometryID = relationships.parents[ 0 ].ID;
						skeletons[ nodeID ] = skeleton;

					} else if ( deformerNode.attrType === 'BlendShape' ) {

						const morphTarget = {
							id: nodeID
						};
						morphTarget.rawTargets = this.parseMorphTargets( relationships, DeformerNodes );
						morphTarget.id = nodeID;
						if ( relationships.parents.length > 1 ) console.warn( 'THREE.FBXLoader: morph target attached to more than one geometry is not supported.' );
						morphTargets[ nodeID ] = morphTarget;

					}

				}

			}

			return {
				skeletons: skeletons,
				morphTargets: morphTargets
			};

		} // Parse single nodes in FBXTree.Objects.Deformer
		// The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
		// Each skin node represents a skeleton and each cluster node represents a bone


		parseSkeleton( relationships, deformerNodes ) {

			const rawBones = [];
			relationships.children.forEach( function ( child ) {

				const boneNode = deformerNodes[ child.ID ];
				if ( boneNode.attrType !== 'Cluster' ) return;
				const rawBone = {
					ID: child.ID,
					indices: [],
					weights: [],
					transformLink: new THREE.Matrix4().fromArray( boneNode.TransformLink.a ) // transform: new THREE.Matrix4().fromArray( boneNode.Transform.a ),
					// linkMode: boneNode.Mode,

				};

				if ( 'Indexes' in boneNode ) {

					rawBone.indices = boneNode.Indexes.a;
					rawBone.weights = boneNode.Weights.a;

				}

				rawBones.push( rawBone );

			} );
			return {
				rawBones: rawBones,
				bones: []
			};

		} // The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"


		parseMorphTargets( relationships, deformerNodes ) {

			const rawMorphTargets = [];

			for ( let i = 0; i < relationships.children.length; i ++ ) {

				const child = relationships.children[ i ];
				const morphTargetNode = deformerNodes[ child.ID ];
				const rawMorphTarget = {
					name: morphTargetNode.attrName,
					initialWeight: morphTargetNode.DeformPercent,
					id: morphTargetNode.id,
					fullWeights: morphTargetNode.FullWeights.a
				};
				if ( morphTargetNode.attrType !== 'BlendShapeChannel' ) return;
				rawMorphTarget.geoID = connections.get( parseInt( child.ID ) ).children.filter( function ( child ) {

					return child.relationship === undefined;

				} )[ 0 ].ID;
				rawMorphTargets.push( rawMorphTarget );

			}

			return rawMorphTargets;

		} // create the main THREE.Group() to be returned by the loader


		parseScene( deformers, geometryMap, materialMap ) {

			sceneGraph = new THREE.Group();
			const modelMap = this.parseModels( deformers.skeletons, geometryMap, materialMap );
			const modelNodes = fbxTree.Objects.Model;
			const scope = this;
			modelMap.forEach( function ( model ) {

				const modelNode = modelNodes[ model.ID ];
				scope.setLookAtProperties( model, modelNode );
				const parentConnections = connections.get( model.ID ).parents;
				parentConnections.forEach( function ( connection ) {

					const parent = modelMap.get( connection.ID );
					if ( parent !== undefined ) parent.add( model );

				} );

				if ( model.parent === null ) {

					sceneGraph.add( model );

				}

			} );
			this.bindSkeleton( deformers.skeletons, geometryMap, modelMap );
			this.createAmbientLight();
			this.setupMorphMaterials();
			sceneGraph.traverse( function ( node ) {

				if ( node.userData.transformData ) {

					if ( node.parent ) {

						node.userData.transformData.parentMatrix = node.parent.matrix;
						node.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;

					}

					const transform = generateTransform( node.userData.transformData );
					node.applyMatrix4( transform );
					node.updateWorldMatrix();

				}

			} );
			const animations = new AnimationParser().parse(); // if all the models where already combined in a single group, just return that

			if ( sceneGraph.children.length === 1 && sceneGraph.children[ 0 ].isGroup ) {

				sceneGraph.children[ 0 ].animations = animations;
				sceneGraph = sceneGraph.children[ 0 ];

			}

			sceneGraph.animations = animations;

		} // parse nodes in FBXTree.Objects.Model


		parseModels( skeletons, geometryMap, materialMap ) {

			const modelMap = new Map();
			const modelNodes = fbxTree.Objects.Model;

			for ( const nodeID in modelNodes ) {

				const id = parseInt( nodeID );
				const node = modelNodes[ nodeID ];
				const relationships = connections.get( id );
				let model = this.buildSkeleton( relationships, skeletons, id, node.attrName );

				if ( ! model ) {

					switch ( node.attrType ) {

						case 'Camera':
							model = this.createCamera( relationships );
							break;

						case 'Light':
							model = this.createLight( relationships );
							break;

						case 'Mesh':
							model = this.createMesh( relationships, geometryMap, materialMap );
							break;

						case 'NurbsCurve':
							model = this.createCurve( relationships, geometryMap );
							break;

						case 'LimbNode':
						case 'Root':
							model = new THREE.Bone();
							break;

						case 'Null':
						default:
							model = new THREE.Group();
							break;

					}

					model.name = node.attrName ? THREE.PropertyBinding.sanitizeNodeName( node.attrName ) : '';
					model.ID = id;

				}

				this.getTransformData( model, node );
				modelMap.set( id, model );

			}

			return modelMap;

		}

		buildSkeleton( relationships, skeletons, id, name ) {

			let bone = null;
			relationships.parents.forEach( function ( parent ) {

				for ( const ID in skeletons ) {

					const skeleton = skeletons[ ID ];
					skeleton.rawBones.forEach( function ( rawBone, i ) {

						if ( rawBone.ID === parent.ID ) {

							const subBone = bone;
							bone = new THREE.Bone();
							bone.matrixWorld.copy( rawBone.transformLink ); // set name and id here - otherwise in cases where "subBone" is created it will not have a name / id

							bone.name = name ? THREE.PropertyBinding.sanitizeNodeName( name ) : '';
							bone.ID = id;
							skeleton.bones[ i ] = bone; // In cases where a bone is shared between multiple meshes
							// duplicate the bone here and and it as a child of the first bone

							if ( subBone !== null ) {

								bone.add( subBone );

							}

						}

					} );

				}

			} );
			return bone;

		} // create a THREE.PerspectiveCamera or THREE.OrthographicCamera


		createCamera( relationships ) {

			let model;
			let cameraAttribute;
			relationships.children.forEach( function ( child ) {

				const attr = fbxTree.Objects.NodeAttribute[ child.ID ];

				if ( attr !== undefined ) {

					cameraAttribute = attr;

				}

			} );

			if ( cameraAttribute === undefined ) {

				model = new THREE.Object3D();

			} else {

				let type = 0;

				if ( cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1 ) {

					type = 1;

				}

				let nearClippingPlane = 1;

				if ( cameraAttribute.NearPlane !== undefined ) {

					nearClippingPlane = cameraAttribute.NearPlane.value / 1000;

				}

				let farClippingPlane = 1000;

				if ( cameraAttribute.FarPlane !== undefined ) {

					farClippingPlane = cameraAttribute.FarPlane.value / 1000;

				}

				let width = window.innerWidth;
				let height = window.innerHeight;

				if ( cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined ) {

					width = cameraAttribute.AspectWidth.value;
					height = cameraAttribute.AspectHeight.value;

				}

				const aspect = width / height;
				let fov = 45;

				if ( cameraAttribute.FieldOfView !== undefined ) {

					fov = cameraAttribute.FieldOfView.value;

				}

				const focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;

				switch ( type ) {

					case 0:
						// Perspective
						model = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );
						if ( focalLength !== null ) model.setFocalLength( focalLength );
						break;

					case 1:
						// Orthographic
						model = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, nearClippingPlane, farClippingPlane );
						break;

					default:
						console.warn( 'THREE.FBXLoader: Unknown camera type ' + type + '.' );
						model = new THREE.Object3D();
						break;

				}

			}

			return model;

		} // Create a THREE.DirectionalLight, THREE.PointLight or THREE.SpotLight


		createLight( relationships ) {

			let model;
			let lightAttribute;
			relationships.children.forEach( function ( child ) {

				const attr = fbxTree.Objects.NodeAttribute[ child.ID ];

				if ( attr !== undefined ) {

					lightAttribute = attr;

				}

			} );

			if ( lightAttribute === undefined ) {

				model = new THREE.Object3D();

			} else {

				let type; // LightType can be undefined for Point lights

				if ( lightAttribute.LightType === undefined ) {

					type = 0;

				} else {

					type = lightAttribute.LightType.value;

				}

				let color = 0xffffff;

				if ( lightAttribute.Color !== undefined ) {

					color = new THREE.Color().fromArray( lightAttribute.Color.value );

				}

				let intensity = lightAttribute.Intensity === undefined ? 1 : lightAttribute.Intensity.value / 100; // light disabled

				if ( lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0 ) {

					intensity = 0;

				}

				let distance = 0;

				if ( lightAttribute.FarAttenuationEnd !== undefined ) {

					if ( lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0 ) {

						distance = 0;

					} else {

						distance = lightAttribute.FarAttenuationEnd.value;

					}

				} // TODO: could this be calculated linearly from FarAttenuationStart to FarAttenuationEnd?


				const decay = 1;

				switch ( type ) {

					case 0:
						// Point
						model = new THREE.PointLight( color, intensity, distance, decay );
						break;

					case 1:
						// Directional
						model = new THREE.DirectionalLight( color, intensity );
						break;

					case 2:
						// Spot
						let angle = Math.PI / 3;

						if ( lightAttribute.InnerAngle !== undefined ) {

							angle = THREE.MathUtils.degToRad( lightAttribute.InnerAngle.value );

						}

						let penumbra = 0;

						if ( lightAttribute.OuterAngle !== undefined ) {

							// TODO: this is not correct - FBX calculates outer and inner angle in degrees
							// with OuterAngle > InnerAngle && OuterAngle <= Math.PI
							// while three.js uses a penumbra between (0, 1) to attenuate the inner angle
							penumbra = THREE.MathUtils.degToRad( lightAttribute.OuterAngle.value );
							penumbra = Math.max( penumbra, 1 );

						}

						model = new THREE.SpotLight( color, intensity, distance, angle, penumbra, decay );
						break;

					default:
						console.warn( 'THREE.FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a THREE.PointLight.' );
						model = new THREE.PointLight( color, intensity );
						break;

				}

				if ( lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1 ) {

					model.castShadow = true;

				}

			}

			return model;

		}

		createMesh( relationships, geometryMap, materialMap ) {

			let model;
			let geometry = null;
			let material = null;
			const materials = []; // get geometry and materials(s) from connections

			relationships.children.forEach( function ( child ) {

				if ( geometryMap.has( child.ID ) ) {

					geometry = geometryMap.get( child.ID );

				}

				if ( materialMap.has( child.ID ) ) {

					materials.push( materialMap.get( child.ID ) );

				}

			} );

			if ( materials.length > 1 ) {

				material = materials;

			} else if ( materials.length > 0 ) {

				material = materials[ 0 ];

			} else {

				material = new THREE.MeshPhongMaterial( {
					color: 0xcccccc
				} );
				materials.push( material );

			}

			if ( 'color' in geometry.attributes ) {

				materials.forEach( function ( material ) {

					material.vertexColors = true;

				} );

			}

			if ( geometry.FBX_Deformer ) {

				materials.forEach( function ( material ) {

					material.skinning = true;

				} );
				model = new THREE.SkinnedMesh( geometry, material );
				model.normalizeSkinWeights();

			} else {

				model = new THREE.Mesh( geometry, material );

			}

			return model;

		}

		createCurve( relationships, geometryMap ) {

			const geometry = relationships.children.reduce( function ( geo, child ) {

				if ( geometryMap.has( child.ID ) ) geo = geometryMap.get( child.ID );
				return geo;

			}, null ); // FBX does not list materials for Nurbs lines, so we'll just put our own in here.

			const material = new THREE.LineBasicMaterial( {
				color: 0x3300ff,
				linewidth: 1
			} );
			return new THREE.Line( geometry, material );

		} // parse the model node for transform data


		getTransformData( model, modelNode ) {

			const transformData = {};
			if ( 'InheritType' in modelNode ) transformData.inheritType = parseInt( modelNode.InheritType.value );
			if ( 'RotationOrder' in modelNode ) transformData.eulerOrder = getEulerOrder( modelNode.RotationOrder.value ); else transformData.eulerOrder = 'ZYX';
			if ( 'Lcl_Translation' in modelNode ) transformData.translation = modelNode.Lcl_Translation.value;
			if ( 'PreRotation' in modelNode ) transformData.preRotation = modelNode.PreRotation.value;
			if ( 'Lcl_Rotation' in modelNode ) transformData.rotation = modelNode.Lcl_Rotation.value;
			if ( 'PostRotation' in modelNode ) transformData.postRotation = modelNode.PostRotation.value;
			if ( 'Lcl_Scaling' in modelNode ) transformData.scale = modelNode.Lcl_Scaling.value;
			if ( 'ScalingOffset' in modelNode ) transformData.scalingOffset = modelNode.ScalingOffset.value;
			if ( 'ScalingPivot' in modelNode ) transformData.scalingPivot = modelNode.ScalingPivot.value;
			if ( 'RotationOffset' in modelNode ) transformData.rotationOffset = modelNode.RotationOffset.value;
			if ( 'RotationPivot' in modelNode ) transformData.rotationPivot = modelNode.RotationPivot.value;
			model.userData.transformData = transformData;

		}

		setLookAtProperties( model, modelNode ) {

			if ( 'LookAtProperty' in modelNode ) {

				const children = connections.get( model.ID ).children;
				children.forEach( function ( child ) {

					if ( child.relationship === 'LookAtProperty' ) {

						const lookAtTarget = fbxTree.Objects.Model[ child.ID ];

						if ( 'Lcl_Translation' in lookAtTarget ) {

							const pos = lookAtTarget.Lcl_Translation.value; // THREE.DirectionalLight, THREE.SpotLight

							if ( model.target !== undefined ) {

								model.target.position.fromArray( pos );
								sceneGraph.add( model.target );

							} else {

								// Cameras and other Object3Ds
								model.lookAt( new THREE.Vector3().fromArray( pos ) );

							}

						}

					}

				} );

			}

		}

		bindSkeleton( skeletons, geometryMap, modelMap ) {

			const bindMatrices = this.parsePoseNodes();

			for ( const ID in skeletons ) {

				const skeleton = skeletons[ ID ];
				const parents = connections.get( parseInt( skeleton.ID ) ).parents;
				parents.forEach( function ( parent ) {

					if ( geometryMap.has( parent.ID ) ) {

						const geoID = parent.ID;
						const geoRelationships = connections.get( geoID );
						geoRelationships.parents.forEach( function ( geoConnParent ) {

							if ( modelMap.has( geoConnParent.ID ) ) {

								const model = modelMap.get( geoConnParent.ID );
								model.bind( new THREE.Skeleton( skeleton.bones ), bindMatrices[ geoConnParent.ID ] );

							}

						} );

					}

				} );

			}

		}

		parsePoseNodes() {

			const bindMatrices = {};

			if ( 'Pose' in fbxTree.Objects ) {

				const BindPoseNode = fbxTree.Objects.Pose;

				for ( const nodeID in BindPoseNode ) {

					if ( BindPoseNode[ nodeID ].attrType === 'BindPose' ) {

						const poseNodes = BindPoseNode[ nodeID ].PoseNode;

						if ( Array.isArray( poseNodes ) ) {

							poseNodes.forEach( function ( poseNode ) {

								bindMatrices[ poseNode.Node ] = new THREE.Matrix4().fromArray( poseNode.Matrix.a );

							} );

						} else {

							bindMatrices[ poseNodes.Node ] = new THREE.Matrix4().fromArray( poseNodes.Matrix.a );

						}

					}

				}

			}

			return bindMatrices;

		} // Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light


		createAmbientLight() {

			if ( 'GlobalSettings' in fbxTree && 'AmbientColor' in fbxTree.GlobalSettings ) {

				const ambientColor = fbxTree.GlobalSettings.AmbientColor.value;
				const r = ambientColor[ 0 ];
				const g = ambientColor[ 1 ];
				const b = ambientColor[ 2 ];

				if ( r !== 0 || g !== 0 || b !== 0 ) {

					const color = new THREE.Color( r, g, b );
					sceneGraph.add( new THREE.AmbientLight( color, 1 ) );

				}

			}

		}

		setupMorphMaterials() {

			const scope = this;
			sceneGraph.traverse( function ( child ) {

				if ( child.isMesh ) {

					if ( child.geometry.morphAttributes.position && child.geometry.morphAttributes.position.length ) {

						if ( Array.isArray( child.material ) ) {

							child.material.forEach( function ( material, i ) {

								scope.setupMorphMaterial( child, material, i );

							} );

						} else {

							scope.setupMorphMaterial( child, child.material );

						}

					}

				}

			} );

		}

		setupMorphMaterial( child, material, index ) {

			const uuid = child.uuid;
			const matUuid = material.uuid; // if a geometry has morph targets, it cannot share the material with other geometries

			let sharedMat = false;
			sceneGraph.traverse( function ( node ) {

				if ( node.isMesh ) {

					if ( Array.isArray( node.material ) ) {

						node.material.forEach( function ( mat ) {

							if ( mat.uuid === matUuid && node.uuid !== uuid ) sharedMat = true;

						} );

					} else if ( node.material.uuid === matUuid && node.uuid !== uuid ) sharedMat = true;

				}

			} );

			if ( sharedMat === true ) {

				const clonedMat = material.clone();
				clonedMat.morphTargets = true;
				if ( index === undefined ) child.material = clonedMat; else child.material[ index ] = clonedMat;

			} else material.morphTargets = true;

		}

	} // parse Geometry data from FBXTree and return map of BufferGeometries


	class GeometryParser {

		// Parse nodes in FBXTree.Objects.Geometry
		parse( deformers ) {

			const geometryMap = new Map();

			if ( 'Geometry' in fbxTree.Objects ) {

				const geoNodes = fbxTree.Objects.Geometry;

				for ( const nodeID in geoNodes ) {

					const relationships = connections.get( parseInt( nodeID ) );
					const geo = this.parseGeometry( relationships, geoNodes[ nodeID ], deformers );
					geometryMap.set( parseInt( nodeID ), geo );

				}

			}

			return geometryMap;

		} // Parse single node in FBXTree.Objects.Geometry


		parseGeometry( relationships, geoNode, deformers ) {

			switch ( geoNode.attrType ) {

				case 'Mesh':
					return this.parseMeshGeometry( relationships, geoNode, deformers );
					break;

				case 'NurbsCurve':
					return this.parseNurbsGeometry( geoNode );
					break;

			}

		} // Parse single node mesh geometry in FBXTree.Objects.Geometry


		parseMeshGeometry( relationships, geoNode, deformers ) {

			const skeletons = deformers.skeletons;
			const morphTargets = [];
			const modelNodes = relationships.parents.map( function ( parent ) {

				return fbxTree.Objects.Model[ parent.ID ];

			} ); // don't create geometry if it is not associated with any models

			if ( modelNodes.length === 0 ) return;
			const skeleton = relationships.children.reduce( function ( skeleton, child ) {

				if ( skeletons[ child.ID ] !== undefined ) skeleton = skeletons[ child.ID ];
				return skeleton;

			}, null );
			relationships.children.forEach( function ( child ) {

				if ( deformers.morphTargets[ child.ID ] !== undefined ) {

					morphTargets.push( deformers.morphTargets[ child.ID ] );

				}

			} ); // Assume one model and get the preRotation from that
			// if there is more than one model associated with the geometry this may cause problems

			const modelNode = modelNodes[ 0 ];
			const transformData = {};
			if ( 'RotationOrder' in modelNode ) transformData.eulerOrder = getEulerOrder( modelNode.RotationOrder.value );
			if ( 'InheritType' in modelNode ) transformData.inheritType = parseInt( modelNode.InheritType.value );
			if ( 'GeometricTranslation' in modelNode ) transformData.translation = modelNode.GeometricTranslation.value;
			if ( 'GeometricRotation' in modelNode ) transformData.rotation = modelNode.GeometricRotation.value;
			if ( 'GeometricScaling' in modelNode ) transformData.scale = modelNode.GeometricScaling.value;
			const transform = generateTransform( transformData );
			return this.genGeometry( geoNode, skeleton, morphTargets, transform );

		} // Generate a THREE.BufferGeometry from a node in FBXTree.Objects.Geometry


		genGeometry( geoNode, skeleton, morphTargets, preTransform ) {

			const geo = new THREE.BufferGeometry();
			if ( geoNode.attrName ) geo.name = geoNode.attrName;
			const geoInfo = this.parseGeoNode( geoNode, skeleton );
			const buffers = this.genBuffers( geoInfo );
			const positionAttribute = new THREE.Float32BufferAttribute( buffers.vertex, 3 );
			positionAttribute.applyMatrix4( preTransform );
			geo.setAttribute( 'position', positionAttribute );

			if ( buffers.colors.length > 0 ) {

				geo.setAttribute( 'color', new THREE.Float32BufferAttribute( buffers.colors, 3 ) );

			}

			if ( skeleton ) {

				geo.setAttribute( 'skinIndex', new THREE.Uint16BufferAttribute( buffers.weightsIndices, 4 ) );
				geo.setAttribute( 'skinWeight', new THREE.Float32BufferAttribute( buffers.vertexWeights, 4 ) ); // used later to bind the skeleton to the model

				geo.FBX_Deformer = skeleton;

			}

			if ( buffers.normal.length > 0 ) {

				const normalMatrix = new THREE.Matrix3().getNormalMatrix( preTransform );
				const normalAttribute = new THREE.Float32BufferAttribute( buffers.normal, 3 );
				normalAttribute.applyNormalMatrix( normalMatrix );
				geo.setAttribute( 'normal', normalAttribute );

			}

			buffers.uvs.forEach( function ( uvBuffer, i ) {

				// subsequent uv buffers are called 'uv1', 'uv2', ...
				let name = 'uv' + ( i + 1 ).toString(); // the first uv buffer is just called 'uv'

				if ( i === 0 ) {

					name = 'uv';

				}

				geo.setAttribute( name, new THREE.Float32BufferAttribute( buffers.uvs[ i ], 2 ) );

			} );

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				// Convert the material indices of each vertex into rendering groups on the geometry.
				let prevMaterialIndex = buffers.materialIndex[ 0 ];
				let startIndex = 0;
				buffers.materialIndex.forEach( function ( currentIndex, i ) {

					if ( currentIndex !== prevMaterialIndex ) {

						geo.addGroup( startIndex, i - startIndex, prevMaterialIndex );
						prevMaterialIndex = currentIndex;
						startIndex = i;

					}

				} ); // the loop above doesn't add the last group, do that here.

				if ( geo.groups.length > 0 ) {

					const lastGroup = geo.groups[ geo.groups.length - 1 ];
					const lastIndex = lastGroup.start + lastGroup.count;

					if ( lastIndex !== buffers.materialIndex.length ) {

						geo.addGroup( lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex );

					}

				} // case where there are multiple materials but the whole geometry is only
				// using one of them


				if ( geo.groups.length === 0 ) {

					geo.addGroup( 0, buffers.materialIndex.length, buffers.materialIndex[ 0 ] );

				}

			}

			this.addMorphTargets( geo, geoNode, morphTargets, preTransform );
			return geo;

		}

		parseGeoNode( geoNode, skeleton ) {

			const geoInfo = {};
			geoInfo.vertexPositions = geoNode.Vertices !== undefined ? geoNode.Vertices.a : [];
			geoInfo.vertexIndices = geoNode.PolygonVertexIndex !== undefined ? geoNode.PolygonVertexIndex.a : [];

			if ( geoNode.LayerElementColor ) {

				geoInfo.color = this.parseVertexColors( geoNode.LayerElementColor[ 0 ] );

			}

			if ( geoNode.LayerElementMaterial ) {

				geoInfo.material = this.parseMaterialIndices( geoNode.LayerElementMaterial[ 0 ] );

			}

			if ( geoNode.LayerElementNormal ) {

				geoInfo.normal = this.parseNormals( geoNode.LayerElementNormal[ 0 ] );

			}

			if ( geoNode.LayerElementUV ) {

				geoInfo.uv = [];
				let i = 0;

				while ( geoNode.LayerElementUV[ i ] ) {

					if ( geoNode.LayerElementUV[ i ].UV ) {

						geoInfo.uv.push( this.parseUVs( geoNode.LayerElementUV[ i ] ) );

					}

					i ++;

				}

			}

			geoInfo.weightTable = {};

			if ( skeleton !== null ) {

				geoInfo.skeleton = skeleton;
				skeleton.rawBones.forEach( function ( rawBone, i ) {

					// loop over the bone's vertex indices and weights
					rawBone.indices.forEach( function ( index, j ) {

						if ( geoInfo.weightTable[ index ] === undefined ) geoInfo.weightTable[ index ] = [];
						geoInfo.weightTable[ index ].push( {
							id: i,
							weight: rawBone.weights[ j ]
						} );

					} );

				} );

			}

			return geoInfo;

		}

		genBuffers( geoInfo ) {

			const buffers = {
				vertex: [],
				normal: [],
				colors: [],
				uvs: [],
				materialIndex: [],
				vertexWeights: [],
				weightsIndices: []
			};
			let polygonIndex = 0;
			let faceLength = 0;
			let displayedWeightsWarning = false; // these will hold data for a single face

			let facePositionIndexes = [];
			let faceNormals = [];
			let faceColors = [];
			let faceUVs = [];
			let faceWeights = [];
			let faceWeightIndices = [];
			const scope = this;
			geoInfo.vertexIndices.forEach( function ( vertexIndex, polygonVertexIndex ) {

				let materialIndex;
				let endOfFace = false; // Face index and vertex index arrays are combined in a single array
				// A cube with quad faces looks like this:
				// PolygonVertexIndex: *24 {
				//  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
				//  }
				// Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
				// to find index of last vertex bit shift the index: ^ - 1

				if ( vertexIndex < 0 ) {

					vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1

					endOfFace = true;

				}

				let weightIndices = [];
				let weights = [];
				facePositionIndexes.push( vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2 );

				if ( geoInfo.color ) {

					const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );
					faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );

				}

				if ( geoInfo.skeleton ) {

					if ( geoInfo.weightTable[ vertexIndex ] !== undefined ) {

						geoInfo.weightTable[ vertexIndex ].forEach( function ( wt ) {

							weights.push( wt.weight );
							weightIndices.push( wt.id );

						} );

					}

					if ( weights.length > 4 ) {

						if ( ! displayedWeightsWarning ) {

							console.warn( 'THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.' );
							displayedWeightsWarning = true;

						}

						const wIndex = [ 0, 0, 0, 0 ];
						const Weight = [ 0, 0, 0, 0 ];
						weights.forEach( function ( weight, weightIndex ) {

							let currentWeight = weight;
							let currentIndex = weightIndices[ weightIndex ];
							Weight.forEach( function ( comparedWeight, comparedWeightIndex, comparedWeightArray ) {

								if ( currentWeight > comparedWeight ) {

									comparedWeightArray[ comparedWeightIndex ] = currentWeight;
									currentWeight = comparedWeight;
									const tmp = wIndex[ comparedWeightIndex ];
									wIndex[ comparedWeightIndex ] = currentIndex;
									currentIndex = tmp;

								}

							} );

						} );
						weightIndices = wIndex;
						weights = Weight;

					} // if the weight array is shorter than 4 pad with 0s


					while ( weights.length < 4 ) {

						weights.push( 0 );
						weightIndices.push( 0 );

					}

					for ( let i = 0; i < 4; ++ i ) {

						faceWeights.push( weights[ i ] );
						faceWeightIndices.push( weightIndices[ i ] );

					}

				}

				if ( geoInfo.normal ) {

					const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal );
					faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

				}

				if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

					materialIndex = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material )[ 0 ];

				}

				if ( geoInfo.uv ) {

					geoInfo.uv.forEach( function ( uv, i ) {

						const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, uv );

						if ( faceUVs[ i ] === undefined ) {

							faceUVs[ i ] = [];

						}

						faceUVs[ i ].push( data[ 0 ] );
						faceUVs[ i ].push( data[ 1 ] );

					} );

				}

				faceLength ++;

				if ( endOfFace ) {

					scope.genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength );
					polygonIndex ++;
					faceLength = 0; // reset arrays for the next face

					facePositionIndexes = [];
					faceNormals = [];
					faceColors = [];
					faceUVs = [];
					faceWeights = [];
					faceWeightIndices = [];

				}

			} );
			return buffers;

		} // Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris


		genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength ) {

			for ( let i = 2; i < faceLength; i ++ ) {

				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 0 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 1 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 2 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 1 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 2 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 1 ] ] );
				buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 2 ] ] );

				if ( geoInfo.skeleton ) {

					buffers.vertexWeights.push( faceWeights[ 0 ] );
					buffers.vertexWeights.push( faceWeights[ 1 ] );
					buffers.vertexWeights.push( faceWeights[ 2 ] );
					buffers.vertexWeights.push( faceWeights[ 3 ] );
					buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 ] );
					buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 1 ] );
					buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 2 ] );
					buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 3 ] );
					buffers.vertexWeights.push( faceWeights[ i * 4 ] );
					buffers.vertexWeights.push( faceWeights[ i * 4 + 1 ] );
					buffers.vertexWeights.push( faceWeights[ i * 4 + 2 ] );
					buffers.vertexWeights.push( faceWeights[ i * 4 + 3 ] );
					buffers.weightsIndices.push( faceWeightIndices[ 0 ] );
					buffers.weightsIndices.push( faceWeightIndices[ 1 ] );
					buffers.weightsIndices.push( faceWeightIndices[ 2 ] );
					buffers.weightsIndices.push( faceWeightIndices[ 3 ] );
					buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 ] );
					buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 1 ] );
					buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 2 ] );
					buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 3 ] );
					buffers.weightsIndices.push( faceWeightIndices[ i * 4 ] );
					buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 1 ] );
					buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 2 ] );
					buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 3 ] );

				}

				if ( geoInfo.color ) {

					buffers.colors.push( faceColors[ 0 ] );
					buffers.colors.push( faceColors[ 1 ] );
					buffers.colors.push( faceColors[ 2 ] );
					buffers.colors.push( faceColors[ ( i - 1 ) * 3 ] );
					buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
					buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 2 ] );
					buffers.colors.push( faceColors[ i * 3 ] );
					buffers.colors.push( faceColors[ i * 3 + 1 ] );
					buffers.colors.push( faceColors[ i * 3 + 2 ] );

				}

				if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

					buffers.materialIndex.push( materialIndex );
					buffers.materialIndex.push( materialIndex );
					buffers.materialIndex.push( materialIndex );

				}

				if ( geoInfo.normal ) {

					buffers.normal.push( faceNormals[ 0 ] );
					buffers.normal.push( faceNormals[ 1 ] );
					buffers.normal.push( faceNormals[ 2 ] );
					buffers.normal.push( faceNormals[ ( i - 1 ) * 3 ] );
					buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 1 ] );
					buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 2 ] );
					buffers.normal.push( faceNormals[ i * 3 ] );
					buffers.normal.push( faceNormals[ i * 3 + 1 ] );
					buffers.normal.push( faceNormals[ i * 3 + 2 ] );

				}

				if ( geoInfo.uv ) {

					geoInfo.uv.forEach( function ( uv, j ) {

						if ( buffers.uvs[ j ] === undefined ) buffers.uvs[ j ] = [];
						buffers.uvs[ j ].push( faceUVs[ j ][ 0 ] );
						buffers.uvs[ j ].push( faceUVs[ j ][ 1 ] );
						buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 ] );
						buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 + 1 ] );
						buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 ] );
						buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 + 1 ] );

					} );

				}

			}

		}

		addMorphTargets( parentGeo, parentGeoNode, morphTargets, preTransform ) {

			if ( morphTargets.length === 0 ) return;
			parentGeo.morphTargetsRelative = true;
			parentGeo.morphAttributes.position = []; // parentGeo.morphAttributes.normal = []; // not implemented

			const scope = this;
			morphTargets.forEach( function ( morphTarget ) {

				morphTarget.rawTargets.forEach( function ( rawTarget ) {

					const morphGeoNode = fbxTree.Objects.Geometry[ rawTarget.geoID ];

					if ( morphGeoNode !== undefined ) {

						scope.genMorphGeometry( parentGeo, parentGeoNode, morphGeoNode, preTransform, rawTarget.name );

					}

				} );

			} );

		} // a morph geometry node is similar to a standard  node, and the node is also contained
		// in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
		// and a special attribute Index defining which vertices of the original geometry are affected
		// Normal and position attributes only have data for the vertices that are affected by the morph


		genMorphGeometry( parentGeo, parentGeoNode, morphGeoNode, preTransform, name ) {

			const vertexIndices = parentGeoNode.PolygonVertexIndex !== undefined ? parentGeoNode.PolygonVertexIndex.a : [];
			const morphPositionsSparse = morphGeoNode.Vertices !== undefined ? morphGeoNode.Vertices.a : [];
			const indices = morphGeoNode.Indexes !== undefined ? morphGeoNode.Indexes.a : [];
			const length = parentGeo.attributes.position.count * 3;
			const morphPositions = new Float32Array( length );

			for ( let i = 0; i < indices.length; i ++ ) {

				const morphIndex = indices[ i ] * 3;
				morphPositions[ morphIndex ] = morphPositionsSparse[ i * 3 ];
				morphPositions[ morphIndex + 1 ] = morphPositionsSparse[ i * 3 + 1 ];
				morphPositions[ morphIndex + 2 ] = morphPositionsSparse[ i * 3 + 2 ];

			} // TODO: add morph normal support


			const morphGeoInfo = {
				vertexIndices: vertexIndices,
				vertexPositions: morphPositions
			};
			const morphBuffers = this.genBuffers( morphGeoInfo );
			const positionAttribute = new THREE.Float32BufferAttribute( morphBuffers.vertex, 3 );
			positionAttribute.name = name || morphGeoNode.attrName;
			positionAttribute.applyMatrix4( preTransform );
			parentGeo.morphAttributes.position.push( positionAttribute );

		} // Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists


		parseNormals( NormalNode ) {

			const mappingType = NormalNode.MappingInformationType;
			const referenceType = NormalNode.ReferenceInformationType;
			const buffer = NormalNode.Normals.a;
			let indexBuffer = [];

			if ( referenceType === 'IndexToDirect' ) {

				if ( 'NormalIndex' in NormalNode ) {

					indexBuffer = NormalNode.NormalIndex.a;

				} else if ( 'NormalsIndex' in NormalNode ) {

					indexBuffer = NormalNode.NormalsIndex.a;

				}

			}

			return {
				dataSize: 3,
				buffer: buffer,
				indices: indexBuffer,
				mappingType: mappingType,
				referenceType: referenceType
			};

		} // Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists


		parseUVs( UVNode ) {

			const mappingType = UVNode.MappingInformationType;
			const referenceType = UVNode.ReferenceInformationType;
			const buffer = UVNode.UV.a;
			let indexBuffer = [];

			if ( referenceType === 'IndexToDirect' ) {

				indexBuffer = UVNode.UVIndex.a;

			}

			return {
				dataSize: 2,
				buffer: buffer,
				indices: indexBuffer,
				mappingType: mappingType,
				referenceType: referenceType
			};

		} // Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists


		parseVertexColors( ColorNode ) {

			const mappingType = ColorNode.MappingInformationType;
			const referenceType = ColorNode.ReferenceInformationType;
			const buffer = ColorNode.Colors.a;
			let indexBuffer = [];

			if ( referenceType === 'IndexToDirect' ) {

				indexBuffer = ColorNode.ColorIndex.a;

			}

			return {
				dataSize: 4,
				buffer: buffer,
				indices: indexBuffer,
				mappingType: mappingType,
				referenceType: referenceType
			};

		} // Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists


		parseMaterialIndices( MaterialNode ) {

			const mappingType = MaterialNode.MappingInformationType;
			const referenceType = MaterialNode.ReferenceInformationType;

			if ( mappingType === 'NoMappingInformation' ) {

				return {
					dataSize: 1,
					buffer: [ 0 ],
					indices: [ 0 ],
					mappingType: 'AllSame',
					referenceType: referenceType
				};

			}

			const materialIndexBuffer = MaterialNode.Materials.a; // Since materials are stored as indices, there's a bit of a mismatch between FBX and what
			// we expect.So we create an intermediate buffer that points to the index in the buffer,
			// for conforming with the other functions we've written for other data.

			const materialIndices = [];

			for ( let i = 0; i < materialIndexBuffer.length; ++ i ) {

				materialIndices.push( i );

			}

			return {
				dataSize: 1,
				buffer: materialIndexBuffer,
				indices: materialIndices,
				mappingType: mappingType,
				referenceType: referenceType
			};

		} // Generate a NurbGeometry from a node in FBXTree.Objects.Geometry


		parseNurbsGeometry( geoNode ) {

			if ( THREE.NURBSCurve === undefined ) {

				console.error( 'THREE.FBXLoader: The loader relies on THREE.NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.' );
				return new THREE.BufferGeometry();

			}

			const order = parseInt( geoNode.Order );

			if ( isNaN( order ) ) {

				console.error( 'THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id );
				return new THREE.BufferGeometry();

			}

			const degree = order - 1;
			const knots = geoNode.KnotVector.a;
			const controlPoints = [];
			const pointsValues = geoNode.Points.a;

			for ( let i = 0, l = pointsValues.length; i < l; i += 4 ) {

				controlPoints.push( new THREE.Vector4().fromArray( pointsValues, i ) );

			}

			let startKnot, endKnot;

			if ( geoNode.Form === 'Closed' ) {

				controlPoints.push( controlPoints[ 0 ] );

			} else if ( geoNode.Form === 'Periodic' ) {

				startKnot = degree;
				endKnot = knots.length - 1 - startKnot;

				for ( let i = 0; i < degree; ++ i ) {

					controlPoints.push( controlPoints[ i ] );

				}

			}

			const curve = new THREE.NURBSCurve( degree, knots, controlPoints, startKnot, endKnot );
			const vertices = curve.getPoints( controlPoints.length * 7 );
			const positions = new Float32Array( vertices.length * 3 );
			vertices.forEach( function ( vertex, i ) {

				vertex.toArray( positions, i * 3 );

			} );
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			return geometry;

		}

	} // parse animation data from FBXTree


	class AnimationParser {

		// take raw animation clips and turn them into three.js animation clips
		parse() {

			const animationClips = [];
			const rawClips = this.parseClips();

			if ( rawClips !== undefined ) {

				for ( const key in rawClips ) {

					const rawClip = rawClips[ key ];
					const clip = this.addClip( rawClip );
					animationClips.push( clip );

				}

			}

			return animationClips;

		}

		parseClips() {

			// since the actual transformation data is stored in FBXTree.Objects.AnimationCurve,
			// if this is undefined we can safely assume there are no animations
			if ( fbxTree.Objects.AnimationCurve === undefined ) return undefined;
			const curveNodesMap = this.parseAnimationCurveNodes();
			this.parseAnimationCurves( curveNodesMap );
			const layersMap = this.parseAnimationLayers( curveNodesMap );
			const rawClips = this.parseAnimStacks( layersMap );
			return rawClips;

		} // parse nodes in FBXTree.Objects.AnimationCurveNode
		// each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
		// and is referenced by an AnimationLayer


		parseAnimationCurveNodes() {

			const rawCurveNodes = fbxTree.Objects.AnimationCurveNode;
			const curveNodesMap = new Map();

			for ( const nodeID in rawCurveNodes ) {

				const rawCurveNode = rawCurveNodes[ nodeID ];

				if ( rawCurveNode.attrName.match( /S|R|T|DeformPercent/ ) !== null ) {

					const curveNode = {
						id: rawCurveNode.id,
						attr: rawCurveNode.attrName,
						curves: {}
					};
					curveNodesMap.set( curveNode.id, curveNode );

				}

			}

			return curveNodesMap;

		} // parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
		// previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
		// axis ( e.g. times and values of x rotation)


		parseAnimationCurves( curveNodesMap ) {

			const rawCurves = fbxTree.Objects.AnimationCurve; // TODO: Many values are identical up to roundoff error, but won't be optimised
			// e.g. position times: [0, 0.4, 0. 8]
			// position values: [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.235384487103147e-7, 93.67520904541016, -0.9982695579528809]
			// clearly, this should be optimised to
			// times: [0], positions [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809]
			// this shows up in nearly every FBX file, and generally time array is length > 100

			for ( const nodeID in rawCurves ) {

				const animationCurve = {
					id: rawCurves[ nodeID ].id,
					times: rawCurves[ nodeID ].KeyTime.a.map( convertFBXTimeToSeconds ),
					values: rawCurves[ nodeID ].KeyValueFloat.a
				};
				const relationships = connections.get( animationCurve.id );

				if ( relationships !== undefined ) {

					const animationCurveID = relationships.parents[ 0 ].ID;
					const animationCurveRelationship = relationships.parents[ 0 ].relationship;

					if ( animationCurveRelationship.match( /X/ ) ) {

						curveNodesMap.get( animationCurveID ).curves[ 'x' ] = animationCurve;

					} else if ( animationCurveRelationship.match( /Y/ ) ) {

						curveNodesMap.get( animationCurveID ).curves[ 'y' ] = animationCurve;

					} else if ( animationCurveRelationship.match( /Z/ ) ) {

						curveNodesMap.get( animationCurveID ).curves[ 'z' ] = animationCurve;

					} else if ( animationCurveRelationship.match( /d|DeformPercent/ ) && curveNodesMap.has( animationCurveID ) ) {

						curveNodesMap.get( animationCurveID ).curves[ 'morph' ] = animationCurve;

					}

				}

			}

		} // parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
		// to various AnimationCurveNodes and is referenced by an AnimationStack node
		// note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack


		parseAnimationLayers( curveNodesMap ) {

			const rawLayers = fbxTree.Objects.AnimationLayer;
			const layersMap = new Map();

			for ( const nodeID in rawLayers ) {

				const layerCurveNodes = [];
				const connection = connections.get( parseInt( nodeID ) );

				if ( connection !== undefined ) {

					// all the animationCurveNodes used in the layer
					const children = connection.children;
					children.forEach( function ( child, i ) {

						if ( curveNodesMap.has( child.ID ) ) {

							const curveNode = curveNodesMap.get( child.ID ); // check that the curves are defined for at least one axis, otherwise ignore the curveNode

							if ( curveNode.curves.x !== undefined || curveNode.curves.y !== undefined || curveNode.curves.z !== undefined ) {

								if ( layerCurveNodes[ i ] === undefined ) {

									const modelID = connections.get( child.ID ).parents.filter( function ( parent ) {

										return parent.relationship !== undefined;

									} )[ 0 ].ID;

									if ( modelID !== undefined ) {

										const rawModel = fbxTree.Objects.Model[ modelID.toString() ];

										if ( rawModel === undefined ) {

											console.warn( 'THREE.FBXLoader: Encountered a unused curve.', child );
											return;

										}

										const node = {
											modelName: rawModel.attrName ? THREE.PropertyBinding.sanitizeNodeName( rawModel.attrName ) : '',
											ID: rawModel.id,
											initialPosition: [ 0, 0, 0 ],
											initialRotation: [ 0, 0, 0 ],
											initialScale: [ 1, 1, 1 ]
										};
										sceneGraph.traverse( function ( child ) {

											if ( child.ID === rawModel.id ) {

												node.transform = child.matrix;
												if ( child.userData.transformData ) node.eulerOrder = child.userData.transformData.eulerOrder;

											}

										} );
										if ( ! node.transform ) node.transform = new THREE.Matrix4(); // if the animated model is pre rotated, we'll have to apply the pre rotations to every
										// animation value as well

										if ( 'PreRotation' in rawModel ) node.preRotation = rawModel.PreRotation.value;
										if ( 'PostRotation' in rawModel ) node.postRotation = rawModel.PostRotation.value;
										layerCurveNodes[ i ] = node;

									}

								}

								if ( layerCurveNodes[ i ] ) layerCurveNodes[ i ][ curveNode.attr ] = curveNode;

							} else if ( curveNode.curves.morph !== undefined ) {

								if ( layerCurveNodes[ i ] === undefined ) {

									const deformerID = connections.get( child.ID ).parents.filter( function ( parent ) {

										return parent.relationship !== undefined;

									} )[ 0 ].ID;
									const morpherID = connections.get( deformerID ).parents[ 0 ].ID;
									const geoID = connections.get( morpherID ).parents[ 0 ].ID; // assuming geometry is not used in more than one model

									const modelID = connections.get( geoID ).parents[ 0 ].ID;
									const rawModel = fbxTree.Objects.Model[ modelID ];
									const node = {
										modelName: rawModel.attrName ? THREE.PropertyBinding.sanitizeNodeName( rawModel.attrName ) : '',
										morphName: fbxTree.Objects.Deformer[ deformerID ].attrName
									};
									layerCurveNodes[ i ] = node;

								}

								layerCurveNodes[ i ][ curveNode.attr ] = curveNode;

							}

						}

					} );
					layersMap.set( parseInt( nodeID ), layerCurveNodes );

				}

			}

			return layersMap;

		} // parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
		// hierarchy. Each Stack node will be used to create a THREE.AnimationClip


		parseAnimStacks( layersMap ) {

			const rawStacks = fbxTree.Objects.AnimationStack; // connect the stacks (clips) up to the layers

			const rawClips = {};

			for ( const nodeID in rawStacks ) {

				const children = connections.get( parseInt( nodeID ) ).children;

				if ( children.length > 1 ) {

					// it seems like stacks will always be associated with a single layer. But just in case there are files
					// where there are multiple layers per stack, we'll display a warning
					console.warn( 'THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.' );

				}

				const layer = layersMap.get( children[ 0 ].ID );
				rawClips[ nodeID ] = {
					name: rawStacks[ nodeID ].attrName,
					layer: layer
				};

			}

			return rawClips;

		}

		addClip( rawClip ) {

			let tracks = [];
			const scope = this;
			rawClip.layer.forEach( function ( rawTracks ) {

				tracks = tracks.concat( scope.generateTracks( rawTracks ) );

			} );
			return new THREE.AnimationClip( rawClip.name, - 1, tracks );

		}

		generateTracks( rawTracks ) {

			const tracks = [];
			let initialPosition = new THREE.Vector3();
			let initialRotation = new THREE.Quaternion();
			let initialScale = new THREE.Vector3();
			if ( rawTracks.transform ) rawTracks.transform.decompose( initialPosition, initialRotation, initialScale );
			initialPosition = initialPosition.toArray();
			initialRotation = new THREE.Euler().setFromQuaternion( initialRotation, rawTracks.eulerOrder ).toArray();
			initialScale = initialScale.toArray();

			if ( rawTracks.T !== undefined && Object.keys( rawTracks.T.curves ).length > 0 ) {

				const positionTrack = this.generateVectorTrack( rawTracks.modelName, rawTracks.T.curves, initialPosition, 'position' );
				if ( positionTrack !== undefined ) tracks.push( positionTrack );

			}

			if ( rawTracks.R !== undefined && Object.keys( rawTracks.R.curves ).length > 0 ) {

				const rotationTrack = this.generateRotationTrack( rawTracks.modelName, rawTracks.R.curves, initialRotation, rawTracks.preRotation, rawTracks.postRotation, rawTracks.eulerOrder );
				if ( rotationTrack !== undefined ) tracks.push( rotationTrack );

			}

			if ( rawTracks.S !== undefined && Object.keys( rawTracks.S.curves ).length > 0 ) {

				const scaleTrack = this.generateVectorTrack( rawTracks.modelName, rawTracks.S.curves, initialScale, 'scale' );
				if ( scaleTrack !== undefined ) tracks.push( scaleTrack );

			}

			if ( rawTracks.DeformPercent !== undefined ) {

				const morphTrack = this.generateMorphTrack( rawTracks );
				if ( morphTrack !== undefined ) tracks.push( morphTrack );

			}

			return tracks;

		}

		generateVectorTrack( modelName, curves, initialValue, type ) {

			const times = this.getTimesForAllAxes( curves );
			const values = this.getKeyframeTrackValues( times, curves, initialValue );
			return new THREE.VectorKeyframeTrack( modelName + '.' + type, times, values );

		}

		generateRotationTrack( modelName, curves, initialValue, preRotation, postRotation, eulerOrder ) {

			if ( curves.x !== undefined ) {

				this.interpolateRotations( curves.x );
				curves.x.values = curves.x.values.map( THREE.MathUtils.degToRad );

			}

			if ( curves.y !== undefined ) {

				this.interpolateRotations( curves.y );
				curves.y.values = curves.y.values.map( THREE.MathUtils.degToRad );

			}

			if ( curves.z !== undefined ) {

				this.interpolateRotations( curves.z );
				curves.z.values = curves.z.values.map( THREE.MathUtils.degToRad );

			}

			const times = this.getTimesForAllAxes( curves );
			const values = this.getKeyframeTrackValues( times, curves, initialValue );

			if ( preRotation !== undefined ) {

				preRotation = preRotation.map( THREE.MathUtils.degToRad );
				preRotation.push( eulerOrder );
				preRotation = new THREE.Euler().fromArray( preRotation );
				preRotation = new THREE.Quaternion().setFromEuler( preRotation );

			}

			if ( postRotation !== undefined ) {

				postRotation = postRotation.map( THREE.MathUtils.degToRad );
				postRotation.push( eulerOrder );
				postRotation = new THREE.Euler().fromArray( postRotation );
				postRotation = new THREE.Quaternion().setFromEuler( postRotation ).invert();

			}

			const quaternion = new THREE.Quaternion();
			const euler = new THREE.Euler();
			const quaternionValues = [];

			for ( let i = 0; i < values.length; i += 3 ) {

				euler.set( values[ i ], values[ i + 1 ], values[ i + 2 ], eulerOrder );
				quaternion.setFromEuler( euler );
				if ( preRotation !== undefined ) quaternion.premultiply( preRotation );
				if ( postRotation !== undefined ) quaternion.multiply( postRotation );
				quaternion.toArray( quaternionValues, i / 3 * 4 );

			}

			return new THREE.QuaternionKeyframeTrack( modelName + '.quaternion', times, quaternionValues );

		}

		generateMorphTrack( rawTracks ) {

			const curves = rawTracks.DeformPercent.curves.morph;
			const values = curves.values.map( function ( val ) {

				return val / 100;

			} );
			const morphNum = sceneGraph.getObjectByName( rawTracks.modelName ).morphTargetDictionary[ rawTracks.morphName ];
			return new THREE.NumberKeyframeTrack( rawTracks.modelName + '.morphTargetInfluences[' + morphNum + ']', curves.times, values );

		} // For all animated objects, times are defined separately for each axis
		// Here we'll combine the times into one sorted array without duplicates


		getTimesForAllAxes( curves ) {

			let times = []; // first join together the times for each axis, if defined

			if ( curves.x !== undefined ) times = times.concat( curves.x.times );
			if ( curves.y !== undefined ) times = times.concat( curves.y.times );
			if ( curves.z !== undefined ) times = times.concat( curves.z.times ); // then sort them

			times = times.sort( function ( a, b ) {

				return a - b;

			} ); // and remove duplicates

			if ( times.length > 1 ) {

				let targetIndex = 1;
				let lastValue = times[ 0 ];

				for ( let i = 1; i < times.length; i ++ ) {

					const currentValue = times[ i ];

					if ( currentValue !== lastValue ) {

						times[ targetIndex ] = currentValue;
						lastValue = currentValue;
						targetIndex ++;

					}

				}

				times = times.slice( 0, targetIndex );

			}

			return times;

		}

		getKeyframeTrackValues( times, curves, initialValue ) {

			const prevValue = initialValue;
			const values = [];
			let xIndex = - 1;
			let yIndex = - 1;
			let zIndex = - 1;
			times.forEach( function ( time ) {

				if ( curves.x ) xIndex = curves.x.times.indexOf( time );
				if ( curves.y ) yIndex = curves.y.times.indexOf( time );
				if ( curves.z ) zIndex = curves.z.times.indexOf( time ); // if there is an x value defined for this frame, use that

				if ( xIndex !== - 1 ) {

					const xValue = curves.x.values[ xIndex ];
					values.push( xValue );
					prevValue[ 0 ] = xValue;

				} else {

					// otherwise use the x value from the previous frame
					values.push( prevValue[ 0 ] );

				}

				if ( yIndex !== - 1 ) {

					const yValue = curves.y.values[ yIndex ];
					values.push( yValue );
					prevValue[ 1 ] = yValue;

				} else {

					values.push( prevValue[ 1 ] );

				}

				if ( zIndex !== - 1 ) {

					const zValue = curves.z.values[ zIndex ];
					values.push( zValue );
					prevValue[ 2 ] = zValue;

				} else {

					values.push( prevValue[ 2 ] );

				}

			} );
			return values;

		} // Rotations are defined as THREE.Euler angles which can have values  of any size
		// These will be converted to quaternions which don't support values greater than
		// PI, so we'll interpolate large rotations


		interpolateRotations( curve ) {

			for ( let i = 1; i < curve.values.length; i ++ ) {

				const initialValue = curve.values[ i - 1 ];
				const valuesSpan = curve.values[ i ] - initialValue;
				const absoluteSpan = Math.abs( valuesSpan );

				if ( absoluteSpan >= 180 ) {

					const numSubIntervals = absoluteSpan / 180;
					const step = valuesSpan / numSubIntervals;
					let nextValue = initialValue + step;
					const initialTime = curve.times[ i - 1 ];
					const timeSpan = curve.times[ i ] - initialTime;
					const interval = timeSpan / numSubIntervals;
					let nextTime = initialTime + interval;
					const interpolatedTimes = [];
					const interpolatedValues = [];

					while ( nextTime < curve.times[ i ] ) {

						interpolatedTimes.push( nextTime );
						nextTime += interval;
						interpolatedValues.push( nextValue );
						nextValue += step;

					}

					curve.times = inject( curve.times, i, interpolatedTimes );
					curve.values = inject( curve.values, i, interpolatedValues );

				}

			}

		}

	} // parse an FBX file in ASCII format


	class TextParser {

		getPrevNode() {

			return this.nodeStack[ this.currentIndent - 2 ];

		}

		getCurrentNode() {

			return this.nodeStack[ this.currentIndent - 1 ];

		}

		getCurrentProp() {

			return this.currentProp;

		}

		pushStack( node ) {

			this.nodeStack.push( node );
			this.currentIndent += 1;

		}

		popStack() {

			this.nodeStack.pop();
			this.currentIndent -= 1;

		}

		setCurrentProp( val, name ) {

			this.currentProp = val;
			this.currentPropName = name;

		}

		parse( text ) {

			this.currentIndent = 0;
			this.allNodes = new FBXTree();
			this.nodeStack = [];
			this.currentProp = [];
			this.currentPropName = '';
			const scope = this;
			const split = text.split( /[\r\n]+/ );
			split.forEach( function ( line, i ) {

				const matchComment = line.match( /^[\s\t]*;/ );
				const matchEmpty = line.match( /^[\s\t]*$/ );
				if ( matchComment || matchEmpty ) return;
				const matchBeginning = line.match( '^\\t{' + scope.currentIndent + '}(\\w+):(.*){', '' );
				const matchProperty = line.match( '^\\t{' + scope.currentIndent + '}(\\w+):[\\s\\t\\r\\n](.*)' );
				const matchEnd = line.match( '^\\t{' + ( scope.currentIndent - 1 ) + '}}' );

				if ( matchBeginning ) {

					scope.parseNodeBegin( line, matchBeginning );

				} else if ( matchProperty ) {

					scope.parseNodeProperty( line, matchProperty, split[ ++ i ] );

				} else if ( matchEnd ) {

					scope.popStack();

				} else if ( line.match( /^[^\s\t}]/ ) ) {

					// large arrays are split over multiple lines terminated with a ',' character
					// if this is encountered the line needs to be joined to the previous line
					scope.parseNodePropertyContinued( line );

				}

			} );
			return this.allNodes;

		}

		parseNodeBegin( line, property ) {

			const nodeName = property[ 1 ].trim().replace( /^"/, '' ).replace( /"$/, '' );
			const nodeAttrs = property[ 2 ].split( ',' ).map( function ( attr ) {

				return attr.trim().replace( /^"/, '' ).replace( /"$/, '' );

			} );
			const node = {
				name: nodeName
			};
			const attrs = this.parseNodeAttr( nodeAttrs );
			const currentNode = this.getCurrentNode(); // a top node

			if ( this.currentIndent === 0 ) {

				this.allNodes.add( nodeName, node );

			} else {

				// a subnode
				// if the subnode already exists, append it
				if ( nodeName in currentNode ) {

					// special case Pose needs PoseNodes as an array
					if ( nodeName === 'PoseNode' ) {

						currentNode.PoseNode.push( node );

					} else if ( currentNode[ nodeName ].id !== undefined ) {

						currentNode[ nodeName ] = {};
						currentNode[ nodeName ][ currentNode[ nodeName ].id ] = currentNode[ nodeName ];

					}

					if ( attrs.id !== '' ) currentNode[ nodeName ][ attrs.id ] = node;

				} else if ( typeof attrs.id === 'number' ) {

					currentNode[ nodeName ] = {};
					currentNode[ nodeName ][ attrs.id ] = node;

				} else if ( nodeName !== 'Properties70' ) {

					if ( nodeName === 'PoseNode' ) currentNode[ nodeName ] = [ node ]; else currentNode[ nodeName ] = node;

				}

			}

			if ( typeof attrs.id === 'number' ) node.id = attrs.id;
			if ( attrs.name !== '' ) node.attrName = attrs.name;
			if ( attrs.type !== '' ) node.attrType = attrs.type;
			this.pushStack( node );

		}

		parseNodeAttr( attrs ) {

			let id = attrs[ 0 ];

			if ( attrs[ 0 ] !== '' ) {

				id = parseInt( attrs[ 0 ] );

				if ( isNaN( id ) ) {

					id = attrs[ 0 ];

				}

			}

			let name = '',
				type = '';

			if ( attrs.length > 1 ) {

				name = attrs[ 1 ].replace( /^(\w+)::/, '' );
				type = attrs[ 2 ];

			}

			return {
				id: id,
				name: name,
				type: type
			};

		}

		parseNodeProperty( line, property, contentLine ) {

			let propName = property[ 1 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();
			let propValue = property[ 2 ].replace( /^"/, '' ).replace( /"$/, '' ).trim(); // for special case: base64 image data follows "Content: ," line
			//	Content: ,
			//	 "/9j/4RDaRXhpZgAATU0A..."

			if ( propName === 'Content' && propValue === ',' ) {

				propValue = contentLine.replace( /"/g, '' ).replace( /,$/, '' ).trim();

			}

			const currentNode = this.getCurrentNode();
			const parentName = currentNode.name;

			if ( parentName === 'Properties70' ) {

				this.parseNodeSpecialProperty( line, propName, propValue );
				return;

			} // Connections


			if ( propName === 'C' ) {

				const connProps = propValue.split( ',' ).slice( 1 );
				const from = parseInt( connProps[ 0 ] );
				const to = parseInt( connProps[ 1 ] );
				let rest = propValue.split( ',' ).slice( 3 );
				rest = rest.map( function ( elem ) {

					return elem.trim().replace( /^"/, '' );

				} );
				propName = 'connections';
				propValue = [ from, to ];
				append( propValue, rest );

				if ( currentNode[ propName ] === undefined ) {

					currentNode[ propName ] = [];

				}

			} // Node


			if ( propName === 'Node' ) currentNode.id = propValue; // connections

			if ( propName in currentNode && Array.isArray( currentNode[ propName ] ) ) {

				currentNode[ propName ].push( propValue );

			} else {

				if ( propName !== 'a' ) currentNode[ propName ] = propValue; else currentNode.a = propValue;

			}

			this.setCurrentProp( currentNode, propName ); // convert string to array, unless it ends in ',' in which case more will be added to it

			if ( propName === 'a' && propValue.slice( - 1 ) !== ',' ) {

				currentNode.a = parseNumberArray( propValue );

			}

		}

		parseNodePropertyContinued( line ) {

			const currentNode = this.getCurrentNode();
			currentNode.a += line; // if the line doesn't end in ',' we have reached the end of the property value
			// so convert the string to an array

			if ( line.slice( - 1 ) !== ',' ) {

				currentNode.a = parseNumberArray( currentNode.a );

			}

		} // parse "Property70"


		parseNodeSpecialProperty( line, propName, propValue ) {

			// split this
			// P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
			// into array like below
			// ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
			const props = propValue.split( '",' ).map( function ( prop ) {

				return prop.trim().replace( /^\"/, '' ).replace( /\s/, '_' );

			} );
			const innerPropName = props[ 0 ];
			const innerPropType1 = props[ 1 ];
			const innerPropType2 = props[ 2 ];
			const innerPropFlag = props[ 3 ];
			let innerPropValue = props[ 4 ]; // cast values where needed, otherwise leave as strings

			switch ( innerPropType1 ) {

				case 'int':
				case 'enum':
				case 'bool':
				case 'ULongLong':
				case 'double':
				case 'Number':
				case 'FieldOfView':
					innerPropValue = parseFloat( innerPropValue );
					break;

				case 'Color':
				case 'ColorRGB':
				case 'Vector3D':
				case 'Lcl_Translation':
				case 'Lcl_Rotation':
				case 'Lcl_Scaling':
					innerPropValue = parseNumberArray( innerPropValue );
					break;

			} // CAUTION: these props must append to parent's parent


			this.getPrevNode()[ innerPropName ] = {
				'type': innerPropType1,
				'type2': innerPropType2,
				'flag': innerPropFlag,
				'value': innerPropValue
			};
			this.setCurrentProp( this.getPrevNode(), innerPropName );

		}

	} // Parse an FBX file in Binary format


	class BinaryParser {

		parse( buffer ) {

			const reader = new BinaryReader( buffer );
			reader.skip( 23 ); // skip magic 23 bytes

			const version = reader.getUint32();

			if ( version < 6400 ) {

				throw new Error( 'THREE.FBXLoader: FBX version not supported, FileVersion: ' + version );

			}

			const allNodes = new FBXTree();

			while ( ! this.endOfContent( reader ) ) {

				const node = this.parseNode( reader, version );
				if ( node !== null ) allNodes.add( node.name, node );

			}

			return allNodes;

		} // Check if reader has reached the end of content.


		endOfContent( reader ) {

			// footer size: 160bytes + 16-byte alignment padding
			// - 16bytes: magic
			// - padding til 16-byte alignment (at least 1byte?)
			//	(seems like some exporters embed fixed 15 or 16bytes?)
			// - 4bytes: magic
			// - 4bytes: version
			// - 120bytes: zero
			// - 16bytes: magic
			if ( reader.size() % 16 === 0 ) {

				return ( reader.getOffset() + 160 + 16 & ~ 0xf ) >= reader.size();

			} else {

				return reader.getOffset() + 160 + 16 >= reader.size();

			}

		} // recursively parse nodes until the end of the file is reached


		parseNode( reader, version ) {

			const node = {}; // The first three data sizes depends on version.

			const endOffset = version >= 7500 ? reader.getUint64() : reader.getUint32();
			const numProperties = version >= 7500 ? reader.getUint64() : reader.getUint32();
			version >= 7500 ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

			const nameLen = reader.getUint8();
			const name = reader.getString( nameLen ); // Regards this node as NULL-record if endOffset is zero

			if ( endOffset === 0 ) return null;
			const propertyList = [];

			for ( let i = 0; i < numProperties; i ++ ) {

				propertyList.push( this.parseProperty( reader ) );

			} // Regards the first three elements in propertyList as id, attrName, and attrType


			const id = propertyList.length > 0 ? propertyList[ 0 ] : '';
			const attrName = propertyList.length > 1 ? propertyList[ 1 ] : '';
			const attrType = propertyList.length > 2 ? propertyList[ 2 ] : ''; // check if this node represents just a single property
			// like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}

			node.singleProperty = numProperties === 1 && reader.getOffset() === endOffset ? true : false;

			while ( endOffset > reader.getOffset() ) {

				const subNode = this.parseNode( reader, version );
				if ( subNode !== null ) this.parseSubNode( name, node, subNode );

			}

			node.propertyList = propertyList; // raw property list used by parent

			if ( typeof id === 'number' ) node.id = id;
			if ( attrName !== '' ) node.attrName = attrName;
			if ( attrType !== '' ) node.attrType = attrType;
			if ( name !== '' ) node.name = name;
			return node;

		}

		parseSubNode( name, node, subNode ) {

			// special case: child node is single property
			if ( subNode.singleProperty === true ) {

				const value = subNode.propertyList[ 0 ];

				if ( Array.isArray( value ) ) {

					node[ subNode.name ] = subNode;
					subNode.a = value;

				} else {

					node[ subNode.name ] = value;

				}

			} else if ( name === 'Connections' && subNode.name === 'C' ) {

				const array = [];
				subNode.propertyList.forEach( function ( property, i ) {

					// first Connection is FBX type (OO, OP, etc.). We'll discard these
					if ( i !== 0 ) array.push( property );

				} );

				if ( node.connections === undefined ) {

					node.connections = [];

				}

				node.connections.push( array );

			} else if ( subNode.name === 'Properties70' ) {

				const keys = Object.keys( subNode );
				keys.forEach( function ( key ) {

					node[ key ] = subNode[ key ];

				} );

			} else if ( name === 'Properties70' && subNode.name === 'P' ) {

				let innerPropName = subNode.propertyList[ 0 ];
				let innerPropType1 = subNode.propertyList[ 1 ];
				const innerPropType2 = subNode.propertyList[ 2 ];
				const innerPropFlag = subNode.propertyList[ 3 ];
				let innerPropValue;
				if ( innerPropName.indexOf( 'Lcl ' ) === 0 ) innerPropName = innerPropName.replace( 'Lcl ', 'Lcl_' );
				if ( innerPropType1.indexOf( 'Lcl ' ) === 0 ) innerPropType1 = innerPropType1.replace( 'Lcl ', 'Lcl_' );

				if ( innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf( 'Lcl_' ) === 0 ) {

					innerPropValue = [ subNode.propertyList[ 4 ], subNode.propertyList[ 5 ], subNode.propertyList[ 6 ] ];

				} else {

					innerPropValue = subNode.propertyList[ 4 ];

				} // this will be copied to parent, see above


				node[ innerPropName ] = {
					'type': innerPropType1,
					'type2': innerPropType2,
					'flag': innerPropFlag,
					'value': innerPropValue
				};

			} else if ( node[ subNode.name ] === undefined ) {

				if ( typeof subNode.id === 'number' ) {

					node[ subNode.name ] = {};
					node[ subNode.name ][ subNode.id ] = subNode;

				} else {

					node[ subNode.name ] = subNode;

				}

			} else {

				if ( subNode.name === 'PoseNode' ) {

					if ( ! Array.isArray( node[ subNode.name ] ) ) {

						node[ subNode.name ] = [ node[ subNode.name ] ];

					}

					node[ subNode.name ].push( subNode );

				} else if ( node[ subNode.name ][ subNode.id ] === undefined ) {

					node[ subNode.name ][ subNode.id ] = subNode;

				}

			}

		}

		parseProperty( reader ) {

			const type = reader.getString( 1 );
			let length;

			switch ( type ) {

				case 'C':
					return reader.getBoolean();

				case 'D':
					return reader.getFloat64();

				case 'F':
					return reader.getFloat32();

				case 'I':
					return reader.getInt32();

				case 'L':
					return reader.getInt64();

				case 'R':
					length = reader.getUint32();
					return reader.getArrayBuffer( length );

				case 'S':
					length = reader.getUint32();
					return reader.getString( length );

				case 'Y':
					return reader.getInt16();

				case 'b':
				case 'c':
				case 'd':
				case 'f':
				case 'i':
				case 'l':
					const arrayLength = reader.getUint32();
					const encoding = reader.getUint32(); // 0: non-compressed, 1: compressed

					const compressedLength = reader.getUint32();

					if ( encoding === 0 ) {

						switch ( type ) {

							case 'b':
							case 'c':
								return reader.getBooleanArray( arrayLength );

							case 'd':
								return reader.getFloat64Array( arrayLength );

							case 'f':
								return reader.getFloat32Array( arrayLength );

							case 'i':
								return reader.getInt32Array( arrayLength );

							case 'l':
								return reader.getInt64Array( arrayLength );

						}

					}

					if ( typeof fflate === 'undefined' ) {

						console.error( 'THREE.FBXLoader: External library fflate.min.js required.' );

					}

					const data = fflate.unzlibSync( new Uint8Array( reader.getArrayBuffer( compressedLength ) ) ); // eslint-disable-line no-undef

					const reader2 = new BinaryReader( data.buffer );

					switch ( type ) {

						case 'b':
						case 'c':
							return reader2.getBooleanArray( arrayLength );

						case 'd':
							return reader2.getFloat64Array( arrayLength );

						case 'f':
							return reader2.getFloat32Array( arrayLength );

						case 'i':
							return reader2.getInt32Array( arrayLength );

						case 'l':
							return reader2.getInt64Array( arrayLength );

					}

				default:
					throw new Error( 'THREE.FBXLoader: Unknown property type ' + type );

			}

		}

	}

	class BinaryReader {

		constructor( buffer, littleEndian ) {

			this.dv = new DataView( buffer );
			this.offset = 0;
			this.littleEndian = littleEndian !== undefined ? littleEndian : true;

		}

		getOffset() {

			return this.offset;

		}

		size() {

			return this.dv.buffer.byteLength;

		}

		skip( length ) {

			this.offset += length;

		} // seems like true/false representation depends on exporter.
		// true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
		// then sees LSB.


		getBoolean() {

			return ( this.getUint8() & 1 ) === 1;

		}

		getBooleanArray( size ) {

			const a = [];

			for ( let i = 0; i < size; i ++ ) {

				a.push( this.getBoolean() );

			}

			return a;

		}

		getUint8() {

			const value = this.dv.getUint8( this.offset );
			this.offset += 1;
			return value;

		}

		getInt16() {

			const value = this.dv.getInt16( this.offset, this.littleEndian );
			this.offset += 2;
			return value;

		}

		getInt32() {

			const value = this.dv.getInt32( this.offset, this.littleEndian );
			this.offset += 4;
			return value;

		}

		getInt32Array( size ) {

			const a = [];

			for ( let i = 0; i < size; i ++ ) {

				a.push( this.getInt32() );

			}

			return a;

		}

		getUint32() {

			const value = this.dv.getUint32( this.offset, this.littleEndian );
			this.offset += 4;
			return value;

		} // JavaScript doesn't support 64-bit integer so calculate this here
		// 1 << 32 will return 1 so using multiply operation instead here.
		// There's a possibility that this method returns wrong value if the value
		// is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
		// TODO: safely handle 64-bit integer


		getInt64() {

			let low, high;

			if ( this.littleEndian ) {

				low = this.getUint32();
				high = this.getUint32();

			} else {

				high = this.getUint32();
				low = this.getUint32();

			} // calculate negative value


			if ( high & 0x80000000 ) {

				high = ~ high & 0xFFFFFFFF;
				low = ~ low & 0xFFFFFFFF;
				if ( low === 0xFFFFFFFF ) high = high + 1 & 0xFFFFFFFF;
				low = low + 1 & 0xFFFFFFFF;
				return - ( high * 0x100000000 + low );

			}

			return high * 0x100000000 + low;

		}

		getInt64Array( size ) {

			const a = [];

			for ( let i = 0; i < size; i ++ ) {

				a.push( this.getInt64() );

			}

			return a;

		} // Note: see getInt64() comment


		getUint64() {

			let low, high;

			if ( this.littleEndian ) {

				low = this.getUint32();
				high = this.getUint32();

			} else {

				high = this.getUint32();
				low = this.getUint32();

			}

			return high * 0x100000000 + low;

		}

		getFloat32() {

			const value = this.dv.getFloat32( this.offset, this.littleEndian );
			this.offset += 4;
			return value;

		}

		getFloat32Array( size ) {

			const a = [];

			for ( let i = 0; i < size; i ++ ) {

				a.push( this.getFloat32() );

			}

			return a;

		}

		getFloat64() {

			const value = this.dv.getFloat64( this.offset, this.littleEndian );
			this.offset += 8;
			return value;

		}

		getFloat64Array( size ) {

			const a = [];

			for ( let i = 0; i < size; i ++ ) {

				a.push( this.getFloat64() );

			}

			return a;

		}

		getArrayBuffer( size ) {

			const value = this.dv.buffer.slice( this.offset, this.offset + size );
			this.offset += size;
			return value;

		}

		getString( size ) {

			// note: safari 9 doesn't support Uint8Array.indexOf; create intermediate array instead
			let a = [];

			for ( let i = 0; i < size; i ++ ) {

				a[ i ] = this.getUint8();

			}

			const nullByte = a.indexOf( 0 );
			if ( nullByte >= 0 ) a = a.slice( 0, nullByte );
			return THREE.LoaderUtils.decodeText( new Uint8Array( a ) );

		}

	} // FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
	// and BinaryParser( FBX Binary format)


	class FBXTree {

		add( key, val ) {

			this[ key ] = val;

		}

	} // ************** UTILITY FUNCTIONS **************


	function isFbxFormatBinary( buffer ) {

		const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';
		return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString( buffer, 0, CORRECT.length );

	}

	function isFbxFormatASCII( text ) {

		const CORRECT = [ 'K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\' ];
		let cursor = 0;

		function read( offset ) {

			const result = text[ offset - 1 ];
			text = text.slice( cursor + offset );
			cursor ++;
			return result;

		}

		for ( let i = 0; i < CORRECT.length; ++ i ) {

			const num = read( 1 );

			if ( num === CORRECT[ i ] ) {

				return false;

			}

		}

		return true;

	}

	function getFbxVersion( text ) {

		const versionRegExp = /FBXVersion: (\d+)/;
		const match = text.match( versionRegExp );

		if ( match ) {

			const version = parseInt( match[ 1 ] );
			return version;

		}

		throw new Error( 'THREE.FBXLoader: Cannot find the version number for the file given.' );

	} // Converts FBX ticks into real time seconds.


	function convertFBXTimeToSeconds( time ) {

		return time / 46186158000;

	}

	const dataArray = []; // extracts the data from the correct position in the FBX array based on indexing type

	function getData( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

		let index;

		switch ( infoObject.mappingType ) {

			case 'ByPolygonVertex':
				index = polygonVertexIndex;
				break;

			case 'ByPolygon':
				index = polygonIndex;
				break;

			case 'ByVertice':
				index = vertexIndex;
				break;

			case 'AllSame':
				index = infoObject.indices[ 0 ];
				break;

			default:
				console.warn( 'THREE.FBXLoader: unknown attribute mapping type ' + infoObject.mappingType );

		}

		if ( infoObject.referenceType === 'IndexToDirect' ) index = infoObject.indices[ index ];
		const from = index * infoObject.dataSize;
		const to = from + infoObject.dataSize;
		return slice( dataArray, infoObject.buffer, from, to );

	}

	const tempEuler = new THREE.Euler();
	const tempVec = new THREE.Vector3(); // generate transformation from FBX transform data
	// ref: https://help.autodesk.com/view/FBX/2017/ENU/?guid=__files_GUID_10CDD63C_79C1_4F2D_BB28_AD2BE65A02ED_htm
	// ref: http://docs.autodesk.com/FBX/2014/ENU/FBX-SDK-Documentation/index.html?url=cpp_ref/_transformations_2main_8cxx-example.html,topicNumber=cpp_ref__transformations_2main_8cxx_example_htmlfc10a1e1-b18d-4e72-9dc0-70d0f1959f5e

	function generateTransform( transformData ) {

		const lTranslationM = new THREE.Matrix4();
		const lPreRotationM = new THREE.Matrix4();
		const lRotationM = new THREE.Matrix4();
		const lPostRotationM = new THREE.Matrix4();
		const lScalingM = new THREE.Matrix4();
		const lScalingPivotM = new THREE.Matrix4();
		const lScalingOffsetM = new THREE.Matrix4();
		const lRotationOffsetM = new THREE.Matrix4();
		const lRotationPivotM = new THREE.Matrix4();
		const lParentGX = new THREE.Matrix4();
		const lParentLX = new THREE.Matrix4();
		const lGlobalT = new THREE.Matrix4();
		const inheritType = transformData.inheritType ? transformData.inheritType : 0;
		if ( transformData.translation ) lTranslationM.setPosition( tempVec.fromArray( transformData.translation ) );

		if ( transformData.preRotation ) {

			const array = transformData.preRotation.map( THREE.MathUtils.degToRad );
			array.push( transformData.eulerOrder );
			lPreRotationM.makeRotationFromEuler( tempEuler.fromArray( array ) );

		}

		if ( transformData.rotation ) {

			const array = transformData.rotation.map( THREE.MathUtils.degToRad );
			array.push( transformData.eulerOrder );
			lRotationM.makeRotationFromEuler( tempEuler.fromArray( array ) );

		}

		if ( transformData.postRotation ) {

			const array = transformData.postRotation.map( THREE.MathUtils.degToRad );
			array.push( transformData.eulerOrder );
			lPostRotationM.makeRotationFromEuler( tempEuler.fromArray( array ) );
			lPostRotationM.invert();

		}

		if ( transformData.scale ) lScalingM.scale( tempVec.fromArray( transformData.scale ) ); // Pivots and offsets

		if ( transformData.scalingOffset ) lScalingOffsetM.setPosition( tempVec.fromArray( transformData.scalingOffset ) );
		if ( transformData.scalingPivot ) lScalingPivotM.setPosition( tempVec.fromArray( transformData.scalingPivot ) );
		if ( transformData.rotationOffset ) lRotationOffsetM.setPosition( tempVec.fromArray( transformData.rotationOffset ) );
		if ( transformData.rotationPivot ) lRotationPivotM.setPosition( tempVec.fromArray( transformData.rotationPivot ) ); // parent transform

		if ( transformData.parentMatrixWorld ) {

			lParentLX.copy( transformData.parentMatrix );
			lParentGX.copy( transformData.parentMatrixWorld );

		}

		const lLRM = new THREE.Matrix4().copy( lPreRotationM ).multiply( lRotationM ).multiply( lPostRotationM ); // Global Rotation

		const lParentGRM = new THREE.Matrix4();
		lParentGRM.extractRotation( lParentGX ); // Global Shear*Scaling

		const lParentTM = new THREE.Matrix4();
		lParentTM.copyPosition( lParentGX );
		const lParentGSM = new THREE.Matrix4();
		const lParentGRSM = new THREE.Matrix4().copy( lParentTM ).invert().multiply( lParentGX );
		lParentGSM.copy( lParentGRM ).invert().multiply( lParentGRSM );
		const lLSM = lScalingM;
		const lGlobalRS = new THREE.Matrix4();

		if ( inheritType === 0 ) {

			lGlobalRS.copy( lParentGRM ).multiply( lLRM ).multiply( lParentGSM ).multiply( lLSM );

		} else if ( inheritType === 1 ) {

			lGlobalRS.copy( lParentGRM ).multiply( lParentGSM ).multiply( lLRM ).multiply( lLSM );

		} else {

			const lParentLSM = new THREE.Matrix4().scale( new THREE.Vector3().setFromMatrixScale( lParentLX ) );
			const lParentLSM_inv = new THREE.Matrix4().copy( lParentLSM ).invert();
			const lParentGSM_noLocal = new THREE.Matrix4().copy( lParentGSM ).multiply( lParentLSM_inv );
			lGlobalRS.copy( lParentGRM ).multiply( lLRM ).multiply( lParentGSM_noLocal ).multiply( lLSM );

		}

		const lRotationPivotM_inv = new THREE.Matrix4();
		lRotationPivotM_inv.copy( lRotationPivotM ).invert();
		const lScalingPivotM_inv = new THREE.Matrix4();
		lScalingPivotM_inv.copy( lScalingPivotM ).invert(); // Calculate the local transform matrix

		let lTransform = new THREE.Matrix4();
		lTransform.copy( lTranslationM ).multiply( lRotationOffsetM ).multiply( lRotationPivotM ).multiply( lPreRotationM ).multiply( lRotationM ).multiply( lPostRotationM ).multiply( lRotationPivotM_inv ).multiply( lScalingOffsetM ).multiply( lScalingPivotM ).multiply( lScalingM ).multiply( lScalingPivotM_inv );
		const lLocalTWithAllPivotAndOffsetInfo = new THREE.Matrix4().copyPosition( lTransform );
		const lGlobalTranslation = new THREE.Matrix4().copy( lParentGX ).multiply( lLocalTWithAllPivotAndOffsetInfo );
		lGlobalT.copyPosition( lGlobalTranslation );
		lTransform = new THREE.Matrix4().copy( lGlobalT ).multiply( lGlobalRS ); // from global to local

		lTransform.premultiply( lParentGX.invert() );
		return lTransform;

	} // Returns the three.js intrinsic THREE.Euler order corresponding to FBX extrinsic THREE.Euler order
	// ref: http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html


	function getEulerOrder( order ) {

		order = order || 0;
		const enums = [ 'ZYX', // -> XYZ extrinsic
			'YZX', // -> XZY extrinsic
			'XZY', // -> YZX extrinsic
			'ZXY', // -> YXZ extrinsic
			'YXZ', // -> ZXY extrinsic
			'XYZ' // -> ZYX extrinsic
			//'SphericXYZ', // not possible to support
		];

		if ( order === 6 ) {

			console.warn( 'THREE.FBXLoader: unsupported THREE.Euler Order: Spherical XYZ. Animations and rotations may be incorrect.' );
			return enums[ 0 ];

		}

		return enums[ order ];

	} // Parses comma separated list of numbers and returns them an array.
	// Used internally by the TextParser


	function parseNumberArray( value ) {

		const array = value.split( ',' ).map( function ( val ) {

			return parseFloat( val );

		} );
		return array;

	}

	function convertArrayBufferToString( buffer, from, to ) {

		if ( from === undefined ) from = 0;
		if ( to === undefined ) to = buffer.byteLength;
		return THREE.LoaderUtils.decodeText( new Uint8Array( buffer, from, to ) );

	}

	function append( a, b ) {

		for ( let i = 0, j = a.length, l = b.length; i < l; i ++, j ++ ) {

			a[ j ] = b[ i ];

		}

	}

	function slice( a, b, from, to ) {

		for ( let i = from, j = 0; i < to; i ++, j ++ ) {

			a[ j ] = b[ i ];

		}

		return a;

	} // inject array a2 into array a1 at index


	function inject( a1, index, a2 ) {

		return a1.slice( 0, index ).concat( a2 ).concat( a1.slice( index ) );

	}

	THREE.FBXLoader = FBXLoader;

} )();

