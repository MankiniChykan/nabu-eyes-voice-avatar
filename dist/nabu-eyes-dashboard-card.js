/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:o,getOwnPropertyDescriptor:h,getOwnPropertyNames:_,getOwnPropertySymbols:c,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,g=p?p.emptyScript:"",m=u.reactiveElementPolyfillSupport,f=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&o(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);a?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[..._(t),...c(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),a=t.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const n=a.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,a=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??v)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==a||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[f("elementProperties")]=new Map,y[f("finalized")]=new Map,m?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,E=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+x,P=`<${C}>`,z=document,O=()=>z.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,q=Array.isArray,M="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,k=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,R=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),I=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),D=new WeakMap,F=z.createTreeWalker(z,129);function W(t,e){if(!q(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Q=(t,e)=>{const s=t.length-1,i=[];let a,n=2===e?"<svg>":3===e?"<math>":"",r=T;for(let e=0;e<s;e++){const s=t[e];let l,o,h=-1,_=0;for(;_<s.length&&(r.lastIndex=_,o=r.exec(s),null!==o);)_=r.lastIndex,r===T?"!--"===o[1]?r=U:void 0!==o[1]?r=k:void 0!==o[2]?(L.test(o[2])&&(a=RegExp("</"+o[2],"g")),r=H):void 0!==o[3]&&(r=H):r===H?">"===o[0]?(r=a??T,h=-1):void 0===o[1]?h=-2:(h=r.lastIndex-o[2].length,l=o[1],r=void 0===o[3]?H:'"'===o[3]?R:j):r===R||r===j?r=H:r===U||r===k?r=T:(r=H,a=void 0);const c=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===T?s+P:h>=0?(i.push(l),s.slice(0,h)+S+s.slice(h)+x+c):s+x+(-2===h?e:c)}return[W(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class G{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,n=0;const r=t.length-1,l=this.parts,[o,h]=Q(t,e);if(this.el=G.createElement(o,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&l.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=h[n++],s=i.getAttribute(t).split(x),r=/([.?@])?(.*)/.exec(e);l.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?Y:"?"===r[1]?tt:"@"===r[1]?et:X}),i.removeAttribute(t)}else t.startsWith(x)&&(l.push({type:6,index:a}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(x),e=t.length-1;if(e>0){i.textContent=w?w.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),F.nextNode(),l.push({type:2,index:++a});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===C)l.push({type:2,index:a});else{let t=-1;for(;-1!==(t=i.data.indexOf(x,t+1));)l.push({type:7,index:a}),t+=x.length-1}a++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===I)return e;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const n=N(e)?void 0:e._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(t),a._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(e=J(t,a._$AS(t,e.values),a,i)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);F.currentNode=i;let a=F.nextNode(),n=0,r=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new Z(a,a.nextSibling,this,t):1===l.type?e=new l.ctor(a,l.name,l.strings,this,t):6===l.type&&(e=new st(a,this,t)),this._$AV.push(e),l=s[++r]}n!==l?.index&&(a=F.nextNode(),n++)}return F.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),N(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>q(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=G.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=D.get(t.strings);return void 0===e&&D.set(t.strings,e=new G(t)),e}k(t){q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new Z(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const a=this.strings;let n=!1;if(void 0===a)t=J(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const i=t;let r,l;for(t=a[0],r=0;r<a.length-1;r++)l=J(this,i[s+r],e,r),l===I&&(l=this._$AH[r]),n||=!N(l)||l!==this._$AH[r],l===V?t=V:t!==V&&(t+=(l??"")+a[r+1]),this._$AH[r]=l}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class et extends X{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??V)===I)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const it=A.litHtmlPolyfillSupport;it?.(G,Z),(A.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let a=i._$litPart$;if(void 0===a){const t=s?.renderBefore??null;i._$litPart$=a=new Z(e.insertBefore(O(),t),t,void 0,s??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const rt=at.litElementPolyfillSupport;rt?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.1");const lt="/hacsfiles/nabu-eyes-voice-avatar",ot="nabu_playing_dash_blue.gif",ht="1px_equalizer_dash.gif",_t={"nabu_playing_dash_blue.gif":"Nabu Playing Blue (default)","nabu_playing_dash_light.gif":"Nabu Playing Light","nabu_playing_dash_purple.gif":"Nabu Playing Purple","nabu_playing_dash_sepia.gif":"Nabu Playing Sepia"},ct={"1px_equalizer_dash.gif":"1px Equalizer","1px_equalizer_fader_dash.gif":"1px Equalizer Fader","1px_equalizer_fader_2_dash.gif":"1px Equalizer Fader 2","1px_equalizer_bottom_dash.gif":"1px Equalizer Bottom","2px_equalizer_dash.gif":"2px Equalizer","2px_equalizer_fader_dash.gif":"2px Equalizer Fader","2px_equalizer_fader_2_dash.gif":"2px Equalizer Fader 2","2px_equalizer_bottom_dash.gif":"2px Equalizer Bottom","2px_equalizer_fader-dash.gif":"2px Equalizer Fader (alt)","nabu_eq_dash_blue.gif":"Nabu EQ Blue","nabu_eq2_dash_blue.gif":"Nabu EQ2 Blue","nabu_eq3_dash_blue.gif":"Nabu EQ3 Blue","nabu_eq_dash_light.gif":"Nabu EQ Light","nabu_eq2_dash_light.gif":"Nabu EQ2 Light","nabu_eq3_dash_light.gif":"Nabu EQ3 Light","nabu_eq_dash_purple.gif":"Nabu EQ Purple","nabu_eq2_dash_purple.gif":"Nabu EQ2 Purple","nabu_eq3_dash_purple.gif":"Nabu EQ3 Purple","nabu_eq_dash_sepia.gif":"Nabu EQ Sepia","nabu_eq2_dash_sepia.gif":"Nabu EQ2 Sepia","nabu_eq3_dash_sepia.gif":"Nabu EQ3 Sepia"},dt={"nabu_idle_dash_blue.gif":"Idle – Blue","nabu_idle_dash_light.gif":"Idle – Light","nabu_idle_dash_purple.gif":"Idle – Purple","nabu_idle_dash_sepia.gif":"Idle – Sepia"},ut={"nabu_listening_dash_blue.gif":"Listening – Blue","nabu_listening_dash_light.gif":"Listening – Light","nabu_listening_dash_purple.gif":"Listening – Purple","nabu_listening_dash_sepia.gif":"Listening – Sepia"},pt={"nabu_processing_dash_blue.gif":"Processing – Blue","nabu_processing_dash_light.gif":"Processing – Light","nabu_processing_dash_purple.gif":"Processing – Purple","nabu_processing_dash_sepia.gif":"Processing – Sepia"},gt={"nabu_responding_dash_blue.gif":"Responding – Blue","nabu_responding_dash_light.gif":"Responding – Light","nabu_responding_dash_purple.gif":"Responding – Purple","nabu_responding_dash_sepia.gif":"Responding – Sepia"},mt={"nabu_alarm_dash_blue.gif":"Alarm – Blue","nabu_alarm_dash_light.gif":"Alarm – Light","nabu_alarm_dash_purple.gif":"Alarm – Purple","nabu_alarm_dash_sepia.gif":"Alarm – Sepia"},ft={"nabu_countdown_dash_blue.gif":"Countdown – Blue","nabu_countdown_dash_light.gif":"Countdown – Light","nabu_countdown_dash_purple.gif":"Countdown – Purple","nabu_countdown_dash_sepia.gif":"Countdown – Sepia"},$t={"nabu_mute_dash_blue.gif":"Mute – Blue","nabu_mute_dash_light.gif":"Mute – Light","nabu_mute_dash_purple.gif":"Mute – Purple","nabu_mute_dash_sepia.gif":"Mute – Sepia"},vt={idle:"nabu_idle_dash_blue.gif",listening:"nabu_listening_dash_blue.gif",processing:"nabu_processing_dash_blue.gif",responding:"nabu_responding_dash_blue.gif",playing:"nabu_playing_dash_blue.gif",alarm:"nabu_alarm_dash_blue.gif",countdown:"nabu_countdown_dash_blue.gif",mute:"nabu_mute_dash_blue.gif"},bt=["on","detected","unavailable"];var yt,At;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(yt||(yt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(At||(At={}));var wt=function(t,e,s,i){i=i||{},s=null==s?{}:s;var a=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return a.detail=s,t.dispatchEvent(a),a};const Et=()=>!!customElements.get("ha-entity-picker");class St extends nt{constructor(){super(...arguments),this._bootstrapped=!1,this._handleText=t=>{const e=t.currentTarget;e?.dataset?.field&&this._config&&this._update(e.dataset.field,e.value||void 0)},this._handleCSV=t=>{const e=t.currentTarget;if(!e?.dataset?.field||!this._config)return;const s=e.value.split(",").map(t=>t.trim()).filter(Boolean);this._update(e.dataset.field,s)},this._handleHide=t=>{const e=t.currentTarget;this._update("hide_when_idle",!!e?.checked)},this._handlePlaying=t=>{const e=t.currentTarget?.value;e&&e in _t&&this._update("playing_variant",e)},this._handleEqualizer=t=>{const e=t.currentTarget?.value;e&&e in ct&&this._update("media_player_equalizer",e)},this._handleStateVariant=t=>e=>{const s=e.currentTarget?.value;s&&this._update(t,s)}}setConfig(t){this._config={...t,assist_entities:[...t.assist_entities??[]],countdown_events:[...t.countdown_events??[]],countdown_clear_events:[...t.countdown_clear_events??[]],alarm_events:[...t.alarm_events??[]],alarm_clear_events:[...t.alarm_clear_events??[]],alarm_entities:[...t.alarm_entities??[]],alarm_active_states:[...t.alarm_active_states??bt],hide_when_idle:t.hide_when_idle??!1}}render(){if(!this.hass||!this._config)return B``;if(!this._bootstrapped){this._bootstrapped=!0;const t={};if(!this._config.assist_entities?.length){const e=Object.keys(this.hass.states).filter(t=>t.startsWith("assist_satellite."));e.length&&(t.assist_entities=e)}const e=this._config.media_player??Object.keys(this.hass.states).find(t=>t.startsWith("media_player."));if(!this._config.media_player&&e&&(t.media_player=e),!this._config.mute_media_player&&e&&(t.mute_media_player=e),Object.keys(t).length){const e={...this._config,...t};this._config=e,wt(this,"config-changed",{config:e})}}const t=this._config,e=Object.keys(this.hass.states).filter(t=>t.startsWith("assist_satellite.")),s=Object.keys(this.hass.states).filter(t=>t.startsWith("media_player."));return B`
      <div class="form">
        <ha-textfield
          label="Name"
          .value=${t.name??""}
          @input=${this._handleText}
          data-field="name"
        ></ha-textfield>

        <!-- Assist satellites -->
        ${customElements.get("ha-entities-picker")?B`
              <ha-entities-picker
                .hass=${this.hass}
                .value=${t.assist_entities??[]}
                label="Assist satellite entities"
                allow-custom-entity
                @value-changed=${t=>this._update("assist_entities",Array.isArray(t.detail?.value)?t.detail.value:t.detail?.value?[t.detail.value]:[])}
              ></ha-entities-picker>
            `:this._fallbackMulti("Assist satellite entities (comma separated)","assist_entities",t.assist_entities??[],e)}

        <!-- Equalizer media player -->
        ${Et()?B`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${t.media_player??""}
                label="Media player for equalizer"
                domain="media_player"
                allow-custom-entity
                @value-changed=${t=>this._update("media_player",t.detail?.value||void 0)}
              ></ha-entity-picker>
            `:this._fallbackSingle("Media player for equalizer","media_player",t.media_player??"",s)}

        <!-- Mute source media player -->
        ${Et()?B`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${t.mute_media_player??t.media_player??""}
                label="Media player for mute state"
                domain="media_player"
                allow-custom-entity
                @value-changed=${t=>this._update("mute_media_player",t.detail?.value||void 0)}
              ></ha-entity-picker>
            `:this._fallbackSingle("Media player for mute state","mute_media_player",t.mute_media_player??t.media_player??"",s)}

        <ha-select
          .value=${t.playing_variant??ot}
          label="Assist playing animation"
          @selected=${this._handlePlaying}
          @closed=${this._stop}
        >
          ${Object.entries(_t).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.media_player_equalizer??ht}
          label="Media player equalizer"
          @selected=${this._handleEqualizer}
          @closed=${this._stop}
        >
          ${Object.entries(ct).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-textfield
          label="Asset path"
          helper="Folder containing GIF assets (defaults to HACS path)"
          .value=${t.asset_path??lt}
          @input=${this._handleText}
          data-field="asset_path"
        ></ha-textfield>

        <div class="switch-row">
          <span>Hide when idle</span>
          <ha-switch
            .checked=${t.hide_when_idle??!1}
            @change=${this._handleHide}
          ></ha-switch>
        </div>

        <!-- Per-state variants -->
        <ha-select
          .value=${t.state_idle_variant??vt.idle}
          label="Idle state variant"
          @selected=${this._handleStateVariant("state_idle_variant")}
          @closed=${this._stop}
        >
          ${Object.entries(dt).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.state_listening_variant??vt.listening}
          label="Listening state variant"
          @selected=${this._handleStateVariant("state_listening_variant")}
          @closed=${this._stop}
        >
          ${Object.entries(ut).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.state_processing_variant??vt.processing}
          label="Processing state variant"
          @selected=${this._handleStateVariant("state_processing_variant")}
          @closed=${this._stop}
        >
          ${Object.entries(pt).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.state_responding_variant??vt.responding}
          label="Responding state variant"
          @selected=${this._handleStateVariant("state_responding_variant")}
          @closed=${this._stop}
        >
          ${Object.entries(gt).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.state_alarm_variant??vt.alarm}
          label="Alarm state variant"
          @selected=${this._handleStateVariant("state_alarm_variant")}
          @closed=${this._stop}
        >
          ${Object.entries(mt).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.state_countdown_variant??vt.countdown}
          label="Countdown state variant"
          @selected=${this._handleStateVariant("state_countdown_variant")}
          @closed=${this._stop}
        >
          ${Object.entries(ft).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.state_mute_variant??vt.mute}
          label="Mute state variant"
          @selected=${this._handleStateVariant("state_mute_variant")}
          @closed=${this._stop}
        >
          ${Object.entries($t).map(([t,e])=>B`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        ${this._eventsInput("Countdown events","countdown_events",t.countdown_events)}
        ${this._eventsInput("Countdown clear events","countdown_clear_events",t.countdown_clear_events)}
        ${this._eventsInput("Alarm events","alarm_events",t.alarm_events)}
        ${this._eventsInput("Alarm clear events","alarm_clear_events",t.alarm_clear_events)}

        <ha-textfield
          label="Alarm active states"
          helper="Comma separated list of states considered active"
          .value=${(t.alarm_active_states??bt).join(", ")}
          @input=${this._handleCSV}
          data-field="alarm_active_states"
        ></ha-textfield>
      </div>
    `}_eventsInput(t,e,s){return B`
      <ha-textfield
        label=${t}
        helper="Comma separated Home Assistant event types"
        .value=${(s??[]).join(", ")}
        @input=${this._handleCSV}
        data-field=${e}
      ></ha-textfield>
    `}_fallbackSingle(t,e,s,i){const a=`list-${e}`;return B`
      <ha-textfield
        label=${t}
        .value=${s??""}
        @input=${this._handleText}
        data-field=${e}
        list=${a}
      ></ha-textfield>
      <datalist id=${a}>${i.map(t=>B`<option value=${t}></option>`)}</datalist>
    `}_fallbackMulti(t,e,s,i){const a=`list-${e}`;return B`
      <ha-textfield
        label=${t}
        helper="Comma separated"
        .value=${(s??[]).join(", ")}
        @input=${this._handleCSV}
        data-field=${e}
        list=${a}
      ></ha-textfield>
      <datalist id=${a}>${i.map(t=>B`<option value=${t}></option>`)}</datalist>
    `}_stop(t){t.stopPropagation()}_update(t,e){if(!this._config)return;const s={...this._config,[t]:e};this._config=s,wt(this,"config-changed",{config:s})}static get styles(){return n`
      .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `}}St.properties={hass:{attribute:!1},_config:{state:!0}},customElements.get("nabu-eyes-dashboard-card-editor")||customElements.define("nabu-eyes-dashboard-card-editor",St);const xt=vt,Ct=["responding","playing","processing","listening","idle"];class Pt extends nt{constructor(){super(...arguments),this._countdownActive=!1,this._alarmActive=!1,this._eventUnsubscribes=[]}static async getConfigElement(){return document.createElement("nabu-eyes-dashboard-card-editor")}static getStubConfig(){return{type:"custom:nabu-eyes-dashboard-card",name:"Nabu Eyes",assist_entities:[],asset_path:lt}}setConfig(t){if(!t)throw new Error("Invalid configuration.");const e={hide_when_idle:!1,playing_variant:ot,media_player_equalizer:ht,countdown_events:[],countdown_clear_events:[],alarm_events:[],alarm_clear_events:[],alarm_active_states:bt,...t,assist_entities:Array.isArray(t.assist_entities)?[...t.assist_entities??[]]:[]};e.assist_entities=this._normalizeStringArray(e.assist_entities),e.countdown_events=this._normalizeStringArray(e.countdown_events),e.countdown_clear_events=this._normalizeStringArray(e.countdown_clear_events),e.alarm_events=this._normalizeStringArray(e.alarm_events),e.alarm_clear_events=this._normalizeStringArray(e.alarm_clear_events),e.alarm_entities=this._normalizeStringArray(e.alarm_entities),e.alarm_active_states=this._normalizeStringArray(e.alarm_active_states?.length?e.alarm_active_states:[...bt]);const s=e.asset_path?.trim();e.asset_path=s&&s.length>0?s:lt,e.playing_variant&&e.playing_variant in _t||(e.playing_variant=ot),e.media_player_equalizer&&!(e.media_player_equalizer in ct)&&(e.media_player_equalizer=ht),this._config=e,this._subscribeToEvents()}_normalizeStringArray(t){return Array.from(new Set((t??[]).map(t=>t?.trim()).filter(t=>!!t?.length)))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeFromEvents()}updated(t){t.has("hass")&&this._subscribeToEvents()}async _subscribeToEvents(){if(this._unsubscribeFromEvents(),!this.hass?.connection||!this._config)return;const t=new Set([...this._config.countdown_events??[],...this._config.countdown_clear_events??[],...this._config.alarm_events??[],...this._config.alarm_clear_events??[]]);if(0!==t.size)for(const e of t)if(e)try{const t=await this.hass.connection.subscribeEvents(t=>{this._handleEvent(e,t.event_type,t.data)},e);this._eventUnsubscribes.push(t)}catch(t){console.warn(`nabu-eyes-dashboard-card: failed to subscribe to event ${e}`,t)}}_unsubscribeFromEvents(){for(;this._eventUnsubscribes.length;){const t=this._eventUnsubscribes.pop();t&&t()}}_handleEvent(t,e,s){if(!this._config||e!==t)return;const{countdown_events:i=[],countdown_clear_events:a=[],alarm_events:n=[],alarm_clear_events:r=[]}=this._config;if(i.includes(e)&&(this._countdownActive=!0),a.includes(e)&&(this._countdownActive=!1),n.includes(e)&&(this._alarmActive=!0),r.includes(e)&&(this._alarmActive=!1),s&&Object.prototype.hasOwnProperty.call(s,"active")&&"boolean"==typeof s.active){const t=!!s.active;(i.includes(e)||a.includes(e))&&(this._countdownActive=t),(n.includes(e)||r.includes(e))&&(this._alarmActive=t)}}getCardSize(){return 3}_resolveStateFilename(t){if(!this._config)return xt[t];switch(t){case"idle":return this._config.state_idle_variant||xt.idle;case"listening":return this._config.state_listening_variant||xt.listening;case"processing":return this._config.state_processing_variant||xt.processing;case"responding":return this._config.state_responding_variant||xt.responding;case"playing":return this._config.playing_variant||xt.playing;case"alarm":return this._config.state_alarm_variant||xt.alarm;case"countdown":return this._config.state_countdown_variant||xt.countdown;case"mute":return this._config.state_mute_variant||xt.mute;default:return xt[t]}}_inferGlowClass(t){const e=t.toLowerCase();return e.includes("_dash_light")?"glow-light":e.includes("_dash_purple")?"glow-purple":e.includes("_dash_sepia")?"glow-sepia":"glow-blue"}render(){if(!this._config)return B``;const t=this._determineAsset();if(!t)return B``;const{src:e,glowClass:s}=t;return B`
      <div class="avatar-container">
        <img class="avatar ${s}" src="${e}" alt="Nabu Eyes state" />
      </div>
    `}_determineAsset(){if(!this._config)return;const t=this._config.asset_path&&this._config.asset_path.trim().length>0?this._config.asset_path:lt,e=e=>{const s=this._resolveStateFilename(e);return{src:this._composeAssetPath(t,s),glowClass:this._inferGlowClass(s)}};if(this._alarmActive||this._isAlarmEntityActive())return e("alarm");if(this._countdownActive)return e("countdown");const s=this._computeAssistState();if("playing"===s)return e("playing");if(s&&"idle"!==s)return e(s);const i=this._determineMediaPlayerAsset(t);if(i)return i;const a=this._determineMuteAsset(t);if(a)return a;if("idle"===s){if(this._config.hide_when_idle)return;return e("idle")}return this._config.hide_when_idle?void 0:e("idle")}_determineMediaPlayerAsset(t){if(!this._config?.media_player||!this.hass)return;const e=this.hass.states[this._config.media_player];if(e&&"playing"===e.state){const e=this._config.media_player_equalizer??ht,s=ct[e]?e:ht;return{src:this._composeAssetPath(t,s),glowClass:this._inferGlowClass(s)}}}_determineMuteAsset(t){const e=this._config?.mute_media_player??this._config?.media_player;if(!e||!this.hass)return;const s=this.hass.states[e];if(!s)return;if(!!!s.attributes?.is_volume_muted)return;const i=this._resolveStateFilename("mute");return{src:this._composeAssetPath(t,i),glowClass:this._inferGlowClass(i)}}_isAlarmEntityActive(){if(!this._config?.alarm_entities?.length||!this.hass)return!1;const t=this._config.alarm_active_states??bt;return this._config.alarm_entities.some(e=>{const s=this.hass.states[e];return!!s&&t.includes(s.state)})}_composeAssetPath(t,e){return t.endsWith("/")?`${t}${e}`:`${t}/${e}`}_computeAssistState(){if(!this.hass)return;const t=this._config?.assist_entities??[],e=t.length>0?t:Object.keys(this.hass.states).filter(t=>t.startsWith("assist_satellite."));if(0===e.length)return;const s=e.map(t=>this.hass.states[t]?.state).filter(t=>"string"==typeof t);for(const t of Ct)if(s.includes(t))return t}static get styles(){return n`
      :host {
        display: block;
        /* Soft overall glow size */
        --nabu-eyes-glow-radius: 30px;
      }

      .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        /* Extra vertical padding so drop-shadow glow stays within the card */
        padding: 48px 0;
        box-sizing: border-box;
      }

      .avatar {
        display: block;
        max-width: 100%;
        height: auto;
      }

      /* Variant glow colours – soft, not retina-searing */
      .glow-blue {
        filter: drop-shadow(0 0 var(--nabu-eyes-glow-radius) rgba(0, 255, 255, 0.35));
      }

      .glow-light {
        filter: drop-shadow(0 0 var(--nabu-eyes-glow-radius) rgba(0, 255, 255, 0.4));
      }

      .glow-purple {
        filter: drop-shadow(0 0 var(--nabu-eyes-glow-radius) rgba(255, 0, 255, 0.38));
      }

      .glow-sepia {
        filter: drop-shadow(0 0 var(--nabu-eyes-glow-radius) rgba(255, 210, 0, 0.35));
      }
    `}}Pt.properties={hass:{attribute:!1},_config:{state:!0},_countdownActive:{state:!0},_alarmActive:{state:!0}};const zt="nabu-eyes-dashboard-card";if(customElements.get(zt)||customElements.define(zt,Pt),"undefined"!=typeof window){window.customCards=window.customCards??[];window.customCards.some(t=>t.type===zt)||window.customCards.push({type:zt,name:"Nabu Eyes Dashboard",description:"Animated Assist avatar with media and alarm indicators.",preview:!0})}export{Pt as NabuEyesDashboardCard};
//# sourceMappingURL=nabu-eyes-dashboard-card.js.map
