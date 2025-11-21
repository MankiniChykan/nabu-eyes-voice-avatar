/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new a(i,e,s)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:o,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:_,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,d=globalThis,p=d.trustedTypes,g=p?p.emptyScript:"",m=d.reactiveElementPolyfillSupport,f=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},v=(e,t)=>!o(e,t),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);a?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[..._(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),a=e.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const n=a.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s){if(void 0!==e){const i=this.constructor,a=this[e];if(s??=i.getPropertyOptions(e),!((s.hasChanged??v)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==a||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,m?.({ReactiveElement:w}),(d.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,A=$.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,x="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,P=`<${C}>`,N=document,O=()=>N.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,H="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,q=/>/g,R=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,j=/"/g,k=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),I=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),F=new WeakMap,G=N.createTreeWalker(N,129);function W(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const Q=(e,t)=>{const s=e.length-1,i=[];let a,n=2===t?"<svg>":3===t?"<math>":"",r=T;for(let t=0;t<s;t++){const s=e[t];let o,l,c=-1,_=0;for(;_<s.length&&(r.lastIndex=_,l=r.exec(s),null!==l);)_=r.lastIndex,r===T?"!--"===l[1]?r=U:void 0!==l[1]?r=q:void 0!==l[2]?(k.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=a??T,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,o=l[1],r=void 0===l[3]?R:'"'===l[3]?j:L):r===j||r===L?r=R:r===U||r===q?r=T:(r=R,a=void 0);const h=r===R&&e[t+1].startsWith("/>")?" ":"";n+=r===T?s+P:c>=0?(i.push(o),s.slice(0,c)+x+s.slice(c)+S+h):s+S+(-2===c?t:h)}return[W(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class V{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,n=0;const r=e.length-1,o=this.parts,[l,c]=Q(e,t);if(this.el=V.createElement(l,s),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&o.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(x)){const t=c[n++],s=i.getAttribute(e).split(S),r=/([.?@])?(.*)/.exec(t);o.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?Y:"?"===r[1]?ee:"@"===r[1]?te:X}),i.removeAttribute(e)}else e.startsWith(S)&&(o.push({type:6,index:a}),i.removeAttribute(e));if(k.test(i.tagName)){const e=i.textContent.split(S),t=e.length-1;if(t>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],O()),G.nextNode(),o.push({type:2,index:++a});i.append(e[t],O())}}}else if(8===i.nodeType)if(i.data===C)o.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(S,e+1));)o.push({type:7,index:a}),e+=S.length-1}a++}}static createElement(e,t){const s=N.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,i){if(t===I)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const n=z(t)?void 0:t._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=J(e,a._$AS(e,t.values),a,i)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??N).importNode(t,!0);G.currentNode=i;let a=G.nextNode(),n=0,r=0,o=s[0];for(;void 0!==o;){if(n===o.index){let t;2===o.type?t=new Z(a,a.nextSibling,this,e):1===o.type?t=new o.ctor(a,o.name,o.strings,this,e):6===o.type&&(t=new se(a,this,e)),this._$AV.push(t),o=s[++r]}n!==o?.index&&(a=G.nextNode(),n++)}return G.currentNode=N,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),z(e)?e===D||null==e||""===e?(this._$AH!==D&&this._$AR(),this._$AH=D):e!==this._$AH&&e!==I&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==D&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=V.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new K(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new V(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new Z(this.O(O()),this.O(O()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=D,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=D}_$AI(e,t=this,s,i){const a=this.strings;let n=!1;if(void 0===a)e=J(this,e,t,0),n=!z(e)||e!==this._$AH&&e!==I,n&&(this._$AH=e);else{const i=e;let r,o;for(e=a[0],r=0;r<a.length-1;r++)o=J(this,i[s+r],t,r),o===I&&(o=this._$AH[r]),n||=!z(o)||o!==this._$AH[r],o===D?e=D:e!==D&&(e+=(o??"")+a[r+1]),this._$AH[r]=o}n&&!i&&this.j(e)}j(e){e===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===D?void 0:e}}class ee extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==D)}}class te extends X{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??D)===I)return;const s=this._$AH,i=e===D&&s!==D||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==D&&(s===D||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ie=$.litHtmlPolyfillSupport;ie?.(V,Z),($.litHtmlVersions??=[]).push("3.3.1");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new Z(t.insertBefore(O(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const re=ae.litElementPolyfillSupport;re?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.1");const oe="/hacsfiles/nabu-eyes-voice-avatar",le="nabu_playing_dash_blue.gif",ce="1px_equalizer_dash.gif",_e={"nabu_playing_dash_blue.gif":"Nabu Playing Blue (default)","nabu_playing_dash_light.gif":"Nabu Playing Light","nabu_playing_dash_purple.gif":"Nabu Playing Purple","nabu_playing_dash_sepia.gif":"Nabu Playing Sepia"},he={"1px_equalizer_dash.gif":"1px Equalizer","1px_equalizer_fader_dash.gif":"1px Equalizer Fader","1px_equalizer_fader_2_dash.gif":"1px Equalizer Fader 2","2px_equalizer_dash.gif":"2px Equalizer","2px_equalizer_fader_dash.gif":"2px Equalizer Fader","2px_equalizer_fader_2_dash.gif":"2px Equalizer Fader 2","2px_equalizer_bottom_dash.gif":"2px Equalizer Bottom","nabu_eq_dash_blue.gif":"Nabu EQ Blue","nabu_eq2_dash_blue.gif":"Nabu EQ2 Blue","nabu_eq3_dash_blue.gif":"Nabu EQ3 Blue","nabu_eq_dash_light.gif":"Nabu EQ Light","nabu_eq2_dash_light.gif":"Nabu EQ2 Light","nabu_eq3_dash_light.gif":"Nabu EQ3 Light","nabu_eq_dash_purple.gif":"Nabu EQ Purple","nabu_eq2_dash_purple.gif":"Nabu EQ2 Purple","nabu_eq3_dash_purple.gif":"Nabu EQ3 Purple","nabu_eq_dash_sepia.gif":"Nabu EQ Sepia","nabu_eq2_dash_sepia.gif":"Nabu EQ2 Sepia","nabu_eq3_dash_sepia.gif":"Nabu EQ3 Sepia"},ue={"nabu_idle_dash_blue.gif":"Idle – Blue","nabu_idle_dash_light.gif":"Idle – Light","nabu_idle_dash_purple.gif":"Idle – Purple","nabu_idle_dash_sepia.gif":"Idle – Sepia"},de={"nabu_listening_dash_blue.gif":"Listening – Blue","nabu_listening_dash_light.gif":"Listening – Light","nabu_listening_dash_purple.gif":"Listening – Purple","nabu_listening_dash_sepia.gif":"Listening – Sepia"},pe={"nabu_processing_dash_blue.gif":"Processing – Blue","nabu_processing_dash_light.gif":"Processing – Light","nabu_processing_dash_purple.gif":"Processing – Purple","nabu_processing_dash_sepia.gif":"Processing – Sepia"},ge={"nabu_responding_dash_blue.gif":"Responding – Blue","nabu_responding_dash_light.gif":"Responding – Light","nabu_responding_dash_purple.gif":"Responding – Purple","nabu_responding_dash_sepia.gif":"Responding – Sepia"},me={"nabu_alarm_dash_blue.gif":"Alarm – Blue","nabu_alarm_dash_light.gif":"Alarm – Light","nabu_alarm_dash_purple.gif":"Alarm – Purple","nabu_alarm_dash_sepia.gif":"Alarm – Sepia"},fe={"nabu_countdown_dash_blue.gif":"Countdown – Blue","nabu_countdown_dash_light.gif":"Countdown – Light","nabu_countdown_dash_purple.gif":"Countdown – Purple","nabu_countdown_dash_sepia.gif":"Countdown – Sepia"},be={"nabu_mute_dash_blue.gif":"Mute – Blue","nabu_mute_dash_light.gif":"Mute – Light","nabu_mute_dash_purple.gif":"Mute – Purple","nabu_mute_dash_sepia.gif":"Mute – Sepia"},ve={idle:"nabu_idle_dash_blue.gif",listening:"nabu_listening_dash_blue.gif",processing:"nabu_processing_dash_blue.gif",responding:"nabu_responding_dash_blue.gif",playing:"nabu_playing_dash_blue.gif",alarm:"nabu_alarm_dash_blue.gif",countdown:"nabu_countdown_dash_blue.gif",mute:"nabu_mute_dash_blue.gif"},ye=["on","detected","unavailable"];var we,$e;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(we||(we={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}($e||($e={}));var Ae=function(e,t,s,i){i=i||{},s=null==s?{}:s;var a=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return a.detail=s,e.dispatchEvent(a),a};const Ee="rgba(0, 21, 255, 0.5)",xe="rgba(0, 255, 255, 0.5)",Se="rgba(255, 0, 255, 0.5)",Ce="rgba(255, 210, 0, 0.5)",Pe=[{name:"name",selector:{text:{}}},{name:"assist_entities",selector:{entity:{domain:"assist_satellite",multiple:!0}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"mute_media_player",selector:{entity:{domain:"media_player"}}},{name:"playing_variant",selector:{select:{options:Object.entries(_e).map(([e,t])=>({value:e,label:t}))}}},{name:"media_player_equalizer",selector:{select:{options:Object.entries(he).map(([e,t])=>({value:e,label:t}))}}},{name:"asset_path",selector:{text:{}}},{name:"hide_when_idle",selector:{boolean:{}}},{name:"fullscreen_overlay",selector:{boolean:{}}},{name:"state_idle_variant",selector:{select:{options:Object.entries(ue).map(([e,t])=>({value:e,label:t}))}}},{name:"state_listening_variant",selector:{select:{options:Object.entries(de).map(([e,t])=>({value:e,label:t}))}}},{name:"state_processing_variant",selector:{select:{options:Object.entries(pe).map(([e,t])=>({value:e,label:t}))}}},{name:"state_responding_variant",selector:{select:{options:Object.entries(ge).map(([e,t])=>({value:e,label:t}))}}},{name:"state_alarm_variant",selector:{select:{options:Object.entries(me).map(([e,t])=>({value:e,label:t}))}}},{name:"state_countdown_variant",selector:{select:{options:Object.entries(fe).map(([e,t])=>({value:e,label:t}))}}},{name:"state_mute_variant",selector:{select:{options:Object.entries(be).map(([e,t])=>({value:e,label:t}))}}},{name:"countdown_events",selector:{text:{multiline:!0}}},{name:"countdown_clear_events",selector:{text:{multiline:!0}}},{name:"alarm_events",selector:{text:{multiline:!0}}},{name:"alarm_clear_events",selector:{text:{multiline:!0}}},{name:"alarm_active_states",selector:{text:{multiline:!0}}},{name:"glow_radius",selector:{number:{min:0,max:200,mode:"box"}}},{name:"avatar_padding_vertical",selector:{number:{min:0,max:200,mode:"box"}}}];class Ne extends ne{constructor(){super(...arguments),this._bootstrapped=!1,this._resetGlowColours=()=>{if(!this._config)return;const e={...this._config,glow_color_blue:Ee,glow_color_light:xe,glow_color_purple:Se,glow_color_sepia:Ce};this._config=e,Ae(this,"config-changed",{config:e})},this._computeLabel=e=>{switch(e.name){case"name":return"Name";case"assist_entities":return"Assist satellite entities";case"media_player":return"Media player for equalizer";case"mute_media_player":return"Media player for mute state";case"playing_variant":return"Assist playing animation";case"media_player_equalizer":return"Media player equalizer";case"asset_path":return"Asset path";case"hide_when_idle":return"Hide when idle";case"fullscreen_overlay":return"Overlay on top (centered)";case"state_idle_variant":return"Idle state variant";case"state_listening_variant":return"Listening state variant";case"state_processing_variant":return"Processing state variant";case"state_responding_variant":return"Responding state variant";case"state_alarm_variant":return"Alarm state variant";case"state_countdown_variant":return"Countdown state variant";case"state_mute_variant":return"Mute state variant";case"countdown_events":return"Countdown events";case"countdown_clear_events":return"Countdown clear events";case"alarm_events":return"Alarm events";case"alarm_clear_events":return"Alarm clear events";case"alarm_active_states":return"Alarm active states";case"glow_radius":return"Glow radius (px)";case"avatar_padding_vertical":return"Vertical padding (px)";default:return e.name}},this._computeHelper=e=>{switch(e.name){case"asset_path":return"Folder containing GIF assets (defaults to HACS path)";case"countdown_events":case"countdown_clear_events":case"alarm_events":case"alarm_clear_events":return"One event type per line or comma separated";case"alarm_active_states":return"One state per line or comma separated";default:return}}}setConfig(e){this._config={...e,assist_entities:[...e.assist_entities??[]],countdown_events:[...e.countdown_events??[]],countdown_clear_events:[...e.countdown_clear_events??[]],alarm_events:[...e.alarm_events??[]],alarm_clear_events:[...e.alarm_clear_events??[]],alarm_entities:[...e.alarm_entities??[]],alarm_active_states:[...e.alarm_active_states??ye],hide_when_idle:e.hide_when_idle??!1,glow_radius:e.glow_radius??40,avatar_padding_vertical:e.avatar_padding_vertical??0,glow_color_blue:e.glow_color_blue??Ee,glow_color_light:e.glow_color_light??xe,glow_color_purple:e.glow_color_purple??Se,glow_color_sepia:e.glow_color_sepia??Ce,fullscreen_overlay:e.fullscreen_overlay??!1,asset_path:e.asset_path??oe,playing_variant:e.playing_variant??le,media_player_equalizer:e.media_player_equalizer??ce,state_idle_variant:e.state_idle_variant??ve.idle,state_listening_variant:e.state_listening_variant??ve.listening,state_processing_variant:e.state_processing_variant??ve.processing,state_responding_variant:e.state_responding_variant??ve.responding,state_alarm_variant:e.state_alarm_variant??ve.alarm,state_countdown_variant:e.state_countdown_variant??ve.countdown,state_mute_variant:e.state_mute_variant??ve.mute}}render(){if(!this.hass||!this._config)return B``;if(!this._bootstrapped){this._bootstrapped=!0;const e={};if(!this._config.assist_entities?.length){const t=Object.keys(this.hass.states).filter(e=>e.startsWith("assist_satellite."));t.length&&(e.assist_entities=t)}const t=this._config.media_player??Object.keys(this.hass.states).find(e=>e.startsWith("media_player."));if(!this._config.media_player&&t&&(e.media_player=t),!this._config.mute_media_player&&t&&(e.mute_media_player=t),Object.keys(e).length){const t={...this._config,...e};this._config=t,Ae(this,"config-changed",{config:t})}}const e=this._config,t=this._rgbaToHexAlpha(e.glow_color_blue??Ee,Ee),s=this._rgbaToHexAlpha(e.glow_color_light??xe,xe),i=this._rgbaToHexAlpha(e.glow_color_purple??Se,Se),a=this._rgbaToHexAlpha(e.glow_color_sepia??Ce,Ce);return B`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${e}
          .schema=${Pe}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <!-- Legacy RGBA colour pickers with alpha channel -->
        <h3 class="section-heading">Variant Glow Colours (RGBA)</h3>

        ${this._glowRow("Blue Glow","glow_color_blue",t.hex,t.alpha,Ee)}
        ${this._glowRow("Light Glow","glow_color_light",s.hex,s.alpha,xe)}
        ${this._glowRow("Purple Glow","glow_color_purple",i.hex,i.alpha,Se)}
        ${this._glowRow("Sepia Glow","glow_color_sepia",a.hex,a.alpha,Ce)}

        <div class="glow-reset-row">
          <span class="glow-reset-heading">Reset Glow Colours</span>
          <mwc-button class="glow-reset-button" @click=${this._resetGlowColours}>
            Reset glow colours
          </mwc-button>
        </div>
      </div>
    `}_valueChanged(e){if(!e.detail?.value)return;const t=e.detail.value,s=e=>{const s=t[e];Array.isArray(s)||"string"==typeof s&&(t[e]=s.split(/[\n,]/).map(e=>e.trim()).filter(Boolean))};s("countdown_events"),s("countdown_clear_events"),s("alarm_events"),s("alarm_clear_events"),s("alarm_active_states"),this._config=t,Ae(this,"config-changed",{config:t})}_glowRow(e,t,s,i,a){return B`
      <div class="color-row">
        <div class="color-label">${e}</div>
        <input
          type="color"
          class="color-input"
          .value=${s}
          @input=${e=>{const s=e.currentTarget,i=this._config&&this._config[t]||a,n=this._rgbaToHexAlpha(i,a),r=this._rgbaFromHexAlpha(s.value,n.alpha);this._update(t,r)}}
        />
        <ha-textfield
          class="alpha-input"
          label="α"
          type="number"
          min="0"
          max="1"
          step="0.05"
          .value=${String(i)}
          @input=${e=>{const s=e.currentTarget,i=Number(s.value);if(Number.isNaN(i))return;const n=Math.min(1,Math.max(0,i)),r=this._config&&this._config[t]||a,o=this._rgbaToHexAlpha(r,a),l=this._rgbaFromHexAlpha(o.hex,n);this._update(t,l)}}
        ></ha-textfield>
      </div>
    `}_rgbaToHexAlpha(e,t){const s=(e||t).trim(),i=s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);if(i){const e=Number(i[1]),t=Number(i[2]),s=Number(i[3]),a=void 0!==i[4]?Number(i[4]):1,n="#"+[e,t,s].map(e=>{const t=Math.min(255,Math.max(0,Math.round(e))).toString(16);return 1===t.length?`0${t}`:t}).join("");return{hex:n,alpha:Math.min(1,Math.max(0,isNaN(a)?1:a))}}if(s.startsWith("#")){let e=s;if(4===e.length){const t=e[1],s=e[2],i=e[3];e=`#${t}${t}${s}${s}${i}${i}`}if(7===e.length)return{hex:e,alpha:1}}return this._rgbaToHexAlpha(t,t)}_rgbaFromHexAlpha(e,t){let s=e.trim();if(s.startsWith("#")||(s=`#${s}`),4===s.length){const e=s[1],t=s[2],i=s[3];s=`#${e}${e}${t}${t}${i}${i}`}if(7!==s.length)return Ee;return`rgba(${parseInt(s.slice(1,3),16)}, ${parseInt(s.slice(3,5),16)}, ${parseInt(s.slice(5,7),16)}, ${Math.min(1,Math.max(0,t))})`}_update(e,t){if(!this._config)return;const s={...this._config,[e]:t};this._config=s,Ae(this,"config-changed",{config:s})}static get styles(){return n`
      .form {
        display: block;
      }

      ha-form {
        --ha-form-label-width: 180px;
      }

      .section-heading {
        margin-top: 16px;
        font-size: 14px;
        font-weight: 500;
        opacity: 0.8;
      }

      .color-row {
        display: grid;
        grid-template-columns: 2fr auto 80px;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }

      .color-label {
        font-size: 13px;
      }

      .color-input {
        width: 40px;
        height: 24px;
        padding: 0;
        border: none;
        background: transparent;
      }

      .alpha-input {
        --mdc-text-field-outlined-hover-border-color: transparent;
      }

      .glow-reset-row {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .glow-reset-heading {
        font-size: 13px;
        opacity: 0.8;
      }

      .glow-reset-button {
        --mdc-theme-primary: #f44336;
      }
    `}}Ne.properties={hass:{attribute:!1},_config:{state:!0}},customElements.get("nabu-eyes-dashboard-card-editor")||customElements.define("nabu-eyes-dashboard-card-editor",Ne);const Oe=ve,ze=["responding","playing","processing","listening","idle"];class Me extends ne{constructor(){super(...arguments),this._countdownActive=!1,this._alarmActive=!1,this._eventUnsubscribes=[]}static async getConfigElement(){return document.createElement("nabu-eyes-dashboard-card-editor")}static getStubConfig(){return{type:"custom:nabu-eyes-dashboard-card",name:"Nabu Eyes",assist_entities:[],asset_path:oe}}setConfig(e){if(!e)throw new Error("Invalid configuration.");const t={hide_when_idle:!1,playing_variant:le,media_player_equalizer:ce,countdown_events:[],countdown_clear_events:[],alarm_events:[],alarm_clear_events:[],alarm_active_states:ye,glow_radius:40,glow_color_blue:"rgba(0, 21, 255, 0.5)",glow_color_light:"rgba(0, 255, 255, 0.5)",glow_color_purple:"rgba(255, 0, 255, 0.5)",glow_color_sepia:"rgba(255, 210, 0, 0.5)",avatar_padding_vertical:0,fullscreen_overlay:!1,...e,assist_entities:Array.isArray(e.assist_entities)?[...e.assist_entities??[]]:[]};t.assist_entities=this._normalizeStringArray(t.assist_entities),t.countdown_events=this._normalizeStringArray(t.countdown_events),t.countdown_clear_events=this._normalizeStringArray(t.countdown_clear_events),t.alarm_events=this._normalizeStringArray(t.alarm_events),t.alarm_clear_events=this._normalizeStringArray(t.alarm_clear_events),t.alarm_entities=this._normalizeStringArray(t.alarm_entities),t.alarm_active_states=this._normalizeStringArray(t.alarm_active_states?.length?t.alarm_active_states:[...ye]);const s=t.asset_path?.trim();t.asset_path=s&&s.length>0?s:oe,t.playing_variant&&t.playing_variant in _e||(t.playing_variant=le),t.media_player_equalizer&&!(t.media_player_equalizer in he)&&(t.media_player_equalizer=ce),this._config=t,this._subscribeToEvents()}_normalizeStringArray(e){return Array.from(new Set((e??[]).map(e=>e?.trim()).filter(e=>!!e?.length)))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeFromEvents()}updated(e){e.has("hass")&&this._subscribeToEvents()}async _subscribeToEvents(){if(this._unsubscribeFromEvents(),!this.hass?.connection||!this._config)return;const e=new Set([...this._config.countdown_events??[],...this._config.countdown_clear_events??[],...this._config.alarm_events??[],...this._config.alarm_clear_events??[]]);if(0!==e.size)for(const t of e)if(t)try{const e=await this.hass.connection.subscribeEvents(e=>{this._handleEvent(t,e.event_type,e.data)},t);this._eventUnsubscribes.push(e)}catch(e){console.warn(`nabu-eyes-dashboard-card: failed to subscribe to event ${t}`,e)}}_unsubscribeFromEvents(){for(;this._eventUnsubscribes.length;){const e=this._eventUnsubscribes.pop();e&&e()}}_handleEvent(e,t,s){if(!this._config||t!==e)return;const{countdown_events:i=[],countdown_clear_events:a=[],alarm_events:n=[],alarm_clear_events:r=[]}=this._config;if(i.includes(t)&&(this._countdownActive=!0),a.includes(t)&&(this._countdownActive=!1),n.includes(t)&&(this._alarmActive=!0),r.includes(t)&&(this._alarmActive=!1),s&&Object.prototype.hasOwnProperty.call(s,"active")&&"boolean"==typeof s.active){const e=!!s.active;(i.includes(t)||a.includes(t))&&(this._countdownActive=e),(n.includes(t)||r.includes(t))&&(this._alarmActive=e)}}getCardSize(){return 3}_resolveStateFilename(e){if(!this._config)return Oe[e];switch(e){case"idle":return this._config.state_idle_variant||Oe.idle;case"listening":return this._config.state_listening_variant||Oe.listening;case"processing":return this._config.state_processing_variant||Oe.processing;case"responding":return this._config.state_responding_variant||Oe.responding;case"playing":return this._config.playing_variant||Oe.playing;case"alarm":return this._config.state_alarm_variant||Oe.alarm;case"countdown":return this._config.state_countdown_variant||Oe.countdown;case"mute":return this._config.state_mute_variant||Oe.mute;default:return Oe[e]}}_inferGlowClass(e){const t=e.toLowerCase();return t.includes("_dash_light")?"glow-light":t.includes("_dash_purple")?"glow-purple":t.includes("_dash_sepia")?"glow-sepia":"glow-blue"}render(){if(!this._config)return B``;const e=this._determineAsset();if(!e)return B``;const{src:t,glowClass:s}=e,i=this._config.glow_radius??40,a=this._config.avatar_padding_vertical??0,n=this._config.fullscreen_overlay??!1,{glow_color_blue:r="rgba(0, 21, 255, 0.5)",glow_color_light:o="rgba(0, 255, 255, 0.5)",glow_color_purple:l="rgba(255, 0, 255, 0.5)",glow_color_sepia:c="rgba(255, 210, 0, 0.5)"}=this._config,_=[`--nabu-eyes-glow-radius: ${i}px`,`--nabu-eyes-glow-color-blue: ${r}`,`--nabu-eyes-glow-color-light: ${o}`,`--nabu-eyes-glow-color-purple: ${l}`,`--nabu-eyes-glow-color-sepia: ${c}`,`--nabu-eyes-padding-vertical: ${a}px`].join("; ");return B`
      <div class="${n?"avatar-container overlay":"avatar-container"}" style=${_}>
        <img class="avatar ${s}" src="${t}" alt="Nabu Eyes state" />
      </div>
    `}_determineAsset(){if(!this._config)return;const e=this._config.asset_path&&this._config.asset_path.trim().length>0?this._config.asset_path:oe,t=t=>{const s=this._resolveStateFilename(t);return{src:this._composeAssetPath(e,s),glowClass:this._inferGlowClass(s)}};if(this._alarmActive||this._isAlarmEntityActive())return t("alarm");if(this._countdownActive)return t("countdown");const s=this._computeAssistState();if("playing"===s)return t("playing");if(s&&"idle"!==s)return t(s);const i=this._determineMediaPlayerAsset(e);if(i)return i;const a=this._determineMuteAsset(e);if(a)return a;if("idle"===s){if(this._config.hide_when_idle)return;return t("idle")}return this._config.hide_when_idle?void 0:t("idle")}_determineMediaPlayerAsset(e){if(!this._config?.media_player||!this.hass)return;const t=this.hass.states[this._config.media_player];if(t&&"playing"===t.state){const t=this._config.media_player_equalizer??ce,s=he[t]?t:ce;return{src:this._composeAssetPath(e,s),glowClass:this._inferGlowClass(s)}}}_determineMuteAsset(e){const t=this._config?.mute_media_player??this._config?.media_player;if(!t||!this.hass)return;const s=this.hass.states[t];if(!s)return;if(!!!s.attributes?.is_volume_muted)return;const i=this._resolveStateFilename("mute");return{src:this._composeAssetPath(e,i),glowClass:this._inferGlowClass(i)}}_isAlarmEntityActive(){if(!this._config?.alarm_entities?.length||!this.hass)return!1;const e=this._config.alarm_active_states??ye;return this._config.alarm_entities.some(t=>{const s=this.hass.states[t];return!!s&&e.includes(s.state)})}_composeAssetPath(e,t){return e.endsWith("/")?`${e}${t}`:`${e}/${t}`}_computeAssistState(){if(!this.hass)return;const e=this._config?.assist_entities??[],t=e.length>0?e:Object.keys(this.hass.states).filter(e=>e.startsWith("assist_satellite."));if(0===t.length)return;const s=t.map(e=>this.hass.states[e]?.state).filter(e=>"string"==typeof e);for(const e of ze)if(s.includes(e))return e}static get styles(){return n`
      :host {
        display: block;
        /* default radius + border colour */
        --nabu-eyes-glow-radius: 40px;
        --nabu-eyes-border-color: #000;
      }

      .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--nabu-eyes-padding-vertical, 0px) 0;
        box-sizing: border-box;
      }

      .avatar-container.overlay {
        position: fixed;
        inset: 0;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        pointer-events: none; /* let clicks pass through to dashboard */
      }

      .avatar {
        display: block;
        max-width: 100%;
        height: auto;
      }

      /* One tight black halo around non-transparent pixels + single colour glow per palette */

      .glow-blue {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius) var(--nabu-eyes-glow-color-blue, rgba(0, 21, 255, 0.5))
          );
      }

      .glow-light {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius)
              var(--nabu-eyes-glow-color-light, rgba(0, 255, 255, 0.5))
          );
      }

      .glow-purple {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius)
              var(--nabu-eyes-glow-color-purple, rgba(255, 0, 255, 0.5))
          );
      }

      .glow-sepia {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius)
              var(--nabu-eyes-glow-color-sepia, rgba(255, 208, 0, 0.5))
          );
      }
    `}}Me.properties={hass:{attribute:!1},_config:{state:!0},_countdownActive:{state:!0},_alarmActive:{state:!0}};const He="nabu-eyes-dashboard-card";if(customElements.get(He)||customElements.define(He,Me),"undefined"!=typeof window){window.customCards=window.customCards??[];window.customCards.some(e=>e.type===He)||window.customCards.push({type:He,name:"Nabu Eyes Dashboard",description:"Animated Assist avatar with media and alarm indicators.",preview:!0})}export{Me as NabuEyesDashboardCard};
//# sourceMappingURL=nabu-eyes-dashboard-card.js.map
