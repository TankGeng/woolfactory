const CCInspectorPluginMsg=window.CCInspectorPluginMsg;let inspector={log(){1===arguments.length||2===arguments.length||arguments.length},initByApi(){this.init((e,t,o)=>{this.onWebSocketInit(e,t)})},init(e){cc.log("[cc-inspector] \u63d2\u4ef6\u542f\u52a8\u4e2d..."),cc.loader.loadRes("cc-inspector",(t,o)=>{if(t)cc.log("[cc-inspector] \u83b7\u53d6\u63d2\u4ef6\u914d\u7f6e\u5931\u8d25,\u8bf7\u68c0\u67e5\u662f\u5426\u6253\u5f00\u63d2\u4ef6!");else{let t=o.host,n=o.port,c=o.isRunInGameStart;if(void 0===t&&void 0===n&&(t=o.json.host,n=o.json.port,c=o.json.isRunInGameStart),void 0===t)return void cc.log("[cc-inspector] \u63d2\u4ef6\u914d\u7f6ehost\u6709\u8bef!");if(void 0===n)return void cc.log("[cc-inspector] \u63d2\u4ef6\u914d\u7f6eport\u6709\u8bef!");void 0!==t&&void 0!==n?e&&e(t,n,c):cc.log("[cc-inspector] \u672a\u83b7\u53d6\u5230\u63d2\u4ef6\u914d\u7f6e")}})},initInspector(){window.inspectorGameMemoryStorage=window.inspectorGameMemoryStorage||{},cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH,()=>{this.init((e,t,o)=>{o?(cc.log("[cc-inspector] \u63d2\u4ef6\u81ea\u52a8\u542f\u52a8\u6210\u529f!"),this.onWebSocketInit(e,t)):cc.log("[cc-inspector] \u63d2\u4ef6\u672a\u81ea\u52a8\u8fd0\u884c,\u4f60\u53ef\u4ee5\u5728\u9879\u76ee\u4e2d\u4f7f\u7528\u76f8\u5173\u63a5\u53e3\u8fd0\u884c\u63d2\u4ef6!")})})},_collectNodeInfo(e,t){if(e){let o=[];return t&&(o=this._getNodeComponentsInfo(e)),{name:e.name,active:e.active,uuid:e.uuid,type:e.constructor.name,x:e.x,y:e.y,zIndex:e.zIndex,childrenCount:e.childrenCount,children:[],width:e.width,height:e.height,color:{r:e.color.r,g:e.color.g,b:e.color.b,a:e.color.a},opacity:e.opacity,rotation:e.rotation,rotationX:e.rotationX,rotationY:e.rotationY,anchorX:e.anchorX,anchorY:e.anchorY,scaleX:e.scaleX,scaleY:e.scaleY,skewX:e.skewX,skewY:e.skewY,group:e.group,components:o}}return null},getNodeInfo(e){let t=window.inspectorGameMemoryStorage[e];return t?this._collectNodeInfo(t,!0):null},_getComponentPropertyData(e){let t=null;if("object"==typeof e){if(cc.Enum.isEnum(e))return cc.Enum.getList(e);t=e.constructor}else t=this._getCompClassId(e);let o=[];if(t){let n=t.__props__;if(n){for(let e=0;e<n.length;){let t=n[e];"_"===t[0]||"node"===t||"uuid"===t||"name"===t||"enabled"===t||"enabledInHierarchy"===t?n.splice(e,1):e++}for(let t=0;t<n.length;t++){let c=n[t],i=cc.Class.attr(e,c),s=null;i&&i.tooltip&&(s=i.tooltip);let r=e[c],l=this._getDataType(r);if(l){let e={name:c,tooltip:s,property:c,type:l,value:r};o.push(e)}}}}return o},_getDataType(e){let t="";return null===e?t="null":null!==e&&"object"==typeof e?(e=e.constructor,t=cc.js.getClassName(e)):t="boolean"==typeof e?cc.Boolean:"string"==typeof e?cc.String:"number"==typeof e?"number":cc.js.getClassName(e),""===t?null:-1===[cc.js.getClassName(cc.Size),cc.js.getClassName(cc.Enum),cc.js.getClassName(cc.Vec2),cc.js.getClassName(cc.Color),cc.Boolean,cc.String,"number","null"].toString().indexOf(t)?null:t},_getCompClassId:e=>("object"==typeof e&&(e=e.constructor),cc.js._getClassId(e)),_getNodeComponentsInfo(e){let t=[],o=e._components;for(let e=0;e<o.length;e++){let n=o[e];window.inspectorGameMemoryStorage[n.uuid]=n;let c=this._getComponentPropertyData(n),i={uuid:n.uuid,name:cc.js.getClassName(n),type:n.constructor.name,enabled:n.enabled,property:c};t.push(i)}return t},_collectChildrenInfo(e,t){let o=this._collectNodeInfo(e,!1);window.inspectorGameMemoryStorage[e.uuid]=e;let n=e.getChildren();for(let e=0;e<n.length;e++){let t=n[e];this._collectChildrenInfo(t,o.children)}t.push(o)},_collectTreeInfo(){let e=[],t=cc.director.getScene().getChildren();for(let o=0;o<t.length;o++){let n=t[o];this._collectChildrenInfo(n,e)}return e},wsSend(e,t){if(this.ws){let o={code:e,data:t},n=JSON.stringify(o);cc.sys.isBrowser,this.ws.send(n)}},_isPluginInit:!1,onWebSocketInit(e,t){if(!1!==this._isPluginInit)return void cc.log("[cc-inspector] \u63d2\u4ef6\u5df2\u7ecf\u521d\u59cb\u5316,\u65e0\u9700\u91cd\u590d\u8c03\u7528!");this._isPluginInit=!0,this.ws&&this.ws.close();let o=`ws://${e}:${t}`;this.ws=new WebSocket(o),this.ws.onopen=(()=>{cc.log("[open] \u6210\u529f\u94fe\u63a5\u8c03\u8bd5\u670d\u52a1\u5668: "+o),this.wsSend(CCInspectorPluginMsg.Msg.Test,"hello cc-inspector!")}),this.ws.onmessage=(e=>{cc.sys.isBrowser;let t=JSON.parse(e.data),o=t.code,n=t.data;if(o===CCInspectorPluginMsg.Msg.GetTreeInfo){let e=this._collectTreeInfo();this.wsSend(CCInspectorPluginMsg.Msg.GetTreeInfo,e)}else if(o===CCInspectorPluginMsg.Msg.GetNodeInfo){let e=this.getNodeInfo(n);e&&this.wsSend(CCInspectorPluginMsg.Msg.GetNodeInfo,e)}else if(o===CCInspectorPluginMsg.Msg.Position){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.x=t.x,o.y=t.y)}else if(o===CCInspectorPluginMsg.Msg.Opacity){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.opacity=t)}else if(o===CCInspectorPluginMsg.Msg.Anchor){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.anchorX=t.x,o.anchorY=t.y)}else if(o===CCInspectorPluginMsg.Msg.Size){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.width=t.width,o.height=t.height)}else if(o===CCInspectorPluginMsg.Msg.Scale){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.scaleX=t.x,o.scaleY=t.y)}else if(o===CCInspectorPluginMsg.Msg.Rotation){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.rotation=t)}else if(o===CCInspectorPluginMsg.Msg.Skew){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.skewX=t.x,o.skewY=t.y)}else if(o===CCInspectorPluginMsg.Msg.Color){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.color=cc.color(t))}else if(o===CCInspectorPluginMsg.Msg.Active){let e=n.uuid,t=n.data,o=window.inspectorGameMemoryStorage[e];o&&(o.active=t)}}),this.ws.onerror=(()=>{this.ws=null,cc.log("[cc-inspector] error: \u6e38\u620f\u8fde\u63a5\u63d2\u4ef6\u5931\u8d25,\u8bf7\u6253\u5f00\u63d2\u4ef6\u540e,\u91cd\u65b0\u8fd0\u884c\u6e38\u620f!")}),this.ws.onclose=(()=>{this.ws=null,cc.log("[cc-inspector] close: \u6e38\u620f\u4e0e\u63d2\u4ef6\u65ad\u5f00\u94fe\u63a5,\u8bf7\u6253\u5f00\u63d2\u4ef6\u540e,\u91cd\u65b0\u8fd0\u884c\u6e38\u620f!")})}};inspector.initInspector(),window.CCInspectorPlugin={init:inspector.initByApi.bind(inspector),collectTreeInfo:inspector._collectTreeInfo.bind(inspector),getNodeInfo:inspector.getNodeInfo.bind(inspector)};