/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:_}=Object,u=globalThis,p=u.trustedTypes,m=p?p.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const a=i?.call(this);n?.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const a=n.fromAttribute(e,t.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,n=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??v)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==n||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[g("elementProperties")]=new Map,A[g("finalized")]=new Map,f?.({ReactiveElement:A}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b=globalThis,w=b.trustedTypes,E=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+x,P=`<${C}>`,z=document,U=()=>z.createComment(""),q=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,M="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,H=/>/g,k=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),L=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),V=new WeakMap,W=z.createTreeWalker(z,129);function F(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,a=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<s;e++){const s=t[e];let o,l,h=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===N?"!--"===l[1]?r=O:void 0!==l[1]?r=H:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=k):void 0!==l[3]&&(r=k):r===k?">"===l[0]?(r=n??N,h=-1):void 0===l[1]?h=-2:(h=r.lastIndex-l[2].length,o=l[1],r=void 0===l[3]?k:'"'===l[3]?j:R):r===j||r===R?r=k:r===O||r===H?r=N:(r=k,n=void 0);const d=r===k&&t[e+1].startsWith("/>")?" ":"";a+=r===N?s+P:h>=0?(i.push(o),s.slice(0,h)+S+s.slice(h)+x+d):s+x+(-2===h?e:d)}return[F(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0;const r=t.length-1,o=this.parts,[l,h]=J(t,e);if(this.el=K.createElement(l,s),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=W.nextNode())&&o.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=h[a++],s=i.getAttribute(t).split(x),r=/([.?@])?(.*)/.exec(e);o.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?Y:"?"===r[1]?tt:"@"===r[1]?et:X}),i.removeAttribute(t)}else t.startsWith(x)&&(o.push({type:6,index:n}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(x),e=t.length-1;if(e>0){i.textContent=w?w.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),W.nextNode(),o.push({type:2,index:++n});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===C)o.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(x,t+1));)o.push({type:7,index:n}),t+=x.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===L)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const a=q(e)?void 0:e._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),void 0===a?n=void 0:(n=new a(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);W.currentNode=i;let n=W.nextNode(),a=0,r=0,o=s[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new Q(n,n.nextSibling,this,t):1===o.type?e=new o.ctor(n,o.name,o.strings,this,t):6===o.type&&(e=new st(n,this,t)),this._$AV.push(e),o=s[++r]}a!==o?.index&&(n=W.nextNode(),a++)}return W.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),q(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&q(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(F(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}_$AI(t,e=this,s,i){const n=this.strings;let a=!1;if(void 0===n)t=Z(this,t,e,0),a=!q(t)||t!==this._$AH&&t!==L,a&&(this._$AH=t);else{const i=t;let r,o;for(t=n[0],r=0;r<n.length-1;r++)o=Z(this,i[s+r],e,r),o===L&&(o=this._$AH[r]),a||=!q(o)||o!==this._$AH[r],o===B?t=B:t!==B&&(t+=(o??"")+n[r+1]),this._$AH[r]=o}a&&!i&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class et extends X{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??B)===L)return;const s=this._$AH,i=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==B&&(s===B||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const it=b.litHtmlPolyfillSupport;it?.(K,Q),(b.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(U(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const rt=nt.litElementPolyfillSupport;rt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.1");const ot="/hacsfiles/nabu-eyes-voice-avatar/nabu_eyes_dashboard",lt={"nabu_playing_dash.gif":"Nabu Playing","nabu_equalizer_dash.gif":"Nabu Equalizer","nabu_equalizer_2_dash.gif":"Nabu Equalizer 2"},ht={"nabu_equalizer_dash.gif":"Nabu Equalizer","nabu_equalizer_2_dash.gif":"Nabu Equalizer 2","1px_equalizer_dash.gif":"1px Equalizer","1px_equalizer_fader_dash.gif":"1px Equalizer Fader","1px_equalizer_fader_2_dash.gif":"1px Equalizer Fader 2","2px_equalizer_dash.gif":"2px Equalizer","2px_equalizer_fader_dash.gif":"2px Equalizer Fader","2px_equalizer_fader_2_dash.gif":"2px Equalizer Fader 2","2px_equalizer_bottom_dash.gif":"2px Bottom Equalizer","nabu_music_dash.gif":"Nabu Music"},ct=["on","detected","unavailable"];var dt,_t;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(dt||(dt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(_t||(_t={}));class ut extends at{setConfig(t){this._config={...t,assist_entities:[...t.assist_entities??[]],countdown_events:[...t.countdown_events??[]],countdown_clear_events:[...t.countdown_clear_events??[]],alarm_events:[...t.alarm_events??[]],alarm_clear_events:[...t.alarm_clear_events??[]],alarm_entities:[...t.alarm_entities??[]],alarm_active_states:[...t.alarm_active_states??ct]}}render(){if(!this.hass||!this._config)return D``;const t=this._config;return D`
      <div class="form">
        <ha-textfield
          label="Name"
          .value=${t.name??""}
          @input=${this._handleTextValue}
          data-field="name"
        ></ha-textfield>

        <!-- Assist satellites (multi) -->
        <ha-entities-picker
          .hass=${this.hass}
          .value=${t.assist_entities??[]}
          label="Assist satellite entities"
          domain="assist_satellite"
          allow-custom-entity
          @value-changed=${t=>this._updateConfig("assist_entities",t.detail?.value??[])}
        ></ha-entities-picker>

        <!-- Media player for equalizer (single) -->
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t.media_player??""}
          label="Media player for equalizer"
          domain="media_player"
          allow-custom-entity
          @value-changed=${t=>this._updateConfig("media_player",t.detail?.value||void 0)}
        ></ha-entity-picker>

        <!-- Media player for mute state (single) -->
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t.mute_media_player??""}
          label="Media player for mute state"
          domain="media_player"
          allow-custom-entity
          @value-changed=${t=>this._updateConfig("mute_media_player",t.detail?.value||void 0)}
        ></ha-entity-picker>

        <!-- Alarm / doorbell entities (multi) -->
        <ha-entities-picker
          .hass=${this.hass}
          .value=${t.alarm_entities??[]}
          label="Alarm / doorbell entities"
          allow-custom-entity
          @value-changed=${t=>this._updateConfig("alarm_entities",t.detail?.value??[])}
        ></ha-entities-picker>

        <ha-select
          .value=${t.playing_variant??"nabu_playing_dash.gif"}
          label="Assist playing animation"
          @selected=${this._handlePlayingVariant}
          @closed=${this._stopPropagation}
        >
          ${Object.entries(lt).map(([t,e])=>D`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-select
          .value=${t.media_player_equalizer??"nabu_equalizer_dash.gif"}
          label="Media player equalizer"
          @selected=${this._handleEqualizerVariant}
          @closed=${this._stopPropagation}
        >
          ${Object.entries(ht).map(([t,e])=>D`<mwc-list-item .value=${t}>${e}</mwc-list-item>`)}
        </ha-select>

        <ha-textfield
          label="Asset path"
          helper="Folder containing GIF assets (defaults to the HACS install path)"
          .value=${t.asset_path??ot}
          @input=${this._handleTextValue}
          data-field="asset_path"
        ></ha-textfield>

        <div class="switch-row">
          <span>Hide when idle</span>
          <ha-switch
            .checked=${t.hide_when_idle??!0}
            @change=${this._handleHideWhenIdle}
          ></ha-switch>
        </div>

        ${this._renderEventInputs("Countdown events","countdown_events",t.countdown_events)}
        ${this._renderEventInputs("Countdown clear events","countdown_clear_events",t.countdown_clear_events)}
        ${this._renderEventInputs("Alarm events","alarm_events",t.alarm_events)}
        ${this._renderEventInputs("Alarm clear events","alarm_clear_events",t.alarm_clear_events)}

        <ha-textfield
          label="Alarm active states"
          helper="Comma separated list of states considered active"
          .value=${(t.alarm_active_states??ct).join(", ")}
          @input=${this._handleStringArray}
          data-field="alarm_active_states"
        ></ha-textfield>
      </div>
    `}_renderEventInputs(t,e,s){return D`
      <ha-textfield
        label=${t}
        helper="Comma separated list of Home Assistant event types"
        .value=${(s??[]).join(", ")}
        @input=${this._handleStringArray}
        data-field=${e}
      ></ha-textfield>
    `}_handleTextValue(t){const e=t.currentTarget;if(!e?.dataset?.field||!this._config)return;const s=e.value;this._updateConfig(e.dataset.field,s||void 0)}_handleStringArray(t){const e=t.currentTarget;if(!e?.dataset?.field||!this._config)return;const s=e.value.split(",").map(t=>t.trim()).filter(t=>t.length>0);this._updateConfig(e.dataset.field,s)}_handlePlayingVariant(t){const e=t.currentTarget,s=e?.value;s&&s in lt&&this._updateConfig("playing_variant",s)}_handleEqualizerVariant(t){const e=t.currentTarget,s=e?.value;s&&s in ht&&this._updateConfig("media_player_equalizer",s)}_handleHideWhenIdle(t){const e=t.currentTarget;this._updateConfig("hide_when_idle",!!e?.checked)}_stopPropagation(t){t.stopPropagation()}_updateConfig(t,e){if(!this._config)return;const s={...this._config,[t]:e};this._config=s,function(t,e,s,i){i=i||{},s=null==s?{}:s;var n=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});n.detail=s,t.dispatchEvent(n)}(this,"config-changed",{config:s})}static get styles(){return a`
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
    `}}ut.properties={hass:{attribute:!1},_config:{state:!0}},customElements.get("nabu-eyes-dashboard-card-editor")||customElements.define("nabu-eyes-dashboard-card-editor",ut);const pt={idle:"nabu_idle_preview_dash.gif",listening:"nabu_listening_dash.gif",processing:"nabu_processing_dash.gif",responding:"nabu_responding_dash.gif",playing:"nabu_playing_dash.gif",alarm:"nabu_alarm_dash.gif",countdown:"nabu_countdown_dash.gif",mute:"nabu_mute_dash.gif"},mt=["responding","playing","processing","listening","idle"];class ft extends at{constructor(){super(...arguments),this._countdownActive=!1,this._alarmActive=!1,this._eventUnsubscribes=[]}static async getConfigElement(){return document.createElement("nabu-eyes-dashboard-card-editor")}static getStubConfig(){return{type:"custom:nabu-eyes-dashboard-card",name:"Nabu Eyes",assist_entities:[],asset_path:ot}}setConfig(t){if(!t)throw new Error("Invalid configuration.");const e={hide_when_idle:!0,playing_variant:"nabu_playing_dash.gif",media_player_equalizer:"nabu_equalizer_dash.gif",countdown_events:[],countdown_clear_events:[],alarm_events:[],alarm_clear_events:[],alarm_active_states:ct,...t,assist_entities:Array.isArray(t.assist_entities)?[...t.assist_entities??[]]:[]};e.assist_entities=this._normalizeStringArray(e.assist_entities),e.countdown_events=this._normalizeStringArray(e.countdown_events),e.countdown_clear_events=this._normalizeStringArray(e.countdown_clear_events),e.alarm_events=this._normalizeStringArray(e.alarm_events),e.alarm_clear_events=this._normalizeStringArray(e.alarm_clear_events),e.alarm_entities=this._normalizeStringArray(e.alarm_entities),e.alarm_active_states=this._normalizeStringArray(e.alarm_active_states?.length?e.alarm_active_states:[...ct]);const s=e.asset_path?.trim();e.asset_path=s&&s.length>0?s:ot,e.playing_variant&&e.playing_variant in lt||(e.playing_variant="nabu_playing_dash.gif"),e.media_player_equalizer&&!(e.media_player_equalizer in ht)&&(e.media_player_equalizer="nabu_equalizer_dash.gif"),this._config=e,this._subscribeToEvents()}_normalizeStringArray(t){return Array.from(new Set((t??[]).map(t=>t?.trim()).filter(t=>!!t?.length)))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeFromEvents()}updated(t){t.has("hass")&&this._subscribeToEvents()}async _subscribeToEvents(){if(this._unsubscribeFromEvents(),!this.hass?.connection||!this._config)return;const t=new Set([...this._config.countdown_events??[],...this._config.countdown_clear_events??[],...this._config.alarm_events??[],...this._config.alarm_clear_events??[]]);if(0!==t.size)for(const e of t)if(e)try{const t=await this.hass.connection.subscribeEvents(t=>{this._handleEvent(e,t.event_type,t.data)},e);this._eventUnsubscribes.push(t)}catch(t){console.warn(`nabu-eyes-dashboard-card: failed to subscribe to event ${e}`,t)}}_unsubscribeFromEvents(){for(;this._eventUnsubscribes.length;){const t=this._eventUnsubscribes.pop();t&&t()}}_handleEvent(t,e,s){if(!this._config||e!==t)return;const{countdown_events:i=[],countdown_clear_events:n=[],alarm_events:a=[],alarm_clear_events:r=[]}=this._config;if(i.includes(e)&&(this._countdownActive=!0),n.includes(e)&&(this._countdownActive=!1),a.includes(e)&&(this._alarmActive=!0),r.includes(e)&&(this._alarmActive=!1),s&&Object.prototype.hasOwnProperty.call(s,"active")&&"boolean"==typeof s.active){const t=!!s.active;(i.includes(e)||n.includes(e))&&(this._countdownActive=t),(a.includes(e)||r.includes(e))&&(this._alarmActive=t)}}getCardSize(){return 3}render(){if(!this._config)return D``;const t=this._determineAsset();return t?D`
      <ha-card>
        ${this._config.name?D`<div class="card-header">${this._config.name}</div>`:null}
        <div class="avatar-container">
          <img src="${t}" alt="Nabu Eyes state" />
        </div>
      </ha-card>
    `:D``}_determineAsset(){if(!this._config)return;const t=this._config.asset_path&&this._config.asset_path.trim().length>0?this._config.asset_path:ot;if(this._alarmActive||this._isAlarmEntityActive())return this._composeAssetPath(t,pt.alarm);if(this._countdownActive)return this._composeAssetPath(t,pt.countdown);const e=this._computeAssistState();if("playing"===e){const e=this._config.playing_variant??"nabu_playing_dash.gif";return this._composeAssetPath(t,e)}if(e&&"idle"!==e){const s=pt[e];return this._composeAssetPath(t,s)}const s=this._determineMediaPlayerAsset(t);if(s)return s;const i=this._determineMuteAsset(t);if(i)return i;if("idle"===e){if(this._config.hide_when_idle)return;return this._composeAssetPath(t,pt.idle)}return this._config.hide_when_idle?void 0:this._composeAssetPath(t,pt.idle)}_determineMediaPlayerAsset(t){if(!this._config?.media_player||!this.hass)return;const e=this.hass.states[this._config.media_player];if(e&&"playing"===e.state){const e=this._config.media_player_equalizer??"nabu_equalizer_dash.gif",s=ht[e]?e:"nabu_equalizer_dash.gif";return this._composeAssetPath(t,s)}}_determineMuteAsset(t){const e=this._config?.mute_media_player??this._config?.media_player;if(!e||!this.hass)return;const s=this.hass.states[e];if(!s)return;if(!!!s.attributes?.is_volume_muted)return;const i="off"===s.state?"nabu_mute_dash.gif":"nabu_mute_red_dash.gif";return this._composeAssetPath(t,i)}_isAlarmEntityActive(){if(!this._config?.alarm_entities?.length||!this.hass)return!1;const t=this._config.alarm_active_states??ct;return this._config.alarm_entities.some(e=>{const s=this.hass.states[e];return!!s&&t.includes(s.state)})}_composeAssetPath(t,e){return t.endsWith("/")?`${t}${e}`:`${t}/${e}`}_computeAssistState(){if(!this._config?.assist_entities?.length||!this.hass)return;const t=this._config.assist_entities.map(t=>this.hass.states[t]?.state).filter(t=>"string"==typeof t);for(const e of mt)if(t.includes(e))return e}static get styles(){return a`
      ha-card {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
      }

      .card-header {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      img {
        max-width: 100%;
        height: auto;
      }
    `}}ft.properties={hass:{attribute:!1},_config:{state:!0},_countdownActive:{state:!0},_alarmActive:{state:!0}};const gt="nabu-eyes-dashboard-card";if(customElements.get(gt)||customElements.define(gt,ft),"undefined"!=typeof window){window.customCards=window.customCards??[];window.customCards.some(t=>t.type===gt)||window.customCards.push({type:gt,name:"Nabu Eyes Dashboard",description:"Animated Assist avatar with media and alarm indicators.",preview:!0})}export{ft as NabuEyesDashboardCard};
//# sourceMappingURL=nabu-eyes-dashboard-card.js.map
