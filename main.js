(function(){var u,t,l,c,y,e,f,n,d,E,r,h,I,B,b;window.location.hash="",y=[],c=[],E=b=I=u="",d=function(n,t){var e;return"fetch"in window?fetch(n).then(function(n){return n.json()}).then(function(n){return t(null,n)})[String.fromCharCode(99)+"atch"](function(n){return t(n)}):((e=new XMLHttpRequest).open("GET",n,!0),e.onreadystatechange=function(){if(4===this.readyState)return 200!==this.status&&t(new Error(this.status,this.statusText)),t(null,JSON.parse(""+this.responseText))},e.send())},l=function(){var n,t,e,r;for(r=[],t=0,e=y.length;t<e;t++)n=y[t],null!=c[n.name]?r.push(c[n.name]++):r.push(c[n.name]=1);return r},f=function(){var n,t,e,r,o,s,i,a;for(console.log("draw list..."),console.log(c),a='<div class="row">',o="ars",r=e=n=0,s=y.length;e<s;r=++e)(i=y[r].name)!==o&&(n=0,a+='</div><div class="row">',o=i),t=c[i],a+='<a href="#'+r+'" style="background: hsl('+(Math.floor(100*n/t)+50)+', 70%, 80%)">'+i+"</a>",n++;return a+="</div>",b.innerHTML="Маршруточки",u.innerHTML=a},t=function(){return u.innerHTML="",I.innerHTML="",b.innerHTML="",E.innerHTML=""},r=function(n){var t,e;return n=parseInt(n),e=Math.floor(n/60)+":",e+=(t=n%60)<10?"0"+t:t},B=function(n,t){return'<td class="time">'+r(n)+'</td><td class="station">'+t+"</td>"},e=function(n){var t,e,r,o,s,i,a,u,l,c,f,d,h,g,w,m,T,v,M,p,H,L;for(M=(c=y[n]).stations,H=c.times,l=c.ids,v={},f="",b.innerHTML="Назад",E.innerHTML=c.name,e=t=0,h=M.length;0<=h?t<h:h<t;e=0<=h?++t:--t)v[H[e]]=l[M[e]];for(i=(s=Object.keys(v)).length,L=60*((p=new Date).getUTCHours()+3)+p.getUTCMinutes(),d=0;d!==i&&parseInt(s[d])<L;)d++;if(d===i)for(e=r=0,g=i;r<g;e=r+=1)f+='<tr class="old">'+B(s[e],v[s[e]])+"</tr>";else if(0===d)for(e=o=0,w=i;o<w;e=o+=1)f+="<tr>"+B(s[e],v[s[e]])+"</tr>";else{for(e=a=0,m=d-1;a<m;e=a+=1)f+='<tr class="old">'+B(s[e],v[s[e]])+"</tr>";for(f+='<tr id="focus" class="old">'+B(s[d-1],v[s[d-1]])+"</tr>",e=u=d,T=i;u<T;e=u+=1)f+="<tr>"+B(s[e],v[s[e]])}if(I.innerHTML=f,null!=document.getElementById("focus"))return window.location.hash="focus"},h=function(){var n;if(n=window.location.hash.slice(1),console.log(n),console.log(this),"focus"!==n)return t(),isNaN(parseInt(n))?f():e(parseInt(n))},n=function(){return u=document.getElementById("buses"),I=document.getElementById("schedule"),b=document.getElementById("title"),E=document.getElementById("name"),d("assets/all.json",function(n,t){var o,e,r,s,i,a,u;if(n)throw n;for(o=0,u=t.length,a=[],s=r=0,i=t.length;r<i;s=++r)e=t[s],a.push(function(e,r){return d("assets/bus/"+r,function(n,t){if(n)throw new Error(n+" "+e+" "+r);if(y[e]=t,++o===u)return window.onhashchange=h,l(),f()})}(s,e));return a})},window.addEventListener("load",n)}).call(this);