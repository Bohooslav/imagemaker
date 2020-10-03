
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
let root;
let resets = '*,::before,::after {	box-sizing: border-box;	border-width: 0;	border-style: solid;	border-color: currentColor;}';

function setup(){
	
	if (!(root)) {
		
		if (root = document.documentElement) {
			
			return register(resets);
		}	}}
function register(styles,id){
	
	setup();
	var el = document.createElement('style');
	el.textContent = styles;
	document.head.appendChild(el);
	return;
}

class Flags {
	
	
	constructor(dom){
		
		this.dom = dom;
		this.string = "";
	}
	
	contains(ref){
		
		return this.dom.classList.contains(ref);
	}
	
	add(ref){
		
		if (this.contains(ref)) { return this }		this.string += (this.string ? ' ' : '') + ref;
		this.dom.classList.add(ref);
		// sync!
		return this;
	}
	
	remove(ref){
		
		if (!(this.contains(ref))) { return this }		var regex = new RegExp('(^|\\s)*' + ref + '(\\s|$)*','g');
		this.string = this.string.replace(regex,'');
		this.dom.classList.remove(ref);
		// sync!
		return this;
	}
	
	toggle(ref,bool){
		
		if (bool === undefined) { bool = !(this.contains(ref)); }		return bool ? this.add(ref) : this.remove(ref);
	}
	
	valueOf(){
		
		return this.string;
	}
	
	toString(){
		
		return this.string;
	}
	
	sync(){
		
		return this.dom.flagSync$();
	}
}

function iter$(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }var raf = (typeof requestAnimationFrame !== 'undefined') ? requestAnimationFrame : (function(blk) { return setTimeout(blk,1000 / 60); });


// Scheduler
class Scheduler {
	
	constructor(){
		var self = this;
		
		this.queue = [];
		this.stage = -1;
		this.batch = 0;
		this.scheduled = false;
		this.listeners = {};
		this.$promise = null;
		this.$resolve = null;
		this.$ticker = function(e) {
			
			self.scheduled = false;
			return self.tick(e);
		};
	}
	
	add(item,force){
		
		if (force || this.queue.indexOf(item) == -1) {
			
			this.queue.push(item);
		}		
		if (!(this.scheduled)) { return this.schedule() }	}
	
	listen(ns,item){
		var $listeners;
		
		($listeners = this.listeners)[ns] || ($listeners[ns] = new Set);
		return this.listeners[ns].add(item);
	}
	
	unlisten(ns,item){
		
		return this.listeners[ns] && this.listeners[ns].delete(item);
	}
	
	get promise(){
		var self = this;
		
		return this.$promise || (this.$promise = new Promise(function(resolve) {
			
			return self.$resolve = resolve;
		}));
	}
	
	tick(timestamp){
		var self = this;
		
		var items = this.queue;
		if (!(this.ts)) { this.ts = timestamp; }		this.dt = timestamp - this.ts;
		this.ts = timestamp;
		this.queue = [];
		this.stage = 1;
		this.batch++;
		
		if (items.length) {
			
			for (let i = 0, $items = iter$(items), $len = $items.length; i < $len; i++) {
				let item = $items[i];
				
				if (typeof item === 'string' && this.listeners[item]) {
					
					this.listeners[item].forEach(function(item) {
						
						if (item.tick instanceof Function) {
							
							return item.tick(self);
						} else if (item instanceof Function) {
							
							return item(self);
						}					});
				} else if (item instanceof Function) {
					
					item(this.dt,this);
				} else if (item.tick) {
					
					item.tick(this.dt,this);
				}			}		}		this.stage = 2;
		this.stage = this.scheduled ? 0 : -1;
		if (this.$promise) {
			
			this.$resolve(this);
			this.$promise = this.$resolve = null;
		}		return this;
	}
	
	schedule(){
		
		if (!(this.scheduled)) {
			
			this.scheduled = true;
			if (this.stage == -1) {
				
				this.stage = 0;
			}			raf(this.$ticker);
		}		return this;
	}
}

var {Document: Document,Node: Node$1,Text: Text$1,Comment: Comment$1,Element: Element$1,SVGElement: SVGElement,HTMLElement: HTMLElement,DocumentFragment: DocumentFragment,ShadowRoot: ShadowRoot$1,Event: Event,CustomEvent: CustomEvent$1,MouseEvent: MouseEvent,document: document$1} = window;

function iter$$1(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }
const keyCodes = {
	esc: [27],
	tab: [9],
	enter: [13],
	space: [32],
	up: [38],
	down: [40],
	left: [37],
	right: [39],
	del: [8,46]
};

Event.log$mod = function (...params){
	
	console.log(...params);
	return true;
};

// Skip unless matching selector
Event.sel$mod = function (expr){
	
	return !(!(this.event.target.matches(String(expr))));
	
};
Event.if$mod = function (expr){
	
	return !(!(expr));
	
};
Event.wait$mod = function (num = 250){
	
	return new Promise(function(_0) { return setTimeout(_0,num); });
	
};
Event.throttle$mod = function (ms = 250){
	var self = this;
	
	if (this.handler.throttled) { return false }	this.handler.throttled = true;
	
	let cl = this.element.flags.add('_cooldown_');
	
	this.handler.once('idle',function() {
		
		return setTimeout(function() {
			
			self.element.flags.remove('_cooldown_');
			return self.handler.throttled = false;
		},ms);
	});
	return true;
	
};
Event.flag$mod = function (name,sel){
	var self = this;
	
	// console.warn 'event flag',self,arguments,id,step
	let el = (sel instanceof globalThis.Element) ? sel : ((sel ? this.element.closest(sel) : this.element));
	if (!(el)) { return true }	let step = this.step;
	this.handler[step] = this.id;
	
	el.flags.add(name);
	let ts = Date.now();
	this.handler.once('idle',function() {
		
		let elapsed = Date.now() - ts;
		let delay = Math.max(250 - elapsed,0);
		return setTimeout(function() {
			
			// console.warn 'event flag after',self,handler[step],id,step
			if (self.handler[step] == self.id) { return el.flags.remove(name) }		},delay);
	});
	
	return true;
	
};
Event.busy$mod = function (sel){
	
	return Event.flag$mod.call(this,'busy',250,sel);
};

// could cache similar event handlers with the same parts
class EventHandler {
	
	constructor(params,closure){
		
		this.params = params;
		this.closure = closure;
	}
	
	getHandlerForMethod(el,name){
		
		if (!(el)) { return null }		return el[name] ? el : this.getHandlerForMethod(el.parentNode,name);
	}
	
	emit(name,...params){
		return imba.emit(this,name,params);
	}
	on(name,...params){
		return imba.listen(this,name,...params);
	}
	once(name,...params){
		return imba.once(this,name,...params);
	}
	un(name,...params){
		return imba.unlisten(this,name,...params);
	}
	
	async handleEvent(event){
		
		var target = event.target;
		var element = event.currentTarget;
		var mods = this.params;
		let commit = true;// self.params.length == 0
		
		this.count || (this.count = 0);
		
		let state = {
			element: element,
			event: event,
			modifiers: mods,
			handler: this,
			id: ++this.count,
			step: -1
		};
		
		if (event.handle$mod) {
			
			if (event.handle$mod.call(state,mods.options) == false) {
				
				return;
			}		}		
		let guard = Event[event.type + '$handle'];
		
		if (guard && guard.call(state,mods.options) == false) {
			
			return;
		}		
		this.currentEvents || (this.currentEvents = new Set);
		this.currentEvents.add(event);
		
		for (let $i = 0, $keys = Object.keys(mods), $l = $keys.length, handler, val; $i < $l; $i++){
			handler = $keys[$i];val = mods[handler];
			state.step++;
			
			if (handler[0] == '_') {
				
				continue;
			}			
			if (handler.indexOf('~') > 0) {
				
				handler = handler.split('~')[0];
			}			
			let modargs = null;
			let args = [event,this];
			let res = undefined;
			let context = null;
			let m;
			
			if (handler[0] == '$' && handler[1] == '_' && (val[0] instanceof Function)) {
				
				handler = val[0];
				args = [event,state].concat(val.slice(1));
				context = element;
			} else if (val instanceof Array) {
				
				args = val.slice();
				modargs = args;
				
				for (let i = 0, $items = iter$$1(args), $len = $items.length; i < $len; i++) {
					let par = $items[i];
					
					// what about fully nested arrays and objects?
					// ought to redirect this
					if (typeof par == 'string' && par[0] == '~' && par[1] == '$') {
						
						let name = par.slice(2);
						let chain = name.split('.');
						let value = state[chain.shift()] || event;
						
						for (let i = 0, $ary = iter$$1(chain), $len = $ary.length; i < $len; i++) {
							let part = $ary[i];
							
							value = value ? value[part] : undefined;
						}						
						args[i] = value;
					}				}			}			
			if (typeof handler == 'string' && (m = handler.match(/^(emit|flag)-(.+)$/))) {
				
				if (!(modargs)) { modargs = args = []; }				args.unshift(m[2]);
				handler = m[1];
			}			
			// console.log "handle part",i,handler,event.currentTarget
			// check if it is an array?
			if (handler == 'stop') {
				
				event.stopImmediatePropagation();
			} else if (handler == 'prevent') {
				
				event.preventDefault();
			} else if (handler == 'commit') {
				
				commit = true;
			} else if (handler == 'silence' || handler == 'silent') {
				
				commit = false;
			} else if (handler == 'ctrl') {
				
				if (!(event.ctrlKey)) { break; }			} else if (handler == 'alt') {
				
				if (!(event.altKey)) { break; }			} else if (handler == 'shift') {
				
				if (!(event.shiftKey)) { break; }			} else if (handler == 'meta') {
				
				if (!(event.metaKey)) { break; }			} else if (handler == 'self') {
				
				if (target != element) { break; }			} else if (handler == 'once') {
				
				// clean up bound data as well
				element.removeEventListener(event.type,this);
			} else if (handler == 'options') {
				
				continue;
			} else if (keyCodes[handler]) {
				
				if (keyCodes[handler].indexOf(event.keyCode) < 0) {
					
					break;
				}			} else if (handler == 'emit') {
				
				let name = args[0];
				let detail = args[1];// is custom event if not?
				let e = new CustomEvent(name,{bubbles: true,detail: detail});// : new Event(name)
				e.originalEvent = event;
				let customRes = element.dispatchEvent(e);
			} else if (typeof handler == 'string') {
				
				let fn = Event[handler + '$mod'] || Event[event.type + '$' + handler];
				
				if (fn instanceof Function) {
					
					handler = fn;
					context = state;
					args = modargs || [];
				} else if (handler[0] == '_') {
					
					handler = handler.slice(1);
					context = this.closure;
				} else {
					
					context = this.getHandlerForMethod(element,handler);
				}			}			
			if (handler instanceof Function) {
				
				res = handler.apply(context || element,args);
			} else if (context) {
				
				res = context[handler].apply(context,args);
			}			
			if (res && (res.then instanceof Function) && res != imba.scheduler.$promise) {
				
				if (commit) imba.$commit();
				// TODO what if await fails?
				res = await res;
			}			
			if (res === false) {
				
				break;
			}			
			state.value = res;
		}		
		if (commit) imba.$commit();
		this.currentEvents.delete(event);
		if (this.currentEvents.size == 0) {
			
			this.emit('idle');
		}		// what if the result is a promise
		return;
	}
}

class Touch {
	
	constructor(e){
		
		this.id = e.pointerId;
		this.t0 = Date.now();
		this.x0 = this.x = e.x;
		this.y0 = this.y = e.y;
		this.mx = this.my = 0;
		e.touch = this;
	}
	
	update(e){
		
		this.mx = e.x - this.x;
		this.my = e.y - this.x;
		this.x = e.x;
		this.y = e.y;
		return e.touch = this;
	}
	
	get dx(){
		
		return this.x - this.x0;
	}
	
	get dy(){
		
		return this.y - this.y0;
		
	}
	get dt(){
		
		return Date.now() - this.t0;
	}
}
Event.pointerdown$handle = function (){
	
	let e = this.event;
	let el = this.element;
	let handler = this.handler;
	if (handler.type != 'touch') { return true }	
	e.dx = e.dy = 0;
	handler.x0 = e.x;
	handler.y0 = e.y;
	handler.pointerId = e.pointerId;
	
	handler.touch = new Touch(e);
	
	let canceller = function() { return false; };
	let selstart = document.onselectstart;
	el.setPointerCapture(e.pointerId);
	
	el.addEventListener('pointermove',handler);
	el.addEventListener('pointerup',handler);
	document.onselectstart = canceller;
	
	el.flags.add('_touch_');
	
	el.addEventListener('pointerup',function(e) {
		
		el.releasePointerCapture(e.pointerId);
		el.removeEventListener('pointermove',handler);
		el.removeEventListener('pointerup',handler);
		handler.pointerId = null;
		if (handler.pointerFlag) {
			
			el.flags.remove(handler.pointerFlag);
		}		el.flags.remove('_touch_');
		return document.onselectstart = selstart;
	},{once: true});
	return true;
};

Event.pointermove$handle = function (){
	
	let h = this.handler;
	let e = this.event;
	let id = h.pointerId;
	if (id && e.pointerId != id) { return false }	if (h.touch) { h.touch.update(e); }	if (typeof h.x0 == 'number') {
		
		e.dx = e.x - h.x0;
		e.dy = e.y - h.y0;
	}	return true;
};


Event.pointerup$handle = function (){
	
	let h = this.handler;
	let e = this.event;
	let id = h.pointerId;
	if (id && e.pointerId != id) { return false }	if (h.touch) { h.touch.update(e); }	if (typeof h.x0 == 'number') {
		
		e.dx = e.x - h.x0;
		e.dy = e.y - h.y0;
	}	return true;
};

function iter$$2(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }function extend$(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}
extend$(DocumentFragment,{
	
	
	get $parent(){
		
		return this.up$ || this.$$parent;
	},
	
	// Called to make a documentFragment become a live fragment
	setup$(flags,options){
		
		this.$start = imba.document.createComment('start');
		this.$end = imba.document.createComment('end');
		
		this.$end.replaceWith$ = function(other) {
			
			this.parentNode.insertBefore(other,this);
			return other;
		};
		
		this.appendChild(this.$start);
		return this.appendChild(this.$end);
	},
	
	// when we for sure know that the only content should be
	// a single text node
	text$(item){
		
		if (!(this.$text)) {
			
			this.$text = this.insert$(item);
		} else {
			
			this.$text.textContent = item;
		}		return;
	},
	
	insert$(item,options,toReplace){
		
		if (this.$$parent) {
			
			// if the fragment is attached to a parent
			// we can just proxy the call through
			return this.$$parent.insert$(item,options,toReplace || this.$end);
		} else {
			
			return Element$1.prototype.insert$.call(this,item,options,toReplace || this.$end);
		}	},
	
	insertInto$(parent,before){
		
		if (!(this.$$parent)) {
			
			this.$$parent = parent;
			// console.log 'insertFrgment into',parent,Array.from(self.childNodes)
			parent.appendChild$(this);
		}		return this;
	},
	
	replaceWith$(other,parent){
		
		this.$start.insertBeforeBegin$(other);
		var el = this.$start;
		while (el){
			
			let next = el.nextSibling;
			this.appendChild(el);
			if (el == this.$end) { break; }			el = next;
			
		}		return other;
	},
	
	appendChild$(child){
		
		this.$end ? this.$end.insertBeforeBegin$(child) : this.appendChild(child);
		return child;
	},
	
	removeChild$(child){
		
		child.parentNode && child.parentNode.removeChild(child);
		return this;
	},
	
	isEmpty$(){
		
		let el = this.$start;
		let end = this.$end;
		
		while (el = el.nextSibling){
			
			if (el == end) { break; }			if ((el instanceof Element$1) || (el instanceof Text$1)) { return false }		}		return true;
	},
});


extend$(ShadowRoot$1,{
	
	get $parent(){
		
		return this.host;
	},
});

class TagCollection {
	
	constructor(f,parent){
		
		this.__F = f;
		this.$parent = parent;
		
		if (!((f & 128)) && (this instanceof KeyedTagFragment)) {
			
			this.$start = document$1.createComment('start');
			if (parent) { parent.appendChild$(this.$start); }		}		
		if (!(f & 256)) {
			
			this.$end = document$1.createComment('end');
			if (parent) { parent.appendChild$(this.$end); }		}		
		this.setup();
	}
	
	appendChild$(item,index){
		
		// we know that these items are dom elements
		if (this.$end && this.$parent) {
			
			this.$end.insertBeforeBegin$(item);
		} else if (this.$parent) {
			
			this.$parent.appendChild$(item);
		}		return;
	}
	
	replaceWith$(other){
		
		this.detachNodes();
		this.$end.insertBeforeBegin$(other);
		this.$parent.removeChild$(this.$end);
		this.$parent = null;
		return;
	}
	
	joinBefore$(before){
		
		return this.insertInto$(before.parentNode,before);
	}
	
	insertInto$(parent,before){
		
		if (!(this.$parent)) {
			
			this.$parent = parent;
			before ? before.insertBeforeBegin$(this.$end) : parent.appendChild$(this.$end);
			this.attachNodes();
		}		return this;
	}
	
	replace$(other){
		
		if (!(this.$parent)) {
			
			this.$parent = other.parentNode;
		}		other.replaceWith$(this.$end);
		this.attachNodes();
		return this;
		
	}
	setup(){
		
		return this;
	}
}
class KeyedTagFragment extends TagCollection {
	static init$(){
		return super.inherited instanceof Function && super.inherited(this);
	}
	
	setup(){
		
		this.array = [];
		this.changes = new Map;
		this.dirty = false;
		return this.$ = {};
	}
	
	push(item,idx){
		
		// on first iteration we can merely run through
		if (!(this.__F & 1)) {
			
			this.array.push(item);
			this.appendChild$(item);
			return;
		}		
		let toReplace = this.array[idx];
		
		if (toReplace === item) ; else {
			
			this.dirty = true;
			// if this is a new item
			let prevIndex = this.array.indexOf(item);
			let changed = this.changes.get(item);
			
			if (prevIndex === -1) {
				
				// should we mark the one currently in slot as removed?
				this.array.splice(idx,0,item);
				this.insertChild(item,idx);
			} else if (prevIndex === idx + 1) {
				
				if (toReplace) {
					
					this.changes.set(toReplace,-1);
				}				this.array.splice(idx,1);
			} else {
				
				if (prevIndex >= 0) { this.array.splice(prevIndex,1); }				this.array.splice(idx,0,item);
				this.insertChild(item,idx);
			}			
			if (changed == -1) {
				
				this.changes.delete(item);
			}		}		return;
	}
	
	insertChild(item,index){
		
		if (index > 0) {
			
			let other = this.array[index - 1];
			// will fail with text nodes
			other.insertAfterEnd$(item);
		} else if (this.$start) {
			
			this.$start.insertAfterEnd$(item);
		} else {
			
			this.$parent.insertAfterBegin$(item);
		}		return;
	}
	
	removeChild(item,index){
		
		// self.map.delete(item)
		// what if this is a fragment or virtual node?
		if (item.parentNode == this.$parent) {
			
			this.$parent.removeChild(item);
		}		return;
	}
	
	attachNodes(){
		
		for (let i = 0, $items = iter$$2(this.array), $len = $items.length; i < $len; i++) {
			let item = $items[i];
			
			this.$end.insertBeforeBegin$(item);
		}		return;
	}
	
	detachNodes(){
		
		for (let $i = 0, $items = iter$$2(this.array), $len = $items.length; $i < $len; $i++) {
			let item = $items[$i];
			
			this.$parent.removeChild(item);
		}		return;
	}
	
	end$(index){
		var self = this;
		
		if (!(this.__F & 1)) {
			
			this.__F |= 1;
			return;
		}		
		if (this.dirty) {
			
			this.changes.forEach(function(pos,item) {
				
				if (pos == -1) {
					
					return self.removeChild(item);
				}			});
			this.changes.clear();
			this.dirty = false;
		}		
		// there are some items we should remove now
		if (this.array.length > index) {
			
			
			// remove the children below
			while (this.array.length > index){
				
				let item = this.array.pop();
				this.removeChild(item);
			}			// self.array.length = index
		}		return;
	}
} KeyedTagFragment.init$();
class IndexedTagFragment extends TagCollection {
	static init$(){
		return super.inherited instanceof Function && super.inherited(this);
	}
	
	
	setup(){
		
		this.$ = [];
		return this.length = 0;
	}
	
	end$(len){
		
		let from = this.length;
		if (from == len || !(this.$parent)) { return }		let array = this.$;
		let par = this.$parent;
		
		if (from > len) {
			
			while (from > len){
				
				par.removeChild$(array[--from]);
			}		} else if (len > from) {
			
			while (len > from){
				
				this.appendChild$(array[from++]);
			}		}		this.length = len;
		return;
	}
	
	attachNodes(){
		
		for (let i = 0, $items = iter$$2(this.$), $len = $items.length; i < $len; i++) {
			let item = $items[i];
			
			if (i == this.length) { break; }			this.$end.insertBeforeBegin$(item);
		}		return;
	}
	
	detachNodes(){
		
		let i = 0;
		while (i < this.length){
			
			let item = this.$[i++];
			this.$parent.removeChild$(item);
		}		return;
	}
} IndexedTagFragment.init$();
function createLiveFragment(bitflags,options,par){
	
	var el = document$1.createDocumentFragment();
	el.setup$(bitflags,options);
	if (par) { el.up$ = par; }	return el;
}
function createIndexedFragment(bitflags,parent){
	
	return new IndexedTagFragment(bitflags,parent);
}
function createKeyedFragment(bitflags,parent){
	
	return new KeyedTagFragment(bitflags,parent);
}

class ImbaElement extends HTMLElement {
	static init$(){
		return super.inherited instanceof Function && super.inherited(this);
	}
	
	constructor(){
		
		super();
		this.setup$();
		this.build();
	}
	
	setup$(){
		
		this.__slots = {};
		return this.__F = 0;
	}
	
	init$(){
		
		this.__F |= (1 | 2);
		return this;
		
	}
	flag$(str){
		
		this.className = this.flags$ext = str;
		return;
	}
	
	// returns the named slot - for context
	slot$(name,ctx){
		var $__slots;
		
		if (name == '__' && !(this.render)) {
			
			return this;
		}		
		return ($__slots = this.__slots)[name] || ($__slots[name] = imba.createLiveFragment(0,null,this));
	}
	
	// called immediately after construction 
	build(){
		
		return this;
	}
	
	// called before the first mount
	awaken(){
		
		return this;
	}
	
	// called when element is attached to document
	mount(){
		
		return this;
	}
	
	unmount(){
		
		return this;
	}
	
	// called after render
	rendered(){
		
		return this;
	}
	
	// called before element is stringified on server (SSR)
	dehydrate(){
		
		return this;
	}
	
	// called before awaken if element was not initially created via imba - on the client
	hydrate(){
		
		// should only autoschedule if we are not awakening inside a parent context that
		this.autoschedule = true;
		return this;
	}
	
	tick(){
		
		return this.commit();
	}
	
	// called when component is (re-)rendered from its parent
	visit(){
		
		return this.commit();
	}
	
	// Wrapper for rendering. Default implementation
	commit(){
		
		if (!(this.isRender())) { return this }		this.__F |= 256;
		this.render && this.render();
		this.rendered();
		return this.__F = (this.__F | 512) & ~256;
	}
	
	
	
	get autoschedule(){
		
		return (this.__F & 64) != 0;
	}
	
	set autoschedule(value){
		
		value ? ((this.__F |= 64)) : ((this.__F &= ~64));
	}
	
	isRender(){
		
		return true;
	}
	
	isMounting(){
		
		return (this.__F & 16) != 0;
	}
	
	isMounted(){
		
		return (this.__F & 32) != 0;
	}
	
	isAwakened(){
		
		return (this.__F & 8) != 0;
	}
	
	isRendered(){
		
		return (this.__F & 512) != 0;
	}
	
	isRendering(){
		
		return (this.__F & 256) != 0;
	}
	
	isScheduled(){
		
		return (this.__F & 128) != 0;
	}
	
	isHydrated(){
		
		return (this.__F & 2) != 0;
	}
	
	schedule(){
		
		imba.scheduler.listen('render',this);
		this.__F |= 128;
		return this;
	}
	
	unschedule(){
		
		imba.scheduler.unlisten('render',this);
		this.__F &= ~128;
		return this;
	}
	
	end$(){
		
		return this.visit();
	}
	
	connectedCallback(){
		
		let flags = this.__F;
		let inited = flags & 1;
		let awakened = flags & 8;
		
		// return if we are already in the process of mounting - or have mounted
		if (flags & (16 | 32)) {
			
			return;
		}		
		this.__F |= 16;
		
		if (!(inited)) {
			
			this.init$();
		}		
		if (!(flags & 2)) {
			
			this.flags$ext = this.className;
			this.hydrate();
			this.__F |= 2;
			this.commit();
		}		
		if (!(awakened)) {
			
			this.awaken();
			this.__F |= 8;
		}		
		let res = this.mount();
		if (res && (res.then instanceof Function)) {
			
			res.then(imba.commit);
		}		// else
		// if this.render and $EL_RENDERED$
		// 	this.render()
		flags = this.__F = (this.__F | 32) & ~16;
		
		if (flags & 64) {
			
			this.schedule();
		}		
		return this;
	}
	
	disconnectedCallback(){
		
		this.__F = this.__F & (~32 & ~16);
		if (this.__F & 128) { this.unschedule(); }		return this.unmount();
	}
} ImbaElement.init$();

function extend$$1(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}


extend$$1(SVGElement,{
	
	
	flag$(str){
		
		this.className.baseVal = this.flags$ext = str;
		return;
	},
	
	flagSelf$(str){
		var self = this;
		
		// if a tag receives flags from inside <self> we need to
		// redefine the flag-methods to later use both
		this.flag$ = function(str) { return self.flagSync$(self.flags$ext = str); };
		this.flagSelf$ = function(str) { return self.flagSync$(self.flags$own = str); };
		return this.flagSelf$(str);
	},
	
	flagSync$(){
		
		return this.className.baseVal = ((this.flags$ext || '') + ' ' + (this.flags$own || '') + ' ' + (this.$flags || ''));
	},
});

function extend$$2(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}var root$1 = ((typeof window !== 'undefined') ? window : (((typeof globalThis !== 'undefined') ? globalThis : null)));

var imba$1 = {
	version: '2.0.0',
	global: root$1,
	ctx: null,
	document: root$1.document
};

root$1.imba = imba$1;

root$1.customElements || (root$1.customElements = {
	define: function() { return true; },// console.log('no custom elements')
	get: function() { return true; }// console.log('no custom elements')
});

imba$1.setTimeout = function(fn,ms) {
	
	return setTimeout(function() {
		
		fn();
		return imba$1.$commit();
	},ms);
};

imba$1.setInterval = function(fn,ms) {
	
	return setInterval(function() {
		
		fn();
		return imba$1.$commit();
	},ms);
};

imba$1.clearInterval = root$1.clearInterval;
imba$1.clearTimeout = root$1.clearTimeout;

Object.defineProperty(imba$1,'flags',{get: function() { return imba$1.document.documentElement.classList; }});

imba$1.q$ = function (query,ctx){
	
	return ((ctx instanceof Element) ? ctx : document).querySelector(query);
};

imba$1.q$$ = function (query,ctx){
	
	return ((ctx instanceof Element) ? ctx : document).querySelectorAll(query);
};

const VALID_CSS_UNITS = {
	cm: 1,
	mm: 1,
	Q: 1,
	pc: 1,
	pt: 1,
	px: 1,
	em: 1,
	ex: 1,
	ch: 1,
	rem: 1,
	vw: 1,
	vh: 1,
	vmin: 1,
	vmax: 1,
	s: 1,
	ms: 1,
	fr: 1,
	'%': 1,
	in: 1,
	turn: 1,
	grad: 1,
	rad: 1,
	deg: 1,
	Hz: 1,
	kHz: 1
};

const CSS_STR_PROPS = {
	prefix: 1,
	suffix: 1,
	content: 1
};

const CSS_PX_PROPS = /^([xyz])$/;
const CSS_DIM_PROPS = /^([tlbr]|size|[whtlbr]|[mps][tlbrxy]?|[rcxy]?[gs])$/;

imba$1.toStyleValue = function (value,unit,key){
	
	let typ = typeof value;
	if (typ == 'number') {
		
		if (!(unit)) {
			
			if (CSS_PX_PROPS.test(key)) {
				
				unit = 'px';
			} else if (CSS_DIM_PROPS.test(key)) {
				
				unit = 'u';
			} else if (key == 'rotate') {
				
				unit = 'turn';
			}		}		
		if (unit) {
			
			if (VALID_CSS_UNITS[unit]) {
				
				// what if the unit is already set?
				return value + unit;
			} else if (unit == 'u') {
				
				return value * 4 + 'px';
			} else {
				
				return ("calc(var(--u_" + unit + ",1px) * " + value + ")");
			}		}	} else if (typ == 'string' && key) {
		
		if (CSS_STR_PROPS[key] && value[0] != '"' && value[0] != "'") {
			
			if (value.indexOf('"') >= 0) {
				
				if (value.indexOf("'") == -1) {
					
					value = "'" + value + "'";
				}			} else {
				
				value = '"' + value + '"';
			}		}	}	
	return value;
};

imba$1.inlineStyles = function (content,id){
	
	register(content);
	// var el = document.createElement('style')
	// el.textContent = styles
	// document.head.appendChild(el)
	return;
};

var dashRegex = /-./g;

imba$1.toCamelCase = function (str){
	
	if (str.indexOf('-') >= 0) {
		
		return str.replace(dashRegex,function(m) { return m.charAt(1).toUpperCase(); });
	} else {
		
		return str;
		
	}};


// Basic events - move to separate file?
var emit__ = function(event,args,node) {
	
	let prev;
	let cb;
	let ret;
	
	while ((prev = node) && (node = node.next)){
		
		if (cb = node.listener) {
			
			if (node.path && cb[node.path]) {
				
				ret = args ? cb[node.path].apply(cb,args) : cb[node.path]();
			} else {
				
				// check if it is a method?
				ret = args ? cb.apply(node,args) : cb.call(node);
			}		}		
		if (node.times && --node.times <= 0) {
			
			prev.next = node.next;
			node.listener = null;
		}	}	return;
};

// method for registering a listener on object
imba$1.listen = function (obj,event,listener,path){
	
	let cbs;
	let list;
	let tail;
	cbs = obj.__listeners__ || (obj.__listeners__ = {});
	list = cbs[event] || (cbs[event] = {});
	tail = list.tail || (list.tail = (list.next = {}));
	tail.listener = listener;
	tail.path = path;
	list.tail = tail.next = {};
	return tail;
};

// register a listener once
imba$1.once = function (obj,event,listener){
	
	let tail = imba$1.listen(obj,event,listener);
	tail.times = 1;
	return tail;
};

// remove a listener
imba$1.unlisten = function (obj,event,cb,meth){
	
	let node;
	let prev;
	let meta = obj.__listeners__;
	if (!(meta)) { return }	
	if (node = meta[event]) {
		
		while ((prev = node) && (node = node.next)){
			
			if (node == cb || node.listener == cb) {
				
				prev.next = node.next;
				// check for correct path as well?
				node.listener = null;
				break;
			}		}	}	return;
};

// emit event
imba$1.emit = function (obj,event,params){
	var cb;
	
	if (cb = obj.__listeners__) {
		
		if (cb[event]) { emit__(event,params,cb[event]); }		if (cb.all) { emit__(event,[event,params],cb.all); }	}	return;
};

imba$1.scheduler = new Scheduler();
imba$1.$commit = function() { return imba$1.scheduler.add('render'); };

imba$1.commit = function() {
	
	imba$1.scheduler.add('render');
	return imba$1.scheduler.promise;
};

imba$1.tick = function() {
	
	imba$1.commit();
	return imba$1.scheduler.promise;
};

/*
DOM
*/


imba$1.mount = function (mountable,into){
	
	let parent = into || document.body;
	let element = mountable;
	if (mountable instanceof Function) {
		
		let ctx = {_: parent};
		let tick = function() {
			
			imba$1.ctx = ctx;
			return mountable(ctx);
		};
		element = tick();
		imba$1.scheduler.listen('render',tick);
	} else {
		
		// automatic scheduling of element - even before
		// element.__schedule = yes
		element.__F |= 64;
	}	
	return parent.appendChild(element);
};

var proxyHandler = {
	get(target,name){
		
		let ctx = target;
		let val = undefined;
		while (ctx && val == undefined){
			
			if (ctx = ctx.$parent) {
				
				val = ctx[name];
			}		}		return val;
	}
};

extend$$2(Node,{
	
	
	get $context(){
		
		return this.$context_ || (this.$context_ = new Proxy(this,proxyHandler));
	},
	
	get $parent(){
		
		return this.up$ || this.parentNode;
	},
	
	init$(){
		
		return this;
	},
	
	// replace this with something else
	replaceWith$(other){
		
		if (!((other instanceof Node)) && other.replace$) {
			
			other.replace$(this);
		} else {
			
			this.parentNode.replaceChild(other,this);
		}		return other;
	},
	
	insertInto$(parent){
		
		parent.appendChild$(this);
		return this;
	},
	
	insertBefore$(el,prev){
		
		return this.insertBefore(el,prev);
	},
	
	insertBeforeBegin$(other){
		
		return this.parentNode.insertBefore(other,this);
	},
	
	insertAfterEnd$(other){
		
		if (this.nextSibling) {
			
			return this.nextSibling.insertBeforeBegin$(other);
		} else {
			
			return this.parentNode.appendChild(other);
		}	},
	
	insertAfterBegin$(other){
		
		if (this.childNodes[0]) {
			
			return this.childNodes[0].insertBeforeBegin$(other);
		} else {
			
			return this.appendChild(other);
		}	},
});

extend$$2(Comment,{
	
	// replace this with something else
	replaceWith$(other){
		
		if (other && other.joinBefore$) {
			
			other.joinBefore$(this);
		} else {
			
			this.parentNode.insertBefore$(other,this);
		}		// other.insertBeforeBegin$(this)
		this.parentNode.removeChild(this);
		// self.parentNode.replaceChild(other,this)
		return other;
	},
});

// what if this is in a webworker?
extend$$2(Element,{
	
	
	emit(name,detail,o = {bubbles: true}){
		
		if (detail != undefined) { o.detail = detail; }		let event = new CustomEvent(name,o);
		let res = this.dispatchEvent(event);
		return event;
	},
	
	slot$(name,ctx){
		
		return this;
	},
	
	on$(type,mods,scope){
		
		
		let check = 'on$' + type;
		let handler;
		
		// check if a custom handler exists for this type?
		if (this[check] instanceof Function) {
			
			handler = this[check](mods,scope);
		}		
		handler = new EventHandler(mods,scope);
		let capture = mods.capture;
		let passive = mods.passive;
		
		let o = capture;
		
		if (passive) {
			
			o = {passive: passive,capture: capture};
		}		
		if (type == 'touch') {
			
			type = 'pointerdown';
			handler.type = 'touch';
		}		
		this.addEventListener(type,handler,o);
		return handler;
	},
	
	// inline in files or remove all together?
	text$(item){
		
		this.textContent = item;
		return this;
	},
	
	insert$(item,f,prev){
		
		let type = typeof item;
		
		if (type === 'undefined' || item === null) {
			
			// what if the prev value was the same?
			if (prev && (prev instanceof Comment)) {
				
				return prev;
			}			
			let el = document.createComment('');
			prev ? prev.replaceWith$(el) : el.insertInto$(this);
			return el;
		}		
		// dont reinsert again
		if (item === prev) {
			
			return item;
		} else if (type !== 'object') {
			
			let res;
			let txt = item;
			
			if ((f & 128) && (f & 256)) {
				
				// FIXME what if the previous one was not text? Possibly dangerous
				// when we set this on a fragment - it essentially replaces the whole
				// fragment?
				this.textContent = txt;
				return;
			}			
			if (prev) {
				
				if (prev instanceof Text) {
					
					prev.textContent = txt;
					return prev;
				} else {
					
					res = document.createTextNode(txt);
					prev.replaceWith$(res,this);
					return res;
				}			} else {
				
				this.appendChild$(res = document.createTextNode(txt));
				return res;
			}		} else {
			
			prev ? prev.replaceWith$(item,this) : item.insertInto$(this);
			return item;
		}		
	},
	get flags(){
		
		if (!(this.$flags)) {
			
			// unless deopted - we want to first cache the extflags
			this.$flags = new Flags(this);
			if (this.flag$ == Element.prototype.flag$) {
				
				this.flags$ext = this.className;
			}			this.flagDeopt$();
		}		return this.$flags;
	},
	
	flag$(str){
		
		this.className = str;
		return;
		
	},
	flagDeopt$(){
		var self = this;
		
		this.flag$ = function(str) { return self.flagSync$(self.flags$ext = str); };
		this.flagSelf$ = function(str) { return self.flagSync$(self.flags$own = str); };
		return;
	},
	
	flagSelf$(str){
		
		// if a tag receives flags from inside <self> we need to
		// redefine the flag-methods to later use both
		this.flagDeopt$();
		return this.flagSelf$(str);
		
		// let existing = (flags$ext ||= self.className)
		// self.flag$ = do(str) self.flagSync$(flags$ext = str)
		// self.flagSelf$ = do(str) self.flagSync$(flags$own = str)
		// self.className = (existing ? existing + ' ' : '') + (flags$own = str)
		// return
	},
	
	flagSync$(){
		
		return this.className = ((this.flags$ext || '') + ' ' + (this.flags$own || '') + ' ' + (this.$flags || ''));
	},
	
	open$(){
		
		return this;
	},
	
	close$(){
		
		return this;
	},
	
	end$(){
		
		if (this.render) { this.render(); }		return;
	},
	
	css$(key,value,mods){
		
		return this.style[key] = value;
		
	},
	css$var(name,value,unit,key){
		
		let cssval = imba$1.toStyleValue(value,unit,key);
		this.style.setProperty(name,cssval);
		return;
	},
});

Element.prototype.appendChild$ = Element.prototype.appendChild;
Element.prototype.removeChild$ = Element.prototype.removeChild;
Element.prototype.insertBefore$ = Element.prototype.insertBefore;
Element.prototype.replaceChild$ = Element.prototype.replaceChild;
Element.prototype.set$ = Element.prototype.setAttribute;
Element.prototype.setns$ = Element.prototype.setAttributeNS;

ShadowRoot.prototype.insert$ = Element.prototype.insert$;
ShadowRoot.prototype.appendChild$ = Element.prototype.appendChild$;

imba$1.createLiveFragment = createLiveFragment;
imba$1.createIndexedFragment = createIndexedFragment;
imba$1.createKeyedFragment = createKeyedFragment;

const CustomTagConstructors = {};

class ImbaElementRegistry {
	
	
	constructor(){
		
		this.types = {};
	}
	
	lookup(name){
		
		return this.types[name];
	}
	
	get(name,klass){
		
		if (!(name) || name == 'component') { return ImbaElement }		if (this.types[name]) { return this.types[name] }		if (klass && root$1[klass]) { return root$1[klass] }		return root$1.customElements.get(name) || ImbaElement;
	}
	
	create(name){
		
		if (this.types[name]) {
			
			// TODO refactor
			return this.types[name].create$();
		} else {
			
			return document.createElement(name);
		}	}
	
	define(name,klass,options){
		
		this.types[name] = klass;
		klass.nodeName = name;
		
		let proto = klass.prototype;
		
		// if proto.render && proto.end$ == Element.prototype.end$
		// proto.end$ = proto.render
		
		if (options && options.extends) {
			
			CustomTagConstructors[name] = klass;
		} else {
			
			root$1.customElements.define(name,klass);
		}		return klass;
	}
}
imba$1.tags = new ImbaElementRegistry();


// root.customElements.define('imba-element',ImbaElement)

imba$1.createElement = function (name,parent,flags,text){
	
	var el = document.createElement(name);
	
	if (flags) { el.className = flags; }	
	if (text !== null) {
		
		el.text$(text);
	}	
	if (parent && (parent instanceof Node)) {
		
		el.insertInto$(parent);
	}	
	return el;
};

imba$1.createComponent = function (name,parent,flags,text){
	
	// the component could have a different web-components name?
	var el;
	
	if (typeof name != 'string') {
		
		if (name && name.nodeName) {
			
			name = name.nodeName;
		}	}	
	if (CustomTagConstructors[name]) {
		
		el = CustomTagConstructors[name].create$(el);
		el.slot$ = ImbaElement.prototype.slot$;
		el.__slots = {};
	} else {
		
		el = document.createElement(name);
	}	
	el.up$ = parent;
	el.init$();
	
	if (text !== null) {
		
		el.slot$('__').text$(text);
	}	
	// mark the classes as external static flags?
	if (flags) {
		
		el.flag$(flags);
	}	return el;
};

imba$1.createSVGElement = function (name,parent,flags,text){
	
	var el = document.createElementNS("http://www.w3.org/2000/svg",name);
	if (flags) {
		
		{
			
			el.className.baseVal = flags;
		}	}	if (parent && (parent instanceof Node)) {
		
		el.insertInto$(parent);
	}	return el;
};

// import './intersect'

function iter$$3(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }function extend$$3(target,ext){
	// @ts-ignore
	var descriptors = Object.getOwnPropertyDescriptors(ext);
	// @ts-ignore
	Object.defineProperties(target.prototype,descriptors);
	return target;
}const toBind = {
	INPUT: true,
	SELECT: true,
	TEXTAREA: true,
	BUTTON: true
};

var isGroup = function(obj) {
	
	return (obj instanceof Array) || (obj && (obj.has instanceof Function));
};

var bindHas = function(object,value) {
	
	if (object instanceof Array) {
		
		return object.indexOf(value) >= 0;
	} else if (object && (object.has instanceof Function)) {
		
		return object.has(value);
	} else if (object && (object.contains instanceof Function)) {
		
		return object.contains(value);
	} else if (object == value) {
		
		return true;
	} else {
		
		return false;
	}};

var bindAdd = function(object,value) {
	
	if (object instanceof Array) {
		
		return object.push(value);
	} else if (object && (object.add instanceof Function)) {
		
		return object.add(value);
	}};

var bindRemove = function(object,value) {
	
	if (object instanceof Array) {
		
		let idx = object.indexOf(value);
		if (idx >= 0) { return object.splice(idx,1) }	} else if (object && (object.delete instanceof Function)) {
		
		return object.delete(value);
	}};

function createProxyProperty(target){
	
	function getter(){
		
		return target[0] ? target[0][target[1]] : undefined;
	}	
	function setter(v){
		
		return target[0] ? ((target[0][target[1]] = v)) : null;
	}	
	return {
		get: getter,
		set: setter
	};
}
/*
Data binding
*/

extend$$3(Element,{
	
	getRichValue(){
		
		return this.value;
	},
	
	setRichValue(value){
		
		return this.value = value;
	},
	
	bind$(key,value){
		
		let o = value || [];
		
		if (key == 'data' && !(this.$$bound) && toBind[this.nodeName]) {
			
			this.$$bound = true;
			if (this.change$) {
				
				this.addEventListener('change',this.change$ = this.change$.bind(this));
			}			if (this.input$) {
				
				this.addEventListener('input',this.input$ = this.input$.bind(this),{capture: true});
			}			if (this.click$) {
				
				this.addEventListener('click',this.click$ = this.click$.bind(this),{capture: true});
			}			// this.on$('change',{_change$: true},this) if this.change$
			// this.on$('input',{capture: true,_input$: true},this) if this.input$
		}		
		Object.defineProperty(this,key,(o instanceof Array) ? createProxyProperty(o) : o);
		return o;
	},
});

Object.defineProperty(Element.prototype,'richValue',{
	get(){
		
		return this.getRichValue();
	},
	set(v){
		
		return this.setRichValue(v);
	}
});

extend$$3(HTMLSelectElement,{
	
	
	change$(e){
		
		let model = this.data;
		let prev = this.$$value;
		this.$$value = undefined;
		let values = this.getRichValue();
		
		if (this.multiple) {
			
			if (prev) {
				
				for (let $i = 0, $items = iter$$3(prev), $len = $items.length; $i < $len; $i++) {
					let value = $items[$i];
					if (values.indexOf(value) != -1) { continue; }					
					bindRemove(model,value);
				}			}			
			for (let $i = 0, $items = iter$$3(values), $len = $items.length; $i < $len; $i++) {
				let value = $items[$i];
				
				if (!(prev) || prev.indexOf(value) == -1) {
					
					bindAdd(model,value);
				}			}		} else {
			
			this.data = values[0];
		}		imba.commit();
		return this;
	},
	
	getRichValue(){
		var $res;
		
		if (this.$$value) {
			
			return this.$$value;
		}		
		$res = [];
		for (let $i = 0, $items = iter$$3(this.selectedOptions), $len = $items.length; $i < $len; $i++) {
			let o = $items[$i];
			
			$res.push(o.richValue);
		}		return this.$$value = $res;
	},
	
	syncValue(){
		
		let model = this.data;
		
		if (this.multiple) {
			
			let vals = [];
			for (let i = 0, $items = iter$$3(this.options), $len = $items.length; i < $len; i++) {
				let option = $items[i];
				
				let val = option.richValue;
				let sel = bindHas(model,val);
				option.selected = sel;
				if (sel) { vals.push(val); }			}			this.$$value = vals;
		} else {
			
			for (let i = 0, $items = iter$$3(this.options), $len = $items.length; i < $len; i++) {
				let option = $items[i];
				
				let val = option.richValue;
				if (val == model) {
					
					this.$$value = [val];
					this.selectedIndex = i;break;
				}			}		}		return;
	},
	
	end$(){
		
		return this.syncValue();
	},
});

extend$$3(HTMLOptionElement,{
	
	setRichValue(value){
		
		this.$$value = value;
		return this.value = value;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		return this.value;
	},
});

extend$$3(HTMLTextAreaElement,{
	
	setRichValue(value){
		
		this.$$value = value;
		return this.value = value;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		return this.value;
	},
	
	input$(e){
		
		this.data = this.value;
		return imba.commit();
	},
	
	end$(){
		
		if (this.$$bound && this.value != this.data) {
			
			return this.value = this.data;
		}	},
});


extend$$3(HTMLInputElement,{
	
	
	input$(e){
		
		let typ = this.type;
		
		if (typ == 'checkbox' || typ == 'radio') {
			
			return;
		}		
		this.$$value = undefined;
		this.data = this.richValue;
		return imba.commit();
	},
	
	change$(e){
		
		let model = this.data;
		let val = this.richValue;
		
		if (this.type == 'checkbox' || this.type == 'radio') {
			
			let checked = this.checked;
			if (isGroup(model)) {
				
				checked ? bindAdd(model,val) : bindRemove(model,val);
			} else {
				
				this.data = checked ? val : false;
			}		}		return imba.commit();
	},
	
	setRichValue(value){
		
		if (this.$$value !== value) {
			
			this.$$value = value;
			
			if (this.value !== value) {
				
				this.value = value;
			}		}		return;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		
		let value = this.value;
		let typ = this.type;
		
		if (typ == 'range' || typ == 'number') {
			
			value = this.valueAsNumber;
			if (Number.isNaN(value)) { value = null; }		} else if (typ == 'checkbox') {
			
			if (value == undefined || value === 'on') { value = true; }		}		
		return value;
	},
	
	end$(){
		
		if (this.$$bound) {
			
			let typ = this.type;
			if (typ == 'checkbox' || typ == 'radio') {
				
				let val = this.data;
				if (val === true || val === false || val == null) {
					
					this.checked = !(!(val));
				} else {
					
					this.checked = bindHas(val,this.richValue);
				}			} else {
				
				this.richValue = this.data;
			}		}		return;
		
	},
});
extend$$3(HTMLButtonElement,{
	
	
	get checked(){
		
		return this.$checked;
		
	},
	set checked(val){
		
		if (val != this.$checked) {
			
			this.$checked = val;
			this.flags.toggle('checked',!(!(val)));
		}	},
	
	setRichValue(value){
		
		this.$$value = value;
		return this.value = value;
	},
	
	getRichValue(){
		
		if (this.$$value !== undefined) {
			
			return this.$$value;
		}		return this.value;
		
	},
	click$(e){
		
		let data = this.data;
		let toggled = this.checked;
		let val = this.richValue;
		// if self.type == 'checkbox' or self.type == 'radio'
		if (isGroup(data)) {
			
			toggled ? bindRemove(data,val) : bindAdd(data,val);
		} else {
			
			this.data = toggled ? null : val;
		}		
		return imba.commit();
	},
	
	end$(){
		
		if (this.$$bound) {
			
			let val = this.data;
			if (val === true || val === false || val == null) {
				
				this.checked = !(!(val));
			} else {
				
				this.checked = bindHas(val,this.richValue);
			}		}		return;
	},
});

class Add extends imba.tags.get('component','ImbaElement') {
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $t$2;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$t$1 = $c$0.d || ($c$0.d = $t$1=imba.createElement('button',$t$0,null,null));
		$t$2=$t$0.__slots.__;
		if(!$t$2 || $t$2.isEmpty$()){
		($t$2="click me");
		}
		$t$2===$c$0.e__ || ($c$0.e_ = $t$1.insert$($c$0.e__=$t$2,384,$c$0.e_));
		$t$0.close$($d$0);
		return $t$0;
	}
} imba.tags.define('add-pcnr88',Add,{});

imba.inlineStyles("add-pcnr88 button:not(#_) {--u_depth: 5px;\n--text: hsla(210.00,38.46%,94.90%,100%);\n--color: hsla(258.05,49.80%,51.57%,100%);\n--shade: hsla(254.37,41.04%,33.92%,100%);\nbackground: var(--color);\nbox-shadow: 0px calc(var(--u_depth,1depth) * 1) var(--shade);\ncolor: var(--text);\ntransition: all .08s;\ntransform: translateY(calc(var(--u_depth,-1depth) * -1));\nborder-radius: 4px;\npadding-top: 0.25rem;\npadding-bottom: 0.25rem;\npadding-left: 0.5rem;\npadding-right: 0.5rem;\nwidth: 100%;\nfont-size: 24px;\nline-height: 36px;\n--u_lh: 36px;}\nadd-pcnr88 button:not(#_):hover {--u_depth: 6px;}\nadd-pcnr88 button:not(#_):active {--u_depth: 3px;}\nadd-pcnr88 button:not(#_):hover {--text: hsla(204.00,45.45%,97.84%,100%);}\nadd-pcnr88 button:not(#_):hover {--color: hsla(258.54,59.42%,59.41%,100%);}\nadd-pcnr88 button:not(#_):active {--color: hsla(258.05,49.80%,51.57%,100%);}\nadd-pcnr88 button:not(#_):hover {--shade: hsla(255.96,43.93%,41.96%,100%);}\nadd-pcnr88 button:not(#_):active {--shade: hsla(254.37,41.04%,33.92%,100%);}\n\n");
/*
add-pcnr88 button:not(#_) {--u_depth: 5px;
--text: hsla(210.00,38.46%,94.90%,100%);
--color: hsla(258.05,49.80%,51.57%,100%);
--shade: hsla(254.37,41.04%,33.92%,100%);
background: var(--color);
box-shadow: 0px calc(var(--u_depth,1depth) * 1) var(--shade);
color: var(--text);
transition: all .08s;
transform: translateY(calc(var(--u_depth,-1depth) * -1));
border-radius: 4px;
padding-top: 0.25rem;
padding-bottom: 0.25rem;
padding-left: 0.5rem;
padding-right: 0.5rem;
width: 100%;
font-size: 24px;
line-height: 36px;
--u_lh: 36px;}
add-pcnr88 button:not(#_):hover {--u_depth: 6px;}
add-pcnr88 button:not(#_):active {--u_depth: 3px;}
add-pcnr88 button:not(#_):hover {--text: hsla(204.00,45.45%,97.84%,100%);}
add-pcnr88 button:not(#_):hover {--color: hsla(258.54,59.42%,59.41%,100%);}
add-pcnr88 button:not(#_):active {--color: hsla(258.05,49.80%,51.57%,100%);}
add-pcnr88 button:not(#_):hover {--shade: hsla(255.96,43.93%,41.96%,100%);}
add-pcnr88 button:not(#_):active {--shade: hsla(254.37,41.04%,33.92%,100%);}


*/

class Logo extends imba.tags.get('component','ImbaElement') {
	
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $t$2;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$b$0 || ($t$1=imba.createSVGElement('svg',$t$0,null,null));
		$b$0 || ($t$1.set$('width',"100%"));
		$b$0 || ($t$1.set$('height',"100%"));
		$b$0 || ($t$1.set$('viewBox',"0 0 1402 519"));
		$b$0 || ($t$1.set$('version',"1.1"));
		$b$0 || ($t$1.set$('xmlns',"http://www.w3.org/2000/svg"));
		$b$0 || ($t$1.setns$('xmlns','xlink',"http://www.w3.org/1999/xlink"));
		$b$0 || ($t$1.setns$('xml','space',"preserve"));
		$b$0 || ($t$1.setns$('xmlns','serif',"http://www.serif.com/"));
		$b$0 || ($t$1.set$('style',"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"));
		$b$0 || ($t$2=imba.createSVGElement('path',$t$1,'d394ged',null));
		$b$0 || ($t$2.set$('d',"M517.255,63.07c-15.061,59.297 -150.964,352.842 -155.413,398.842c-3.516,36.354 33.018,71.872 40.497,48.781c22.443,-69.298 108.006,-210.335 136.19,-234.607c-6.121,14.563 -30.705,94.68 -31.983,113.547c-1.934,28.56 34.355,45.038 41.983,22.464c25.895,-76.636 105.733,-168.831 105.733,-168.831c0,0 -23.333,86.869 -23.843,99.638c-1.184,29.588 24.317,51.98 40.345,36.407c15.46,-15.022 56.329,-78.489 74.588,-100.448c52.47,-63.106 95.109,-71.959 111.526,-68.832c1.893,7.24 -15.692,33.967 -24.458,41.046c-31.9,18.357 -64.001,53.544 -69.192,71.158c-5.662,19.212 19.287,42.212 32.941,35.535c39.169,-19.153 81.287,-95.183 83.103,-96.693c19.269,-16.017 65.005,-30.846 65.005,-30.846c-45.199,34.012 -62.066,107.263 -10.149,108.036c11.863,0.177 41.066,-11.817 41.066,-11.817c0.572,0.572 -12.106,27.448 -14.327,35.648c-3.953,14.594 30.161,38.826 31.758,23.354c0.724,-7.025 43.75,-110.666 74.997,-158.901c19.195,-29.63 28.456,-62.614 22.328,-82.455c-4.843,-15.679 -27.988,-37.226 -60.42,-37.344c-30.141,-0.111 -94.186,17.842 -106.701,40.575c-9.826,17.85 8.948,40.837 17.509,34.386c15.918,-11.994 59.018,-35.439 89.725,-35.932c23.84,-0.383 22.751,14.084 22.751,14.084c-53.369,4.534 -155.79,55.079 -155.79,55.079c11.899,-44.904 -52.029,-58.795 -92.35,-32.394c14.2,-20.124 72.442,-119.226 79.362,-145.257c6.458,-24.297 -31.082,-48.368 -38.181,-30.183c-17.071,43.727 -173.77,305.565 -173.77,305.565c0,-3.033 50.447,-119.001 49.924,-127.204c-0.543,-8.525 -30.667,-25.356 -35.55,-22.827c-16.58,8.586 -92.442,87.831 -92.442,87.831c9.743,-26.114 41.852,-93.968 45.058,-98.906c8.471,-13.048 -31.669,-36.243 -38.953,-30.258c-14.614,12.006 -100.034,140.036 -119.014,165.136c-0.089,0.117 80.584,-173.588 81.854,-193.049c1.149,-17.613 -39.593,-54.4 -45.707,-30.328Zm369.083,302.851c27.827,-2.413 49.028,29.217 32.406,33.744c-15.998,4.356 -104.512,16.833 -196.802,39.419c-112.255,27.472 -230.576,65.587 -236.861,67.534c-32.392,10.036 -16.879,-35.911 2.839,-42.691c157.745,-54.24 374.098,-95.897 398.418,-98.006Zm-484.789,-259.494c-8.773,40.076 -94.052,229.342 -104.996,272.23c-7.778,30.477 32.359,68.742 39.066,43.688c19.711,-73.633 107.559,-248.579 112.467,-285.016c4.229,-31.404 -42.252,-50.479 -46.537,-30.902Zm681.017,153.099c5.957,-10.246 17.805,-15.526 29.406,-13.105c28.519,5.927 64.324,8.849 110.97,6.677c32.046,-1.493 -15.299,51.714 -59.441,47.523c-31.168,-2.958 -58.556,-11.97 -75.306,-21.03c-3.41,-1.881 -5.926,-5.049 -6.986,-8.796c-1.06,-3.748 -0.576,-7.764 1.344,-11.153c-0.042,-0.023 -0.042,-0.023 0.013,-0.116Zm-788.021,-14.209c5.357,-1.355 11.016,0.492 14.541,4.747c3.525,4.255 4.289,10.158 1.962,15.17c0.065,0.036 0.063,0.041 0.061,0.046c-7.424,15.987 -22.078,27.434 -39.387,30.766c-9.799,1.861 -20.858,3.408 -33.153,4.575c-44.143,4.191 -91.487,-49.016 -59.441,-47.523c47.704,2.221 85.733,-1.288 115.417,-7.781Zm652.282,50.416c21.238,-1.136 81.696,-66.601 84.629,-87.328c0,0 -79.409,49.957 -84.629,87.328Zm-605.431,-100.409c-4.763,12.017 -15.237,20.841 -27.888,23.493c-58.312,12.226 -142.145,7.468 -183.476,-2.556c-40.175,-9.743 -66.58,-68.204 -40.495,-59.487c60.58,20.246 173.265,26.937 237.043,19.706c4.875,-0.672 9.742,1.292 12.785,5.16c3.044,3.868 3.809,9.059 2.01,13.641c0.033,0.013 0.033,0.013 0.021,0.043Zm771.512,3.722c3.759,-11.64 14.856,-19.314 27.074,-18.722c59.241,2.372 128.887,-8.958 172.551,-23.55c26.085,-8.717 -3.32,49.744 -43.495,59.487c-33.265,8.068 -96.162,11.615 -142.488,4.941c-4.939,-0.775 -9.292,-3.668 -11.919,-7.921c-2.627,-4.253 -3.265,-9.441 -1.747,-14.204c0.013,0.004 0.013,0.004 0.024,-0.031Zm-747.307,-72.314c-3.92,12.888 -15.316,22.073 -28.743,23.165c-117.108,8.424 -267.542,-18.636 -310.992,-63.46c-32.654,-33.687 -30.563,-98.47 -11.993,-77.88c70.369,78.022 243.35,100.48 337.541,99.488c4.641,-0.104 9.05,2.023 11.857,5.72c2.807,3.697 3.671,8.516 2.323,12.958c0.009,0.003 0.009,0.003 0.007,0.009Zm753.823,9.05c-2.173,-6.738 -1.129,-14.101 2.831,-19.97c3.96,-5.868 10.397,-9.591 17.459,-10.098c95.668,-7.542 201.075,-44.593 248.483,-97.157c18.569,-20.59 20.661,44.193 -11.994,77.88c-34.92,36.026 -135.371,60.576 -235.27,64.436c-9.734,0.342 -18.513,-5.818 -21.502,-15.088c-0.006,0 -0.007,-0.002 -0.007,-0.003Z"));
		$t$0.close$($d$0);
		return $t$0;
	}
} imba.tags.define('logo-d394ge',Logo,{});

imba.inlineStyles("logo-d394ge:not(#_) {width: 200px;\nmargin-top: 2.5rem;\nmargin-bottom: 2.5rem;\n--color: rgb(245, 224, 94);}\n\n.d394ged:not(#_):not(#_) {fill: var(--color);}\n\n");
/*
logo-d394ge:not(#_) {width: 200px;
margin-top: 2.5rem;
margin-bottom: 2.5rem;
--color: rgb(245, 224, 94);}

.d394ged:not(#_):not(#_) {fill: var(--color);}


*/

class ChooseImage extends imba.tags.get('component','ImbaElement') {
	
	
	
	readFile(file){
		var self = this;
		
		if (!(file) || file.type.slice(0,5) != 'image') {
			
			window.alert("Please choose image");
			return;
		}		let reader = new FileReader();
		reader.onload = function(e) { return self.data.drawImage(e.target.result); };
		return reader.readAsDataURL(file);
	}
	
	onDropFile(e){
		
		e.stopPropagation();
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			
			return this.readFile(e.dataTransfer.files[0]);
			// readFile({target: {files: e.dataTransfer.files}})
		} else {
			
			return window.alert('The File APIs are not fully supported in this browser.');
		}	}
	
	openFile(){
		var self = this;
		
		this.readFile = function(e) {
			
			let file = e.target.files[0];
			if (!(file) || !((file.type.slice(0,5) == 'image' || file.type.slice(0,5) == 'video'))) {
				
				window.alert("Please choose image");
				return;
			}			let reader = new FileReader();
			reader.onload = function(e) {
				
				self.data.drawImage(e.target.result);
				return document.body.removeChild(self.fileInput);
			};
			return reader.readAsDataURL(file);
		};
		this.fileInput = document.createElement("input");
		this.fileInput.type = 'file';
		this.fileInput.accept = "image/*";
		this.fileInput.style.display = 'none';
		this.fileInput.onchange = this.readFile;
		document.body.appendChild(this.fileInput);
		return this.clickElem(this.fileInput);
	}
	
	clickElem(elem){
		
		var eventMouse = document.createEvent("MouseEvents");
		eventMouse.initMouseEvent("click",true,false,window,0,0,0,0,0,false,false,false,false,0,null);
		return elem.dispatchEvent(eventMouse);
	}
	
	dragOver(evt){
		
		evt.stopPropagation();
		return evt.dataTransfer.dropEffect = 'copy';
	}
	
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $t$2, $t$3;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$b$0 || ($t$1=imba.createElement('button',$t$0,null,null));
		$b$0 || ($t$1.on$(`click`,{prevent: true,openFile: true},this));
		$b$0 || ($t$1.on$(`dragover`,{prevent: true,dragOver: true},this));
		$b$0 || ($t$1.on$(`drop`,{prevent: true,onDropFile: true},this));
		$b$0 || ($t$2=imba.createElement('p',$t$1,null,"Choose an image"));
		$b$0 || ($t$2=imba.createSVGElement('svg',$t$1,null,null));
		$b$0 || ($t$2.set$('xmlns',"http://www.w3.org/2000/svg"));
		$b$0 || ($t$2.set$('height',"24"));
		$b$0 || ($t$2.set$('viewBox',"0 0 24 24"));
		$b$0 || ($t$2.set$('width',"24"));
		$b$0 || ($t$3=imba.createSVGElement('path',$t$2,null,null));
		$b$0 || ($t$3.set$('d',"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"));
		$t$0.close$($d$0);
		return $t$0;
	}
	
} imba.tags.define('choose-image-mny5rm',ChooseImage,{});

imba.inlineStyles("choose-image-mny5rm:not(#_) {width: 320px;\nheight: 320px;}\n\nchoose-image-mny5rm button:not(#_) {--u_depth: 5px;\n--text: hsla(210.00,38.46%,94.90%,100%);\n--color: hsla(258.05,49.80%,51.57%,100%);\n--shade: hsla(254.37,41.04%,33.92%,100%);\nbackground: var(--color);\ndisplay: flex;\nfd: collumn;\njustify-content: center;\nalign-items: center;\nbox-shadow: 0px calc(var(--u_depth,1depth) * 1) var(--shade);\ncolor: var(--text);\ntransition: all .08s;\ntransform: translateY(calc(var(--u_depth,-1depth) * -1));\nborder-radius: 4px;\npadding-top: 0.25rem;\npadding-bottom: 0.25rem;\npadding-left: 0.5rem;\npadding-right: 0.5rem;\nwidth: 100%;\nheight: 100%;\nfont-size: 24px;\nline-height: 36px;\n--u_lh: 36px;}\nchoose-image-mny5rm button:not(#_):hover {--u_depth: 6px;}\nchoose-image-mny5rm button:not(#_):active {--u_depth: 3px;}\nchoose-image-mny5rm button:not(#_):hover {--text: hsla(204.00,45.45%,97.84%,100%);}\nchoose-image-mny5rm button:not(#_):hover {--color: hsla(258.54,59.42%,59.41%,100%);}\nchoose-image-mny5rm button:not(#_):active {--color: hsla(258.05,49.80%,51.57%,100%);}\nchoose-image-mny5rm button:not(#_):hover {--shade: hsla(255.96,43.93%,41.96%,100%);}\nchoose-image-mny5rm button:not(#_):active {--shade: hsla(254.37,41.04%,33.92%,100%);}\n\n");
/*
choose-image-mny5rm:not(#_) {width: 320px;
height: 320px;}

choose-image-mny5rm button:not(#_) {--u_depth: 5px;
--text: hsla(210.00,38.46%,94.90%,100%);
--color: hsla(258.05,49.80%,51.57%,100%);
--shade: hsla(254.37,41.04%,33.92%,100%);
background: var(--color);
display: flex;
fd: collumn;
justify-content: center;
align-items: center;
box-shadow: 0px calc(var(--u_depth,1depth) * 1) var(--shade);
color: var(--text);
transition: all .08s;
transform: translateY(calc(var(--u_depth,-1depth) * -1));
border-radius: 4px;
padding-top: 0.25rem;
padding-bottom: 0.25rem;
padding-left: 0.5rem;
padding-right: 0.5rem;
width: 100%;
height: 100%;
font-size: 24px;
line-height: 36px;
--u_lh: 36px;}
choose-image-mny5rm button:not(#_):hover {--u_depth: 6px;}
choose-image-mny5rm button:not(#_):active {--u_depth: 3px;}
choose-image-mny5rm button:not(#_):hover {--text: hsla(204.00,45.45%,97.84%,100%);}
choose-image-mny5rm button:not(#_):hover {--color: hsla(258.54,59.42%,59.41%,100%);}
choose-image-mny5rm button:not(#_):active {--color: hsla(258.05,49.80%,51.57%,100%);}
choose-image-mny5rm button:not(#_):hover {--shade: hsla(255.96,43.93%,41.96%,100%);}
choose-image-mny5rm button:not(#_):active {--shade: hsla(254.37,41.04%,33.92%,100%);}


*/

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/* eslint-disable no-bitwise, unicorn/prefer-query-selector */

/**
* StackBlur - a fast almost Gaussian Blur For Canvas
*
* In case you find this class useful - especially in commercial projects -
* I am not totally unhappy for a small donation to my PayPal account
* mario@quasimondo.de
*
* Or support me on flattr:
* {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}.
*
* @module StackBlur
* @author Mario Klingemann
* Contact: mario@quasimondo.com
* Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
* Twitter: @quasimondo
*
* @copyright (c) 2010 Mario Klingemann
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/* eslint-disable max-len */
var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
/* eslint-enable max-len */

/**
 * @param {string|HTMLImageElement} img
 * @param {string|HTMLCanvasElement} canvas
 * @param {Float} radius
 * @param {boolean} blurAlphaChannel
 * @returns {undefined}
 */

function processImage(img, canvas, radius, blurAlphaChannel) {
  if (typeof img === 'string') {
    img = document.getElementById(img);
  }

  if (!img || !('naturalWidth' in img)) {
    return;
  }

  var w = img.naturalWidth;
  var h = img.naturalHeight;

  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  if (!canvas || !('getContext' in canvas)) {
    return;
  }

  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = w;
  canvas.height = h;
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, w, h);
  context.drawImage(img, 0, 0);

  if (isNaN(radius) || radius < 1) {
    return;
  }

  if (blurAlphaChannel) {
    processCanvasRGBA(canvas, 0, 0, w, h, radius);
  } else {
    processCanvasRGB(canvas, 0, 0, w, h, radius);
  }
}
/**
 * @param {string|HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @throws {Error|TypeError}
 * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
 */


function getImageDataFromCanvas(canvas, topX, topY, width, height) {
  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  if (!canvas || _typeof(canvas) !== 'object' || !('getContext' in canvas)) {
    throw new TypeError('Expecting canvas with `getContext` method ' + 'in processCanvasRGB(A) calls!');
  }

  var context = canvas.getContext('2d');

  try {
    return context.getImageData(topX, topY, width, height);
  } catch (e) {
    throw new Error('unable to access image data: ' + e);
  }
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */


function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
  if (isNaN(radius) || radius < 1) {
    return;
  }

  radius |= 0;
  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
  imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
  canvas.getContext('2d').putImageData(imageData, topX, topY);
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */


function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
  var pixels = imageData.data;
  var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, aSum, rOutSum, gOutSum, bOutSum, aOutSum, rInSum, gInSum, bInSum, aInSum, pr, pg, pb, pa, rbs;
  var div = 2 * radius + 1; // const w4 = width << 2;

  var widthMinus1 = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1 = radius + 1;
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  var stackStart = new BlurStack();
  var stack = stackStart;
  var stackEnd;

  for (i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();

    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }

  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;
  yw = yi = 0;
  var mulSum = mulTable[radius];
  var shgSum = shgTable[radius];

  for (y = 0; y < height; y++) {
    rInSum = gInSum = bInSum = aInSum = rSum = gSum = bSum = aSum = 0;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
      bSum += (stack.b = pb = pixels[p + 2]) * rbs;
      aSum += (stack.a = pa = pixels[p + 3]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;
      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;

    for (x = 0; x < width; x++) {
      pixels[yi + 3] = pa = aSum * mulSum >> shgSum;

      if (pa !== 0) {
        pa = 255 / pa;
        pixels[yi] = (rSum * mulSum >> shgSum) * pa;
        pixels[yi + 1] = (gSum * mulSum >> shgSum) * pa;
        pixels[yi + 2] = (bSum * mulSum >> shgSum) * pa;
      } else {
        pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
      }

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
      rInSum += stackIn.r = pixels[p];
      gInSum += stackIn.g = pixels[p + 1];
      bInSum += stackIn.b = pixels[p + 2];
      aInSum += stackIn.a = pixels[p + 3];
      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      aSum += aInSum;
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      aOutSum += pa = stackOut.a;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;
      stackOut = stackOut.next;
      yi += 4;
    }

    yw += width;
  }

  for (x = 0; x < width; x++) {
    gInSum = bInSum = aInSum = rInSum = gSum = bSum = aSum = rSum = 0;
    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    yp = width;

    for (i = 1; i <= radius; i++) {
      yi = yp + x << 2;
      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
      aSum += (stack.a = pa = pixels[yi + 3]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;
      stack = stack.next;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;

    for (y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p + 3] = pa = aSum * mulSum >> shgSum;

      if (pa > 0) {
        pa = 255 / pa;
        pixels[p] = (rSum * mulSum >> shgSum) * pa;
        pixels[p + 1] = (gSum * mulSum >> shgSum) * pa;
        pixels[p + 2] = (bSum * mulSum >> shgSum) * pa;
      } else {
        pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
      }

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
      rSum += rInSum += stackIn.r = pixels[p];
      gSum += gInSum += stackIn.g = pixels[p + 1];
      bSum += bInSum += stackIn.b = pixels[p + 2];
      aSum += aInSum += stackIn.a = pixels[p + 3];
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      aOutSum += pa = stackOut.a;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;
      stackOut = stackOut.next;
      yi += width;
    }
  }

  return imageData;
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */


function processCanvasRGB(canvas, topX, topY, width, height, radius) {
  if (isNaN(radius) || radius < 1) {
    return;
  }

  radius |= 0;
  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
  imageData = processImageDataRGB(imageData, topX, topY, width, height, radius);
  canvas.getContext('2d').putImageData(imageData, topX, topY);
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */


function processImageDataRGB(imageData, topX, topY, width, height, radius) {
  var pixels = imageData.data;
  var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, rOutSum, gOutSum, bOutSum, rInSum, gInSum, bInSum, pr, pg, pb, rbs;
  var div = 2 * radius + 1; // const w4 = width << 2;

  var widthMinus1 = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1 = radius + 1;
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  var stackStart = new BlurStack();
  var stack = stackStart;
  var stackEnd;

  for (i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();

    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }

  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;
  yw = yi = 0;
  var mulSum = mulTable[radius];
  var shgSum = shgTable[radius];

  for (y = 0; y < height; y++) {
    rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
      bSum += (stack.b = pb = pixels[p + 2]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;

    for (x = 0; x < width; x++) {
      pixels[yi] = rSum * mulSum >> shgSum;
      pixels[yi + 1] = gSum * mulSum >> shgSum;
      pixels[yi + 2] = bSum * mulSum >> shgSum;
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
      rInSum += stackIn.r = pixels[p];
      gInSum += stackIn.g = pixels[p + 1];
      bInSum += stackIn.b = pixels[p + 2];
      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      stackOut = stackOut.next;
      yi += 4;
    }

    yw += width;
  }

  for (x = 0; x < width; x++) {
    gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;
    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    yp = width;

    for (i = 1; i <= radius; i++) {
      yi = yp + x << 2;
      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      stack = stack.next;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;

    for (y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p] = rSum * mulSum >> shgSum;
      pixels[p + 1] = gSum * mulSum >> shgSum;
      pixels[p + 2] = bSum * mulSum >> shgSum;
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
      rSum += rInSum += stackIn.r = pixels[p];
      gSum += gInSum += stackIn.g = pixels[p + 1];
      bSum += bInSum += stackIn.b = pixels[p + 2];
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      stackOut = stackOut.next;
      yi += width;
    }
  }

  return imageData;
}
/**
 *
 */


var BlurStack =
/**
 * Set properties.
 */
function BlurStack() {
  _classCallCheck(this, BlurStack);

  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.next = null;
};

var $1 = new WeakMap(), $2 = new WeakMap(), $3 = new WeakMap();
/*
This tag is a box with resizers and gragggers
to measure borders for resizing image or text &c
*/


let crop = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
};

// Save state of crop before dragging
// to calculate result of dragging suming up touch difference and previous state
let bcrop = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
};

class MeasuringBox extends imba.tags.get('component','ImbaElement') {
	static init$(){
		
		return this;
	}
	init$(){
		super.init$();return undefined;
	}
	
	set width(value) {
		$1.set(this,value);
	}
	get width() {
		return $1.get(this);
	}
	set height(value) {
		$2.set(this,value);
	}
	get height() {
		return $2.get(this);
	}
	set text_resizing(value) {
		$3.set(this,value);
	}
	get text_resizing() {
		return $3.has(this) ? $3.get(this) : false;
	}
	
	mount(){
		
		crop = this.data.crop;
		this.width = this.data.width;
		this.height = this.data.height;
		this.text_resizing = this.data.text_resizing || this.data.text_resizing;
		return this.backUpCrop();
	}
	
	backUpCrop(){
		
		return bcrop = JSON.parse(JSON.stringify(crop));
	}
	
	// Functions that calculate new value concrete side
	moveN(e){
		
		const new_height = bcrop.height - e.dy;
		if (e.dy < 0 && (new_height > this.height || bcrop.top + e.dy < 0) && crop.width * 2 >= bcrop.height + bcrop.top) {
			
			crop.top = 0;
			return crop.height = bcrop.height + bcrop.top;
		} else if (new_height >= crop.width * 2) {
			
			crop.height = crop.width * 2;
			return crop.top = (bcrop.height - crop.height) + bcrop.top;
		} else if (this.height >= new_height && new_height >= crop.width / 2 && new_height >= 64) {
			
			crop.height = new_height;
			return crop.top = bcrop.top + e.dy;
		} else {
			
			crop.height = (crop.width / 2 > 64) ? (crop.width / 2) : 64;
			return crop.top = bcrop.top + (bcrop.height - crop.height);
		}	}
	
	moveW(e){
		
		const new_width = bcrop.width - e.dx;
		// This function is used for text editing where is another restrictions
		if (!(this.text_resizing)) {
			
			if (e.dx < 0 && (bcrop.width - e.dx > this.width || bcrop.left + e.dx < 0) && crop.height * 2 >= bcrop.width + bcrop.left) {
				
				crop.left = 0;
				return crop.width = bcrop.width + bcrop.left;
			} else if (new_width >= crop.height * 2) {
				
				crop.width = crop.height * 2;
				return crop.left = (bcrop.width - crop.width) + bcrop.left;
			} else if (this.width >= new_width && new_width >= crop.height / 2 && new_width >= 64) {
				
				crop.width = new_width;
				return crop.left = bcrop.left + e.dx;
			} else {
				
				crop.width = (crop.height / 2 > 64) ? (crop.height / 2) : 64;
				return crop.left = bcrop.left + (bcrop.width - crop.width);
			}		} else {
			
			if (this.data.calculateNewHeight(new_width) > this.height && new_width < crop.width) {
				
				return;
			}			if (e.dx < 0 && (bcrop.width - e.dx > this.width || bcrop.left + e.dx < 0)) {
				
				crop.left = 0;
				return crop.width = bcrop.width + bcrop.left;
			} else if (this.width >= new_width && new_width >= this.data.minimum_text_width) {
				
				crop.width = new_width;
				return crop.left = bcrop.left + e.dx;
			} else {
				
				crop.width = this.data.minimum_text_width;
				return crop.left = bcrop.left + (bcrop.width - crop.width);
			}		}	}
	
	moveS(e){
		
		const new_height = bcrop.height + e.dy;
		if (e.dy > 0 && bcrop.top + bcrop.height + e.dy > this.height && crop.width * 2 >= this.height - bcrop.top) {
			
			return crop.height = this.height - bcrop.top;
		} else if (new_height >= crop.width * 2) {
			
			return crop.height = crop.width * 2;
		} else if (this.height >= new_height && new_height >= crop.width / 2 && new_height >= 64) {
			
			return crop.height = new_height;
		} else {
			
			return crop.height = (crop.width / 2 > 64) ? (crop.width / 2) : 64;
		}	}
	
	moveE(e){
		
		const new_width = bcrop.width + e.dx;
		if (!(this.text_resizing)) {
			
			if (e.dx > 0 && bcrop.left + bcrop.width + e.dx > this.width && crop.height * 2 >= this.width - bcrop.left) {
				
				return crop.width = this.width - bcrop.left;
			} else if (new_width >= crop.height * 2) {
				
				return crop.width = crop.height * 2;
			} else if (this.width >= new_width && new_width >= crop.height / 2 && new_width >= 64) {
				
				return crop.width = new_width;
			} else {
				
				return crop.width = (crop.height / 2 > 64) ? (crop.height / 2) : 64;
			}		} else {
			
			if (this.data.calculateNewHeight(new_width) > this.height && new_width < crop.width) {
				
				return;
			}			if (bcrop.left + new_width > this.width) {
				
				return crop.width = this.width - bcrop.left;
			} else if (this.width >= new_width && new_width >= this.data.minimum_text_width) {
				
				return crop.width = new_width;
			} else {
				
				return crop.width = this.data.minimum_text_width;
			}		}	}
	
	// # # # # Functions that trigger concrete functions to change concrete sides
	// Fonctions for sides changes
	dragN(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			return this.moveN(e);
		}	}
	
	dragW(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			return this.moveW(e);
		}	}
	
	dragS(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			return this.moveS(e);
		}	}
	
	dragE(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			return this.moveE(e);
		}	}
	
	// Functions for corner changes
	dragNW(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			this.moveN(e);
			return this.moveW(e);
		}	}
	
	dragNE(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			this.moveN(e);
			return this.moveE(e);
		}	}
	
	dragSE(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			this.moveS(e);
			return this.moveE(e);
		}	}
	
	dragSW(e){
		
		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			this.moveS(e);
			return this.moveW(e);
		}	}
	
	
	dragCropArea(e){
		
		if (e.target.className.indexOf('dragger') > 0) ;		if (e.type.slice(-4) == 'down') {
			
			this.backUpCrop();
		}		if (e.type.slice(-4) == 'move') {
			
			if (!(bcrop.top + e.dy + crop.height > this.height || bcrop.top + e.dy < 0)) {
				
				crop.top = bcrop.top + e.dy;
			} else {
				
				if (bcrop.top + e.dy + crop.height > this.height) {
					
					crop.top = this.height - bcrop.height;
				} else if (this.height || bcrop.top + e.dy < 0) {
					
					crop.top = 0;
				}			}			
			if (!(bcrop.left + e.dx + crop.width > this.width || bcrop.left + e.dx < 0)) {
				
				return crop.left = bcrop.left + e.dx;
			} else {
				
				if (bcrop.left + e.dx + crop.width > this.width) {
					
					return crop.left = this.width - bcrop.width;
				} else if (this.width || bcrop.left + e.dx < 0) {
					
					return crop.left = 0;
				}			}		}	}
	
	render(){
		var self = this, $bg$0$2, $bg$1$2, $bg$2$2, $bg$3$2, $bg$4$2, $bg$5$2, $bg$6$2, $bg$7$2, $t$0, $c$0, $b$0, $d$0, $v$0, $t$1, $v$1, $b$3, $d$3, $v$3, $t$2, $b$2, $d$2, $v$2;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		($v$0=this.text_resizing ? 0 : 1,$v$0===$c$0.bh || ($t$0.css$var('--vhmu9bc',$c$0.bh=$v$0,null,'o')));
		((!$b$0||$d$0&2) && $t$0.flagSelf$('vhmu9bb'));
		$t$1 = ($c$0.bi) || ($c$0.bi=$t$1=imba.createElement('div',$t$0,'vhmu9bf',null));
		($v$1=this.width,$v$1===$c$0.bj || ($t$1.css$var('--vhmu9bg',$c$0.bj=$v$1,'px','w')));
		($v$1=this.height,$v$1===$c$0.bk || ($t$1.css$var('--vhmu9bh',$c$0.bk=$v$1,'px','h')));
		($v$1=crop.left,$v$1===$c$0.bl || ($t$1.css$var('--vhmu9bi',$c$0.bl=$v$1,'px','clip-path')));
		($v$1=crop.top + crop.height,$v$1===$c$0.bm || ($t$1.css$var('--vhmu9bj',$c$0.bm=$v$1,'px','clip-path')));
		($v$1=crop.left,$v$1===$c$0.bn || ($t$1.css$var('--vhmu9bk',$c$0.bn=$v$1,'px','clip-path')));
		($v$1=crop.top,$v$1===$c$0.bo || ($t$1.css$var('--vhmu9bl',$c$0.bo=$v$1,'px','clip-path')));
		($v$1=crop.left + crop.width,$v$1===$c$0.bp || ($t$1.css$var('--vhmu9bm',$c$0.bp=$v$1,'px','clip-path')));
		($v$1=crop.top,$v$1===$c$0.bq || ($t$1.css$var('--vhmu9bn',$c$0.bq=$v$1,'px','clip-path')));
		($v$1=crop.left + crop.width,$v$1===$c$0.br || ($t$1.css$var('--vhmu9bo',$c$0.br=$v$1,'px','clip-path')));
		($v$1=crop.top + crop.height,$v$1===$c$0.bs || ($t$1.css$var('--vhmu9bp',$c$0.bs=$v$1,'px','clip-path')));
		($v$1=crop.left,$v$1===$c$0.bt || ($t$1.css$var('--vhmu9bq',$c$0.bt=$v$1,'px','clip-path')));
		($v$1=crop.top + crop.height,$v$1===$c$0.bu || ($t$1.css$var('--vhmu9br',$c$0.bu=$v$1,'px','clip-path')));
		$t$1 = ($c$0.bv) || ($c$0.bv=$t$1=imba.createElement('div',$t$0,'vhmu9bs',null));
		($v$1=this.width,$v$1===$c$0.bw || ($t$1.css$var('--vhmu9bt',$c$0.bw=$v$1,'px','w')));
		($v$1=this.height,$v$1===$c$0.bx || ($t$1.css$var('--vhmu9bu',$c$0.bx=$v$1,'px','h')));
		$bg$0$2 = $bg$1$2 = $bg$2$2 = $bg$3$2 = $bg$4$2 = $bg$5$2 = $bg$6$2 = $bg$7$2 = null;if (!(this.text_resizing)) {
			
			// Side resizers
			$bg$0$2 = ($b$3=$d$3=1,$c$0.by) || ($b$3=$d$3=0,$c$0.by=$bg$0$2=imba.createElement('div',null,'vhmu9bv dragger',null));
			$b$3||($bg$0$2.up$=$t$1);
			($v$3=crop.top - 8,$v$3===$c$0.bz || ($bg$0$2.css$var('--vhmu9bw',$c$0.bz=$v$3,'px','t')));
			($v$3=crop.left + (crop.width) / 2 - 8,$v$3===$c$0.ca || ($bg$0$2.css$var('--vhmu9bx',$c$0.ca=$v$3,'px','l')));
			$b$3 || ($bg$0$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragN(e);
			}]},this));
			$bg$1$2 = ($b$3=$d$3=1,$c$0.cb) || ($b$3=$d$3=0,$c$0.cb=$bg$1$2=imba.createElement('div',null,'vhmu9by dragger',null));
			$b$3||($bg$1$2.up$=$t$1);
			($v$3=crop.top + (crop.height) / 2 - 8,$v$3===$c$0.cc || ($bg$1$2.css$var('--vhmu9bz',$c$0.cc=$v$3,'px','t')));
			($v$3=crop.left + crop.width - 8,$v$3===$c$0.cd || ($bg$1$2.css$var('--vhmu9baa',$c$0.cd=$v$3,'px','l')));
			$b$3 || ($bg$1$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragE(e);
			}]},this));
			$bg$2$2 = ($b$3=$d$3=1,$c$0.ce) || ($b$3=$d$3=0,$c$0.ce=$bg$2$2=imba.createElement('div',null,'vhmu9bab dragger',null));
			$b$3||($bg$2$2.up$=$t$1);
			($v$3=crop.top + crop.height - 8,$v$3===$c$0.cf || ($bg$2$2.css$var('--vhmu9bac',$c$0.cf=$v$3,'px','t')));
			($v$3=crop.left + (crop.width) / 2 - 8,$v$3===$c$0.cg || ($bg$2$2.css$var('--vhmu9bad',$c$0.cg=$v$3,'px','l')));
			$b$3 || ($bg$2$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragS(e);
			}]},this));
			$bg$3$2 = ($b$3=$d$3=1,$c$0.ch) || ($b$3=$d$3=0,$c$0.ch=$bg$3$2=imba.createElement('div',null,'vhmu9bae dragger',null));
			$b$3||($bg$3$2.up$=$t$1);
			($v$3=crop.top + (crop.height) / 2 - 8,$v$3===$c$0.ci || ($bg$3$2.css$var('--vhmu9baf',$c$0.ci=$v$3,'px','t')));
			($v$3=crop.left - 8,$v$3===$c$0.cj || ($bg$3$2.css$var('--vhmu9bag',$c$0.cj=$v$3,'px','l')));
			$b$3 || ($bg$3$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragW(e);
			}]},this));
			
			// Corner resizers
			$bg$4$2 = ($b$3=$d$3=1,$c$0.ck) || ($b$3=$d$3=0,$c$0.ck=$bg$4$2=imba.createElement('div',null,'vhmu9bah dragger',null));
			$b$3||($bg$4$2.up$=$t$1);
			($v$3=crop.top - 8,$v$3===$c$0.cl || ($bg$4$2.css$var('--vhmu9bai',$c$0.cl=$v$3,'px','t')));
			($v$3=crop.left - 8,$v$3===$c$0.cm || ($bg$4$2.css$var('--vhmu9baj',$c$0.cm=$v$3,'px','l')));
			$b$3 || ($bg$4$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragNW(e);
			}]},this));
			$bg$5$2 = ($b$3=$d$3=1,$c$0.cn) || ($b$3=$d$3=0,$c$0.cn=$bg$5$2=imba.createElement('div',null,'vhmu9bak dragger',null));
			$b$3||($bg$5$2.up$=$t$1);
			($v$3=crop.top - 8,$v$3===$c$0.co || ($bg$5$2.css$var('--vhmu9bal',$c$0.co=$v$3,'px','t')));
			($v$3=crop.left + crop.width - 8,$v$3===$c$0.cp || ($bg$5$2.css$var('--vhmu9bam',$c$0.cp=$v$3,'px','l')));
			$b$3 || ($bg$5$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragNE(e);
			}]},this));
			$bg$6$2 = ($b$3=$d$3=1,$c$0.cq) || ($b$3=$d$3=0,$c$0.cq=$bg$6$2=imba.createElement('div',null,'vhmu9ban dragger',null));
			$b$3||($bg$6$2.up$=$t$1);
			($v$3=crop.top + crop.height - 8,$v$3===$c$0.cr || ($bg$6$2.css$var('--vhmu9bao',$c$0.cr=$v$3,'px','t')));
			($v$3=crop.left + crop.width - 8,$v$3===$c$0.cs || ($bg$6$2.css$var('--vhmu9bap',$c$0.cs=$v$3,'px','l')));
			$b$3 || ($bg$6$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragSE(e);
			}]},this));
			$bg$7$2 = ($b$3=$d$3=1,$c$0.ct) || ($b$3=$d$3=0,$c$0.ct=$bg$7$2=imba.createElement('div',null,'vhmu9baq dragger',null));
			$b$3||($bg$7$2.up$=$t$1);
			($v$3=crop.top + crop.height - 8,$v$3===$c$0.cu || ($bg$7$2.css$var('--vhmu9bar',$c$0.cu=$v$3,'px','t')));
			($v$3=crop.left - 8,$v$3===$c$0.cv || ($bg$7$2.css$var('--vhmu9bas',$c$0.cv=$v$3,'px','l')));
			$b$3 || ($bg$7$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragSW(e);
			}]},this));
		} else {
			
			$bg$0$2 = ($b$3=$d$3=1,$c$0.cw) || ($b$3=$d$3=0,$c$0.cw=$bg$0$2=imba.createElement('div',null,'vhmu9bat dragger',null));
			$b$3||($bg$0$2.up$=$t$1);
			($v$3=crop.height,$v$3===$c$0.cx || ($bg$0$2.css$var('--vhmu9bau',$c$0.cx=$v$3,'px','h')));
			($v$3=crop.top,$v$3===$c$0.cy || ($bg$0$2.css$var('--vhmu9bav',$c$0.cy=$v$3,'px','t')));
			($v$3=crop.left + crop.width - 8,$v$3===$c$0.cz || ($bg$0$2.css$var('--vhmu9baw',$c$0.cz=$v$3,'px','l')));
			$b$3 || ($bg$0$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragE(e);
			}]},this));
			$bg$1$2 = ($b$3=$d$3=1,$c$0.da) || ($b$3=$d$3=0,$c$0.da=$bg$1$2=imba.createElement('div',null,'vhmu9bax dragger',null));
			$b$3||($bg$1$2.up$=$t$1);
			($v$3=crop.height,$v$3===$c$0.db || ($bg$1$2.css$var('--vhmu9bay',$c$0.db=$v$3,'px','h')));
			($v$3=crop.top,$v$3===$c$0.dc || ($bg$1$2.css$var('--vhmu9baz',$c$0.dc=$v$3,'px','t')));
			($v$3=crop.left - 8,$v$3===$c$0.dd || ($bg$1$2.css$var('--vhmu9bba',$c$0.dd=$v$3,'px','l')));
			$b$3 || ($bg$1$2.on$(`touch`,{$_: [function(e,$) {
				return self.dragW(e);
			}]},this));
			
		}
		($c$0.$bg$0$2_ = $t$1.insert$($bg$0$2,0,$c$0.$bg$0$2_));
		($c$0.$bg$1$2_ = $t$1.insert$($bg$1$2,0,$c$0.$bg$1$2_));
		($c$0.$bg$2$2_ = $t$1.insert$($bg$2$2,0,$c$0.$bg$2$2_));
		($c$0.$bg$3$2_ = $t$1.insert$($bg$3$2,0,$c$0.$bg$3$2_));
		($c$0.$bg$4$2_ = $t$1.insert$($bg$4$2,0,$c$0.$bg$4$2_));
		($c$0.$bg$5$2_ = $t$1.insert$($bg$5$2,0,$c$0.$bg$5$2_));
		($c$0.$bg$6$2_ = $t$1.insert$($bg$6$2,0,$c$0.$bg$6$2_));
		($c$0.$bg$7$2_ = $t$1.insert$($bg$7$2,0,$c$0.$bg$7$2_));		$t$2 = ($b$2=$d$2=1,$c$0.de) || ($b$2=$d$2=0,$c$0.de=$t$2=imba.createElement('div',$t$1,'vhmu9bbb',null));
		($v$2=crop.top,$v$2===$c$0.df || ($t$2.css$var('--vhmu9bbc',$c$0.df=$v$2,'px','t')));
		($v$2=crop.left,$v$2===$c$0.dg || ($t$2.css$var('--vhmu9bbd',$c$0.dg=$v$2,'px','l')));
		($v$2=crop.width,$v$2===$c$0.dh || ($t$2.css$var('--vhmu9bbe',$c$0.dh=$v$2,'px','w')));
		($v$2=crop.height,$v$2===$c$0.di || ($t$2.css$var('--vhmu9bbf',$c$0.di=$v$2,'px','h')));
		$b$2 || ($t$2.on$(`touch`,{$_: [function(e,$) {
			return self.dragCropArea(e);
		}]},this));
		$t$0.close$($d$0);
		return $t$0;
	}
	
	
	
	
} MeasuringBox.init$(); imba.tags.define('measuring-box-vhmu9b',MeasuringBox,{});

imba.inlineStyles(".vhmu9bb:not(#_):not(#_) {position: absolute;\ntop: 0rem;\nleft: 0rem;\ndisplay: block;\noverflow: visible;\nbackground: hsla(201.00,100.00%,96.08%,100%);\nopacity: var(--vhmu9bc);}\n.vhmu9bb:not(#_):not(#_):hover {opacity: 1;}\n\n.vhmu9bf:not(#_):not(#_) {position: absolute;\ndisplay: block;\nleft: 0rem;\ntop: 0rem;\nwidth: var(--vhmu9bg);\nheight: var(--vhmu9bh);\nbackground: rgba(0, 0, 0, 0.5);\nclip-path: polygon(0% 0%, 0% 100%, var(--vhmu9bi) var(--vhmu9bj), var(--vhmu9bk) var(--vhmu9bl), var(--vhmu9bm) var(--vhmu9bn), var(--vhmu9bo) var(--vhmu9bp), var(--vhmu9bq) var(--vhmu9br), 0% 100%, 100% 100%, 100% 0%);}\n\n.vhmu9bs:not(#_):not(#_) {position: absolute;\ndisplay: block;\nleft: 0rem;\ntop: 0rem;\nwidth: var(--vhmu9bt);\nheight: var(--vhmu9bu);}\n\n.vhmu9bv:not(#_):not(#_) {top: var(--vhmu9bw);\nleft: var(--vhmu9bx);\ncursor: ns-resize;}\n\n.vhmu9by:not(#_):not(#_) {top: var(--vhmu9bz);\nleft: var(--vhmu9baa);\ncursor: ew-resize;}\n\n.vhmu9bab:not(#_):not(#_) {top: var(--vhmu9bac);\nleft: var(--vhmu9bad);\ncursor: ns-resize;}\n\n.vhmu9bae:not(#_):not(#_) {top: var(--vhmu9baf);\nleft: var(--vhmu9bag);\ncursor: ew-resize;}\n\n.vhmu9bah:not(#_):not(#_) {top: var(--vhmu9bai);\nleft: var(--vhmu9baj);\ncursor: nwse-resize;}\n\n.vhmu9bak:not(#_):not(#_) {top: var(--vhmu9bal);\nleft: var(--vhmu9bam);\ncursor: nesw-resize;}\n\n.vhmu9ban:not(#_):not(#_) {top: var(--vhmu9bao);\nleft: var(--vhmu9bap);\ncursor: nwse-resize;}\n\n.vhmu9baq:not(#_):not(#_) {top: var(--vhmu9bar);\nleft: var(--vhmu9bas);\ncursor: nesw-resize;}\n\n.vhmu9bat:not(#_):not(#_) {height: var(--vhmu9bau);\ntop: var(--vhmu9bav);\nleft: var(--vhmu9baw);\ncursor: ew-resize;}\n\n.vhmu9bax:not(#_):not(#_) {height: var(--vhmu9bay);\ntop: var(--vhmu9baz);\nleft: var(--vhmu9bba);\ncursor: ew-resize;}\n\n.vhmu9bbb:not(#_):not(#_) {position: absolute;\ntop: var(--vhmu9bbc);\nleft: var(--vhmu9bbd);\nwidth: var(--vhmu9bbe);\nheight: var(--vhmu9bbf);\ncursor: move;}\n\nmeasuring-box-vhmu9b:not(#_) {transition: all 300ms ease 0s;}\n\nmeasuring-box-vhmu9b .dragger:not(#_) {position: absolute;\nwidth: 16px;\nheight: 16px;\nbackground: rgba(192, 192, 192, 0.5);\nz-index: 3;}\n\n");
/*
.vhmu9bb:not(#_):not(#_) {position: absolute;
top: 0rem;
left: 0rem;
display: block;
overflow: visible;
background: hsla(201.00,100.00%,96.08%,100%);
opacity: var(--vhmu9bc);}
.vhmu9bb:not(#_):not(#_):hover {opacity: 1;}

.vhmu9bf:not(#_):not(#_) {position: absolute;
display: block;
left: 0rem;
top: 0rem;
width: var(--vhmu9bg);
height: var(--vhmu9bh);
background: rgba(0, 0, 0, 0.5);
clip-path: polygon(0% 0%, 0% 100%, var(--vhmu9bi) var(--vhmu9bj), var(--vhmu9bk) var(--vhmu9bl), var(--vhmu9bm) var(--vhmu9bn), var(--vhmu9bo) var(--vhmu9bp), var(--vhmu9bq) var(--vhmu9br), 0% 100%, 100% 100%, 100% 0%);}

.vhmu9bs:not(#_):not(#_) {position: absolute;
display: block;
left: 0rem;
top: 0rem;
width: var(--vhmu9bt);
height: var(--vhmu9bu);}

.vhmu9bv:not(#_):not(#_) {top: var(--vhmu9bw);
left: var(--vhmu9bx);
cursor: ns-resize;}

.vhmu9by:not(#_):not(#_) {top: var(--vhmu9bz);
left: var(--vhmu9baa);
cursor: ew-resize;}

.vhmu9bab:not(#_):not(#_) {top: var(--vhmu9bac);
left: var(--vhmu9bad);
cursor: ns-resize;}

.vhmu9bae:not(#_):not(#_) {top: var(--vhmu9baf);
left: var(--vhmu9bag);
cursor: ew-resize;}

.vhmu9bah:not(#_):not(#_) {top: var(--vhmu9bai);
left: var(--vhmu9baj);
cursor: nwse-resize;}

.vhmu9bak:not(#_):not(#_) {top: var(--vhmu9bal);
left: var(--vhmu9bam);
cursor: nesw-resize;}

.vhmu9ban:not(#_):not(#_) {top: var(--vhmu9bao);
left: var(--vhmu9bap);
cursor: nwse-resize;}

.vhmu9baq:not(#_):not(#_) {top: var(--vhmu9bar);
left: var(--vhmu9bas);
cursor: nesw-resize;}

.vhmu9bat:not(#_):not(#_) {height: var(--vhmu9bau);
top: var(--vhmu9bav);
left: var(--vhmu9baw);
cursor: ew-resize;}

.vhmu9bax:not(#_):not(#_) {height: var(--vhmu9bay);
top: var(--vhmu9baz);
left: var(--vhmu9bba);
cursor: ew-resize;}

.vhmu9bbb:not(#_):not(#_) {position: absolute;
top: var(--vhmu9bbc);
left: var(--vhmu9bbd);
width: var(--vhmu9bbe);
height: var(--vhmu9bbf);
cursor: move;}

measuring-box-vhmu9b:not(#_) {transition: all 300ms ease 0s;}

measuring-box-vhmu9b .dragger:not(#_) {position: absolute;
width: 16px;
height: 16px;
background: rgba(192, 192, 192, 0.5);
z-index: 3;}


*/

var $1$1 = new WeakMap(), $2$1 = new WeakMap(), $3$1 = new WeakMap(), $4 = new WeakMap(), $5 = new WeakMap(), $6 = new WeakMap(), $7 = new WeakMap(), $8 = new WeakMap();
class MmeasuringTextState {
	static init$(){
		
		return this;
	}
	constructor(){
		
		
	}
	
	set canvas(value) {
		$1$1.set(this,value);
	}
	get canvas() {
		var $t$0, $b$0, $d$0, $c$$ = (imba.ctx||{});
		if (!$1$1.has(this)) { $1$1.set(this,($t$0=($b$0=$d$0=1,$c$$.c) || ($b$0=$d$0=0,$c$$.c=$t$0=imba.createElement('canvas',null,'nruzghb',null)),
		$b$0||($t$0.up$=$c$$._),
		$t$0)); }		return $1$1.get(this);
	}
	set text(value) {
		$2$1.set(this,value);
	}
	get text() {
		return $2$1.has(this) ? $2$1.get(this) : '';
	}
	set crop(value) {
		$3$1.set(this,value);
	}
	get crop() {
		if (!$3$1.has(this)) { $3$1.set(this,{}); }		return $3$1.get(this);
	}
	set font(value) {
		$4.set(this,value);
	}
	get font() {
		if (!$4.has(this)) { $4.set(this,{}); }		return $4.get(this);
	}
	set width(value) {
		$5.set(this,value);
	}
	get width() {
		return $5.has(this) ? $5.get(this) : 0;
	}
	set height(value) {
		$6.set(this,value);
	}
	get height() {
		return $6.has(this) ? $6.get(this) : 0;
	}
	set text_resizing(value) {
		$7.set(this,value);
	}
	get text_resizing() {
		return $7.has(this) ? $7.get(this) : true;
	}
	set minimum_text_width(value) {
		$8.set(this,value);
	}
	get minimum_text_width() {
		return $8.has(this) ? $8.get(this) : 0;
	}
	
	calculateTextLines(context,maxWidth,lineHeight){
		
		this.minimum_text_width = 0;
		let words = this.text.split(' ');
		let line = '';
		let lines = [];
		
		// Generates an array of wrapped line and
		// calculates the height of future text to center it later
		for (let len = words.length, n = 0, rd = len - n; (rd > 0) ? (n < len) : (n > len); (rd > 0) ? (n++) : (n--)) {
			
			// The next 3 lines calculates minimum possible width of the text box
			let minimum_text_width_metrics = context.measureText(words[n]);
			if (minimum_text_width_metrics.width > this.minimum_text_width) {
				
				this.minimum_text_width = minimum_text_width_metrics.width;
			}			
			let testLine = line + words[n] + ' ';
			let metrics = context.measureText(testLine);
			let testWidth = metrics.width;
			if ((testWidth > maxWidth && n > 0)) {
				
				lines.push(line);
				line = words[n] + ' ';
			} else {
				
				line = testLine;
			}		}		lines.push(line);
		
		if (this.minimum_text_width > this.canvas.width) {
			
			this.minimum_text_width = this.canvas.width;
		}		
		return lines;
	}
	
	
	calculateNewHeight(new_width,size = this.font.size){
		
		let ctx = this.canvas.getContext('2d');
		ctx.save();
		
		ctx.font = size + 'px ' + this.font.family;
		ctx.textAlign = this.font.align;
		const lines = this.calculateTextLines(ctx,new_width,this.font.lineHeight * size);
		
		ctx.restore();
		return lines.length * (this.font.lineHeight * size);
	}
	
	
	calculateMaximumFontSize(){
		
		this.font.maxsize = 2048;
		let new_height = this.calculateNewHeight(this.canvas.width,this.font.maxsize);
		console.log(this.canvas.width * this.canvas.height,this.text.length * this.font.lineHeight * this.font.size * this.font.size);
		// font.size = (canvas.width * canvas.height) / (text.length * font.line-height)
		// font.size = (canvas.width * canvas.height) / (text.length * font.line-height * font.line-height )
		this.font.size = Math.sqrt((this.canvas.width * this.canvas.height) / (this.text.length * this.font.lineHeight));
		
		let iterations = 0;
		while (new_height >= this.canvas.height){
			
			console.log(this.font.maxsize,this.canvas.height,new_height,((this.canvas.height) / new_height));
			this.font.maxsize = this.font.maxsize * (((this.canvas.height) / new_height)) * 2;
			new_height = this.calculateNewHeight(this.canvas.width,this.font.maxsize);
			
			iterations++;
			
			if (this.font.maxsize > 10000) {
				
				break;
			}		}		
		
		console.log(iterations,this.font.size,this.font.maxsize);
		// if font.size > font.maxsize
		// 	font.size = font.maxsize
		if (this.font.size > this.font.maxsize) {
			
			return this.font.maxsize = this.font.size;
		}	}
} MmeasuringTextState.init$();
imba.inlineStyles(".nruzghb:not(#_):not(#_) {display: block;}\n\n");
/*
.nruzghb:not(#_):not(#_) {display: block;}


*/

function iter$$4(a){ return a ? (a.toIterable ? a.toIterable() : a) : []; }var $1$2 = new WeakMap(), $2$2 = new WeakMap(), $3$2 = new WeakMap(), $4$1 = new WeakMap(), $5$1 = new WeakMap();

let measuringData = new MmeasuringTextState();

class CroppedImage extends imba.tags.get('component','ImbaElement') {
	static init$(){
		
		return this;
	}
	init$(){
		super.init$();return undefined;
	}
	
	set image(value) {
		$1$2.set(this,value);
	}
	get image() {
		if (!$1$2.has(this)) { $1$2.set(this,new Image); }		return $1$2.get(this);
	}
	set font(value) {
		$2$2.set(this,value);
	}
	get font() {
		if (!$2$2.has(this)) { $2$2.set(this,{
			size: 30,
			maxsize: 30,
			family: "Arial",
			color: "white",
			align: "center",
			lineHeight: 1.5
		}); }		return $2$2.get(this);
	}
	set blur(value) {
		$3$2.set(this,value);
	}
	get blur() {
		return $3$2.has(this) ? $3$2.get(this) : false;
	}
	set blur_radius(value) {
		$4$1.set(this,value);
	}
	get blur_radius() {
		return $4$1.has(this) ? $4$1.get(this) : 4;
	}
	set text_crop(value) {
		$5$1.set(this,value);
	}
	get text_crop() {
		if (!$5$1.has(this)) { $5$1.set(this,{
			left: 0,
			top: 0,
			width: 0,
			height: 0,
			total_text_height: 1.5
		}); }		return $5$1.get(this);
	}
	
	mount(){
		
		// Before painting text I use crop data to crop original image
		[this.width,this.height] = this.data.getSize(this.data.crop.width * this.data.uploaded_image.width,this.data.uploaded_image.height * this.data.crop.height);
		this.text_crop.width = this.width;
		this.text_crop.height = this.height;
		this.text_crop.left = 0;
		this.text_crop.top = 0;
		
		// measuringData.text = "if"
		measuringData.text = "After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.";
		// measuringData.text = "After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us.After finally growing annoyed with T-Rex chases we decided to end that, and fly to a nicer Place, but it is up to you to steer your plane to an Oasis with the Rest of us."
		measuringData.crop = this.text_crop;
		measuringData.font = this.font;
		measuringData.width = this.width;
		measuringData.height = this.height;
		measuringData.text_resizing = true;
		measuringData.minimum_text_width = 0;
		
		measuringData.canvas.width = this.width;
		measuringData.canvas.height = this.height;
		measuringData.canvas.imageSmoothingQuality = 'high';
		measuringData.calculateMaximumFontSize();
		this.renderImage();
		
		// Calculate top to display it in the center of the canvas
		this.text_crop.top = (this.height - this.text_crop.total_text_height) / 2;
		return this.calculateLuminance();
		// adjkfvn()
	}
	
	// Needed to define correct font collor. 
	// Dark on lighter pictures and light on darker
	calculateLuminance(){
		
		let rgb = this.getAverageRGB();
		document.body.children[2].style.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
		let Y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
		if (Y < 128) {
			
			return this.font.color = "white";
		} else {
			return this.font.color = "black";
		}	}
	
	adjkfvn(){
		var self = this;
		
		return setTimeout(function() {
			
			self.font.size *= 1.5;
			return console.log(self.font.size);
			// adjkfvn()
		},1000);
	}
	
	renderImage(){
		
		let ctx = measuringData.canvas.getContext('2d');
		ctx.save();
		// Clear canvas before painting
		ctx.clearRect(0,0,this.width,this.height);
		
		this.drawImage(ctx);
		this.drawText(ctx);
		
		ctx.restore();
		return imba.commit();
	}
	
	drawImage(ctx){
		
		if (this.blur) {
			
			return processImage(this.data.image,measuringData.canvas,this.blur_radius,false);
		} else {
			
			return ctx.drawImage(this.data.image,0,0,this.width,this.height);
		}	}
	
	drawText(ctx){
		
		ctx.font = this.font.size + 'px ' + this.font.family;
		ctx.textAlign = this.font.align;
		ctx.fillStyle = this.font.color;
		
		// [x, y] are coordinates of the center of the position of the text on the canvas
		const x = this.text_crop.width / 2 + this.text_crop.left;
		const y = this.text_crop.height / 2 + this.text_crop.top - (this.font.lineHeight * this.font.size) / 4;
		return this.wrapText(ctx,x,y,this.text_crop.width,this.font.lineHeight * this.font.size);
	}
	
	wrapText(context,x,y,maxWidth,lineHeight){
		var $res;
		
		if (maxWidth == 0) { return }		
		const lines = measuringData.calculateTextLines(context,maxWidth,lineHeight);
		
		this.text_crop.total_text_height = lines.length * lineHeight;
		
		// TODO Before drawing text check out if it can be fitted in the canvas frames
		// if text_crop.total_text_height > height + text_crop.top
		// console.log text_crop.total_text_height, height - text_crop.top
		if (this.text_crop.total_text_height > this.height - this.text_crop.top) {
			
			if (this.text_crop.total_text_height > this.height) {
				
				console.log("😱 😱 😱");
			} else {
				
				this.text_crop.top = this.height - this.text_crop.total_text_height;
			}		}		
		
		this.text_crop.height = this.text_crop.total_text_height;
		// Center the text position around y coordinate
		y = y - this.text_crop.total_text_height / 2 + lineHeight;
		// Write the lines from top to bottom
		$res = [];
		for (let $i = 0, $items = iter$$4(lines), $len = $items.length; $i < $len; $i++) {
			let line = $items[$i];
			
			context.fillText(line,x,y);
			// Change position of next line to be lower
			$res.push((y += lineHeight));
		}		return $res;
	}
	
	// # This is helper function for resizing text
	// # It prevents the going of the text box out of canvas
	// def textBoxCheck
	
	
	
	getAverageRGB(){
		
		let blockSize = 5;// only visit every 5 pixels
		let defaultRGB = {r: 0,g: 0,b: 0};// for non-supporting envs
		let context = measuringData.canvas.getContext && measuringData.canvas.getContext('2d');
		let imgdata;
		let i = -4;
		let rgb = {r: 0,g: 0,b: 0};
		let count = 0;
		
		if (!(context)) {
			
			return defaultRGB;
			
		}		try {
			
			imgdata = context.getImageData(0,0,this.width,this.height);
		} catch (e) {
			
			// security error, img on diff domain */alert('x')
			return defaultRGB;
		}		
		while ((i += blockSize * 4) < imgdata.data.length){
			
			++count;
			rgb.r += imgdata.data[i];
			rgb.g += imgdata.data[i + 1];
			rgb.b += imgdata.data[i + 2];
		}		
		// ~~ used to floor values
		rgb.r = ~~(rgb.r / count);
		rgb.g = ~~(rgb.g / count);
		rgb.b = ~~(rgb.b / count);
		
		return rgb;
	}
	
	
	render(){
		var $t$0, $c$0, $b$0, $d$0, $t$1, $b$1, $d$1, $v$1, $t$2, $b$2, $d$2, $v$2;
		
		this.renderImage();
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		((!$b$0||$d$0&2) && $t$0.flagSelf$('e6wu0bb'));
		$t$1 = ($b$1=$d$1=1,$c$0.h) || ($b$1=$d$1=0,$c$0.h=$t$1=imba.createElement('div',$t$0,'e6wu0be',null));
		($v$1=this.width,$v$1===$c$0.i || ($t$1.css$var('--e6wu0bf',$c$0.i=$v$1,'px','w')));
		($v$1=this.height,$v$1===$c$0.j || ($t$1.css$var('--e6wu0bg',$c$0.j=$v$1,'px','h')));
		($v$1=measuringData.canvas,($v$1===$c$0.k&&$b$1) || ($c$0.k_ = $t$1.insert$($c$0.k=$v$1,128,$c$0.k_)));
		$t$2 = ($b$2=$d$2=1,$c$0.l) || ($b$2=$d$2=0,$c$0.l=$t$2=imba.createComponent(MeasuringBox,$t$1,null,null));
		$b$2 || $t$2.bind$('data',{get:function(){ return measuringData },set:function(v$){ measuringData = v$; }});
		$b$2 || !$t$2.setup || $t$2.setup($d$2);
		$t$2.end$($d$2);
		$b$2 || $t$2.insertInto$($t$1);
		$b$0 || ($t$1=imba.createElement('div',$t$0,'actions',null));
		$t$2 = ($b$2=$d$2=1,$c$0.n) || ($b$2=$d$2=0,$c$0.n=$t$2=imba.createElement('input',$t$1,null,null));
		$b$2 || ($t$2.type='range');
		$b$2 || ($t$2.name='fontsize');
		$v$2=$c$0.o || ($c$0.o=$t$2.bind$('data',[null,'size']));
		$v$2[0]=this.font;
		$b$2 || ($t$2.step='0.1');
		$b$2 || ($t$2.min='4');
		($v$2=("" + (this.font.maxsize + 1)),$v$2===$c$0.p || ($t$2.max=$c$0.p=$v$2));
		$b$2 || !$t$2.setup || $t$2.setup($d$2);
		$t$2.end$($d$2);
		$t$0.close$($d$0);
		return $t$0;
	}
} CroppedImage.init$(); imba.tags.define('cropped-image-e6wu0b',CroppedImage,{});

imba.inlineStyles(".e6wu0bb:not(#_):not(#_) {display: block;}\n\n.e6wu0be:not(#_):not(#_) {position: relative;\ndisplay: block;\nwidth: var(--e6wu0bf);\nheight: var(--e6wu0bg);\noverflow: visible;\nbackground: hsla(0.00,0.00%,100.00%,0%);}\n\n");
/*
.e6wu0bb:not(#_):not(#_) {display: block;}

.e6wu0be:not(#_):not(#_) {position: relative;
display: block;
width: var(--e6wu0bf);
height: var(--e6wu0bg);
overflow: visible;
background: hsla(0.00,0.00%,100.00%,0%);}


*/

var $1$3 = new WeakMap(), $2$3 = new WeakMap(), $t$0;

// Here we save crop information
let crop$1 = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
};

let canvas = (($t$0=imba.createElement('canvas',null,'f0vwtmb',null)),
$t$0);
let measuringData$1 = {};

class CropImage extends imba.tags.get('component','ImbaElement') {
	static init$(){
		
		return this;
	}
	init$(){
		super.init$();return undefined;
	}
	
	set width(value) {
		$1$3.set(this,value);
	}
	get width() {
		return $1$3.get(this);
	}
	set height(value) {
		$2$3.set(this,value);
	}
	get height() {
		return $2$3.get(this);
	}
	
	mount(){
		
		[this.width,this.height] = this.data.getSize(this.data.uploaded_image.width,this.data.uploaded_image.height);
		crop$1.width = this.width;
		crop$1.height = this.height;
		crop$1.left = 0;
		crop$1.top = 0;
		measuringData$1 = {
			crop: crop$1,
			width: this.width,
			height: this.height
		};
		
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.imageSmoothingQuality = 'high';
		canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		canvas.getContext('2d').drawImage(this.data.uploaded_image,0,0,this.width,this.height);
		return imba.commit();
	}
	
	async cropImg(){
		var self = this;
		
		// In this view I get crop mesures on resized image,
		// in the next stage will be "real" cropping,
		// which will be on full image,
		// so for that I convert the mesures to percentages
		crop$1.width = crop$1.width / this.width;
		crop$1.height = crop$1.height / this.height;
		crop$1.left = crop$1.left / this.width;
		crop$1.top = crop$1.top / this.height;
		
		this.data.crop = crop$1;
		
		// # Get new optimized width, height and height for new canvas
		[this.width,this.height] = this.data.getSize(crop$1.width * this.data.uploaded_image.width,this.data.uploaded_image.height * crop$1.height);
		canvas.width = this.width;
		canvas.height = this.height;
		
		// Paint the cropped image on canvas and get toDataURL image
		canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		canvas.getContext('2d').drawImage(this.data.uploaded_image,crop$1.left * this.data.uploaded_image.width,crop$1.top * this.data.uploaded_image.height,crop$1.width * this.data.uploaded_image.width,crop$1.height * this.data.uploaded_image.height,0,0,this.width,this.height);
		
		this.data.image.src = canvas.toDataURL();
		// Now applied changes, grap picture and in the next tick go to the next stage
		return await imba.commit().then(function() {
			
			self.data.stage += 1;
			return imba.commit();
		});
	}
	
	render(){
		var self = this, t$01, $c$0, $b$0, $d$0, $v$0, $t$1, $b$1, $d$1, $t$mS, $v$1;
		
		t$01=this;
		t$01.open$();
		$c$0 = ($b$0=$d$0=1,t$01.$) || ($b$0=$d$0=0,t$01.$={});
		((!$b$0||$d$0&2) && t$01.flagSelf$('f0vwtmc'));
		($v$0=canvas,($v$0===$c$0.i&&$b$0) || ($c$0.i_ = t$01.insert$($c$0.i=$v$0,128,$c$0.i_)));
		$t$1 = ($b$1=$d$1=1,$c$0.j) || ($b$1=$d$1=0,$c$0.j=$t$1=imba.createComponent(MeasuringBox,t$01,null,null));
		$b$1 || $t$1.bind$('data',{get:function(){ return measuringData$1 },set:function(v$){ measuringData$1 = v$; }});
		$b$1 || !$t$1.setup || $t$1.setup($d$1);
		$t$1.end$($d$1);
		$b$1 || $t$1.insertInto$(t$01);
		$t$1 = ($b$1=$d$1=1,$c$0.l) || ($b$1=$d$1=0,$c$0.l=$t$1=imba.createComponent(Add,t$01,'f0vwtmf',"Next"));
		$t$mS = $t$1.slot$('__',$c$0);
		($v$1=this.height + 8,$v$1===$c$0.n || ($t$1.css$var('--f0vwtmg',$c$0.n=$v$1,'px','t')));
		($v$1=this.width,$v$1===$c$0.o || ($t$1.css$var('--f0vwtmh',$c$0.o=$v$1,'px','w')));
		$b$1 || ($t$1.on$(`click`,{$_: [function(e,$) {
			return self.cropImg(e);
		}]},this));
		$b$1 || !$t$1.setup || $t$1.setup($d$1);
		$t$1.end$($d$1);
		$b$1 || $t$1.insertInto$(t$01);
		t$01.close$($d$0);
		return t$01;
	}
	
	
} CropImage.init$(); imba.tags.define('crop-image-f0vwtm',CropImage,{});

imba.inlineStyles(".f0vwtmb:not(#_):not(#_) {display: block;}\n\n.f0vwtmc:not(#_):not(#_) {position: relative;\ndisplay: block;\noverflow: visible;\nbackground: hsla(0.00,0.00%,100.00%,0%);}\n\n.f0vwtmf:not(#_):not(#_) {position: absolute;\ntop: var(--f0vwtmg);\nwidth: var(--f0vwtmh);\nleft: 0rem;}\n\ncrop-image-f0vwtm .dragger:not(#_) {position: absolute;\nwidth: 16px;\nheight: 16px;\nbackground: rgba(192, 192, 192, 0.5);\nz-index: 3;}\n\n");
/*
.f0vwtmb:not(#_):not(#_) {display: block;}

.f0vwtmc:not(#_):not(#_) {position: relative;
display: block;
overflow: visible;
background: hsla(0.00,0.00%,100.00%,0%);}

.f0vwtmf:not(#_):not(#_) {position: absolute;
top: var(--f0vwtmg);
width: var(--f0vwtmh);
left: 0rem;}

crop-image-f0vwtm .dragger:not(#_) {position: absolute;
width: 16px;
height: 16px;
background: rgba(192, 192, 192, 0.5);
z-index: 3;}


*/

var $1$4 = new WeakMap(), $2$4 = new WeakMap(), $3$3 = new WeakMap(), $4$2 = new WeakMap();
class ImageState {
	static init$(){
		
		return this;
	}
	constructor(){
		
		
	}
	
	set uploaded_image(value) {
		$1$4.set(this,value);
	}
	get uploaded_image() {
		if (!$1$4.has(this)) { $1$4.set(this,new Image); }		return $1$4.get(this);
	}
	set image(value) {
		$2$4.set(this,value);
	}
	get image() {
		if (!$2$4.has(this)) { $2$4.set(this,new Image); }		return $2$4.get(this);
	}
	
	set stage(value) {
		$3$3.set(this,value);
	}
	get stage() {
		return $3$3.has(this) ? $3$3.get(this) : 0;
	}
	set crop(value) {
		$4$2.set(this,value);
	}
	get crop() {
		if (!$4$2.has(this)) { $4$2.set(this,{
			left: 0,
			top: 0,
			width: 0,
			height: 0
		}); }		return $4$2.get(this);
	}
	
	drawImage(src){
		var self = this;
		
		this.uploaded_image.src = src;
		return setTimeout(function() {
			
			self.stage = 1;
			return imba.commit();
		},1);
	}
	
	back(){
		
		if (this.stage) {
			
			return this.stage--;
		}	}
	
	// # Returns size optimized for 800x600 frame
	// # The frame may has another dimensions
	// TODO! optimaze for different devices
	getSize(width,height){
		
		let MAX_WIDTH = 800;
		let MAX_HEIGHT = 600;
		
		if (width > height) {
			
			height *= MAX_WIDTH / width;
			width = MAX_WIDTH;
		} else {
			
			width *= MAX_HEIGHT / height;
			height = MAX_HEIGHT;
		}		
		return [width,height];
	}
} ImageState.init$();

var $1$5 = new WeakMap();






class AppRootComponent extends imba.tags.get('component','ImbaElement') {
	static init$(){
		
		return this;
	}
	init$(){
		super.init$();return undefined;
	}
	
	set imgstate(value) {
		$1$5.set(this,value);
	}
	get imgstate() {
		if (!$1$5.has(this)) { $1$5.set(this,new ImageState); }		return $1$5.get(this);
	}
	
	render(){
		var self = this, $e$0$1, $t$0, $c$0, $b$0, $d$0, $t$1, $b$1, $d$1, $t$gS, $b$2, $d$2, $v$2;
		
		$t$0=this;
		$t$0.open$();
		$c$0 = ($b$0=$d$0=1,$t$0.$) || ($b$0=$d$0=0,$t$0.$={});
		$t$1 = ($b$1=$d$1=1,$c$0.f) || ($b$1=$d$1=0,$c$0.f=$t$1=imba.createComponent(Add,$t$0,'gw1m0vc',"Back"));
		$t$gS = $t$1.slot$('__',$c$0);
		$b$1 || ($t$1.on$(`click`,{$_: [function(e,$) {
			return self.imgstate.back();
		}]},this));
		$b$1 || !$t$1.setup || $t$1.setup($d$1);
		$t$1.end$($d$1);
		$b$1 || $t$1.insertInto$($t$0);
		$t$1 = ($b$1=$d$1=1,$c$0.h) || ($b$1=$d$1=0,$c$0.h=$t$1=imba.createComponent(Logo,$t$0,null,null));
		$b$1 || !$t$1.setup || $t$1.setup($d$1);
		$t$1.end$($d$1);
		$b$1 || $t$1.insertInto$($t$0);
		$e$0$1 = null;if (!(this.imgstate.stage)) {
			
			$e$0$1 = ($b$2=$d$2=1,$c$0.i) || ($b$2=$d$2=0,$c$0.i=$e$0$1=imba.createComponent(ChooseImage,null,null,null));
			$b$2||($e$0$1.up$=$t$0);
			$v$2=$c$0.j || ($c$0.j=$e$0$1.bind$('data',[null,'imgstate']));
			$v$2[0]=this;
			$b$2 || !$e$0$1.setup || $e$0$1.setup($d$2);
			$e$0$1.end$($d$2);
		} else if (this.imgstate.stage == 1) {
			
			$e$0$1 = ($b$2=$d$2=1,$c$0.k) || ($b$2=$d$2=0,$c$0.k=$e$0$1=imba.createComponent(CropImage,null,null,null));
			$b$2||($e$0$1.up$=$t$0);
			$v$2=$c$0.l || ($c$0.l=$e$0$1.bind$('data',[null,'imgstate']));
			$v$2[0]=this;
			$b$2 || !$e$0$1.setup || $e$0$1.setup($d$2);
			$e$0$1.end$($d$2);
		} else {
			
			$e$0$1 = ($b$2=$d$2=1,$c$0.m) || ($b$2=$d$2=0,$c$0.m=$e$0$1=imba.createComponent(CroppedImage,null,null,null));
			$b$2||($e$0$1.up$=$t$0);
			$v$2=$c$0.n || ($c$0.n=$e$0$1.bind$('data',[null,'imgstate']));
			$v$2[0]=this;
			$b$2 || !$e$0$1.setup || $e$0$1.setup($d$2);
			$e$0$1.end$($d$2);
		}
		($c$0.$e$0$1_ = $t$0.insert$($e$0$1,0,$c$0.$e$0$1_));		$t$0.close$($d$0);
		return $t$0;
	}
	
	
} AppRootComponent.init$(); imba.tags.define('app-root',AppRootComponent,{});

imba.inlineStyles(":root,body {--u_radius: 5px;}\n\n* {box-sizing: border-box;\nscrollbar-color: rgba(68, 119, 255, 0.1) rgba(0, 0, 0, 0);\nscrollbar-width: auto;\nmargin: 0rem;\npadding: 0rem;\nscroll-behavior: smooth;\n-webkit-overflow-scrolling: touch;\n-webkit-tap-highlight-color: hsla(0.00,0.00%,100.00%,0%);}\n\n.gw1m0vc:not(#_):not(#_) {margin-top: 12px;\nposition: absolute;\nleft: 8px;}\n\napp-root:not(#_) {display: flex;\nflex-direction: column;\nalign-items: center;\ntext-align: center;\nbackground: hsla(220.00,25.71%,13.73%,100%);\nmin-height: 100vh;\nborder-radius: var(--border-radius-2space,2space);\npadding-bottom: 64px;}\n\n");
/*
:root,body {--u_radius: 5px;}

* {box-sizing: border-box;
scrollbar-color: rgba(68, 119, 255, 0.1) rgba(0, 0, 0, 0);
scrollbar-width: auto;
margin: 0rem;
padding: 0rem;
scroll-behavior: smooth;
-webkit-overflow-scrolling: touch;
-webkit-tap-highlight-color: hsla(0.00,0.00%,100.00%,0%);}

.gw1m0vc:not(#_):not(#_) {margin-top: 12px;
position: absolute;
left: 8px;}

app-root:not(#_) {display: flex;
flex-direction: column;
align-items: center;
text-align: center;
background: hsla(220.00,25.71%,13.73%,100%);
min-height: 100vh;
border-radius: var(--border-radius-2space,2space);
padding-bottom: 64px;}


*/
//# sourceMappingURL=app.imba.js.map
