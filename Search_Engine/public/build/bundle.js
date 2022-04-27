
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const sökningar = writable(0);
    const promise = writable();

    /* src/Spinner.svelte generated by Svelte v3.46.4 */

    const file$3 = "src/Spinner.svelte";

    function create_fragment$3(ctx) {
    	let link;
    	let t0;
    	let div8;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let t4;
    	let div4;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let div7;

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			div8 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			t4 = space();
    			div4 = element("div");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = space();
    			div7 = element("div");
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$3, 1, 0, 35);
    			attr_dev(div0, "class", "svelte-16lmlqk");
    			add_location(div0, file$3, 4, 4, 207);
    			attr_dev(div1, "class", "svelte-16lmlqk");
    			add_location(div1, file$3, 5, 4, 220);
    			attr_dev(div2, "class", "svelte-16lmlqk");
    			add_location(div2, file$3, 6, 4, 233);
    			attr_dev(div3, "class", "svelte-16lmlqk");
    			add_location(div3, file$3, 7, 4, 246);
    			attr_dev(div4, "class", "svelte-16lmlqk");
    			add_location(div4, file$3, 8, 4, 259);
    			attr_dev(div5, "class", "svelte-16lmlqk");
    			add_location(div5, file$3, 9, 4, 272);
    			attr_dev(div6, "class", "svelte-16lmlqk");
    			add_location(div6, file$3, 10, 4, 285);
    			attr_dev(div7, "class", "svelte-16lmlqk");
    			add_location(div7, file$3, 11, 4, 298);
    			attr_dev(div8, "class", "lds-roller svelte-16lmlqk");
    			add_location(div8, file$3, 3, 0, 177);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div8, t1);
    			append_dev(div8, div1);
    			append_dev(div8, t2);
    			append_dev(div8, div2);
    			append_dev(div8, t3);
    			append_dev(div8, div3);
    			append_dev(div8, t4);
    			append_dev(div8, div4);
    			append_dev(div8, t5);
    			append_dev(div8, div5);
    			append_dev(div8, t6);
    			append_dev(div8, div6);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Results.svelte generated by Svelte v3.46.4 */

    const file$2 = "src/Results.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (57:15) 
    function create_if_block_4(ctx) {
    	let div6;
    	let div5;
    	let div4;
    	let span0;
    	let t1;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let div3;
    	let t5;
    	let div16;
    	let div8;
    	let div7;
    	let t6;
    	let div11;
    	let div9;
    	let t7;
    	let div10;
    	let t8;
    	let div15;
    	let div12;
    	let span1;
    	let t10;
    	let div14;
    	let div13;
    	let t12;
    	let form;
    	let input;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			span0 = element("span");
    			span0.textContent = "S";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "KMOTOR";
    			t5 = space();
    			div16 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			t6 = space();
    			div11 = element("div");
    			div9 = element("div");
    			t7 = space();
    			div10 = element("div");
    			t8 = space();
    			div15 = element("div");
    			div12 = element("div");
    			span1 = element("span");
    			span1.textContent = "INVALID SEARCH";
    			t10 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div13.textContent = "TERM";
    			t12 = space();
    			form = element("form");
    			input = element("input");
    			attr_dev(span0, "class", "loggafont svelte-18nkq9y");
    			set_style(span0, "transform", "translate(32.8px, 2px)");
    			add_location(span0, file$2, 60, 12, 2477);
    			attr_dev(div0, "class", "search-scope svelte-18nkq9y");
    			add_location(div0, file$2, 62, 16, 2606);
    			attr_dev(div1, "class", "line-scope svelte-18nkq9y");
    			add_location(div1, file$2, 63, 16, 2656);
    			attr_dev(div2, "class", "search svelte-18nkq9y");
    			add_location(div2, file$2, 61, 16, 2568);
    			attr_dev(div3, "class", "loggafont svelte-18nkq9y");
    			add_location(div3, file$2, 65, 16, 2724);
    			attr_dev(div4, "class", "sökmotorlogga svelte-18nkq9y");
    			add_location(div4, file$2, 59, 12, 2436);
    			attr_dev(div5, "class", "background svelte-18nkq9y");
    			add_location(div5, file$2, 58, 12, 2398);
    			attr_dev(div6, "class", "bakgrundtop svelte-18nkq9y");
    			add_location(div6, file$2, 57, 1, 2359);
    			attr_dev(div7, "class", "triangle svelte-18nkq9y");
    			add_location(div7, file$2, 71, 3, 2870);
    			attr_dev(div8, "class", "outline svelte-18nkq9y");
    			add_location(div8, file$2, 70, 1, 2844);
    			attr_dev(div9, "class", "top-mark svelte-18nkq9y");
    			add_location(div9, file$2, 75, 1, 2949);
    			attr_dev(div10, "class", "bottom-mark svelte-18nkq9y");
    			add_location(div10, file$2, 76, 1, 2980);
    			attr_dev(div11, "class", "exclamation-mark svelte-18nkq9y");
    			add_location(div11, file$2, 74, 3, 2916);
    			attr_dev(span1, "class", "invalid-search svelte-18nkq9y");
    			add_location(span1, file$2, 80, 1, 3059);
    			attr_dev(div12, "class", "svelte-18nkq9y");
    			add_location(div12, file$2, 79, 1, 3051);
    			attr_dev(div13, "class", "invalid-search svelte-18nkq9y");
    			set_style(div13, "transform", "translate(64px, 0px)");
    			add_location(div13, file$2, 83, 1, 3130);
    			attr_dev(div14, "class", "svelte-18nkq9y");
    			add_location(div14, file$2, 82, 1, 3122);
    			attr_dev(div15, "class", "textholder svelte-18nkq9y");
    			add_location(div15, file$2, 78, 1, 3024);
    			attr_dev(div16, "class", "animation svelte-18nkq9y");
    			add_location(div16, file$2, 69, 0, 2818);
    			attr_dev(input, "class", "återställ svelte-18nkq9y");
    			attr_dev(input, "type", "submit");
    			input.value = "Try again";
    			add_location(input, file$2, 88, 0, 3242);
    			attr_dev(form, "class", "svelte-18nkq9y");
    			add_location(form, file$2, 87, 0, 3234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, span0);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div8);
    			append_dev(div8, div7);
    			append_dev(div16, t6);
    			append_dev(div16, div11);
    			append_dev(div11, div9);
    			append_dev(div11, t7);
    			append_dev(div11, div10);
    			append_dev(div16, t8);
    			append_dev(div16, div15);
    			append_dev(div15, div12);
    			append_dev(div12, span1);
    			append_dev(div15, t10);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div16);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(57:15) ",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if json && "data" in json && "items" in json.data && json.data.items.length > 0}
    function create_if_block(ctx) {
    	let div6;
    	let div5;
    	let div4;
    	let span;
    	let t1;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let div3;
    	let t5;
    	let div7;
    	let each_value = /*json*/ ctx[0].data.items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			span = element("span");
    			span.textContent = "S";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "KMOTOR";
    			t5 = space();
    			div7 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "loggafont svelte-18nkq9y");
    			set_style(span, "transform", "translate(32.8px, 2px)");
    			add_location(span, file$2, 26, 12, 998);
    			attr_dev(div0, "class", "search-scope svelte-18nkq9y");
    			add_location(div0, file$2, 28, 16, 1127);
    			attr_dev(div1, "class", "line-scope svelte-18nkq9y");
    			add_location(div1, file$2, 29, 16, 1177);
    			attr_dev(div2, "class", "search svelte-18nkq9y");
    			add_location(div2, file$2, 27, 16, 1089);
    			attr_dev(div3, "class", "loggafont svelte-18nkq9y");
    			add_location(div3, file$2, 31, 16, 1245);
    			attr_dev(div4, "class", "sökmotorlogga svelte-18nkq9y");
    			add_location(div4, file$2, 25, 12, 957);
    			attr_dev(div5, "class", "background svelte-18nkq9y");
    			add_location(div5, file$2, 24, 12, 919);
    			attr_dev(div6, "class", "bakgrundtop svelte-18nkq9y");
    			add_location(div6, file$2, 23, 4, 880);
    			attr_dev(div7, "id", "item-holder");
    			attr_dev(div7, "class", "svelte-18nkq9y");
    			add_location(div7, file$2, 35, 0, 1339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, span);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div7, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div7, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*datum, json, visamer, mycket, undefined, visaBeskrivning, visaBeskrivninginnan*/ 31) {
    				each_value = /*json*/ ctx[0].data.items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div7, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:0) {#if json && \\\"data\\\" in json && \\\"items\\\" in json.data && json.data.items.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (38:8) {#if item.type == "dataverse"}
    function create_if_block_1(ctx) {
    	let div1;
    	let p;
    	let a0;
    	let t0_value = /*item*/ ctx[5].url + "";
    	let t0;
    	let a0_href_value;
    	let t1;
    	let div0;
    	let a1;
    	let t2_value = /*item*/ ctx[5].name + "";
    	let t2;
    	let a1_href_value;
    	let t3;
    	let t4;
    	let t5;

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[5].descripion = undefined) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*mycket*/ ctx[4].Text && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p = element("p");
    			a0 = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			a1 = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			attr_dev(a0, "href", a0_href_value = /*item*/ ctx[5].url);
    			attr_dev(a0, "class", "svelte-18nkq9y");
    			add_location(a0, file$2, 39, 20, 1496);
    			attr_dev(p, "class", "svelte-18nkq9y");
    			add_location(p, file$2, 39, 16, 1492);
    			attr_dev(a1, "href", a1_href_value = /*item*/ ctx[5].url);
    			attr_dev(a1, "class", "svelte-18nkq9y");
    			add_location(a1, file$2, 40, 39, 1573);
    			attr_dev(div0, "class", "itemname svelte-18nkq9y");
    			add_location(div0, file$2, 40, 16, 1550);
    			attr_dev(div1, "id", "item");
    			attr_dev(div1, "class", "svelte-18nkq9y");
    			add_location(div1, file$2, 38, 8, 1457);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(p, a0);
    			append_dev(a0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, a1);
    			append_dev(a1, t2);
    			append_dev(div1, t3);
    			if_block0.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*json*/ 1 && t0_value !== (t0_value = /*item*/ ctx[5].url + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*json*/ 1 && a0_href_value !== (a0_href_value = /*item*/ ctx[5].url)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*json*/ 1 && t2_value !== (t2_value = /*item*/ ctx[5].name + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*json*/ 1 && a1_href_value !== (a1_href_value = /*item*/ ctx[5].url)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t4);
    				}
    			}

    			if (/*mycket*/ ctx[4].Text) if_block1.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(38:8) {#if item.type == \\\"dataverse\\\"}",
    		ctx
    	});

    	return block;
    }

    // (44:16) {:else}
    function create_else_block(ctx) {
    	let h40;
    	let t0_value = /*item*/ ctx[5].description + "";
    	let t0;
    	let t1;
    	let h41;
    	let t2_value = /*item*/ ctx[5].description + "";
    	let t2;

    	const block = {
    		c: function create() {
    			h40 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			h41 = element("h4");
    			t2 = text(t2_value);
    			attr_dev(h40, "id", "beskrivninginnan");
    			set_style(h40, "display", /*visaBeskrivninginnan*/ ctx[1] ? 'block' : 'none');
    			attr_dev(h40, "class", "svelte-18nkq9y");
    			add_location(h40, file$2, 44, 16, 1761);
    			attr_dev(h41, "id", "beskrivning");
    			set_style(h41, "display", /*visaBeskrivning*/ ctx[2] ? 'block' : 'none');
    			attr_dev(h41, "class", "svelte-18nkq9y");
    			add_location(h41, file$2, 45, 16, 1887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h40, anchor);
    			append_dev(h40, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h41, anchor);
    			append_dev(h41, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*json*/ 1 && t0_value !== (t0_value = /*item*/ ctx[5].description + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*visaBeskrivninginnan*/ 2) {
    				set_style(h40, "display", /*visaBeskrivninginnan*/ ctx[1] ? 'block' : 'none');
    			}

    			if (dirty & /*json*/ 1 && t2_value !== (t2_value = /*item*/ ctx[5].description + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*visaBeskrivning*/ 4) {
    				set_style(h41, "display", /*visaBeskrivning*/ ctx[2] ? 'block' : 'none');
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h41);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(44:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:20) {#if item.descripion = undefined}
    function create_if_block_3(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "No desciption found.";
    			attr_dev(h4, "class", "svelte-18nkq9y");
    			add_location(h4, file$2, 42, 20, 1689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(42:20) {#if item.descripion = undefined}",
    		ctx
    	});

    	return block;
    }

    // (48:16) {#if mycket.Text}
    function create_if_block_2(ctx) {
    	let form;
    	let input;
    	let h4;
    	let t_value = datum(/*item*/ ctx[5].published_at) + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			h4 = element("h4");
    			t = text(t_value);
    			attr_dev(input, "type", "button");
    			attr_dev(input, "class", "visamerstyling svelte-18nkq9y");
    			input.value = "▼ Visa all text";
    			add_location(input, file$2, 49, 20, 2090);
    			attr_dev(h4, "id", "datum");
    			attr_dev(h4, "class", "svelte-18nkq9y");
    			add_location(h4, file$2, 49, 107, 2177);
    			attr_dev(form, "class", "svelte-18nkq9y");
    			add_location(form, file$2, 48, 16, 2062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			append_dev(form, h4);
    			append_dev(h4, t);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*visamer*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*json*/ 1 && t_value !== (t_value = datum(/*item*/ ctx[5].published_at) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(48:16) {#if mycket.Text}",
    		ctx
    	});

    	return block;
    }

    // (37:8) {#each json.data.items as item}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*item*/ ctx[5].type == "dataverse" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[5].type == "dataverse") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(37:8) {#each json.data.items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*json*/ ctx[0] && "data" in /*json*/ ctx[0] && "items" in /*json*/ ctx[0].data && /*json*/ ctx[0].data.items.length > 0) return create_if_block;
    		if (/*json*/ ctx[0]) return create_if_block_4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			link1 = element("link");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&family=Poppins:wght@300&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "class", "svelte-18nkq9y");
    			add_location(link0, file$2, 0, 0, 0);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@1&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "class", "svelte-18nkq9y");
    			add_location(link1, file$2, 1, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, link1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(link1);
    			if (detaching) detach_dev(t1);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function datum(datum) {
    	let split = datum.split("T");
    	let output = "";

    	split.forEach((element, index) => {
    		if (index == 0) {
    			output = element;
    		}
    	});

    	return output;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Results', slots, []);
    	let { json } = $$props;
    	let visaBeskrivninginnan = true;
    	let visaBeskrivning = false;

    	function visamer() {
    		$$invalidate(1, visaBeskrivninginnan = false);
    		$$invalidate(2, visaBeskrivning = true);
    	}

    	let mycket = { Text: true };
    	const writable_props = ['json'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Results> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('json' in $$props) $$invalidate(0, json = $$props.json);
    	};

    	$$self.$capture_state = () => ({
    		json,
    		visaBeskrivninginnan,
    		visaBeskrivning,
    		visamer,
    		mycket,
    		datum
    	});

    	$$self.$inject_state = $$props => {
    		if ('json' in $$props) $$invalidate(0, json = $$props.json);
    		if ('visaBeskrivninginnan' in $$props) $$invalidate(1, visaBeskrivninginnan = $$props.visaBeskrivninginnan);
    		if ('visaBeskrivning' in $$props) $$invalidate(2, visaBeskrivning = $$props.visaBeskrivning);
    		if ('mycket' in $$props) $$invalidate(4, mycket = $$props.mycket);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [json, visaBeskrivninginnan, visaBeskrivning, visamer, mycket];
    }

    class Results extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { json: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Results",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*json*/ ctx[0] === undefined && !('json' in props)) {
    			console.warn("<Results> was created without expected prop 'json'");
    		}
    	}

    	get json() {
    		throw new Error("<Results>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set json(value) {
    		throw new Error("<Results>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Search.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1 } = globals;
    const file$1 = "src/Search.svelte";

    function create_fragment$1(ctx) {
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let div48;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let div2;
    	let t4;
    	let div7;
    	let span;
    	let t6;
    	let div5;
    	let div3;
    	let t7;
    	let div4;
    	let t8;
    	let div6;
    	let t10;
    	let div15;
    	let div14;
    	let div13;
    	let div12;
    	let div8;
    	let t11;
    	let div9;
    	let t12;
    	let div10;
    	let t13;
    	let div11;
    	let t14;
    	let div23;
    	let div22;
    	let div21;
    	let div20;
    	let div16;
    	let t15;
    	let div17;
    	let t16;
    	let div18;
    	let t17;
    	let div19;
    	let t18;
    	let div31;
    	let div30;
    	let div29;
    	let div28;
    	let div24;
    	let t19;
    	let div25;
    	let t20;
    	let div26;
    	let t21;
    	let div27;
    	let t22;
    	let div39;
    	let div38;
    	let div37;
    	let div36;
    	let div32;
    	let t23;
    	let div33;
    	let t24;
    	let div34;
    	let t25;
    	let div35;
    	let t26;
    	let div47;
    	let div46;
    	let div45;
    	let div44;
    	let div40;
    	let t27;
    	let div41;
    	let t28;
    	let div42;
    	let t29;
    	let div43;
    	let t30;
    	let form0;
    	let input0;
    	let t31;
    	let form1;
    	let input1;
    	let t32;
    	let div52;
    	let div51;
    	let div49;
    	let t33;
    	let div50;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			link1 = element("link");
    			t1 = space();
    			div48 = element("div");
    			div0 = element("div");
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div2 = element("div");
    			t4 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "S";
    			t6 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t7 = space();
    			div4 = element("div");
    			t8 = space();
    			div6 = element("div");
    			div6.textContent = "KMOTOR";
    			t10 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			div8 = element("div");
    			t11 = space();
    			div9 = element("div");
    			t12 = space();
    			div10 = element("div");
    			t13 = space();
    			div11 = element("div");
    			t14 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div20 = element("div");
    			div16 = element("div");
    			t15 = space();
    			div17 = element("div");
    			t16 = space();
    			div18 = element("div");
    			t17 = space();
    			div19 = element("div");
    			t18 = space();
    			div31 = element("div");
    			div30 = element("div");
    			div29 = element("div");
    			div28 = element("div");
    			div24 = element("div");
    			t19 = space();
    			div25 = element("div");
    			t20 = space();
    			div26 = element("div");
    			t21 = space();
    			div27 = element("div");
    			t22 = space();
    			div39 = element("div");
    			div38 = element("div");
    			div37 = element("div");
    			div36 = element("div");
    			div32 = element("div");
    			t23 = space();
    			div33 = element("div");
    			t24 = space();
    			div34 = element("div");
    			t25 = space();
    			div35 = element("div");
    			t26 = space();
    			div47 = element("div");
    			div46 = element("div");
    			div45 = element("div");
    			div44 = element("div");
    			div40 = element("div");
    			t27 = space();
    			div41 = element("div");
    			t28 = space();
    			div42 = element("div");
    			t29 = space();
    			div43 = element("div");
    			t30 = space();
    			form0 = element("form");
    			input0 = element("input");
    			t31 = space();
    			form1 = element("form");
    			input1 = element("input");
    			t32 = space();
    			div52 = element("div");
    			div51 = element("div");
    			div49 = element("div");
    			t33 = space();
    			div50 = element("div");
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&family=Poppins:wght@300&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "class", "svelte-41bzi8");
    			add_location(link0, file$1, 0, 0, 0);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@1&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "class", "svelte-41bzi8");
    			add_location(link1, file$1, 1, 0, 164);
    			attr_dev(div0, "class", "background-ute svelte-41bzi8");
    			add_location(div0, file$1, 21, 1, 898);
    			attr_dev(div1, "class", "background-inne svelte-41bzi8");
    			add_location(div1, file$1, 23, 1, 938);
    			attr_dev(div2, "class", "background-sokmotor svelte-41bzi8");
    			add_location(div2, file$1, 24, 2, 977);
    			attr_dev(span, "class", "loggafont svelte-41bzi8");
    			add_location(span, file$1, 27, 2, 1055);
    			attr_dev(div3, "class", "search-scope2 svelte-41bzi8");
    			add_location(div3, file$1, 29, 2, 1153);
    			attr_dev(div4, "class", "top-mark2 svelte-41bzi8");
    			add_location(div4, file$1, 30, 2, 1190);
    			attr_dev(div5, "class", "search svelte-41bzi8");
    			set_style(div5, "transform", "translate(0px, 5px)");
    			add_location(div5, file$1, 28, 2, 1091);
    			attr_dev(div6, "class", "loggafont svelte-41bzi8");
    			add_location(div6, file$1, 32, 2, 1235);
    			attr_dev(div7, "class", "sökmotorlogga svelte-41bzi8");
    			add_location(div7, file$1, 26, 2, 1024);
    			attr_dev(div8, "class", "emoji-eyes svelte-41bzi8");
    			add_location(div8, file$1, 39, 2, 1587);
    			attr_dev(div9, "class", "emoji-eyes2 svelte-41bzi8");
    			add_location(div9, file$1, 40, 3, 1622);
    			attr_dev(div10, "class", "emoji-mouth svelte-41bzi8");
    			add_location(div10, file$1, 41, 3, 1658);
    			attr_dev(div11, "class", "top-mark svelte-41bzi8");
    			set_style(div11, "animation-delay", "11.4s");
    			add_location(div11, file$1, 42, 6, 1697);
    			attr_dev(div12, "class", "search-scope svelte-41bzi8");
    			add_location(div12, file$1, 38, 5, 1557);
    			attr_dev(div13, "class", "rotate svelte-41bzi8");
    			set_style(div13, "animation-delay", "11.4s");
    			add_location(div13, file$1, 37, 4, 1499);
    			attr_dev(div14, "class", "transformera svelte-41bzi8");
    			set_style(div14, "animation-delay", "11.4s");
    			add_location(div14, file$1, 36, 3, 1437);
    			attr_dev(div15, "class", "osynligstart svelte-41bzi8");
    			set_style(div15, "animation-iteration-count", "1");
    			add_location(div15, file$1, 34, 2, 1284);
    			attr_dev(div16, "class", "emoji-eyes svelte-41bzi8");
    			add_location(div16, file$1, 51, 2, 2038);
    			attr_dev(div17, "class", "emoji-eyes2 svelte-41bzi8");
    			add_location(div17, file$1, 52, 3, 2073);
    			attr_dev(div18, "class", "emoji-mouth svelte-41bzi8");
    			add_location(div18, file$1, 53, 3, 2109);
    			attr_dev(div19, "class", "top-mark svelte-41bzi8");
    			set_style(div19, "animation-delay", "23.4s");
    			add_location(div19, file$1, 54, 6, 2148);
    			attr_dev(div20, "class", "search-scope svelte-41bzi8");
    			add_location(div20, file$1, 50, 5, 2008);
    			attr_dev(div21, "class", "rotate svelte-41bzi8");
    			set_style(div21, "animation-delay", "23.4s");
    			add_location(div21, file$1, 49, 4, 1950);
    			attr_dev(div22, "class", "transformera svelte-41bzi8");
    			set_style(div22, "animation-delay", "23.4s");
    			add_location(div22, file$1, 48, 3, 1888);
    			attr_dev(div23, "class", "osynligstart svelte-41bzi8");
    			set_style(div23, "animation-iteration-count", "2.052631578947368");
    			add_location(div23, file$1, 47, 2, 1803);
    			attr_dev(div24, "class", "emoji-eyes svelte-41bzi8");
    			add_location(div24, file$1, 63, 2, 2489);
    			attr_dev(div25, "class", "emoji-eyes2 svelte-41bzi8");
    			add_location(div25, file$1, 64, 3, 2524);
    			attr_dev(div26, "class", "emoji-mouth svelte-41bzi8");
    			add_location(div26, file$1, 65, 3, 2560);
    			attr_dev(div27, "class", "top-mark svelte-41bzi8");
    			set_style(div27, "animation-delay", "35.4s");
    			add_location(div27, file$1, 66, 6, 2599);
    			attr_dev(div28, "class", "search-scope svelte-41bzi8");
    			add_location(div28, file$1, 62, 5, 2459);
    			attr_dev(div29, "class", "rotate svelte-41bzi8");
    			set_style(div29, "animation-delay", "35.4s");
    			add_location(div29, file$1, 61, 4, 2401);
    			attr_dev(div30, "class", "transformera svelte-41bzi8");
    			set_style(div30, "animation-delay", "35.4s");
    			add_location(div30, file$1, 60, 3, 2339);
    			attr_dev(div31, "class", "osynligstart svelte-41bzi8");
    			set_style(div31, "animation-iteration-count", "3.105263157894737");
    			add_location(div31, file$1, 59, 2, 2254);
    			attr_dev(div32, "class", "emoji-eyes svelte-41bzi8");
    			add_location(div32, file$1, 75, 2, 2939);
    			attr_dev(div33, "class", "emoji-eyes2 svelte-41bzi8");
    			add_location(div33, file$1, 76, 3, 2974);
    			attr_dev(div34, "class", "emoji-mouth svelte-41bzi8");
    			add_location(div34, file$1, 77, 3, 3010);
    			attr_dev(div35, "class", "top-mark svelte-41bzi8");
    			set_style(div35, "animation-delay", "47.4s");
    			add_location(div35, file$1, 78, 6, 3049);
    			attr_dev(div36, "class", "search-scope svelte-41bzi8");
    			add_location(div36, file$1, 74, 5, 2909);
    			attr_dev(div37, "class", "rotate svelte-41bzi8");
    			set_style(div37, "animation-delay", "47.4s");
    			add_location(div37, file$1, 73, 4, 2851);
    			attr_dev(div38, "class", "transformera svelte-41bzi8");
    			set_style(div38, "animation-delay", "47.4s");
    			add_location(div38, file$1, 72, 3, 2789);
    			attr_dev(div39, "class", "osynligstart svelte-41bzi8");
    			set_style(div39, "animation-iteration-count", "4.157894736842104");
    			add_location(div39, file$1, 71, 2, 2705);
    			attr_dev(div40, "class", "emoji-eyes svelte-41bzi8");
    			add_location(div40, file$1, 87, 2, 3389);
    			attr_dev(div41, "class", "emoji-eyes2 svelte-41bzi8");
    			add_location(div41, file$1, 88, 3, 3424);
    			attr_dev(div42, "class", "emoji-mouth svelte-41bzi8");
    			add_location(div42, file$1, 89, 3, 3460);
    			attr_dev(div43, "class", "top-mark svelte-41bzi8");
    			set_style(div43, "animation-delay", "59.4s");
    			add_location(div43, file$1, 90, 6, 3499);
    			attr_dev(div44, "class", "search-scope svelte-41bzi8");
    			add_location(div44, file$1, 86, 5, 3359);
    			attr_dev(div45, "class", "rotate svelte-41bzi8");
    			set_style(div45, "animation-delay", "59.4s");
    			add_location(div45, file$1, 85, 4, 3302);
    			attr_dev(div46, "class", "transformera svelte-41bzi8");
    			set_style(div46, "animation-delay", "59.4s");
    			add_location(div46, file$1, 84, 3, 3240);
    			attr_dev(div47, "class", "osynligstart svelte-41bzi8");
    			set_style(div47, "animation-iteration-count", "5.210526315789472");
    			add_location(div47, file$1, 83, 2, 3155);
    			attr_dev(div48, "class", "background-utemal svelte-41bzi8");
    			set_style(div48, "display", /*innansökning*/ ctx[1] ? 'absolute' : 'none');
    			add_location(div48, file$1, 20, 0, 810);
    			attr_dev(input0, "class", "ejsökt svelte-41bzi8");
    			attr_dev(input0, "placeholder", "Sök...");
    			set_style(input0, "display", /*innansökning*/ ctx[1] ? 'block' : 'none');
    			add_location(input0, file$1, 101, 12, 3754);
    			attr_dev(form0, "class", "svelte-41bzi8");
    			add_location(form0, file$1, 96, 8, 3623);
    			attr_dev(input1, "class", "sökt svelte-41bzi8");
    			attr_dev(input1, "placeholder", "Sök...");
    			set_style(input1, "display", /*innansökning*/ ctx[1] ? 'none' : 'block');
    			add_location(input1, file$1, 108, 2, 3975);
    			attr_dev(form1, "class", "svelte-41bzi8");
    			add_location(form1, file$1, 103, 2, 3891);
    			attr_dev(div49, "class", "top-i svelte-41bzi8");
    			add_location(div49, file$1, 112, 12, 4245);
    			attr_dev(div50, "class", "bottom-i svelte-41bzi8");
    			add_location(div50, file$1, 113, 16, 4288);
    			attr_dev(div51, "class", "information-mark svelte-41bzi8");
    			add_location(div51, file$1, 111, 12, 4201);
    			attr_dev(div52, "class", "information-box svelte-41bzi8");
    			set_style(div52, "display", /*innansökning*/ ctx[1] ? 'absolute' : 'none');
    			add_location(div52, file$1, 110, 2, 4104);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, link1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div48, anchor);
    			append_dev(div48, div0);
    			append_dev(div48, t2);
    			append_dev(div48, div1);
    			append_dev(div48, t3);
    			append_dev(div48, div2);
    			append_dev(div48, t4);
    			append_dev(div48, div7);
    			append_dev(div7, span);
    			append_dev(div7, t6);
    			append_dev(div7, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div48, t10);
    			append_dev(div48, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div8);
    			append_dev(div12, t11);
    			append_dev(div12, div9);
    			append_dev(div12, t12);
    			append_dev(div12, div10);
    			append_dev(div12, t13);
    			append_dev(div12, div11);
    			append_dev(div48, t14);
    			append_dev(div48, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div16);
    			append_dev(div20, t15);
    			append_dev(div20, div17);
    			append_dev(div20, t16);
    			append_dev(div20, div18);
    			append_dev(div20, t17);
    			append_dev(div20, div19);
    			append_dev(div48, t18);
    			append_dev(div48, div31);
    			append_dev(div31, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div24);
    			append_dev(div28, t19);
    			append_dev(div28, div25);
    			append_dev(div28, t20);
    			append_dev(div28, div26);
    			append_dev(div28, t21);
    			append_dev(div28, div27);
    			append_dev(div48, t22);
    			append_dev(div48, div39);
    			append_dev(div39, div38);
    			append_dev(div38, div37);
    			append_dev(div37, div36);
    			append_dev(div36, div32);
    			append_dev(div36, t23);
    			append_dev(div36, div33);
    			append_dev(div36, t24);
    			append_dev(div36, div34);
    			append_dev(div36, t25);
    			append_dev(div36, div35);
    			append_dev(div48, t26);
    			append_dev(div48, div47);
    			append_dev(div47, div46);
    			append_dev(div46, div45);
    			append_dev(div45, div44);
    			append_dev(div44, div40);
    			append_dev(div44, t27);
    			append_dev(div44, div41);
    			append_dev(div44, t28);
    			append_dev(div44, div42);
    			append_dev(div44, t29);
    			append_dev(div44, div43);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, form0, anchor);
    			append_dev(form0, input0);
    			set_input_value(input0, /*question*/ ctx[0]);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, form1, anchor);
    			append_dev(form1, input1);
    			set_input_value(input1, /*question*/ ctx[0]);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, div52, anchor);
    			append_dev(div52, div51);
    			append_dev(div51, div49);
    			append_dev(div51, t33);
    			append_dev(div51, div50);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(form0, "submit", prevent_default(/*submit_handler*/ ctx[5]), false, true, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(form1, "submit", prevent_default(/*submit_handler_1*/ ctx[7]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*innansökning*/ 2) {
    				set_style(div48, "display", /*innansökning*/ ctx[1] ? 'absolute' : 'none');
    			}

    			if (dirty & /*innansökning*/ 2) {
    				set_style(input0, "display", /*innansökning*/ ctx[1] ? 'block' : 'none');
    			}

    			if (dirty & /*question*/ 1 && input0.value !== /*question*/ ctx[0]) {
    				set_input_value(input0, /*question*/ ctx[0]);
    			}

    			if (dirty & /*innansökning*/ 2) {
    				set_style(input1, "display", /*innansökning*/ ctx[1] ? 'none' : 'block');
    			}

    			if (dirty & /*question*/ 1 && input1.value !== /*question*/ ctx[0]) {
    				set_input_value(input1, /*question*/ ctx[0]);
    			}

    			if (dirty & /*innansökning*/ 2) {
    				set_style(div52, "display", /*innansökning*/ ctx[1] ? 'absolute' : 'none');
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(link1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div48);
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(form0);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(form1);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(div52);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $promise;
    	validate_store(promise, 'promise');
    	component_subscribe($$self, promise, $$value => $$invalidate(2, $promise = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let question;
    	let innansökning = true;

    	async function search() {
    		const res = await fetch('https://demo.dataverse.org/api/search?q=' + question + "&per_page=50");
    		const json = await res.json();

    		if (res.ok) {
    			return (sökningar.update(n => n + 1), $$invalidate(1, innansökning = false), json);
    		} else {
    			throw new Error(json);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		question = this.value;
    		$$invalidate(0, question);
    	}

    	const submit_handler = () => {
    		set_store_value(promise, $promise = search(), $promise);
    	};

    	function input1_input_handler() {
    		question = this.value;
    		$$invalidate(0, question);
    	}

    	const submit_handler_1 = () => {
    		set_store_value(promise, $promise = search(), $promise);
    	};

    	$$self.$capture_state = () => ({
    		promise,
    		sökningar,
    		question,
    		innansökning,
    		search,
    		$promise
    	});

    	$$self.$inject_state = $$props => {
    		if ('question' in $$props) $$invalidate(0, question = $$props.question);
    		if ('innansökning' in $$props) $$invalidate(1, innansökning = $$props.innansökning);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		question,
    		innansökning,
    		$promise,
    		search,
    		input0_input_handler,
    		submit_handler,
    		input1_input_handler,
    		submit_handler_1
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (22:4) {:catch error}
    function create_catch_block(ctx) {
    	let div907;
    	let div1;
    	let div0;
    	let t0;
    	let div905;
    	let div22;
    	let div2;
    	let div3;
    	let div4;
    	let div5;
    	let div6;
    	let div7;
    	let div8;
    	let div9;
    	let div10;
    	let div11;
    	let div12;
    	let div13;
    	let div14;
    	let div15;
    	let div16;
    	let div17;
    	let div18;
    	let div19;
    	let div20;
    	let div21;
    	let t1;
    	let div43;
    	let div23;
    	let div24;
    	let div25;
    	let div26;
    	let div27;
    	let div28;
    	let div29;
    	let div30;
    	let div31;
    	let div32;
    	let div33;
    	let div34;
    	let div35;
    	let div36;
    	let div37;
    	let div38;
    	let div39;
    	let div40;
    	let div41;
    	let div42;
    	let t2;
    	let div64;
    	let div44;
    	let div45;
    	let div46;
    	let div47;
    	let div48;
    	let div49;
    	let div50;
    	let div51;
    	let div52;
    	let div53;
    	let div54;
    	let div55;
    	let div56;
    	let div57;
    	let div58;
    	let div59;
    	let div60;
    	let div61;
    	let div62;
    	let div63;
    	let t3;
    	let div85;
    	let div65;
    	let div66;
    	let div67;
    	let div68;
    	let div69;
    	let div70;
    	let div71;
    	let div72;
    	let div73;
    	let div74;
    	let div75;
    	let div76;
    	let div77;
    	let div78;
    	let div79;
    	let div80;
    	let div81;
    	let div82;
    	let div83;
    	let div84;
    	let t4;
    	let div106;
    	let div86;
    	let div87;
    	let div88;
    	let div89;
    	let div90;
    	let div91;
    	let div92;
    	let div93;
    	let div94;
    	let div95;
    	let div96;
    	let div97;
    	let div98;
    	let div99;
    	let div100;
    	let div101;
    	let div102;
    	let div103;
    	let div104;
    	let div105;
    	let t5;
    	let div127;
    	let div107;
    	let div108;
    	let div109;
    	let div110;
    	let div111;
    	let div112;
    	let div113;
    	let div114;
    	let div115;
    	let div116;
    	let div117;
    	let div118;
    	let div119;
    	let div120;
    	let div121;
    	let div122;
    	let div123;
    	let div124;
    	let div125;
    	let div126;
    	let t6;
    	let div148;
    	let div128;
    	let div129;
    	let div130;
    	let div131;
    	let div132;
    	let div133;
    	let div134;
    	let div135;
    	let div136;
    	let div137;
    	let div138;
    	let div139;
    	let div140;
    	let div141;
    	let div142;
    	let div143;
    	let div144;
    	let div145;
    	let div146;
    	let div147;
    	let t7;
    	let div169;
    	let div149;
    	let div150;
    	let div151;
    	let div152;
    	let div153;
    	let div154;
    	let div155;
    	let div156;
    	let div157;
    	let div158;
    	let div159;
    	let div160;
    	let div161;
    	let div162;
    	let div163;
    	let div164;
    	let div165;
    	let div166;
    	let div167;
    	let div168;
    	let t8;
    	let div190;
    	let div170;
    	let div171;
    	let div172;
    	let div173;
    	let div174;
    	let div175;
    	let div176;
    	let div177;
    	let div178;
    	let div179;
    	let div180;
    	let div181;
    	let div182;
    	let div183;
    	let div184;
    	let div185;
    	let div186;
    	let div187;
    	let div188;
    	let div189;
    	let t9;
    	let div211;
    	let div191;
    	let div192;
    	let div193;
    	let div194;
    	let div195;
    	let div196;
    	let div197;
    	let div198;
    	let div199;
    	let div200;
    	let div201;
    	let div202;
    	let div203;
    	let div204;
    	let div205;
    	let div206;
    	let div207;
    	let div208;
    	let div209;
    	let div210;
    	let t10;
    	let div232;
    	let div212;
    	let div213;
    	let div214;
    	let div215;
    	let div216;
    	let div217;
    	let div218;
    	let div219;
    	let div220;
    	let div221;
    	let div222;
    	let div223;
    	let div224;
    	let div225;
    	let div226;
    	let div227;
    	let div228;
    	let div229;
    	let div230;
    	let div231;
    	let t11;
    	let div253;
    	let div233;
    	let div234;
    	let div235;
    	let div236;
    	let div237;
    	let div238;
    	let div239;
    	let div240;
    	let div241;
    	let div242;
    	let div243;
    	let div244;
    	let div245;
    	let div246;
    	let div247;
    	let div248;
    	let div249;
    	let div250;
    	let div251;
    	let div252;
    	let t12;
    	let div274;
    	let div254;
    	let div255;
    	let div256;
    	let div257;
    	let div258;
    	let div259;
    	let div260;
    	let div261;
    	let div262;
    	let div263;
    	let div264;
    	let div265;
    	let div266;
    	let div267;
    	let div268;
    	let div269;
    	let div270;
    	let div271;
    	let div272;
    	let div273;
    	let t13;
    	let div295;
    	let div275;
    	let div276;
    	let div277;
    	let div278;
    	let div279;
    	let div280;
    	let div281;
    	let div282;
    	let div283;
    	let div284;
    	let div285;
    	let div286;
    	let div287;
    	let div288;
    	let div289;
    	let div290;
    	let div291;
    	let div292;
    	let div293;
    	let div294;
    	let t14;
    	let div316;
    	let div296;
    	let div297;
    	let div298;
    	let div299;
    	let div300;
    	let div301;
    	let div302;
    	let div303;
    	let div304;
    	let div305;
    	let div306;
    	let div307;
    	let div308;
    	let div309;
    	let div310;
    	let div311;
    	let div312;
    	let div313;
    	let div314;
    	let div315;
    	let t15;
    	let div337;
    	let div317;
    	let div318;
    	let div319;
    	let div320;
    	let div321;
    	let div322;
    	let div323;
    	let div324;
    	let div325;
    	let div326;
    	let div327;
    	let div328;
    	let div329;
    	let div330;
    	let div331;
    	let div332;
    	let div333;
    	let div334;
    	let div335;
    	let div336;
    	let t16;
    	let div358;
    	let div338;
    	let div339;
    	let div340;
    	let div341;
    	let div342;
    	let div343;
    	let div344;
    	let div345;
    	let div346;
    	let div347;
    	let div348;
    	let div349;
    	let div350;
    	let div351;
    	let div352;
    	let div353;
    	let div354;
    	let div355;
    	let div356;
    	let div357;
    	let t17;
    	let div379;
    	let div359;
    	let div360;
    	let div361;
    	let div362;
    	let div363;
    	let div364;
    	let div365;
    	let div366;
    	let div367;
    	let div368;
    	let div369;
    	let div370;
    	let div371;
    	let div372;
    	let div373;
    	let div374;
    	let div375;
    	let div376;
    	let div377;
    	let div378;
    	let t18;
    	let div400;
    	let div380;
    	let div381;
    	let div382;
    	let div383;
    	let div384;
    	let div385;
    	let div386;
    	let div387;
    	let div388;
    	let div389;
    	let div390;
    	let div391;
    	let div392;
    	let div393;
    	let div394;
    	let div395;
    	let div396;
    	let div397;
    	let div398;
    	let div399;
    	let t19;
    	let div421;
    	let div401;
    	let div402;
    	let div403;
    	let div404;
    	let div405;
    	let div406;
    	let div407;
    	let div408;
    	let div409;
    	let div410;
    	let div411;
    	let div412;
    	let div413;
    	let div414;
    	let div415;
    	let div416;
    	let div417;
    	let div418;
    	let div419;
    	let div420;
    	let t20;
    	let div442;
    	let div422;
    	let div423;
    	let div424;
    	let div425;
    	let div426;
    	let div427;
    	let div428;
    	let div429;
    	let div430;
    	let div431;
    	let div432;
    	let div433;
    	let div434;
    	let div435;
    	let div436;
    	let div437;
    	let div438;
    	let div439;
    	let div440;
    	let div441;
    	let t21;
    	let div463;
    	let div443;
    	let div444;
    	let div445;
    	let div446;
    	let div447;
    	let div448;
    	let div449;
    	let div450;
    	let div451;
    	let div452;
    	let div453;
    	let div454;
    	let div455;
    	let div456;
    	let div457;
    	let div458;
    	let div459;
    	let div460;
    	let div461;
    	let div462;
    	let t22;
    	let div484;
    	let div464;
    	let div465;
    	let div466;
    	let div467;
    	let div468;
    	let div469;
    	let div470;
    	let div471;
    	let div472;
    	let div473;
    	let div474;
    	let div475;
    	let div476;
    	let div477;
    	let div478;
    	let div479;
    	let div480;
    	let div481;
    	let div482;
    	let div483;
    	let t23;
    	let div505;
    	let div485;
    	let div486;
    	let div487;
    	let div488;
    	let div489;
    	let div490;
    	let div491;
    	let div492;
    	let div493;
    	let div494;
    	let div495;
    	let div496;
    	let div497;
    	let div498;
    	let div499;
    	let div500;
    	let div501;
    	let div502;
    	let div503;
    	let div504;
    	let t24;
    	let div526;
    	let div506;
    	let div507;
    	let div508;
    	let div509;
    	let div510;
    	let div511;
    	let div512;
    	let div513;
    	let div514;
    	let div515;
    	let div516;
    	let div517;
    	let div518;
    	let div519;
    	let div520;
    	let div521;
    	let div522;
    	let div523;
    	let div524;
    	let div525;
    	let t25;
    	let div547;
    	let div527;
    	let div528;
    	let div529;
    	let div530;
    	let div531;
    	let div532;
    	let div533;
    	let div534;
    	let div535;
    	let div536;
    	let div537;
    	let div538;
    	let div539;
    	let div540;
    	let div541;
    	let div542;
    	let div543;
    	let div544;
    	let div545;
    	let div546;
    	let t26;
    	let div568;
    	let div548;
    	let div549;
    	let div550;
    	let div551;
    	let div552;
    	let div553;
    	let div554;
    	let div555;
    	let div556;
    	let div557;
    	let div558;
    	let div559;
    	let div560;
    	let div561;
    	let div562;
    	let div563;
    	let div564;
    	let div565;
    	let div566;
    	let div567;
    	let t27;
    	let div589;
    	let div569;
    	let div570;
    	let div571;
    	let div572;
    	let div573;
    	let div574;
    	let div575;
    	let div576;
    	let div577;
    	let div578;
    	let div579;
    	let div580;
    	let div581;
    	let div582;
    	let div583;
    	let div584;
    	let div585;
    	let div586;
    	let div587;
    	let div588;
    	let t28;
    	let div610;
    	let div590;
    	let div591;
    	let div592;
    	let div593;
    	let div594;
    	let div595;
    	let div596;
    	let div597;
    	let div598;
    	let div599;
    	let div600;
    	let div601;
    	let div602;
    	let div603;
    	let div604;
    	let div605;
    	let div606;
    	let div607;
    	let div608;
    	let div609;
    	let t29;
    	let div631;
    	let div611;
    	let div612;
    	let div613;
    	let div614;
    	let div615;
    	let div616;
    	let div617;
    	let div618;
    	let div619;
    	let div620;
    	let div621;
    	let div622;
    	let div623;
    	let div624;
    	let div625;
    	let div626;
    	let div627;
    	let div628;
    	let div629;
    	let div630;
    	let t30;
    	let div652;
    	let div632;
    	let div633;
    	let div634;
    	let div635;
    	let div636;
    	let div637;
    	let div638;
    	let div639;
    	let div640;
    	let div641;
    	let div642;
    	let div643;
    	let div644;
    	let div645;
    	let div646;
    	let div647;
    	let div648;
    	let div649;
    	let div650;
    	let div651;
    	let t31;
    	let div673;
    	let div653;
    	let div654;
    	let div655;
    	let div656;
    	let div657;
    	let div658;
    	let div659;
    	let div660;
    	let div661;
    	let div662;
    	let div663;
    	let div664;
    	let div665;
    	let div666;
    	let div667;
    	let div668;
    	let div669;
    	let div670;
    	let div671;
    	let div672;
    	let t32;
    	let div694;
    	let div674;
    	let div675;
    	let div676;
    	let div677;
    	let div678;
    	let div679;
    	let div680;
    	let div681;
    	let div682;
    	let div683;
    	let div684;
    	let div685;
    	let div686;
    	let div687;
    	let div688;
    	let div689;
    	let div690;
    	let div691;
    	let div692;
    	let div693;
    	let t33;
    	let div715;
    	let div695;
    	let div696;
    	let div697;
    	let div698;
    	let div699;
    	let div700;
    	let div701;
    	let div702;
    	let div703;
    	let div704;
    	let div705;
    	let div706;
    	let div707;
    	let div708;
    	let div709;
    	let div710;
    	let div711;
    	let div712;
    	let div713;
    	let div714;
    	let t34;
    	let div736;
    	let div716;
    	let div717;
    	let div718;
    	let div719;
    	let div720;
    	let div721;
    	let div722;
    	let div723;
    	let div724;
    	let div725;
    	let div726;
    	let div727;
    	let div728;
    	let div729;
    	let div730;
    	let div731;
    	let div732;
    	let div733;
    	let div734;
    	let div735;
    	let t35;
    	let div757;
    	let div737;
    	let div738;
    	let div739;
    	let div740;
    	let div741;
    	let div742;
    	let div743;
    	let div744;
    	let div745;
    	let div746;
    	let div747;
    	let div748;
    	let div749;
    	let div750;
    	let div751;
    	let div752;
    	let div753;
    	let div754;
    	let div755;
    	let div756;
    	let t36;
    	let div778;
    	let div758;
    	let div759;
    	let div760;
    	let div761;
    	let div762;
    	let div763;
    	let div764;
    	let div765;
    	let div766;
    	let div767;
    	let div768;
    	let div769;
    	let div770;
    	let div771;
    	let div772;
    	let div773;
    	let div774;
    	let div775;
    	let div776;
    	let div777;
    	let t37;
    	let div799;
    	let div779;
    	let div780;
    	let div781;
    	let div782;
    	let div783;
    	let div784;
    	let div785;
    	let div786;
    	let div787;
    	let div788;
    	let div789;
    	let div790;
    	let div791;
    	let div792;
    	let div793;
    	let div794;
    	let div795;
    	let div796;
    	let div797;
    	let div798;
    	let t38;
    	let div820;
    	let div800;
    	let div801;
    	let div802;
    	let div803;
    	let div804;
    	let div805;
    	let div806;
    	let div807;
    	let div808;
    	let div809;
    	let div810;
    	let div811;
    	let div812;
    	let div813;
    	let div814;
    	let div815;
    	let div816;
    	let div817;
    	let div818;
    	let div819;
    	let t39;
    	let div841;
    	let div821;
    	let div822;
    	let div823;
    	let div824;
    	let div825;
    	let div826;
    	let div827;
    	let div828;
    	let div829;
    	let div830;
    	let div831;
    	let div832;
    	let div833;
    	let div834;
    	let div835;
    	let div836;
    	let div837;
    	let div838;
    	let div839;
    	let div840;
    	let t40;
    	let div862;
    	let div842;
    	let div843;
    	let div844;
    	let div845;
    	let div846;
    	let div847;
    	let div848;
    	let div849;
    	let div850;
    	let div851;
    	let div852;
    	let div853;
    	let div854;
    	let div855;
    	let div856;
    	let div857;
    	let div858;
    	let div859;
    	let div860;
    	let div861;
    	let t41;
    	let div883;
    	let div863;
    	let div864;
    	let div865;
    	let div866;
    	let div867;
    	let div868;
    	let div869;
    	let div870;
    	let div871;
    	let div872;
    	let div873;
    	let div874;
    	let div875;
    	let div876;
    	let div877;
    	let div878;
    	let div879;
    	let div880;
    	let div881;
    	let div882;
    	let t42;
    	let div904;
    	let div884;
    	let div885;
    	let div886;
    	let div887;
    	let div888;
    	let div889;
    	let div890;
    	let div891;
    	let div892;
    	let div893;
    	let div894;
    	let div895;
    	let div896;
    	let div897;
    	let div898;
    	let div899;
    	let div900;
    	let div901;
    	let div902;
    	let div903;
    	let t43;
    	let div906;
    	let t44;
    	let form0;
    	let input0;
    	let t45;
    	let div908;
    	let t46;
    	let form1;
    	let input1;

    	const block = {
    		c: function create() {
    			div907 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div905 = element("div");
    			div22 = element("div");
    			div2 = element("div");
    			div3 = element("div");
    			div4 = element("div");
    			div5 = element("div");
    			div6 = element("div");
    			div7 = element("div");
    			div8 = element("div");
    			div9 = element("div");
    			div10 = element("div");
    			div11 = element("div");
    			div12 = element("div");
    			div13 = element("div");
    			div14 = element("div");
    			div15 = element("div");
    			div16 = element("div");
    			div17 = element("div");
    			div18 = element("div");
    			div19 = element("div");
    			div20 = element("div");
    			div21 = element("div");
    			t1 = space();
    			div43 = element("div");
    			div23 = element("div");
    			div24 = element("div");
    			div25 = element("div");
    			div26 = element("div");
    			div27 = element("div");
    			div28 = element("div");
    			div29 = element("div");
    			div30 = element("div");
    			div31 = element("div");
    			div32 = element("div");
    			div33 = element("div");
    			div34 = element("div");
    			div35 = element("div");
    			div36 = element("div");
    			div37 = element("div");
    			div38 = element("div");
    			div39 = element("div");
    			div40 = element("div");
    			div41 = element("div");
    			div42 = element("div");
    			t2 = space();
    			div64 = element("div");
    			div44 = element("div");
    			div45 = element("div");
    			div46 = element("div");
    			div47 = element("div");
    			div48 = element("div");
    			div49 = element("div");
    			div50 = element("div");
    			div51 = element("div");
    			div52 = element("div");
    			div53 = element("div");
    			div54 = element("div");
    			div55 = element("div");
    			div56 = element("div");
    			div57 = element("div");
    			div58 = element("div");
    			div59 = element("div");
    			div60 = element("div");
    			div61 = element("div");
    			div62 = element("div");
    			div63 = element("div");
    			t3 = space();
    			div85 = element("div");
    			div65 = element("div");
    			div66 = element("div");
    			div67 = element("div");
    			div68 = element("div");
    			div69 = element("div");
    			div70 = element("div");
    			div71 = element("div");
    			div72 = element("div");
    			div73 = element("div");
    			div74 = element("div");
    			div75 = element("div");
    			div76 = element("div");
    			div77 = element("div");
    			div78 = element("div");
    			div79 = element("div");
    			div80 = element("div");
    			div81 = element("div");
    			div82 = element("div");
    			div83 = element("div");
    			div84 = element("div");
    			t4 = space();
    			div106 = element("div");
    			div86 = element("div");
    			div87 = element("div");
    			div88 = element("div");
    			div89 = element("div");
    			div90 = element("div");
    			div91 = element("div");
    			div92 = element("div");
    			div93 = element("div");
    			div94 = element("div");
    			div95 = element("div");
    			div96 = element("div");
    			div97 = element("div");
    			div98 = element("div");
    			div99 = element("div");
    			div100 = element("div");
    			div101 = element("div");
    			div102 = element("div");
    			div103 = element("div");
    			div104 = element("div");
    			div105 = element("div");
    			t5 = space();
    			div127 = element("div");
    			div107 = element("div");
    			div108 = element("div");
    			div109 = element("div");
    			div110 = element("div");
    			div111 = element("div");
    			div112 = element("div");
    			div113 = element("div");
    			div114 = element("div");
    			div115 = element("div");
    			div116 = element("div");
    			div117 = element("div");
    			div118 = element("div");
    			div119 = element("div");
    			div120 = element("div");
    			div121 = element("div");
    			div122 = element("div");
    			div123 = element("div");
    			div124 = element("div");
    			div125 = element("div");
    			div126 = element("div");
    			t6 = space();
    			div148 = element("div");
    			div128 = element("div");
    			div129 = element("div");
    			div130 = element("div");
    			div131 = element("div");
    			div132 = element("div");
    			div133 = element("div");
    			div134 = element("div");
    			div135 = element("div");
    			div136 = element("div");
    			div137 = element("div");
    			div138 = element("div");
    			div139 = element("div");
    			div140 = element("div");
    			div141 = element("div");
    			div142 = element("div");
    			div143 = element("div");
    			div144 = element("div");
    			div145 = element("div");
    			div146 = element("div");
    			div147 = element("div");
    			t7 = space();
    			div169 = element("div");
    			div149 = element("div");
    			div150 = element("div");
    			div151 = element("div");
    			div152 = element("div");
    			div153 = element("div");
    			div154 = element("div");
    			div155 = element("div");
    			div156 = element("div");
    			div157 = element("div");
    			div158 = element("div");
    			div159 = element("div");
    			div160 = element("div");
    			div161 = element("div");
    			div162 = element("div");
    			div163 = element("div");
    			div164 = element("div");
    			div165 = element("div");
    			div166 = element("div");
    			div167 = element("div");
    			div168 = element("div");
    			t8 = space();
    			div190 = element("div");
    			div170 = element("div");
    			div171 = element("div");
    			div172 = element("div");
    			div173 = element("div");
    			div174 = element("div");
    			div175 = element("div");
    			div176 = element("div");
    			div177 = element("div");
    			div178 = element("div");
    			div179 = element("div");
    			div180 = element("div");
    			div181 = element("div");
    			div182 = element("div");
    			div183 = element("div");
    			div184 = element("div");
    			div185 = element("div");
    			div186 = element("div");
    			div187 = element("div");
    			div188 = element("div");
    			div189 = element("div");
    			t9 = space();
    			div211 = element("div");
    			div191 = element("div");
    			div192 = element("div");
    			div193 = element("div");
    			div194 = element("div");
    			div195 = element("div");
    			div196 = element("div");
    			div197 = element("div");
    			div198 = element("div");
    			div199 = element("div");
    			div200 = element("div");
    			div201 = element("div");
    			div202 = element("div");
    			div203 = element("div");
    			div204 = element("div");
    			div205 = element("div");
    			div206 = element("div");
    			div207 = element("div");
    			div208 = element("div");
    			div209 = element("div");
    			div210 = element("div");
    			t10 = space();
    			div232 = element("div");
    			div212 = element("div");
    			div213 = element("div");
    			div214 = element("div");
    			div215 = element("div");
    			div216 = element("div");
    			div217 = element("div");
    			div218 = element("div");
    			div219 = element("div");
    			div220 = element("div");
    			div221 = element("div");
    			div222 = element("div");
    			div223 = element("div");
    			div224 = element("div");
    			div225 = element("div");
    			div226 = element("div");
    			div227 = element("div");
    			div228 = element("div");
    			div229 = element("div");
    			div230 = element("div");
    			div231 = element("div");
    			t11 = space();
    			div253 = element("div");
    			div233 = element("div");
    			div234 = element("div");
    			div235 = element("div");
    			div236 = element("div");
    			div237 = element("div");
    			div238 = element("div");
    			div239 = element("div");
    			div240 = element("div");
    			div241 = element("div");
    			div242 = element("div");
    			div243 = element("div");
    			div244 = element("div");
    			div245 = element("div");
    			div246 = element("div");
    			div247 = element("div");
    			div248 = element("div");
    			div249 = element("div");
    			div250 = element("div");
    			div251 = element("div");
    			div252 = element("div");
    			t12 = space();
    			div274 = element("div");
    			div254 = element("div");
    			div255 = element("div");
    			div256 = element("div");
    			div257 = element("div");
    			div258 = element("div");
    			div259 = element("div");
    			div260 = element("div");
    			div261 = element("div");
    			div262 = element("div");
    			div263 = element("div");
    			div264 = element("div");
    			div265 = element("div");
    			div266 = element("div");
    			div267 = element("div");
    			div268 = element("div");
    			div269 = element("div");
    			div270 = element("div");
    			div271 = element("div");
    			div272 = element("div");
    			div273 = element("div");
    			t13 = space();
    			div295 = element("div");
    			div275 = element("div");
    			div276 = element("div");
    			div277 = element("div");
    			div278 = element("div");
    			div279 = element("div");
    			div280 = element("div");
    			div281 = element("div");
    			div282 = element("div");
    			div283 = element("div");
    			div284 = element("div");
    			div285 = element("div");
    			div286 = element("div");
    			div287 = element("div");
    			div288 = element("div");
    			div289 = element("div");
    			div290 = element("div");
    			div291 = element("div");
    			div292 = element("div");
    			div293 = element("div");
    			div294 = element("div");
    			t14 = space();
    			div316 = element("div");
    			div296 = element("div");
    			div297 = element("div");
    			div298 = element("div");
    			div299 = element("div");
    			div300 = element("div");
    			div301 = element("div");
    			div302 = element("div");
    			div303 = element("div");
    			div304 = element("div");
    			div305 = element("div");
    			div306 = element("div");
    			div307 = element("div");
    			div308 = element("div");
    			div309 = element("div");
    			div310 = element("div");
    			div311 = element("div");
    			div312 = element("div");
    			div313 = element("div");
    			div314 = element("div");
    			div315 = element("div");
    			t15 = space();
    			div337 = element("div");
    			div317 = element("div");
    			div318 = element("div");
    			div319 = element("div");
    			div320 = element("div");
    			div321 = element("div");
    			div322 = element("div");
    			div323 = element("div");
    			div324 = element("div");
    			div325 = element("div");
    			div326 = element("div");
    			div327 = element("div");
    			div328 = element("div");
    			div329 = element("div");
    			div330 = element("div");
    			div331 = element("div");
    			div332 = element("div");
    			div333 = element("div");
    			div334 = element("div");
    			div335 = element("div");
    			div336 = element("div");
    			t16 = space();
    			div358 = element("div");
    			div338 = element("div");
    			div339 = element("div");
    			div340 = element("div");
    			div341 = element("div");
    			div342 = element("div");
    			div343 = element("div");
    			div344 = element("div");
    			div345 = element("div");
    			div346 = element("div");
    			div347 = element("div");
    			div348 = element("div");
    			div349 = element("div");
    			div350 = element("div");
    			div351 = element("div");
    			div352 = element("div");
    			div353 = element("div");
    			div354 = element("div");
    			div355 = element("div");
    			div356 = element("div");
    			div357 = element("div");
    			t17 = space();
    			div379 = element("div");
    			div359 = element("div");
    			div360 = element("div");
    			div361 = element("div");
    			div362 = element("div");
    			div363 = element("div");
    			div364 = element("div");
    			div365 = element("div");
    			div366 = element("div");
    			div367 = element("div");
    			div368 = element("div");
    			div369 = element("div");
    			div370 = element("div");
    			div371 = element("div");
    			div372 = element("div");
    			div373 = element("div");
    			div374 = element("div");
    			div375 = element("div");
    			div376 = element("div");
    			div377 = element("div");
    			div378 = element("div");
    			t18 = space();
    			div400 = element("div");
    			div380 = element("div");
    			div381 = element("div");
    			div382 = element("div");
    			div383 = element("div");
    			div384 = element("div");
    			div385 = element("div");
    			div386 = element("div");
    			div387 = element("div");
    			div388 = element("div");
    			div389 = element("div");
    			div390 = element("div");
    			div391 = element("div");
    			div392 = element("div");
    			div393 = element("div");
    			div394 = element("div");
    			div395 = element("div");
    			div396 = element("div");
    			div397 = element("div");
    			div398 = element("div");
    			div399 = element("div");
    			t19 = space();
    			div421 = element("div");
    			div401 = element("div");
    			div402 = element("div");
    			div403 = element("div");
    			div404 = element("div");
    			div405 = element("div");
    			div406 = element("div");
    			div407 = element("div");
    			div408 = element("div");
    			div409 = element("div");
    			div410 = element("div");
    			div411 = element("div");
    			div412 = element("div");
    			div413 = element("div");
    			div414 = element("div");
    			div415 = element("div");
    			div416 = element("div");
    			div417 = element("div");
    			div418 = element("div");
    			div419 = element("div");
    			div420 = element("div");
    			t20 = space();
    			div442 = element("div");
    			div422 = element("div");
    			div423 = element("div");
    			div424 = element("div");
    			div425 = element("div");
    			div426 = element("div");
    			div427 = element("div");
    			div428 = element("div");
    			div429 = element("div");
    			div430 = element("div");
    			div431 = element("div");
    			div432 = element("div");
    			div433 = element("div");
    			div434 = element("div");
    			div435 = element("div");
    			div436 = element("div");
    			div437 = element("div");
    			div438 = element("div");
    			div439 = element("div");
    			div440 = element("div");
    			div441 = element("div");
    			t21 = space();
    			div463 = element("div");
    			div443 = element("div");
    			div444 = element("div");
    			div445 = element("div");
    			div446 = element("div");
    			div447 = element("div");
    			div448 = element("div");
    			div449 = element("div");
    			div450 = element("div");
    			div451 = element("div");
    			div452 = element("div");
    			div453 = element("div");
    			div454 = element("div");
    			div455 = element("div");
    			div456 = element("div");
    			div457 = element("div");
    			div458 = element("div");
    			div459 = element("div");
    			div460 = element("div");
    			div461 = element("div");
    			div462 = element("div");
    			t22 = space();
    			div484 = element("div");
    			div464 = element("div");
    			div465 = element("div");
    			div466 = element("div");
    			div467 = element("div");
    			div468 = element("div");
    			div469 = element("div");
    			div470 = element("div");
    			div471 = element("div");
    			div472 = element("div");
    			div473 = element("div");
    			div474 = element("div");
    			div475 = element("div");
    			div476 = element("div");
    			div477 = element("div");
    			div478 = element("div");
    			div479 = element("div");
    			div480 = element("div");
    			div481 = element("div");
    			div482 = element("div");
    			div483 = element("div");
    			t23 = space();
    			div505 = element("div");
    			div485 = element("div");
    			div486 = element("div");
    			div487 = element("div");
    			div488 = element("div");
    			div489 = element("div");
    			div490 = element("div");
    			div491 = element("div");
    			div492 = element("div");
    			div493 = element("div");
    			div494 = element("div");
    			div495 = element("div");
    			div496 = element("div");
    			div497 = element("div");
    			div498 = element("div");
    			div499 = element("div");
    			div500 = element("div");
    			div501 = element("div");
    			div502 = element("div");
    			div503 = element("div");
    			div504 = element("div");
    			t24 = space();
    			div526 = element("div");
    			div506 = element("div");
    			div507 = element("div");
    			div508 = element("div");
    			div509 = element("div");
    			div510 = element("div");
    			div511 = element("div");
    			div512 = element("div");
    			div513 = element("div");
    			div514 = element("div");
    			div515 = element("div");
    			div516 = element("div");
    			div517 = element("div");
    			div518 = element("div");
    			div519 = element("div");
    			div520 = element("div");
    			div521 = element("div");
    			div522 = element("div");
    			div523 = element("div");
    			div524 = element("div");
    			div525 = element("div");
    			t25 = space();
    			div547 = element("div");
    			div527 = element("div");
    			div528 = element("div");
    			div529 = element("div");
    			div530 = element("div");
    			div531 = element("div");
    			div532 = element("div");
    			div533 = element("div");
    			div534 = element("div");
    			div535 = element("div");
    			div536 = element("div");
    			div537 = element("div");
    			div538 = element("div");
    			div539 = element("div");
    			div540 = element("div");
    			div541 = element("div");
    			div542 = element("div");
    			div543 = element("div");
    			div544 = element("div");
    			div545 = element("div");
    			div546 = element("div");
    			t26 = space();
    			div568 = element("div");
    			div548 = element("div");
    			div549 = element("div");
    			div550 = element("div");
    			div551 = element("div");
    			div552 = element("div");
    			div553 = element("div");
    			div554 = element("div");
    			div555 = element("div");
    			div556 = element("div");
    			div557 = element("div");
    			div558 = element("div");
    			div559 = element("div");
    			div560 = element("div");
    			div561 = element("div");
    			div562 = element("div");
    			div563 = element("div");
    			div564 = element("div");
    			div565 = element("div");
    			div566 = element("div");
    			div567 = element("div");
    			t27 = space();
    			div589 = element("div");
    			div569 = element("div");
    			div570 = element("div");
    			div571 = element("div");
    			div572 = element("div");
    			div573 = element("div");
    			div574 = element("div");
    			div575 = element("div");
    			div576 = element("div");
    			div577 = element("div");
    			div578 = element("div");
    			div579 = element("div");
    			div580 = element("div");
    			div581 = element("div");
    			div582 = element("div");
    			div583 = element("div");
    			div584 = element("div");
    			div585 = element("div");
    			div586 = element("div");
    			div587 = element("div");
    			div588 = element("div");
    			t28 = space();
    			div610 = element("div");
    			div590 = element("div");
    			div591 = element("div");
    			div592 = element("div");
    			div593 = element("div");
    			div594 = element("div");
    			div595 = element("div");
    			div596 = element("div");
    			div597 = element("div");
    			div598 = element("div");
    			div599 = element("div");
    			div600 = element("div");
    			div601 = element("div");
    			div602 = element("div");
    			div603 = element("div");
    			div604 = element("div");
    			div605 = element("div");
    			div606 = element("div");
    			div607 = element("div");
    			div608 = element("div");
    			div609 = element("div");
    			t29 = space();
    			div631 = element("div");
    			div611 = element("div");
    			div612 = element("div");
    			div613 = element("div");
    			div614 = element("div");
    			div615 = element("div");
    			div616 = element("div");
    			div617 = element("div");
    			div618 = element("div");
    			div619 = element("div");
    			div620 = element("div");
    			div621 = element("div");
    			div622 = element("div");
    			div623 = element("div");
    			div624 = element("div");
    			div625 = element("div");
    			div626 = element("div");
    			div627 = element("div");
    			div628 = element("div");
    			div629 = element("div");
    			div630 = element("div");
    			t30 = space();
    			div652 = element("div");
    			div632 = element("div");
    			div633 = element("div");
    			div634 = element("div");
    			div635 = element("div");
    			div636 = element("div");
    			div637 = element("div");
    			div638 = element("div");
    			div639 = element("div");
    			div640 = element("div");
    			div641 = element("div");
    			div642 = element("div");
    			div643 = element("div");
    			div644 = element("div");
    			div645 = element("div");
    			div646 = element("div");
    			div647 = element("div");
    			div648 = element("div");
    			div649 = element("div");
    			div650 = element("div");
    			div651 = element("div");
    			t31 = space();
    			div673 = element("div");
    			div653 = element("div");
    			div654 = element("div");
    			div655 = element("div");
    			div656 = element("div");
    			div657 = element("div");
    			div658 = element("div");
    			div659 = element("div");
    			div660 = element("div");
    			div661 = element("div");
    			div662 = element("div");
    			div663 = element("div");
    			div664 = element("div");
    			div665 = element("div");
    			div666 = element("div");
    			div667 = element("div");
    			div668 = element("div");
    			div669 = element("div");
    			div670 = element("div");
    			div671 = element("div");
    			div672 = element("div");
    			t32 = space();
    			div694 = element("div");
    			div674 = element("div");
    			div675 = element("div");
    			div676 = element("div");
    			div677 = element("div");
    			div678 = element("div");
    			div679 = element("div");
    			div680 = element("div");
    			div681 = element("div");
    			div682 = element("div");
    			div683 = element("div");
    			div684 = element("div");
    			div685 = element("div");
    			div686 = element("div");
    			div687 = element("div");
    			div688 = element("div");
    			div689 = element("div");
    			div690 = element("div");
    			div691 = element("div");
    			div692 = element("div");
    			div693 = element("div");
    			t33 = space();
    			div715 = element("div");
    			div695 = element("div");
    			div696 = element("div");
    			div697 = element("div");
    			div698 = element("div");
    			div699 = element("div");
    			div700 = element("div");
    			div701 = element("div");
    			div702 = element("div");
    			div703 = element("div");
    			div704 = element("div");
    			div705 = element("div");
    			div706 = element("div");
    			div707 = element("div");
    			div708 = element("div");
    			div709 = element("div");
    			div710 = element("div");
    			div711 = element("div");
    			div712 = element("div");
    			div713 = element("div");
    			div714 = element("div");
    			t34 = space();
    			div736 = element("div");
    			div716 = element("div");
    			div717 = element("div");
    			div718 = element("div");
    			div719 = element("div");
    			div720 = element("div");
    			div721 = element("div");
    			div722 = element("div");
    			div723 = element("div");
    			div724 = element("div");
    			div725 = element("div");
    			div726 = element("div");
    			div727 = element("div");
    			div728 = element("div");
    			div729 = element("div");
    			div730 = element("div");
    			div731 = element("div");
    			div732 = element("div");
    			div733 = element("div");
    			div734 = element("div");
    			div735 = element("div");
    			t35 = space();
    			div757 = element("div");
    			div737 = element("div");
    			div738 = element("div");
    			div739 = element("div");
    			div740 = element("div");
    			div741 = element("div");
    			div742 = element("div");
    			div743 = element("div");
    			div744 = element("div");
    			div745 = element("div");
    			div746 = element("div");
    			div747 = element("div");
    			div748 = element("div");
    			div749 = element("div");
    			div750 = element("div");
    			div751 = element("div");
    			div752 = element("div");
    			div753 = element("div");
    			div754 = element("div");
    			div755 = element("div");
    			div756 = element("div");
    			t36 = space();
    			div778 = element("div");
    			div758 = element("div");
    			div759 = element("div");
    			div760 = element("div");
    			div761 = element("div");
    			div762 = element("div");
    			div763 = element("div");
    			div764 = element("div");
    			div765 = element("div");
    			div766 = element("div");
    			div767 = element("div");
    			div768 = element("div");
    			div769 = element("div");
    			div770 = element("div");
    			div771 = element("div");
    			div772 = element("div");
    			div773 = element("div");
    			div774 = element("div");
    			div775 = element("div");
    			div776 = element("div");
    			div777 = element("div");
    			t37 = space();
    			div799 = element("div");
    			div779 = element("div");
    			div780 = element("div");
    			div781 = element("div");
    			div782 = element("div");
    			div783 = element("div");
    			div784 = element("div");
    			div785 = element("div");
    			div786 = element("div");
    			div787 = element("div");
    			div788 = element("div");
    			div789 = element("div");
    			div790 = element("div");
    			div791 = element("div");
    			div792 = element("div");
    			div793 = element("div");
    			div794 = element("div");
    			div795 = element("div");
    			div796 = element("div");
    			div797 = element("div");
    			div798 = element("div");
    			t38 = space();
    			div820 = element("div");
    			div800 = element("div");
    			div801 = element("div");
    			div802 = element("div");
    			div803 = element("div");
    			div804 = element("div");
    			div805 = element("div");
    			div806 = element("div");
    			div807 = element("div");
    			div808 = element("div");
    			div809 = element("div");
    			div810 = element("div");
    			div811 = element("div");
    			div812 = element("div");
    			div813 = element("div");
    			div814 = element("div");
    			div815 = element("div");
    			div816 = element("div");
    			div817 = element("div");
    			div818 = element("div");
    			div819 = element("div");
    			t39 = space();
    			div841 = element("div");
    			div821 = element("div");
    			div822 = element("div");
    			div823 = element("div");
    			div824 = element("div");
    			div825 = element("div");
    			div826 = element("div");
    			div827 = element("div");
    			div828 = element("div");
    			div829 = element("div");
    			div830 = element("div");
    			div831 = element("div");
    			div832 = element("div");
    			div833 = element("div");
    			div834 = element("div");
    			div835 = element("div");
    			div836 = element("div");
    			div837 = element("div");
    			div838 = element("div");
    			div839 = element("div");
    			div840 = element("div");
    			t40 = space();
    			div862 = element("div");
    			div842 = element("div");
    			div843 = element("div");
    			div844 = element("div");
    			div845 = element("div");
    			div846 = element("div");
    			div847 = element("div");
    			div848 = element("div");
    			div849 = element("div");
    			div850 = element("div");
    			div851 = element("div");
    			div852 = element("div");
    			div853 = element("div");
    			div854 = element("div");
    			div855 = element("div");
    			div856 = element("div");
    			div857 = element("div");
    			div858 = element("div");
    			div859 = element("div");
    			div860 = element("div");
    			div861 = element("div");
    			t41 = space();
    			div883 = element("div");
    			div863 = element("div");
    			div864 = element("div");
    			div865 = element("div");
    			div866 = element("div");
    			div867 = element("div");
    			div868 = element("div");
    			div869 = element("div");
    			div870 = element("div");
    			div871 = element("div");
    			div872 = element("div");
    			div873 = element("div");
    			div874 = element("div");
    			div875 = element("div");
    			div876 = element("div");
    			div877 = element("div");
    			div878 = element("div");
    			div879 = element("div");
    			div880 = element("div");
    			div881 = element("div");
    			div882 = element("div");
    			t42 = space();
    			div904 = element("div");
    			div884 = element("div");
    			div885 = element("div");
    			div886 = element("div");
    			div887 = element("div");
    			div888 = element("div");
    			div889 = element("div");
    			div890 = element("div");
    			div891 = element("div");
    			div892 = element("div");
    			div893 = element("div");
    			div894 = element("div");
    			div895 = element("div");
    			div896 = element("div");
    			div897 = element("div");
    			div898 = element("div");
    			div899 = element("div");
    			div900 = element("div");
    			div901 = element("div");
    			div902 = element("div");
    			div903 = element("div");
    			t43 = space();
    			div906 = element("div");
    			t44 = text("Failed to Fetch.\n\t\t");
    			form0 = element("form");
    			input0 = element("input");
    			t45 = space();
    			div908 = element("div");
    			t46 = text("Failed to Fetch.\n");
    			form1 = element("form");
    			input1 = element("input");
    			attr_dev(div0, "class", "boom svelte-quhomu");
    			add_location(div0, file, 24, 1, 878);
    			attr_dev(div1, "class", "stav svelte-quhomu");
    			add_location(div1, file, 23, 2, 856);
    			attr_dev(div2, "class", "boll svelte-quhomu");
    			add_location(div2, file, 28, 0, 977);
    			attr_dev(div3, "class", "boll svelte-quhomu");
    			add_location(div3, file, 28, 24, 1001);
    			attr_dev(div4, "class", "boll svelte-quhomu");
    			add_location(div4, file, 28, 48, 1025);
    			attr_dev(div5, "class", "boll svelte-quhomu");
    			add_location(div5, file, 28, 72, 1049);
    			attr_dev(div6, "class", "boll svelte-quhomu");
    			add_location(div6, file, 28, 96, 1073);
    			attr_dev(div7, "class", "boll svelte-quhomu");
    			add_location(div7, file, 28, 120, 1097);
    			attr_dev(div8, "class", "boll svelte-quhomu");
    			add_location(div8, file, 28, 144, 1121);
    			attr_dev(div9, "class", "boll svelte-quhomu");
    			add_location(div9, file, 28, 168, 1145);
    			attr_dev(div10, "class", "boll svelte-quhomu");
    			add_location(div10, file, 28, 192, 1169);
    			attr_dev(div11, "class", "boll svelte-quhomu");
    			add_location(div11, file, 28, 216, 1193);
    			attr_dev(div12, "class", "boll svelte-quhomu");
    			add_location(div12, file, 28, 240, 1217);
    			attr_dev(div13, "class", "boll svelte-quhomu");
    			add_location(div13, file, 28, 264, 1241);
    			attr_dev(div14, "class", "boll svelte-quhomu");
    			add_location(div14, file, 28, 288, 1265);
    			attr_dev(div15, "class", "boll svelte-quhomu");
    			add_location(div15, file, 28, 312, 1289);
    			attr_dev(div16, "class", "boll svelte-quhomu");
    			add_location(div16, file, 28, 336, 1313);
    			attr_dev(div17, "class", "boll svelte-quhomu");
    			add_location(div17, file, 28, 360, 1337);
    			attr_dev(div18, "class", "boll svelte-quhomu");
    			add_location(div18, file, 28, 384, 1361);
    			attr_dev(div19, "class", "boll svelte-quhomu");
    			add_location(div19, file, 28, 408, 1385);
    			attr_dev(div20, "class", "boll svelte-quhomu");
    			add_location(div20, file, 28, 432, 1409);
    			attr_dev(div21, "class", "boll svelte-quhomu");
    			add_location(div21, file, 28, 456, 1433);
    			attr_dev(div22, "class", "row svelte-quhomu");
    			add_location(div22, file, 27, 8, 959);
    			attr_dev(div23, "class", "boll svelte-quhomu");
    			add_location(div23, file, 31, 0, 1494);
    			attr_dev(div24, "class", "boll svelte-quhomu");
    			add_location(div24, file, 31, 24, 1518);
    			attr_dev(div25, "class", "boll svelte-quhomu");
    			add_location(div25, file, 31, 48, 1542);
    			attr_dev(div26, "class", "boll svelte-quhomu");
    			add_location(div26, file, 31, 72, 1566);
    			attr_dev(div27, "class", "bollröd svelte-quhomu");
    			set_style(div27, "animation-delay", "1050ms");
    			add_location(div27, file, 31, 96, 1590);
    			attr_dev(div28, "class", "bollröd svelte-quhomu");
    			set_style(div28, "animation-delay", "1050ms");
    			add_location(div28, file, 31, 154, 1648);
    			attr_dev(div29, "class", "bollröd svelte-quhomu");
    			set_style(div29, "animation-delay", "1050ms");
    			add_location(div29, file, 31, 212, 1706);
    			attr_dev(div30, "class", "bollröd svelte-quhomu");
    			set_style(div30, "animation-delay", "1050ms");
    			add_location(div30, file, 31, 270, 1764);
    			attr_dev(div31, "class", "bollröd svelte-quhomu");
    			set_style(div31, "animation-delay", "1050ms");
    			add_location(div31, file, 31, 328, 1822);
    			attr_dev(div32, "class", "bollröd svelte-quhomu");
    			set_style(div32, "animation-delay", "1050ms");
    			add_location(div32, file, 31, 386, 1880);
    			attr_dev(div33, "class", "bollröd svelte-quhomu");
    			set_style(div33, "animation-delay", "1050ms");
    			add_location(div33, file, 31, 444, 1938);
    			attr_dev(div34, "class", "bollröd svelte-quhomu");
    			set_style(div34, "animation-delay", "1050ms");
    			add_location(div34, file, 31, 502, 1996);
    			attr_dev(div35, "class", "bollröd svelte-quhomu");
    			set_style(div35, "animation-delay", "1050ms");
    			add_location(div35, file, 31, 560, 2054);
    			attr_dev(div36, "class", "bollröd svelte-quhomu");
    			set_style(div36, "animation-delay", "1050ms");
    			add_location(div36, file, 31, 618, 2112);
    			attr_dev(div37, "class", "bollröd svelte-quhomu");
    			set_style(div37, "animation-delay", "1050ms");
    			add_location(div37, file, 31, 676, 2170);
    			attr_dev(div38, "class", "bollröd svelte-quhomu");
    			set_style(div38, "animation-delay", "1050ms");
    			add_location(div38, file, 31, 734, 2228);
    			attr_dev(div39, "class", "boll svelte-quhomu");
    			add_location(div39, file, 31, 792, 2286);
    			attr_dev(div40, "class", "boll svelte-quhomu");
    			add_location(div40, file, 31, 816, 2310);
    			attr_dev(div41, "class", "boll svelte-quhomu");
    			add_location(div41, file, 31, 840, 2334);
    			attr_dev(div42, "class", "boll svelte-quhomu");
    			add_location(div42, file, 31, 864, 2358);
    			attr_dev(div43, "class", "row2 svelte-quhomu");
    			add_location(div43, file, 30, 1, 1475);
    			attr_dev(div44, "class", "boll svelte-quhomu");
    			add_location(div44, file, 34, 0, 2420);
    			attr_dev(div45, "class", "boll svelte-quhomu");
    			add_location(div45, file, 34, 24, 2444);
    			attr_dev(div46, "class", "boll svelte-quhomu");
    			add_location(div46, file, 34, 48, 2468);
    			attr_dev(div47, "class", "boll svelte-quhomu");
    			add_location(div47, file, 34, 72, 2492);
    			attr_dev(div48, "class", "bollröd svelte-quhomu");
    			set_style(div48, "animation-delay", "1100ms");
    			add_location(div48, file, 34, 96, 2516);
    			attr_dev(div49, "class", "boll svelte-quhomu");
    			add_location(div49, file, 34, 154, 2574);
    			attr_dev(div50, "class", "boll svelte-quhomu");
    			add_location(div50, file, 34, 178, 2598);
    			attr_dev(div51, "class", "bollröd svelte-quhomu");
    			set_style(div51, "animation-delay", "1100ms");
    			add_location(div51, file, 34, 202, 2622);
    			attr_dev(div52, "class", "boll svelte-quhomu");
    			add_location(div52, file, 34, 260, 2680);
    			attr_dev(div53, "class", "boll svelte-quhomu");
    			add_location(div53, file, 34, 284, 2704);
    			attr_dev(div54, "class", "boll svelte-quhomu");
    			add_location(div54, file, 34, 308, 2728);
    			attr_dev(div55, "class", "boll svelte-quhomu");
    			add_location(div55, file, 34, 332, 2752);
    			attr_dev(div56, "class", "boll svelte-quhomu");
    			add_location(div56, file, 34, 356, 2776);
    			attr_dev(div57, "class", "boll svelte-quhomu");
    			add_location(div57, file, 34, 380, 2800);
    			attr_dev(div58, "class", "boll svelte-quhomu");
    			add_location(div58, file, 34, 404, 2824);
    			attr_dev(div59, "class", "boll svelte-quhomu");
    			add_location(div59, file, 34, 428, 2848);
    			attr_dev(div60, "class", "boll svelte-quhomu");
    			add_location(div60, file, 34, 452, 2872);
    			attr_dev(div61, "class", "boll svelte-quhomu");
    			add_location(div61, file, 34, 476, 2896);
    			attr_dev(div62, "class", "boll svelte-quhomu");
    			add_location(div62, file, 34, 500, 2920);
    			attr_dev(div63, "class", "boll svelte-quhomu");
    			add_location(div63, file, 34, 524, 2944);
    			attr_dev(div64, "class", "row3 svelte-quhomu");
    			add_location(div64, file, 33, 1, 2401);
    			attr_dev(div65, "class", "boll svelte-quhomu");
    			add_location(div65, file, 37, 0, 3006);
    			attr_dev(div66, "class", "boll svelte-quhomu");
    			add_location(div66, file, 37, 24, 3030);
    			attr_dev(div67, "class", "boll svelte-quhomu");
    			add_location(div67, file, 37, 48, 3054);
    			attr_dev(div68, "class", "boll svelte-quhomu");
    			add_location(div68, file, 37, 72, 3078);
    			attr_dev(div69, "class", "bollröd svelte-quhomu");
    			set_style(div69, "animation-delay", "1150ms");
    			add_location(div69, file, 37, 96, 3102);
    			attr_dev(div70, "class", "boll svelte-quhomu");
    			add_location(div70, file, 37, 154, 3160);
    			attr_dev(div71, "class", "boll svelte-quhomu");
    			add_location(div71, file, 37, 178, 3184);
    			attr_dev(div72, "class", "bollröd svelte-quhomu");
    			set_style(div72, "animation-delay", "1150ms");
    			add_location(div72, file, 37, 202, 3208);
    			attr_dev(div73, "class", "boll svelte-quhomu");
    			add_location(div73, file, 37, 260, 3266);
    			attr_dev(div74, "class", "boll svelte-quhomu");
    			add_location(div74, file, 37, 284, 3290);
    			attr_dev(div75, "class", "boll svelte-quhomu");
    			add_location(div75, file, 37, 308, 3314);
    			attr_dev(div76, "class", "boll svelte-quhomu");
    			add_location(div76, file, 37, 332, 3338);
    			attr_dev(div77, "class", "boll svelte-quhomu");
    			add_location(div77, file, 37, 356, 3362);
    			attr_dev(div78, "class", "boll svelte-quhomu");
    			add_location(div78, file, 37, 380, 3386);
    			attr_dev(div79, "class", "boll svelte-quhomu");
    			add_location(div79, file, 37, 404, 3410);
    			attr_dev(div80, "class", "boll svelte-quhomu");
    			add_location(div80, file, 37, 428, 3434);
    			attr_dev(div81, "class", "boll svelte-quhomu");
    			add_location(div81, file, 37, 452, 3458);
    			attr_dev(div82, "class", "boll svelte-quhomu");
    			add_location(div82, file, 37, 476, 3482);
    			attr_dev(div83, "class", "boll svelte-quhomu");
    			add_location(div83, file, 37, 500, 3506);
    			attr_dev(div84, "class", "boll svelte-quhomu");
    			add_location(div84, file, 37, 524, 3530);
    			attr_dev(div85, "class", "row4 svelte-quhomu");
    			add_location(div85, file, 36, 1, 2987);
    			attr_dev(div86, "class", "boll svelte-quhomu");
    			add_location(div86, file, 40, 0, 3592);
    			attr_dev(div87, "class", "boll svelte-quhomu");
    			add_location(div87, file, 40, 24, 3616);
    			attr_dev(div88, "class", "boll svelte-quhomu");
    			add_location(div88, file, 40, 48, 3640);
    			attr_dev(div89, "class", "boll svelte-quhomu");
    			add_location(div89, file, 40, 72, 3664);
    			attr_dev(div90, "class", "boll svelte-quhomu");
    			add_location(div90, file, 40, 96, 3688);
    			attr_dev(div91, "class", "boll svelte-quhomu");
    			add_location(div91, file, 40, 120, 3712);
    			attr_dev(div92, "class", "boll svelte-quhomu");
    			add_location(div92, file, 40, 144, 3736);
    			attr_dev(div93, "class", "boll svelte-quhomu");
    			add_location(div93, file, 40, 168, 3760);
    			attr_dev(div94, "class", "boll svelte-quhomu");
    			add_location(div94, file, 40, 192, 3784);
    			attr_dev(div95, "class", "bollröd svelte-quhomu");
    			set_style(div95, "animation-delay", "1200ms");
    			add_location(div95, file, 40, 216, 3808);
    			attr_dev(div96, "class", "bollröd svelte-quhomu");
    			set_style(div96, "animation-delay", "1200ms");
    			add_location(div96, file, 40, 274, 3866);
    			attr_dev(div97, "class", "bollröd svelte-quhomu");
    			set_style(div97, "animation-delay", "1200ms");
    			add_location(div97, file, 40, 332, 3924);
    			attr_dev(div98, "class", "bollröd svelte-quhomu");
    			set_style(div98, "animation-delay", "1200ms");
    			add_location(div98, file, 40, 390, 3982);
    			attr_dev(div99, "class", "bollröd svelte-quhomu");
    			set_style(div99, "animation-delay", "1200ms");
    			add_location(div99, file, 40, 448, 4040);
    			attr_dev(div100, "class", "bollröd svelte-quhomu");
    			set_style(div100, "animation-delay", "1200ms");
    			add_location(div100, file, 40, 506, 4098);
    			attr_dev(div101, "class", "bollröd svelte-quhomu");
    			set_style(div101, "animation-delay", "1200ms");
    			add_location(div101, file, 40, 564, 4156);
    			attr_dev(div102, "class", "boll svelte-quhomu");
    			add_location(div102, file, 40, 622, 4214);
    			attr_dev(div103, "class", "boll svelte-quhomu");
    			add_location(div103, file, 40, 646, 4238);
    			attr_dev(div104, "class", "boll svelte-quhomu");
    			add_location(div104, file, 40, 670, 4262);
    			attr_dev(div105, "class", "boll svelte-quhomu");
    			add_location(div105, file, 40, 694, 4286);
    			attr_dev(div106, "class", "row5 svelte-quhomu");
    			add_location(div106, file, 39, 1, 3573);
    			attr_dev(div107, "class", "boll svelte-quhomu");
    			add_location(div107, file, 43, 2, 4349);
    			attr_dev(div108, "class", "boll svelte-quhomu");
    			add_location(div108, file, 43, 26, 4373);
    			attr_dev(div109, "class", "boll svelte-quhomu");
    			add_location(div109, file, 43, 50, 4397);
    			attr_dev(div110, "class", "boll svelte-quhomu");
    			add_location(div110, file, 43, 74, 4421);
    			attr_dev(div111, "class", "boll svelte-quhomu");
    			add_location(div111, file, 43, 98, 4445);
    			attr_dev(div112, "class", "boll svelte-quhomu");
    			add_location(div112, file, 43, 122, 4469);
    			attr_dev(div113, "class", "boll svelte-quhomu");
    			add_location(div113, file, 43, 146, 4493);
    			attr_dev(div114, "class", "boll svelte-quhomu");
    			add_location(div114, file, 43, 170, 4517);
    			attr_dev(div115, "class", "boll svelte-quhomu");
    			add_location(div115, file, 43, 194, 4541);
    			attr_dev(div116, "class", "bollröd svelte-quhomu");
    			set_style(div116, "animation-delay", "1250ms");
    			add_location(div116, file, 43, 218, 4565);
    			attr_dev(div117, "class", "boll svelte-quhomu");
    			add_location(div117, file, 43, 276, 4623);
    			attr_dev(div118, "class", "boll svelte-quhomu");
    			add_location(div118, file, 43, 300, 4647);
    			attr_dev(div119, "class", "bollröd svelte-quhomu");
    			set_style(div119, "animation-delay", "1250ms");
    			add_location(div119, file, 43, 324, 4671);
    			attr_dev(div120, "class", "boll svelte-quhomu");
    			add_location(div120, file, 43, 382, 4729);
    			attr_dev(div121, "class", "boll svelte-quhomu");
    			add_location(div121, file, 43, 406, 4753);
    			attr_dev(div122, "class", "bollröd svelte-quhomu");
    			set_style(div122, "animation-delay", "1250ms");
    			add_location(div122, file, 43, 430, 4777);
    			attr_dev(div123, "class", "boll svelte-quhomu");
    			add_location(div123, file, 43, 488, 4835);
    			attr_dev(div124, "class", "boll svelte-quhomu");
    			add_location(div124, file, 43, 512, 4859);
    			attr_dev(div125, "class", "boll svelte-quhomu");
    			add_location(div125, file, 43, 536, 4883);
    			attr_dev(div126, "class", "boll svelte-quhomu");
    			add_location(div126, file, 43, 560, 4907);
    			attr_dev(div127, "class", "row6 svelte-quhomu");
    			add_location(div127, file, 42, 1, 4328);
    			attr_dev(div128, "class", "boll svelte-quhomu");
    			add_location(div128, file, 46, 0, 4968);
    			attr_dev(div129, "class", "boll svelte-quhomu");
    			add_location(div129, file, 46, 24, 4992);
    			attr_dev(div130, "class", "boll svelte-quhomu");
    			add_location(div130, file, 46, 48, 5016);
    			attr_dev(div131, "class", "boll svelte-quhomu");
    			add_location(div131, file, 46, 72, 5040);
    			attr_dev(div132, "class", "boll svelte-quhomu");
    			add_location(div132, file, 46, 96, 5064);
    			attr_dev(div133, "class", "boll svelte-quhomu");
    			add_location(div133, file, 46, 120, 5088);
    			attr_dev(div134, "class", "boll svelte-quhomu");
    			add_location(div134, file, 46, 144, 5112);
    			attr_dev(div135, "class", "boll svelte-quhomu");
    			add_location(div135, file, 46, 168, 5136);
    			attr_dev(div136, "class", "boll svelte-quhomu");
    			add_location(div136, file, 46, 192, 5160);
    			attr_dev(div137, "class", "bollröd svelte-quhomu");
    			set_style(div137, "animation-delay", "1300ms");
    			add_location(div137, file, 46, 216, 5184);
    			attr_dev(div138, "class", "boll svelte-quhomu");
    			add_location(div138, file, 46, 274, 5242);
    			attr_dev(div139, "class", "boll svelte-quhomu");
    			add_location(div139, file, 46, 298, 5266);
    			attr_dev(div140, "class", "bollröd svelte-quhomu");
    			set_style(div140, "animation-delay", "1300ms");
    			add_location(div140, file, 46, 322, 5290);
    			attr_dev(div141, "class", "boll svelte-quhomu");
    			add_location(div141, file, 46, 380, 5348);
    			attr_dev(div142, "class", "boll svelte-quhomu");
    			add_location(div142, file, 46, 404, 5372);
    			attr_dev(div143, "class", "bollröd svelte-quhomu");
    			set_style(div143, "animation-delay", "1300ms");
    			add_location(div143, file, 46, 428, 5396);
    			attr_dev(div144, "class", "boll svelte-quhomu");
    			add_location(div144, file, 46, 486, 5454);
    			attr_dev(div145, "class", "boll svelte-quhomu");
    			add_location(div145, file, 46, 510, 5478);
    			attr_dev(div146, "class", "boll svelte-quhomu");
    			add_location(div146, file, 46, 534, 5502);
    			attr_dev(div147, "class", "boll svelte-quhomu");
    			add_location(div147, file, 46, 558, 5526);
    			attr_dev(div148, "class", "row7 svelte-quhomu");
    			add_location(div148, file, 45, 1, 4949);
    			attr_dev(div149, "class", "boll svelte-quhomu");
    			add_location(div149, file, 49, 0, 5587);
    			attr_dev(div150, "class", "boll svelte-quhomu");
    			add_location(div150, file, 49, 24, 5611);
    			attr_dev(div151, "class", "boll svelte-quhomu");
    			add_location(div151, file, 49, 48, 5635);
    			attr_dev(div152, "class", "boll svelte-quhomu");
    			add_location(div152, file, 49, 72, 5659);
    			attr_dev(div153, "class", "boll svelte-quhomu");
    			add_location(div153, file, 49, 96, 5683);
    			attr_dev(div154, "class", "boll svelte-quhomu");
    			add_location(div154, file, 49, 120, 5707);
    			attr_dev(div155, "class", "boll svelte-quhomu");
    			add_location(div155, file, 49, 144, 5731);
    			attr_dev(div156, "class", "boll svelte-quhomu");
    			add_location(div156, file, 49, 168, 5755);
    			attr_dev(div157, "class", "boll svelte-quhomu");
    			add_location(div157, file, 49, 192, 5779);
    			attr_dev(div158, "class", "bollröd svelte-quhomu");
    			set_style(div158, "animation-delay", "1350ms");
    			add_location(div158, file, 49, 216, 5803);
    			attr_dev(div159, "class", "boll svelte-quhomu");
    			add_location(div159, file, 49, 274, 5861);
    			attr_dev(div160, "class", "boll svelte-quhomu");
    			add_location(div160, file, 49, 298, 5885);
    			attr_dev(div161, "class", "boll svelte-quhomu");
    			add_location(div161, file, 49, 322, 5909);
    			attr_dev(div162, "class", "boll svelte-quhomu");
    			add_location(div162, file, 49, 346, 5933);
    			attr_dev(div163, "class", "boll svelte-quhomu");
    			add_location(div163, file, 49, 370, 5957);
    			attr_dev(div164, "class", "bollröd svelte-quhomu");
    			set_style(div164, "animation-delay", "1350ms");
    			add_location(div164, file, 49, 394, 5981);
    			attr_dev(div165, "class", "boll svelte-quhomu");
    			add_location(div165, file, 49, 452, 6039);
    			attr_dev(div166, "class", "boll svelte-quhomu");
    			add_location(div166, file, 49, 476, 6063);
    			attr_dev(div167, "class", "boll svelte-quhomu");
    			add_location(div167, file, 49, 500, 6087);
    			attr_dev(div168, "class", "boll svelte-quhomu");
    			add_location(div168, file, 49, 524, 6111);
    			attr_dev(div169, "class", "row8 svelte-quhomu");
    			add_location(div169, file, 48, 1, 5568);
    			attr_dev(div170, "class", "boll svelte-quhomu");
    			add_location(div170, file, 52, 2, 6174);
    			attr_dev(div171, "class", "boll svelte-quhomu");
    			add_location(div171, file, 52, 26, 6198);
    			attr_dev(div172, "class", "boll svelte-quhomu");
    			add_location(div172, file, 52, 50, 6222);
    			attr_dev(div173, "class", "boll svelte-quhomu");
    			add_location(div173, file, 52, 74, 6246);
    			attr_dev(div174, "class", "boll svelte-quhomu");
    			add_location(div174, file, 52, 98, 6270);
    			attr_dev(div175, "class", "boll svelte-quhomu");
    			add_location(div175, file, 52, 122, 6294);
    			attr_dev(div176, "class", "boll svelte-quhomu");
    			add_location(div176, file, 52, 146, 6318);
    			attr_dev(div177, "class", "boll svelte-quhomu");
    			add_location(div177, file, 52, 170, 6342);
    			attr_dev(div178, "class", "boll svelte-quhomu");
    			add_location(div178, file, 52, 194, 6366);
    			attr_dev(div179, "class", "boll svelte-quhomu");
    			add_location(div179, file, 52, 218, 6390);
    			attr_dev(div180, "class", "boll svelte-quhomu");
    			add_location(div180, file, 52, 242, 6414);
    			attr_dev(div181, "class", "boll svelte-quhomu");
    			add_location(div181, file, 52, 266, 6438);
    			attr_dev(div182, "class", "boll svelte-quhomu");
    			add_location(div182, file, 52, 290, 6462);
    			attr_dev(div183, "class", "boll svelte-quhomu");
    			add_location(div183, file, 52, 314, 6486);
    			attr_dev(div184, "class", "boll svelte-quhomu");
    			add_location(div184, file, 52, 338, 6510);
    			attr_dev(div185, "class", "boll svelte-quhomu");
    			add_location(div185, file, 52, 362, 6534);
    			attr_dev(div186, "class", "boll svelte-quhomu");
    			add_location(div186, file, 52, 386, 6558);
    			attr_dev(div187, "class", "boll svelte-quhomu");
    			add_location(div187, file, 52, 410, 6582);
    			attr_dev(div188, "class", "boll svelte-quhomu");
    			add_location(div188, file, 52, 434, 6606);
    			attr_dev(div189, "class", "boll svelte-quhomu");
    			add_location(div189, file, 52, 458, 6630);
    			attr_dev(div190, "class", "row9 svelte-quhomu");
    			add_location(div190, file, 51, 1, 6153);
    			attr_dev(div191, "class", "boll svelte-quhomu");
    			add_location(div191, file, 56, 0, 6693);
    			attr_dev(div192, "class", "boll svelte-quhomu");
    			add_location(div192, file, 56, 24, 6717);
    			attr_dev(div193, "class", "boll svelte-quhomu");
    			add_location(div193, file, 56, 48, 6741);
    			attr_dev(div194, "class", "boll svelte-quhomu");
    			add_location(div194, file, 56, 72, 6765);
    			attr_dev(div195, "class", "boll svelte-quhomu");
    			add_location(div195, file, 56, 96, 6789);
    			attr_dev(div196, "class", "boll svelte-quhomu");
    			add_location(div196, file, 56, 120, 6813);
    			attr_dev(div197, "class", "boll svelte-quhomu");
    			add_location(div197, file, 56, 144, 6837);
    			attr_dev(div198, "class", "boll svelte-quhomu");
    			add_location(div198, file, 56, 168, 6861);
    			attr_dev(div199, "class", "boll svelte-quhomu");
    			add_location(div199, file, 56, 192, 6885);
    			attr_dev(div200, "class", "bollröd svelte-quhomu");
    			set_style(div200, "animation-delay", "1450ms");
    			add_location(div200, file, 56, 216, 6909);
    			attr_dev(div201, "class", "boll svelte-quhomu");
    			add_location(div201, file, 56, 274, 6967);
    			attr_dev(div202, "class", "boll svelte-quhomu");
    			add_location(div202, file, 56, 298, 6991);
    			attr_dev(div203, "class", "boll svelte-quhomu");
    			add_location(div203, file, 56, 322, 7015);
    			attr_dev(div204, "class", "boll svelte-quhomu");
    			add_location(div204, file, 56, 346, 7039);
    			attr_dev(div205, "class", "boll svelte-quhomu");
    			add_location(div205, file, 56, 370, 7063);
    			attr_dev(div206, "class", "boll svelte-quhomu");
    			add_location(div206, file, 56, 394, 7087);
    			attr_dev(div207, "class", "boll svelte-quhomu");
    			add_location(div207, file, 56, 418, 7111);
    			attr_dev(div208, "class", "boll svelte-quhomu");
    			add_location(div208, file, 56, 442, 7135);
    			attr_dev(div209, "class", "boll svelte-quhomu");
    			add_location(div209, file, 56, 466, 7159);
    			attr_dev(div210, "class", "boll svelte-quhomu");
    			add_location(div210, file, 56, 490, 7183);
    			attr_dev(div211, "class", "row10 svelte-quhomu");
    			add_location(div211, file, 55, 1, 6673);
    			attr_dev(div212, "class", "boll svelte-quhomu");
    			add_location(div212, file, 59, 0, 7245);
    			attr_dev(div213, "class", "boll svelte-quhomu");
    			add_location(div213, file, 59, 24, 7269);
    			attr_dev(div214, "class", "boll svelte-quhomu");
    			add_location(div214, file, 59, 48, 7293);
    			attr_dev(div215, "class", "boll svelte-quhomu");
    			add_location(div215, file, 59, 72, 7317);
    			attr_dev(div216, "class", "boll svelte-quhomu");
    			add_location(div216, file, 59, 96, 7341);
    			attr_dev(div217, "class", "boll svelte-quhomu");
    			add_location(div217, file, 59, 120, 7365);
    			attr_dev(div218, "class", "boll svelte-quhomu");
    			add_location(div218, file, 59, 144, 7389);
    			attr_dev(div219, "class", "boll svelte-quhomu");
    			add_location(div219, file, 59, 168, 7413);
    			attr_dev(div220, "class", "boll svelte-quhomu");
    			add_location(div220, file, 59, 192, 7437);
    			attr_dev(div221, "class", "bollröd svelte-quhomu");
    			set_style(div221, "animation-delay", "1500ms");
    			add_location(div221, file, 59, 216, 7461);
    			attr_dev(div222, "class", "boll svelte-quhomu");
    			add_location(div222, file, 59, 274, 7519);
    			attr_dev(div223, "class", "boll svelte-quhomu");
    			add_location(div223, file, 59, 298, 7543);
    			attr_dev(div224, "class", "boll svelte-quhomu");
    			add_location(div224, file, 59, 322, 7567);
    			attr_dev(div225, "class", "boll svelte-quhomu");
    			add_location(div225, file, 59, 346, 7591);
    			attr_dev(div226, "class", "boll svelte-quhomu");
    			add_location(div226, file, 59, 370, 7615);
    			attr_dev(div227, "class", "boll svelte-quhomu");
    			add_location(div227, file, 59, 394, 7639);
    			attr_dev(div228, "class", "boll svelte-quhomu");
    			add_location(div228, file, 59, 418, 7663);
    			attr_dev(div229, "class", "boll svelte-quhomu");
    			add_location(div229, file, 59, 442, 7687);
    			attr_dev(div230, "class", "boll svelte-quhomu");
    			add_location(div230, file, 59, 466, 7711);
    			attr_dev(div231, "class", "boll svelte-quhomu");
    			add_location(div231, file, 59, 490, 7735);
    			attr_dev(div232, "class", "row11 svelte-quhomu");
    			add_location(div232, file, 58, 1, 7225);
    			attr_dev(div233, "class", "boll svelte-quhomu");
    			add_location(div233, file, 62, 0, 7797);
    			attr_dev(div234, "class", "boll svelte-quhomu");
    			add_location(div234, file, 62, 24, 7821);
    			attr_dev(div235, "class", "boll svelte-quhomu");
    			add_location(div235, file, 62, 48, 7845);
    			attr_dev(div236, "class", "boll svelte-quhomu");
    			add_location(div236, file, 62, 72, 7869);
    			attr_dev(div237, "class", "boll svelte-quhomu");
    			add_location(div237, file, 62, 96, 7893);
    			attr_dev(div238, "class", "boll svelte-quhomu");
    			add_location(div238, file, 62, 120, 7917);
    			attr_dev(div239, "class", "boll svelte-quhomu");
    			add_location(div239, file, 62, 144, 7941);
    			attr_dev(div240, "class", "boll svelte-quhomu");
    			add_location(div240, file, 62, 168, 7965);
    			attr_dev(div241, "class", "boll svelte-quhomu");
    			add_location(div241, file, 62, 192, 7989);
    			attr_dev(div242, "class", "bollröd svelte-quhomu");
    			set_style(div242, "animation-delay", "1550ms");
    			add_location(div242, file, 62, 216, 8013);
    			attr_dev(div243, "class", "bollröd svelte-quhomu");
    			set_style(div243, "animation-delay", "1550ms");
    			add_location(div243, file, 62, 274, 8071);
    			attr_dev(div244, "class", "bollröd svelte-quhomu");
    			set_style(div244, "animation-delay", "1550ms");
    			add_location(div244, file, 62, 332, 8129);
    			attr_dev(div245, "class", "bollröd svelte-quhomu");
    			set_style(div245, "animation-delay", "1550ms");
    			add_location(div245, file, 62, 390, 8187);
    			attr_dev(div246, "class", "bollröd svelte-quhomu");
    			set_style(div246, "animation-delay", "1550ms");
    			add_location(div246, file, 62, 448, 8245);
    			attr_dev(div247, "class", "bollröd svelte-quhomu");
    			set_style(div247, "animation-delay", "1550ms");
    			add_location(div247, file, 62, 506, 8303);
    			attr_dev(div248, "class", "bollröd svelte-quhomu");
    			set_style(div248, "animation-delay", "1550ms");
    			add_location(div248, file, 62, 564, 8361);
    			attr_dev(div249, "class", "boll svelte-quhomu");
    			add_location(div249, file, 62, 622, 8419);
    			attr_dev(div250, "class", "boll svelte-quhomu");
    			add_location(div250, file, 62, 646, 8443);
    			attr_dev(div251, "class", "boll svelte-quhomu");
    			add_location(div251, file, 62, 670, 8467);
    			attr_dev(div252, "class", "boll svelte-quhomu");
    			add_location(div252, file, 62, 694, 8491);
    			attr_dev(div253, "class", "row12 svelte-quhomu");
    			add_location(div253, file, 61, 1, 7777);
    			attr_dev(div254, "class", "boll svelte-quhomu");
    			add_location(div254, file, 65, 0, 8553);
    			attr_dev(div255, "class", "boll svelte-quhomu");
    			add_location(div255, file, 65, 24, 8577);
    			attr_dev(div256, "class", "boll svelte-quhomu");
    			add_location(div256, file, 65, 48, 8601);
    			attr_dev(div257, "class", "boll svelte-quhomu");
    			add_location(div257, file, 65, 72, 8625);
    			attr_dev(div258, "class", "boll svelte-quhomu");
    			add_location(div258, file, 65, 96, 8649);
    			attr_dev(div259, "class", "boll svelte-quhomu");
    			add_location(div259, file, 65, 120, 8673);
    			attr_dev(div260, "class", "boll svelte-quhomu");
    			add_location(div260, file, 65, 144, 8697);
    			attr_dev(div261, "class", "boll svelte-quhomu");
    			add_location(div261, file, 65, 168, 8721);
    			attr_dev(div262, "class", "boll svelte-quhomu");
    			add_location(div262, file, 65, 192, 8745);
    			attr_dev(div263, "class", "bollröd svelte-quhomu");
    			set_style(div263, "animation-delay", "1600ms");
    			add_location(div263, file, 65, 216, 8769);
    			attr_dev(div264, "class", "boll svelte-quhomu");
    			add_location(div264, file, 65, 274, 8827);
    			attr_dev(div265, "class", "boll svelte-quhomu");
    			add_location(div265, file, 65, 298, 8851);
    			attr_dev(div266, "class", "boll svelte-quhomu");
    			add_location(div266, file, 65, 322, 8875);
    			attr_dev(div267, "class", "boll svelte-quhomu");
    			add_location(div267, file, 65, 346, 8899);
    			attr_dev(div268, "class", "boll svelte-quhomu");
    			add_location(div268, file, 65, 370, 8923);
    			attr_dev(div269, "class", "boll svelte-quhomu");
    			add_location(div269, file, 65, 394, 8947);
    			attr_dev(div270, "class", "boll svelte-quhomu");
    			add_location(div270, file, 65, 418, 8971);
    			attr_dev(div271, "class", "boll svelte-quhomu");
    			add_location(div271, file, 65, 442, 8995);
    			attr_dev(div272, "class", "boll svelte-quhomu");
    			add_location(div272, file, 65, 466, 9019);
    			attr_dev(div273, "class", "boll svelte-quhomu");
    			add_location(div273, file, 65, 490, 9043);
    			attr_dev(div274, "class", "row13 svelte-quhomu");
    			add_location(div274, file, 64, 1, 8533);
    			attr_dev(div275, "class", "boll svelte-quhomu");
    			add_location(div275, file, 68, 0, 9105);
    			attr_dev(div276, "class", "boll svelte-quhomu");
    			add_location(div276, file, 68, 24, 9129);
    			attr_dev(div277, "class", "boll svelte-quhomu");
    			add_location(div277, file, 68, 48, 9153);
    			attr_dev(div278, "class", "boll svelte-quhomu");
    			add_location(div278, file, 68, 72, 9177);
    			attr_dev(div279, "class", "boll svelte-quhomu");
    			add_location(div279, file, 68, 96, 9201);
    			attr_dev(div280, "class", "boll svelte-quhomu");
    			add_location(div280, file, 68, 120, 9225);
    			attr_dev(div281, "class", "boll svelte-quhomu");
    			add_location(div281, file, 68, 144, 9249);
    			attr_dev(div282, "class", "boll svelte-quhomu");
    			add_location(div282, file, 68, 168, 9273);
    			attr_dev(div283, "class", "boll svelte-quhomu");
    			add_location(div283, file, 68, 192, 9297);
    			attr_dev(div284, "class", "bollröd svelte-quhomu");
    			set_style(div284, "animation-delay", "1650ms");
    			add_location(div284, file, 68, 216, 9321);
    			attr_dev(div285, "class", "boll svelte-quhomu");
    			add_location(div285, file, 68, 274, 9379);
    			attr_dev(div286, "class", "boll svelte-quhomu");
    			add_location(div286, file, 68, 298, 9403);
    			attr_dev(div287, "class", "boll svelte-quhomu");
    			add_location(div287, file, 68, 322, 9427);
    			attr_dev(div288, "class", "boll svelte-quhomu");
    			add_location(div288, file, 68, 346, 9451);
    			attr_dev(div289, "class", "boll svelte-quhomu");
    			add_location(div289, file, 68, 370, 9475);
    			attr_dev(div290, "class", "boll svelte-quhomu");
    			add_location(div290, file, 68, 394, 9499);
    			attr_dev(div291, "class", "boll svelte-quhomu");
    			add_location(div291, file, 68, 418, 9523);
    			attr_dev(div292, "class", "boll svelte-quhomu");
    			add_location(div292, file, 68, 442, 9547);
    			attr_dev(div293, "class", "boll svelte-quhomu");
    			add_location(div293, file, 68, 466, 9571);
    			attr_dev(div294, "class", "boll svelte-quhomu");
    			add_location(div294, file, 68, 490, 9595);
    			attr_dev(div295, "class", "row14 svelte-quhomu");
    			add_location(div295, file, 67, 1, 9085);
    			attr_dev(div296, "class", "boll svelte-quhomu");
    			add_location(div296, file, 71, 0, 9657);
    			attr_dev(div297, "class", "boll svelte-quhomu");
    			add_location(div297, file, 71, 24, 9681);
    			attr_dev(div298, "class", "boll svelte-quhomu");
    			add_location(div298, file, 71, 48, 9705);
    			attr_dev(div299, "class", "boll svelte-quhomu");
    			add_location(div299, file, 71, 72, 9729);
    			attr_dev(div300, "class", "boll svelte-quhomu");
    			add_location(div300, file, 71, 96, 9753);
    			attr_dev(div301, "class", "boll svelte-quhomu");
    			add_location(div301, file, 71, 120, 9777);
    			attr_dev(div302, "class", "boll svelte-quhomu");
    			add_location(div302, file, 71, 144, 9801);
    			attr_dev(div303, "class", "boll svelte-quhomu");
    			add_location(div303, file, 71, 168, 9825);
    			attr_dev(div304, "class", "boll svelte-quhomu");
    			add_location(div304, file, 71, 192, 9849);
    			attr_dev(div305, "class", "boll svelte-quhomu");
    			add_location(div305, file, 71, 216, 9873);
    			attr_dev(div306, "class", "boll svelte-quhomu");
    			add_location(div306, file, 71, 240, 9897);
    			attr_dev(div307, "class", "boll svelte-quhomu");
    			add_location(div307, file, 71, 264, 9921);
    			attr_dev(div308, "class", "boll svelte-quhomu");
    			add_location(div308, file, 71, 288, 9945);
    			attr_dev(div309, "class", "boll svelte-quhomu");
    			add_location(div309, file, 71, 312, 9969);
    			attr_dev(div310, "class", "boll svelte-quhomu");
    			add_location(div310, file, 71, 336, 9993);
    			attr_dev(div311, "class", "boll svelte-quhomu");
    			add_location(div311, file, 71, 360, 10017);
    			attr_dev(div312, "class", "boll svelte-quhomu");
    			add_location(div312, file, 71, 384, 10041);
    			attr_dev(div313, "class", "boll svelte-quhomu");
    			add_location(div313, file, 71, 408, 10065);
    			attr_dev(div314, "class", "boll svelte-quhomu");
    			add_location(div314, file, 71, 432, 10089);
    			attr_dev(div315, "class", "boll svelte-quhomu");
    			add_location(div315, file, 71, 456, 10113);
    			attr_dev(div316, "class", "row15 svelte-quhomu");
    			add_location(div316, file, 70, 1, 9637);
    			attr_dev(div317, "class", "boll svelte-quhomu");
    			add_location(div317, file, 74, 0, 10175);
    			attr_dev(div318, "class", "boll svelte-quhomu");
    			add_location(div318, file, 74, 24, 10199);
    			attr_dev(div319, "class", "boll svelte-quhomu");
    			add_location(div319, file, 74, 48, 10223);
    			attr_dev(div320, "class", "boll svelte-quhomu");
    			add_location(div320, file, 74, 72, 10247);
    			attr_dev(div321, "class", "boll svelte-quhomu");
    			add_location(div321, file, 74, 96, 10271);
    			attr_dev(div322, "class", "boll svelte-quhomu");
    			add_location(div322, file, 74, 120, 10295);
    			attr_dev(div323, "class", "boll svelte-quhomu");
    			add_location(div323, file, 74, 144, 10319);
    			attr_dev(div324, "class", "boll svelte-quhomu");
    			add_location(div324, file, 74, 168, 10343);
    			attr_dev(div325, "class", "boll svelte-quhomu");
    			add_location(div325, file, 74, 192, 10367);
    			attr_dev(div326, "class", "bollröd svelte-quhomu");
    			set_style(div326, "animation-delay", "1750ms");
    			add_location(div326, file, 74, 216, 10391);
    			attr_dev(div327, "class", "bollröd svelte-quhomu");
    			set_style(div327, "animation-delay", "1750ms");
    			add_location(div327, file, 74, 274, 10449);
    			attr_dev(div328, "class", "bollröd svelte-quhomu");
    			set_style(div328, "animation-delay", "1750ms");
    			add_location(div328, file, 74, 332, 10507);
    			attr_dev(div329, "class", "bollröd svelte-quhomu");
    			set_style(div329, "animation-delay", "1750ms");
    			add_location(div329, file, 74, 390, 10565);
    			attr_dev(div330, "class", "bollröd svelte-quhomu");
    			set_style(div330, "animation-delay", "1750ms");
    			add_location(div330, file, 74, 448, 10623);
    			attr_dev(div331, "class", "bollröd svelte-quhomu");
    			set_style(div331, "animation-delay", "1750ms");
    			add_location(div331, file, 74, 506, 10681);
    			attr_dev(div332, "class", "bollröd svelte-quhomu");
    			set_style(div332, "animation-delay", "1750ms");
    			add_location(div332, file, 74, 564, 10739);
    			attr_dev(div333, "class", "boll svelte-quhomu");
    			add_location(div333, file, 74, 622, 10797);
    			attr_dev(div334, "class", "boll svelte-quhomu");
    			add_location(div334, file, 74, 646, 10821);
    			attr_dev(div335, "class", "boll svelte-quhomu");
    			add_location(div335, file, 74, 670, 10845);
    			attr_dev(div336, "class", "boll svelte-quhomu");
    			add_location(div336, file, 74, 694, 10869);
    			attr_dev(div337, "class", "row16 svelte-quhomu");
    			add_location(div337, file, 73, 1, 10155);
    			attr_dev(div338, "class", "boll svelte-quhomu");
    			add_location(div338, file, 77, 0, 10931);
    			attr_dev(div339, "class", "boll svelte-quhomu");
    			add_location(div339, file, 77, 24, 10955);
    			attr_dev(div340, "class", "boll svelte-quhomu");
    			add_location(div340, file, 77, 48, 10979);
    			attr_dev(div341, "class", "boll svelte-quhomu");
    			add_location(div341, file, 77, 72, 11003);
    			attr_dev(div342, "class", "boll svelte-quhomu");
    			add_location(div342, file, 77, 96, 11027);
    			attr_dev(div343, "class", "boll svelte-quhomu");
    			add_location(div343, file, 77, 120, 11051);
    			attr_dev(div344, "class", "boll svelte-quhomu");
    			add_location(div344, file, 77, 144, 11075);
    			attr_dev(div345, "class", "boll svelte-quhomu");
    			add_location(div345, file, 77, 168, 11099);
    			attr_dev(div346, "class", "boll svelte-quhomu");
    			add_location(div346, file, 77, 192, 11123);
    			attr_dev(div347, "class", "bollröd svelte-quhomu");
    			set_style(div347, "animation-delay", "1800ms");
    			add_location(div347, file, 77, 216, 11147);
    			attr_dev(div348, "class", "boll svelte-quhomu");
    			add_location(div348, file, 77, 274, 11205);
    			attr_dev(div349, "class", "boll svelte-quhomu");
    			add_location(div349, file, 77, 298, 11229);
    			attr_dev(div350, "class", "boll svelte-quhomu");
    			add_location(div350, file, 77, 322, 11253);
    			attr_dev(div351, "class", "boll svelte-quhomu");
    			add_location(div351, file, 77, 346, 11277);
    			attr_dev(div352, "class", "boll svelte-quhomu");
    			add_location(div352, file, 77, 370, 11301);
    			attr_dev(div353, "class", "bollröd svelte-quhomu");
    			set_style(div353, "animation-delay", "1800ms");
    			add_location(div353, file, 77, 394, 11325);
    			attr_dev(div354, "class", "boll svelte-quhomu");
    			add_location(div354, file, 77, 452, 11383);
    			attr_dev(div355, "class", "boll svelte-quhomu");
    			add_location(div355, file, 77, 476, 11407);
    			attr_dev(div356, "class", "boll svelte-quhomu");
    			add_location(div356, file, 77, 500, 11431);
    			attr_dev(div357, "class", "boll svelte-quhomu");
    			add_location(div357, file, 77, 524, 11455);
    			attr_dev(div358, "class", "row17 svelte-quhomu");
    			add_location(div358, file, 76, 1, 10911);
    			attr_dev(div359, "class", "boll svelte-quhomu");
    			add_location(div359, file, 80, 0, 11517);
    			attr_dev(div360, "class", "boll svelte-quhomu");
    			add_location(div360, file, 80, 24, 11541);
    			attr_dev(div361, "class", "boll svelte-quhomu");
    			add_location(div361, file, 80, 48, 11565);
    			attr_dev(div362, "class", "boll svelte-quhomu");
    			add_location(div362, file, 80, 72, 11589);
    			attr_dev(div363, "class", "boll svelte-quhomu");
    			add_location(div363, file, 80, 96, 11613);
    			attr_dev(div364, "class", "boll svelte-quhomu");
    			add_location(div364, file, 80, 120, 11637);
    			attr_dev(div365, "class", "boll svelte-quhomu");
    			add_location(div365, file, 80, 144, 11661);
    			attr_dev(div366, "class", "boll svelte-quhomu");
    			add_location(div366, file, 80, 168, 11685);
    			attr_dev(div367, "class", "boll svelte-quhomu");
    			add_location(div367, file, 80, 192, 11709);
    			attr_dev(div368, "class", "bollröd svelte-quhomu");
    			set_style(div368, "animation-delay", "1850ms");
    			add_location(div368, file, 80, 216, 11733);
    			attr_dev(div369, "class", "boll svelte-quhomu");
    			add_location(div369, file, 80, 274, 11791);
    			attr_dev(div370, "class", "boll svelte-quhomu");
    			add_location(div370, file, 80, 298, 11815);
    			attr_dev(div371, "class", "boll svelte-quhomu");
    			add_location(div371, file, 80, 322, 11839);
    			attr_dev(div372, "class", "boll svelte-quhomu");
    			add_location(div372, file, 80, 346, 11863);
    			attr_dev(div373, "class", "boll svelte-quhomu");
    			add_location(div373, file, 80, 370, 11887);
    			attr_dev(div374, "class", "bollröd svelte-quhomu");
    			set_style(div374, "animation-delay", "1850ms");
    			add_location(div374, file, 80, 394, 11911);
    			attr_dev(div375, "class", "boll svelte-quhomu");
    			add_location(div375, file, 80, 452, 11969);
    			attr_dev(div376, "class", "boll svelte-quhomu");
    			add_location(div376, file, 80, 476, 11993);
    			attr_dev(div377, "class", "boll svelte-quhomu");
    			add_location(div377, file, 80, 500, 12017);
    			attr_dev(div378, "class", "boll svelte-quhomu");
    			add_location(div378, file, 80, 524, 12041);
    			attr_dev(div379, "class", "row18 svelte-quhomu");
    			add_location(div379, file, 79, 1, 11497);
    			attr_dev(div380, "class", "boll svelte-quhomu");
    			add_location(div380, file, 83, 0, 12103);
    			attr_dev(div381, "class", "boll svelte-quhomu");
    			add_location(div381, file, 83, 24, 12127);
    			attr_dev(div382, "class", "boll svelte-quhomu");
    			add_location(div382, file, 83, 48, 12151);
    			attr_dev(div383, "class", "boll svelte-quhomu");
    			add_location(div383, file, 83, 72, 12175);
    			attr_dev(div384, "class", "boll svelte-quhomu");
    			add_location(div384, file, 83, 96, 12199);
    			attr_dev(div385, "class", "boll svelte-quhomu");
    			add_location(div385, file, 83, 120, 12223);
    			attr_dev(div386, "class", "boll svelte-quhomu");
    			add_location(div386, file, 83, 144, 12247);
    			attr_dev(div387, "class", "boll svelte-quhomu");
    			add_location(div387, file, 83, 168, 12271);
    			attr_dev(div388, "class", "boll svelte-quhomu");
    			add_location(div388, file, 83, 192, 12295);
    			attr_dev(div389, "class", "boll svelte-quhomu");
    			add_location(div389, file, 83, 216, 12319);
    			attr_dev(div390, "class", "boll svelte-quhomu");
    			add_location(div390, file, 83, 240, 12343);
    			attr_dev(div391, "class", "boll svelte-quhomu");
    			add_location(div391, file, 83, 264, 12367);
    			attr_dev(div392, "class", "boll svelte-quhomu");
    			add_location(div392, file, 83, 288, 12391);
    			attr_dev(div393, "class", "boll svelte-quhomu");
    			add_location(div393, file, 83, 312, 12415);
    			attr_dev(div394, "class", "boll svelte-quhomu");
    			add_location(div394, file, 83, 336, 12439);
    			attr_dev(div395, "class", "boll svelte-quhomu");
    			add_location(div395, file, 83, 360, 12463);
    			attr_dev(div396, "class", "boll svelte-quhomu");
    			add_location(div396, file, 83, 384, 12487);
    			attr_dev(div397, "class", "boll svelte-quhomu");
    			add_location(div397, file, 83, 408, 12511);
    			attr_dev(div398, "class", "boll svelte-quhomu");
    			add_location(div398, file, 83, 432, 12535);
    			attr_dev(div399, "class", "boll svelte-quhomu");
    			add_location(div399, file, 83, 456, 12559);
    			attr_dev(div400, "class", "row19 svelte-quhomu");
    			add_location(div400, file, 82, 1, 12083);
    			attr_dev(div401, "class", "boll svelte-quhomu");
    			add_location(div401, file, 86, 0, 12621);
    			attr_dev(div402, "class", "boll svelte-quhomu");
    			add_location(div402, file, 86, 24, 12645);
    			attr_dev(div403, "class", "boll svelte-quhomu");
    			add_location(div403, file, 86, 48, 12669);
    			attr_dev(div404, "class", "boll svelte-quhomu");
    			add_location(div404, file, 86, 72, 12693);
    			attr_dev(div405, "class", "boll svelte-quhomu");
    			add_location(div405, file, 86, 96, 12717);
    			attr_dev(div406, "class", "boll svelte-quhomu");
    			add_location(div406, file, 86, 120, 12741);
    			attr_dev(div407, "class", "boll svelte-quhomu");
    			add_location(div407, file, 86, 144, 12765);
    			attr_dev(div408, "class", "boll svelte-quhomu");
    			add_location(div408, file, 86, 168, 12789);
    			attr_dev(div409, "class", "boll svelte-quhomu");
    			add_location(div409, file, 86, 192, 12813);
    			attr_dev(div410, "class", "bollröd svelte-quhomu");
    			set_style(div410, "animation-delay", "1950ms");
    			add_location(div410, file, 86, 216, 12837);
    			attr_dev(div411, "class", "bollröd svelte-quhomu");
    			set_style(div411, "animation-delay", "1950ms");
    			add_location(div411, file, 86, 274, 12895);
    			attr_dev(div412, "class", "bollröd svelte-quhomu");
    			set_style(div412, "animation-delay", "1950ms");
    			add_location(div412, file, 86, 332, 12953);
    			attr_dev(div413, "class", "bollröd svelte-quhomu");
    			set_style(div413, "animation-delay", "1950ms");
    			add_location(div413, file, 86, 390, 13011);
    			attr_dev(div414, "class", "bollröd svelte-quhomu");
    			set_style(div414, "animation-delay", "1950ms");
    			add_location(div414, file, 86, 448, 13069);
    			attr_dev(div415, "class", "bollröd svelte-quhomu");
    			set_style(div415, "animation-delay", "1950ms");
    			add_location(div415, file, 86, 506, 13127);
    			attr_dev(div416, "class", "bollröd svelte-quhomu");
    			set_style(div416, "animation-delay", "1950ms");
    			add_location(div416, file, 86, 564, 13185);
    			attr_dev(div417, "class", "boll svelte-quhomu");
    			add_location(div417, file, 86, 622, 13243);
    			attr_dev(div418, "class", "boll svelte-quhomu");
    			add_location(div418, file, 86, 646, 13267);
    			attr_dev(div419, "class", "boll svelte-quhomu");
    			add_location(div419, file, 86, 670, 13291);
    			attr_dev(div420, "class", "boll svelte-quhomu");
    			add_location(div420, file, 86, 694, 13315);
    			attr_dev(div421, "class", "row20 svelte-quhomu");
    			add_location(div421, file, 85, 1, 12601);
    			attr_dev(div422, "class", "boll svelte-quhomu");
    			add_location(div422, file, 89, 0, 13377);
    			attr_dev(div423, "class", "boll svelte-quhomu");
    			add_location(div423, file, 89, 24, 13401);
    			attr_dev(div424, "class", "boll svelte-quhomu");
    			add_location(div424, file, 89, 48, 13425);
    			attr_dev(div425, "class", "boll svelte-quhomu");
    			add_location(div425, file, 89, 72, 13449);
    			attr_dev(div426, "class", "boll svelte-quhomu");
    			add_location(div426, file, 89, 96, 13473);
    			attr_dev(div427, "class", "boll svelte-quhomu");
    			add_location(div427, file, 89, 120, 13497);
    			attr_dev(div428, "class", "boll svelte-quhomu");
    			add_location(div428, file, 89, 144, 13521);
    			attr_dev(div429, "class", "boll svelte-quhomu");
    			add_location(div429, file, 89, 168, 13545);
    			attr_dev(div430, "class", "boll svelte-quhomu");
    			add_location(div430, file, 89, 192, 13569);
    			attr_dev(div431, "class", "boll svelte-quhomu");
    			add_location(div431, file, 89, 216, 13593);
    			attr_dev(div432, "class", "boll svelte-quhomu");
    			add_location(div432, file, 89, 240, 13617);
    			attr_dev(div433, "class", "boll svelte-quhomu");
    			add_location(div433, file, 89, 264, 13641);
    			attr_dev(div434, "class", "bollröd svelte-quhomu");
    			set_style(div434, "animation-delay", "2000ms");
    			add_location(div434, file, 89, 288, 13665);
    			attr_dev(div435, "class", "boll svelte-quhomu");
    			add_location(div435, file, 89, 346, 13723);
    			attr_dev(div436, "class", "boll svelte-quhomu");
    			add_location(div436, file, 89, 370, 13747);
    			attr_dev(div437, "class", "boll svelte-quhomu");
    			add_location(div437, file, 89, 394, 13771);
    			attr_dev(div438, "class", "boll svelte-quhomu");
    			add_location(div438, file, 89, 418, 13795);
    			attr_dev(div439, "class", "boll svelte-quhomu");
    			add_location(div439, file, 89, 442, 13819);
    			attr_dev(div440, "class", "boll svelte-quhomu");
    			add_location(div440, file, 89, 466, 13843);
    			attr_dev(div441, "class", "boll svelte-quhomu");
    			add_location(div441, file, 89, 490, 13867);
    			attr_dev(div442, "class", "row21 svelte-quhomu");
    			add_location(div442, file, 88, 1, 13357);
    			attr_dev(div443, "class", "boll svelte-quhomu");
    			add_location(div443, file, 92, 0, 13929);
    			attr_dev(div444, "class", "boll svelte-quhomu");
    			add_location(div444, file, 92, 24, 13953);
    			attr_dev(div445, "class", "boll svelte-quhomu");
    			add_location(div445, file, 92, 48, 13977);
    			attr_dev(div446, "class", "boll svelte-quhomu");
    			add_location(div446, file, 92, 72, 14001);
    			attr_dev(div447, "class", "boll svelte-quhomu");
    			add_location(div447, file, 92, 96, 14025);
    			attr_dev(div448, "class", "boll svelte-quhomu");
    			add_location(div448, file, 92, 120, 14049);
    			attr_dev(div449, "class", "boll svelte-quhomu");
    			add_location(div449, file, 92, 144, 14073);
    			attr_dev(div450, "class", "boll svelte-quhomu");
    			add_location(div450, file, 92, 168, 14097);
    			attr_dev(div451, "class", "boll svelte-quhomu");
    			add_location(div451, file, 92, 192, 14121);
    			attr_dev(div452, "class", "boll svelte-quhomu");
    			add_location(div452, file, 92, 216, 14145);
    			attr_dev(div453, "class", "boll svelte-quhomu");
    			add_location(div453, file, 92, 240, 14169);
    			attr_dev(div454, "class", "boll svelte-quhomu");
    			add_location(div454, file, 92, 264, 14193);
    			attr_dev(div455, "class", "bollröd svelte-quhomu");
    			set_style(div455, "animation-delay", "2050ms");
    			add_location(div455, file, 92, 288, 14217);
    			attr_dev(div456, "class", "boll svelte-quhomu");
    			add_location(div456, file, 92, 346, 14275);
    			attr_dev(div457, "class", "boll svelte-quhomu");
    			add_location(div457, file, 92, 370, 14299);
    			attr_dev(div458, "class", "boll svelte-quhomu");
    			add_location(div458, file, 92, 394, 14323);
    			attr_dev(div459, "class", "boll svelte-quhomu");
    			add_location(div459, file, 92, 418, 14347);
    			attr_dev(div460, "class", "boll svelte-quhomu");
    			add_location(div460, file, 92, 442, 14371);
    			attr_dev(div461, "class", "boll svelte-quhomu");
    			add_location(div461, file, 92, 466, 14395);
    			attr_dev(div462, "class", "boll svelte-quhomu");
    			add_location(div462, file, 92, 490, 14419);
    			attr_dev(div463, "class", "row22 svelte-quhomu");
    			add_location(div463, file, 91, 1, 13909);
    			attr_dev(div464, "class", "boll svelte-quhomu");
    			add_location(div464, file, 95, 0, 14481);
    			attr_dev(div465, "class", "boll svelte-quhomu");
    			add_location(div465, file, 95, 24, 14505);
    			attr_dev(div466, "class", "boll svelte-quhomu");
    			add_location(div466, file, 95, 48, 14529);
    			attr_dev(div467, "class", "boll svelte-quhomu");
    			add_location(div467, file, 95, 72, 14553);
    			attr_dev(div468, "class", "boll svelte-quhomu");
    			add_location(div468, file, 95, 96, 14577);
    			attr_dev(div469, "class", "boll svelte-quhomu");
    			add_location(div469, file, 95, 120, 14601);
    			attr_dev(div470, "class", "boll svelte-quhomu");
    			add_location(div470, file, 95, 144, 14625);
    			attr_dev(div471, "class", "boll svelte-quhomu");
    			add_location(div471, file, 95, 168, 14649);
    			attr_dev(div472, "class", "boll svelte-quhomu");
    			add_location(div472, file, 95, 192, 14673);
    			attr_dev(div473, "class", "bollröd svelte-quhomu");
    			set_style(div473, "animation-delay", "2100ms");
    			add_location(div473, file, 95, 216, 14697);
    			attr_dev(div474, "class", "bollröd svelte-quhomu");
    			set_style(div474, "animation-delay", "2100ms");
    			add_location(div474, file, 95, 274, 14755);
    			attr_dev(div475, "class", "bollröd svelte-quhomu");
    			set_style(div475, "animation-delay", "2100ms");
    			add_location(div475, file, 95, 332, 14813);
    			attr_dev(div476, "class", "bollröd svelte-quhomu");
    			set_style(div476, "animation-delay", "2100ms");
    			add_location(div476, file, 95, 390, 14871);
    			attr_dev(div477, "class", "bollröd svelte-quhomu");
    			set_style(div477, "animation-delay", "2100ms");
    			add_location(div477, file, 95, 448, 14929);
    			attr_dev(div478, "class", "bollröd svelte-quhomu");
    			set_style(div478, "animation-delay", "2100ms");
    			add_location(div478, file, 95, 506, 14987);
    			attr_dev(div479, "class", "bollröd svelte-quhomu");
    			set_style(div479, "animation-delay", "2100ms");
    			add_location(div479, file, 95, 564, 15045);
    			attr_dev(div480, "class", "boll svelte-quhomu");
    			add_location(div480, file, 95, 622, 15103);
    			attr_dev(div481, "class", "boll svelte-quhomu");
    			add_location(div481, file, 95, 646, 15127);
    			attr_dev(div482, "class", "boll svelte-quhomu");
    			add_location(div482, file, 95, 670, 15151);
    			attr_dev(div483, "class", "boll svelte-quhomu");
    			add_location(div483, file, 95, 694, 15175);
    			attr_dev(div484, "class", "row23 svelte-quhomu");
    			add_location(div484, file, 94, 1, 14461);
    			attr_dev(div485, "class", "boll svelte-quhomu");
    			add_location(div485, file, 98, 0, 15237);
    			attr_dev(div486, "class", "boll svelte-quhomu");
    			add_location(div486, file, 98, 24, 15261);
    			attr_dev(div487, "class", "boll svelte-quhomu");
    			add_location(div487, file, 98, 48, 15285);
    			attr_dev(div488, "class", "boll svelte-quhomu");
    			add_location(div488, file, 98, 72, 15309);
    			attr_dev(div489, "class", "boll svelte-quhomu");
    			add_location(div489, file, 98, 96, 15333);
    			attr_dev(div490, "class", "boll svelte-quhomu");
    			add_location(div490, file, 98, 120, 15357);
    			attr_dev(div491, "class", "boll svelte-quhomu");
    			add_location(div491, file, 98, 144, 15381);
    			attr_dev(div492, "class", "boll svelte-quhomu");
    			add_location(div492, file, 98, 168, 15405);
    			attr_dev(div493, "class", "boll svelte-quhomu");
    			add_location(div493, file, 98, 192, 15429);
    			attr_dev(div494, "class", "boll svelte-quhomu");
    			add_location(div494, file, 98, 216, 15453);
    			attr_dev(div495, "class", "boll svelte-quhomu");
    			add_location(div495, file, 98, 240, 15477);
    			attr_dev(div496, "class", "boll svelte-quhomu");
    			add_location(div496, file, 98, 264, 15501);
    			attr_dev(div497, "class", "boll svelte-quhomu");
    			add_location(div497, file, 98, 288, 15525);
    			attr_dev(div498, "class", "boll svelte-quhomu");
    			add_location(div498, file, 98, 312, 15549);
    			attr_dev(div499, "class", "boll svelte-quhomu");
    			add_location(div499, file, 98, 336, 15573);
    			attr_dev(div500, "class", "boll svelte-quhomu");
    			add_location(div500, file, 98, 360, 15597);
    			attr_dev(div501, "class", "boll svelte-quhomu");
    			add_location(div501, file, 98, 384, 15621);
    			attr_dev(div502, "class", "boll svelte-quhomu");
    			add_location(div502, file, 98, 408, 15645);
    			attr_dev(div503, "class", "boll svelte-quhomu");
    			add_location(div503, file, 98, 432, 15669);
    			attr_dev(div504, "class", "boll svelte-quhomu");
    			add_location(div504, file, 98, 456, 15693);
    			attr_dev(div505, "class", "row24 svelte-quhomu");
    			add_location(div505, file, 97, 1, 15217);
    			attr_dev(div506, "class", "boll svelte-quhomu");
    			add_location(div506, file, 101, 0, 15755);
    			attr_dev(div507, "class", "boll svelte-quhomu");
    			add_location(div507, file, 101, 24, 15779);
    			attr_dev(div508, "class", "boll svelte-quhomu");
    			add_location(div508, file, 101, 48, 15803);
    			attr_dev(div509, "class", "boll svelte-quhomu");
    			add_location(div509, file, 101, 72, 15827);
    			attr_dev(div510, "class", "boll svelte-quhomu");
    			add_location(div510, file, 101, 96, 15851);
    			attr_dev(div511, "class", "boll svelte-quhomu");
    			add_location(div511, file, 101, 120, 15875);
    			attr_dev(div512, "class", "boll svelte-quhomu");
    			add_location(div512, file, 101, 144, 15899);
    			attr_dev(div513, "class", "boll svelte-quhomu");
    			add_location(div513, file, 101, 168, 15923);
    			attr_dev(div514, "class", "boll svelte-quhomu");
    			add_location(div514, file, 101, 192, 15947);
    			attr_dev(div515, "class", "bollröd svelte-quhomu");
    			set_style(div515, "animation-delay", "2200ms");
    			add_location(div515, file, 101, 216, 15971);
    			attr_dev(div516, "class", "boll svelte-quhomu");
    			add_location(div516, file, 101, 274, 16029);
    			attr_dev(div517, "class", "bollröd svelte-quhomu");
    			set_style(div517, "animation-delay", "2200ms");
    			add_location(div517, file, 101, 298, 16053);
    			attr_dev(div518, "class", "bollröd svelte-quhomu");
    			set_style(div518, "animation-delay", "2200ms");
    			add_location(div518, file, 101, 356, 16111);
    			attr_dev(div519, "class", "bollröd svelte-quhomu");
    			set_style(div519, "animation-delay", "2200ms");
    			add_location(div519, file, 101, 414, 16169);
    			attr_dev(div520, "class", "bollröd svelte-quhomu");
    			set_style(div520, "animation-delay", "2200ms");
    			add_location(div520, file, 101, 472, 16227);
    			attr_dev(div521, "class", "bollröd svelte-quhomu");
    			set_style(div521, "animation-delay", "2200ms");
    			add_location(div521, file, 101, 530, 16285);
    			attr_dev(div522, "class", "boll svelte-quhomu");
    			add_location(div522, file, 101, 588, 16343);
    			attr_dev(div523, "class", "boll svelte-quhomu");
    			add_location(div523, file, 101, 612, 16367);
    			attr_dev(div524, "class", "boll svelte-quhomu");
    			add_location(div524, file, 101, 636, 16391);
    			attr_dev(div525, "class", "boll svelte-quhomu");
    			add_location(div525, file, 101, 660, 16415);
    			attr_dev(div526, "class", "row25 svelte-quhomu");
    			add_location(div526, file, 100, 1, 15735);
    			attr_dev(div527, "class", "boll svelte-quhomu");
    			add_location(div527, file, 104, 0, 16477);
    			attr_dev(div528, "class", "boll svelte-quhomu");
    			add_location(div528, file, 104, 24, 16501);
    			attr_dev(div529, "class", "boll svelte-quhomu");
    			add_location(div529, file, 104, 48, 16525);
    			attr_dev(div530, "class", "boll svelte-quhomu");
    			add_location(div530, file, 104, 72, 16549);
    			attr_dev(div531, "class", "boll svelte-quhomu");
    			add_location(div531, file, 104, 96, 16573);
    			attr_dev(div532, "class", "boll svelte-quhomu");
    			add_location(div532, file, 104, 120, 16597);
    			attr_dev(div533, "class", "boll svelte-quhomu");
    			add_location(div533, file, 104, 144, 16621);
    			attr_dev(div534, "class", "boll svelte-quhomu");
    			add_location(div534, file, 104, 168, 16645);
    			attr_dev(div535, "class", "boll svelte-quhomu");
    			add_location(div535, file, 104, 192, 16669);
    			attr_dev(div536, "class", "boll svelte-quhomu");
    			add_location(div536, file, 104, 216, 16693);
    			attr_dev(div537, "class", "boll svelte-quhomu");
    			add_location(div537, file, 104, 240, 16717);
    			attr_dev(div538, "class", "boll svelte-quhomu");
    			add_location(div538, file, 104, 264, 16741);
    			attr_dev(div539, "class", "boll svelte-quhomu");
    			add_location(div539, file, 104, 288, 16765);
    			attr_dev(div540, "class", "boll svelte-quhomu");
    			add_location(div540, file, 104, 312, 16789);
    			attr_dev(div541, "class", "boll svelte-quhomu");
    			add_location(div541, file, 104, 336, 16813);
    			attr_dev(div542, "class", "boll svelte-quhomu");
    			add_location(div542, file, 104, 360, 16837);
    			attr_dev(div543, "class", "boll svelte-quhomu");
    			add_location(div543, file, 104, 384, 16861);
    			attr_dev(div544, "class", "boll svelte-quhomu");
    			add_location(div544, file, 104, 408, 16885);
    			attr_dev(div545, "class", "boll svelte-quhomu");
    			add_location(div545, file, 104, 432, 16909);
    			attr_dev(div546, "class", "boll svelte-quhomu");
    			add_location(div546, file, 104, 456, 16933);
    			attr_dev(div547, "class", "row26 svelte-quhomu");
    			add_location(div547, file, 103, 1, 16457);
    			attr_dev(div548, "class", "boll svelte-quhomu");
    			add_location(div548, file, 107, 0, 16995);
    			attr_dev(div549, "class", "boll svelte-quhomu");
    			add_location(div549, file, 107, 24, 17019);
    			attr_dev(div550, "class", "boll svelte-quhomu");
    			add_location(div550, file, 107, 48, 17043);
    			attr_dev(div551, "class", "boll svelte-quhomu");
    			add_location(div551, file, 107, 72, 17067);
    			attr_dev(div552, "class", "boll svelte-quhomu");
    			add_location(div552, file, 107, 96, 17091);
    			attr_dev(div553, "class", "boll svelte-quhomu");
    			add_location(div553, file, 107, 120, 17115);
    			attr_dev(div554, "class", "boll svelte-quhomu");
    			add_location(div554, file, 107, 144, 17139);
    			attr_dev(div555, "class", "boll svelte-quhomu");
    			add_location(div555, file, 107, 168, 17163);
    			attr_dev(div556, "class", "boll svelte-quhomu");
    			add_location(div556, file, 107, 192, 17187);
    			attr_dev(div557, "class", "boll svelte-quhomu");
    			add_location(div557, file, 107, 216, 17211);
    			attr_dev(div558, "class", "boll svelte-quhomu");
    			add_location(div558, file, 107, 240, 17235);
    			attr_dev(div559, "class", "bollröd svelte-quhomu");
    			set_style(div559, "animation-delay", "2300ms");
    			add_location(div559, file, 107, 264, 17259);
    			attr_dev(div560, "class", "bollröd svelte-quhomu");
    			set_style(div560, "animation-delay", "2300ms");
    			add_location(div560, file, 107, 322, 17317);
    			attr_dev(div561, "class", "bollröd svelte-quhomu");
    			set_style(div561, "animation-delay", "2300ms");
    			add_location(div561, file, 107, 380, 17375);
    			attr_dev(div562, "class", "bollröd svelte-quhomu");
    			set_style(div562, "animation-delay", "2300ms");
    			add_location(div562, file, 107, 438, 17433);
    			attr_dev(div563, "class", "bollröd svelte-quhomu");
    			set_style(div563, "animation-delay", "2300ms");
    			add_location(div563, file, 107, 496, 17491);
    			attr_dev(div564, "class", "boll svelte-quhomu");
    			add_location(div564, file, 107, 554, 17549);
    			attr_dev(div565, "class", "boll svelte-quhomu");
    			add_location(div565, file, 107, 578, 17573);
    			attr_dev(div566, "class", "boll svelte-quhomu");
    			add_location(div566, file, 107, 602, 17597);
    			attr_dev(div567, "class", "boll svelte-quhomu");
    			add_location(div567, file, 107, 626, 17621);
    			attr_dev(div568, "class", "row27 svelte-quhomu");
    			add_location(div568, file, 106, 1, 16975);
    			attr_dev(div569, "class", "boll svelte-quhomu");
    			add_location(div569, file, 110, 0, 17683);
    			attr_dev(div570, "class", "boll svelte-quhomu");
    			add_location(div570, file, 110, 24, 17707);
    			attr_dev(div571, "class", "boll svelte-quhomu");
    			add_location(div571, file, 110, 48, 17731);
    			attr_dev(div572, "class", "boll svelte-quhomu");
    			add_location(div572, file, 110, 72, 17755);
    			attr_dev(div573, "class", "boll svelte-quhomu");
    			add_location(div573, file, 110, 96, 17779);
    			attr_dev(div574, "class", "boll svelte-quhomu");
    			add_location(div574, file, 110, 120, 17803);
    			attr_dev(div575, "class", "boll svelte-quhomu");
    			add_location(div575, file, 110, 144, 17827);
    			attr_dev(div576, "class", "boll svelte-quhomu");
    			add_location(div576, file, 110, 168, 17851);
    			attr_dev(div577, "class", "boll svelte-quhomu");
    			add_location(div577, file, 110, 192, 17875);
    			attr_dev(div578, "class", "boll svelte-quhomu");
    			add_location(div578, file, 110, 216, 17899);
    			attr_dev(div579, "class", "boll svelte-quhomu");
    			add_location(div579, file, 110, 240, 17923);
    			attr_dev(div580, "class", "boll svelte-quhomu");
    			add_location(div580, file, 110, 264, 17947);
    			attr_dev(div581, "class", "bollröd svelte-quhomu");
    			set_style(div581, "animation-delay", "2350ms");
    			add_location(div581, file, 110, 288, 17971);
    			attr_dev(div582, "class", "boll svelte-quhomu");
    			add_location(div582, file, 110, 346, 18029);
    			attr_dev(div583, "class", "boll svelte-quhomu");
    			add_location(div583, file, 110, 370, 18053);
    			attr_dev(div584, "class", "boll svelte-quhomu");
    			add_location(div584, file, 110, 394, 18077);
    			attr_dev(div585, "class", "boll svelte-quhomu");
    			add_location(div585, file, 110, 418, 18101);
    			attr_dev(div586, "class", "boll svelte-quhomu");
    			add_location(div586, file, 110, 442, 18125);
    			attr_dev(div587, "class", "boll svelte-quhomu");
    			add_location(div587, file, 110, 466, 18149);
    			attr_dev(div588, "class", "boll svelte-quhomu");
    			add_location(div588, file, 110, 490, 18173);
    			attr_dev(div589, "class", "row28 svelte-quhomu");
    			add_location(div589, file, 109, 1, 17663);
    			attr_dev(div590, "class", "boll svelte-quhomu");
    			add_location(div590, file, 113, 0, 18235);
    			attr_dev(div591, "class", "boll svelte-quhomu");
    			add_location(div591, file, 113, 24, 18259);
    			attr_dev(div592, "class", "boll svelte-quhomu");
    			add_location(div592, file, 113, 48, 18283);
    			attr_dev(div593, "class", "boll svelte-quhomu");
    			add_location(div593, file, 113, 72, 18307);
    			attr_dev(div594, "class", "boll svelte-quhomu");
    			add_location(div594, file, 113, 96, 18331);
    			attr_dev(div595, "class", "boll svelte-quhomu");
    			add_location(div595, file, 113, 120, 18355);
    			attr_dev(div596, "class", "boll svelte-quhomu");
    			add_location(div596, file, 113, 144, 18379);
    			attr_dev(div597, "class", "boll svelte-quhomu");
    			add_location(div597, file, 113, 168, 18403);
    			attr_dev(div598, "class", "boll svelte-quhomu");
    			add_location(div598, file, 113, 192, 18427);
    			attr_dev(div599, "class", "boll svelte-quhomu");
    			add_location(div599, file, 113, 216, 18451);
    			attr_dev(div600, "class", "boll svelte-quhomu");
    			add_location(div600, file, 113, 240, 18475);
    			attr_dev(div601, "class", "boll svelte-quhomu");
    			add_location(div601, file, 113, 264, 18499);
    			attr_dev(div602, "class", "boll svelte-quhomu");
    			add_location(div602, file, 113, 288, 18523);
    			attr_dev(div603, "class", "bollröd svelte-quhomu");
    			set_style(div603, "animation-delay", "2400ms");
    			add_location(div603, file, 113, 312, 18547);
    			attr_dev(div604, "class", "boll svelte-quhomu");
    			add_location(div604, file, 113, 370, 18605);
    			attr_dev(div605, "class", "boll svelte-quhomu");
    			add_location(div605, file, 113, 394, 18629);
    			attr_dev(div606, "class", "boll svelte-quhomu");
    			add_location(div606, file, 113, 418, 18653);
    			attr_dev(div607, "class", "boll svelte-quhomu");
    			add_location(div607, file, 113, 442, 18677);
    			attr_dev(div608, "class", "boll svelte-quhomu");
    			add_location(div608, file, 113, 466, 18701);
    			attr_dev(div609, "class", "boll svelte-quhomu");
    			add_location(div609, file, 113, 490, 18725);
    			attr_dev(div610, "class", "row29 svelte-quhomu");
    			add_location(div610, file, 112, 1, 18215);
    			attr_dev(div611, "class", "boll svelte-quhomu");
    			add_location(div611, file, 116, 0, 18787);
    			attr_dev(div612, "class", "boll svelte-quhomu");
    			add_location(div612, file, 116, 24, 18811);
    			attr_dev(div613, "class", "boll svelte-quhomu");
    			add_location(div613, file, 116, 48, 18835);
    			attr_dev(div614, "class", "boll svelte-quhomu");
    			add_location(div614, file, 116, 72, 18859);
    			attr_dev(div615, "class", "boll svelte-quhomu");
    			add_location(div615, file, 116, 96, 18883);
    			attr_dev(div616, "class", "boll svelte-quhomu");
    			add_location(div616, file, 116, 120, 18907);
    			attr_dev(div617, "class", "boll svelte-quhomu");
    			add_location(div617, file, 116, 144, 18931);
    			attr_dev(div618, "class", "boll svelte-quhomu");
    			add_location(div618, file, 116, 168, 18955);
    			attr_dev(div619, "class", "boll svelte-quhomu");
    			add_location(div619, file, 116, 192, 18979);
    			attr_dev(div620, "class", "boll svelte-quhomu");
    			add_location(div620, file, 116, 216, 19003);
    			attr_dev(div621, "class", "boll svelte-quhomu");
    			add_location(div621, file, 116, 240, 19027);
    			attr_dev(div622, "class", "bollröd svelte-quhomu");
    			set_style(div622, "animation-delay", "2450ms");
    			add_location(div622, file, 116, 264, 19051);
    			attr_dev(div623, "class", "bollröd svelte-quhomu");
    			set_style(div623, "animation-delay", "2450ms");
    			add_location(div623, file, 116, 322, 19109);
    			attr_dev(div624, "class", "bollröd svelte-quhomu");
    			set_style(div624, "animation-delay", "2450ms");
    			add_location(div624, file, 116, 380, 19167);
    			attr_dev(div625, "class", "bollröd svelte-quhomu");
    			set_style(div625, "animation-delay", "2450ms");
    			add_location(div625, file, 116, 438, 19225);
    			attr_dev(div626, "class", "bollröd svelte-quhomu");
    			set_style(div626, "animation-delay", "2450ms");
    			add_location(div626, file, 116, 496, 19283);
    			attr_dev(div627, "class", "boll svelte-quhomu");
    			add_location(div627, file, 116, 554, 19341);
    			attr_dev(div628, "class", "boll svelte-quhomu");
    			add_location(div628, file, 116, 578, 19365);
    			attr_dev(div629, "class", "boll svelte-quhomu");
    			add_location(div629, file, 116, 602, 19389);
    			attr_dev(div630, "class", "boll svelte-quhomu");
    			add_location(div630, file, 116, 626, 19413);
    			attr_dev(div631, "class", "row30 svelte-quhomu");
    			add_location(div631, file, 115, 1, 18767);
    			attr_dev(div632, "class", "boll svelte-quhomu");
    			add_location(div632, file, 119, 0, 19475);
    			attr_dev(div633, "class", "boll svelte-quhomu");
    			add_location(div633, file, 119, 24, 19499);
    			attr_dev(div634, "class", "boll svelte-quhomu");
    			add_location(div634, file, 119, 48, 19523);
    			attr_dev(div635, "class", "boll svelte-quhomu");
    			add_location(div635, file, 119, 72, 19547);
    			attr_dev(div636, "class", "boll svelte-quhomu");
    			add_location(div636, file, 119, 96, 19571);
    			attr_dev(div637, "class", "boll svelte-quhomu");
    			add_location(div637, file, 119, 120, 19595);
    			attr_dev(div638, "class", "boll svelte-quhomu");
    			add_location(div638, file, 119, 144, 19619);
    			attr_dev(div639, "class", "boll svelte-quhomu");
    			add_location(div639, file, 119, 168, 19643);
    			attr_dev(div640, "class", "boll svelte-quhomu");
    			add_location(div640, file, 119, 192, 19667);
    			attr_dev(div641, "class", "boll svelte-quhomu");
    			add_location(div641, file, 119, 216, 19691);
    			attr_dev(div642, "class", "boll svelte-quhomu");
    			add_location(div642, file, 119, 240, 19715);
    			attr_dev(div643, "class", "boll svelte-quhomu");
    			add_location(div643, file, 119, 264, 19739);
    			attr_dev(div644, "class", "boll svelte-quhomu");
    			add_location(div644, file, 119, 288, 19763);
    			attr_dev(div645, "class", "boll svelte-quhomu");
    			add_location(div645, file, 119, 312, 19787);
    			attr_dev(div646, "class", "boll svelte-quhomu");
    			add_location(div646, file, 119, 336, 19811);
    			attr_dev(div647, "class", "boll svelte-quhomu");
    			add_location(div647, file, 119, 360, 19835);
    			attr_dev(div648, "class", "boll svelte-quhomu");
    			add_location(div648, file, 119, 384, 19859);
    			attr_dev(div649, "class", "boll svelte-quhomu");
    			add_location(div649, file, 119, 408, 19883);
    			attr_dev(div650, "class", "boll svelte-quhomu");
    			add_location(div650, file, 119, 432, 19907);
    			attr_dev(div651, "class", "boll svelte-quhomu");
    			add_location(div651, file, 119, 456, 19931);
    			attr_dev(div652, "class", "row31 svelte-quhomu");
    			add_location(div652, file, 118, 1, 19455);
    			attr_dev(div653, "class", "boll svelte-quhomu");
    			add_location(div653, file, 122, 0, 19993);
    			attr_dev(div654, "class", "boll svelte-quhomu");
    			add_location(div654, file, 122, 24, 20017);
    			attr_dev(div655, "class", "boll svelte-quhomu");
    			add_location(div655, file, 122, 48, 20041);
    			attr_dev(div656, "class", "boll svelte-quhomu");
    			add_location(div656, file, 122, 72, 20065);
    			attr_dev(div657, "class", "boll svelte-quhomu");
    			add_location(div657, file, 122, 96, 20089);
    			attr_dev(div658, "class", "boll svelte-quhomu");
    			add_location(div658, file, 122, 120, 20113);
    			attr_dev(div659, "class", "boll svelte-quhomu");
    			add_location(div659, file, 122, 144, 20137);
    			attr_dev(div660, "class", "boll svelte-quhomu");
    			add_location(div660, file, 122, 168, 20161);
    			attr_dev(div661, "class", "boll svelte-quhomu");
    			add_location(div661, file, 122, 192, 20185);
    			attr_dev(div662, "class", "bollröd svelte-quhomu");
    			set_style(div662, "animation-delay", "2550ms");
    			add_location(div662, file, 122, 216, 20209);
    			attr_dev(div663, "class", "bollröd svelte-quhomu");
    			set_style(div663, "animation-delay", "2550ms");
    			add_location(div663, file, 122, 274, 20267);
    			attr_dev(div664, "class", "bollröd svelte-quhomu");
    			set_style(div664, "animation-delay", "2550ms");
    			add_location(div664, file, 122, 332, 20325);
    			attr_dev(div665, "class", "bollröd svelte-quhomu");
    			set_style(div665, "animation-delay", "2550ms");
    			add_location(div665, file, 122, 390, 20383);
    			attr_dev(div666, "class", "bollröd svelte-quhomu");
    			set_style(div666, "animation-delay", "2550ms");
    			add_location(div666, file, 122, 448, 20441);
    			attr_dev(div667, "class", "bollröd svelte-quhomu");
    			set_style(div667, "animation-delay", "2550ms");
    			add_location(div667, file, 122, 506, 20499);
    			attr_dev(div668, "class", "bollröd svelte-quhomu");
    			set_style(div668, "animation-delay", "2550ms");
    			add_location(div668, file, 122, 564, 20557);
    			attr_dev(div669, "class", "boll svelte-quhomu");
    			add_location(div669, file, 122, 622, 20615);
    			attr_dev(div670, "class", "boll svelte-quhomu");
    			add_location(div670, file, 122, 646, 20639);
    			attr_dev(div671, "class", "boll svelte-quhomu");
    			add_location(div671, file, 122, 670, 20663);
    			attr_dev(div672, "class", "boll svelte-quhomu");
    			add_location(div672, file, 122, 694, 20687);
    			attr_dev(div673, "class", "row32 svelte-quhomu");
    			add_location(div673, file, 121, 1, 19973);
    			attr_dev(div674, "class", "boll svelte-quhomu");
    			add_location(div674, file, 126, 0, 20750);
    			attr_dev(div675, "class", "boll svelte-quhomu");
    			add_location(div675, file, 126, 24, 20774);
    			attr_dev(div676, "class", "boll svelte-quhomu");
    			add_location(div676, file, 126, 48, 20798);
    			attr_dev(div677, "class", "boll svelte-quhomu");
    			add_location(div677, file, 126, 72, 20822);
    			attr_dev(div678, "class", "boll svelte-quhomu");
    			add_location(div678, file, 126, 96, 20846);
    			attr_dev(div679, "class", "boll svelte-quhomu");
    			add_location(div679, file, 126, 120, 20870);
    			attr_dev(div680, "class", "boll svelte-quhomu");
    			add_location(div680, file, 126, 144, 20894);
    			attr_dev(div681, "class", "boll svelte-quhomu");
    			add_location(div681, file, 126, 168, 20918);
    			attr_dev(div682, "class", "boll svelte-quhomu");
    			add_location(div682, file, 126, 192, 20942);
    			attr_dev(div683, "class", "bollröd svelte-quhomu");
    			set_style(div683, "animation-delay", "2600ms");
    			add_location(div683, file, 126, 216, 20966);
    			attr_dev(div684, "class", "boll svelte-quhomu");
    			add_location(div684, file, 126, 274, 21024);
    			attr_dev(div685, "class", "boll svelte-quhomu");
    			add_location(div685, file, 126, 298, 21048);
    			attr_dev(div686, "class", "boll svelte-quhomu");
    			add_location(div686, file, 126, 322, 21072);
    			attr_dev(div687, "class", "boll svelte-quhomu");
    			add_location(div687, file, 126, 346, 21096);
    			attr_dev(div688, "class", "boll svelte-quhomu");
    			add_location(div688, file, 126, 370, 21120);
    			attr_dev(div689, "class", "bollröd svelte-quhomu");
    			set_style(div689, "animation-delay", "2600ms");
    			add_location(div689, file, 126, 394, 21144);
    			attr_dev(div690, "class", "boll svelte-quhomu");
    			add_location(div690, file, 126, 452, 21202);
    			attr_dev(div691, "class", "boll svelte-quhomu");
    			add_location(div691, file, 126, 476, 21226);
    			attr_dev(div692, "class", "boll svelte-quhomu");
    			add_location(div692, file, 126, 500, 21250);
    			attr_dev(div693, "class", "boll svelte-quhomu");
    			add_location(div693, file, 126, 524, 21274);
    			attr_dev(div694, "class", "row33 svelte-quhomu");
    			add_location(div694, file, 125, 1, 20730);
    			attr_dev(div695, "class", "boll svelte-quhomu");
    			add_location(div695, file, 130, 0, 21337);
    			attr_dev(div696, "class", "boll svelte-quhomu");
    			add_location(div696, file, 130, 24, 21361);
    			attr_dev(div697, "class", "boll svelte-quhomu");
    			add_location(div697, file, 130, 48, 21385);
    			attr_dev(div698, "class", "boll svelte-quhomu");
    			add_location(div698, file, 130, 72, 21409);
    			attr_dev(div699, "class", "boll svelte-quhomu");
    			add_location(div699, file, 130, 96, 21433);
    			attr_dev(div700, "class", "boll svelte-quhomu");
    			add_location(div700, file, 130, 120, 21457);
    			attr_dev(div701, "class", "boll svelte-quhomu");
    			add_location(div701, file, 130, 144, 21481);
    			attr_dev(div702, "class", "boll svelte-quhomu");
    			add_location(div702, file, 130, 168, 21505);
    			attr_dev(div703, "class", "boll svelte-quhomu");
    			add_location(div703, file, 130, 192, 21529);
    			attr_dev(div704, "class", "bollröd svelte-quhomu");
    			set_style(div704, "animation-delay", "2650ms");
    			add_location(div704, file, 130, 216, 21553);
    			attr_dev(div705, "class", "boll svelte-quhomu");
    			add_location(div705, file, 130, 274, 21611);
    			attr_dev(div706, "class", "boll svelte-quhomu");
    			add_location(div706, file, 130, 298, 21635);
    			attr_dev(div707, "class", "bollröd svelte-quhomu");
    			set_style(div707, "animation-delay", "2650ms");
    			add_location(div707, file, 130, 322, 21659);
    			attr_dev(div708, "class", "boll svelte-quhomu");
    			add_location(div708, file, 130, 380, 21717);
    			attr_dev(div709, "class", "boll svelte-quhomu");
    			add_location(div709, file, 130, 404, 21741);
    			attr_dev(div710, "class", "bollröd svelte-quhomu");
    			set_style(div710, "animation-delay", "2650ms");
    			add_location(div710, file, 130, 428, 21765);
    			attr_dev(div711, "class", "boll svelte-quhomu");
    			add_location(div711, file, 130, 486, 21823);
    			attr_dev(div712, "class", "boll svelte-quhomu");
    			add_location(div712, file, 130, 510, 21847);
    			attr_dev(div713, "class", "boll svelte-quhomu");
    			add_location(div713, file, 130, 534, 21871);
    			attr_dev(div714, "class", "boll svelte-quhomu");
    			add_location(div714, file, 130, 558, 21895);
    			attr_dev(div715, "class", "row34 svelte-quhomu");
    			add_location(div715, file, 129, 1, 21317);
    			attr_dev(div716, "class", "boll svelte-quhomu");
    			add_location(div716, file, 134, 0, 21958);
    			attr_dev(div717, "class", "boll svelte-quhomu");
    			add_location(div717, file, 134, 24, 21982);
    			attr_dev(div718, "class", "boll svelte-quhomu");
    			add_location(div718, file, 134, 48, 22006);
    			attr_dev(div719, "class", "boll svelte-quhomu");
    			add_location(div719, file, 134, 72, 22030);
    			attr_dev(div720, "class", "boll svelte-quhomu");
    			add_location(div720, file, 134, 96, 22054);
    			attr_dev(div721, "class", "boll svelte-quhomu");
    			add_location(div721, file, 134, 120, 22078);
    			attr_dev(div722, "class", "boll svelte-quhomu");
    			add_location(div722, file, 134, 144, 22102);
    			attr_dev(div723, "class", "boll svelte-quhomu");
    			add_location(div723, file, 134, 168, 22126);
    			attr_dev(div724, "class", "boll svelte-quhomu");
    			add_location(div724, file, 134, 192, 22150);
    			attr_dev(div725, "class", "bollröd svelte-quhomu");
    			set_style(div725, "animation-delay", "2700ms");
    			add_location(div725, file, 134, 216, 22174);
    			attr_dev(div726, "class", "boll svelte-quhomu");
    			add_location(div726, file, 134, 274, 22232);
    			attr_dev(div727, "class", "boll svelte-quhomu");
    			add_location(div727, file, 134, 298, 22256);
    			attr_dev(div728, "class", "bollröd svelte-quhomu");
    			set_style(div728, "animation-delay", "2700ms");
    			add_location(div728, file, 134, 322, 22280);
    			attr_dev(div729, "class", "bollröd svelte-quhomu");
    			set_style(div729, "animation-delay", "2700ms");
    			add_location(div729, file, 134, 380, 22338);
    			attr_dev(div730, "class", "bollröd svelte-quhomu");
    			set_style(div730, "animation-delay", "2700ms");
    			add_location(div730, file, 134, 438, 22396);
    			attr_dev(div731, "class", "bollröd svelte-quhomu");
    			set_style(div731, "animation-delay", "2700ms");
    			add_location(div731, file, 134, 496, 22454);
    			attr_dev(div732, "class", "boll svelte-quhomu");
    			add_location(div732, file, 134, 554, 22512);
    			attr_dev(div733, "class", "boll svelte-quhomu");
    			add_location(div733, file, 134, 578, 22536);
    			attr_dev(div734, "class", "boll svelte-quhomu");
    			add_location(div734, file, 134, 602, 22560);
    			attr_dev(div735, "class", "boll svelte-quhomu");
    			add_location(div735, file, 134, 626, 22584);
    			attr_dev(div736, "class", "row35 svelte-quhomu");
    			add_location(div736, file, 133, 1, 21938);
    			attr_dev(div737, "class", "boll svelte-quhomu");
    			add_location(div737, file, 137, 0, 22646);
    			attr_dev(div738, "class", "boll svelte-quhomu");
    			add_location(div738, file, 137, 24, 22670);
    			attr_dev(div739, "class", "boll svelte-quhomu");
    			add_location(div739, file, 137, 48, 22694);
    			attr_dev(div740, "class", "boll svelte-quhomu");
    			add_location(div740, file, 137, 72, 22718);
    			attr_dev(div741, "class", "boll svelte-quhomu");
    			add_location(div741, file, 137, 96, 22742);
    			attr_dev(div742, "class", "boll svelte-quhomu");
    			add_location(div742, file, 137, 120, 22766);
    			attr_dev(div743, "class", "boll svelte-quhomu");
    			add_location(div743, file, 137, 144, 22790);
    			attr_dev(div744, "class", "boll svelte-quhomu");
    			add_location(div744, file, 137, 168, 22814);
    			attr_dev(div745, "class", "boll svelte-quhomu");
    			add_location(div745, file, 137, 192, 22838);
    			attr_dev(div746, "class", "boll svelte-quhomu");
    			add_location(div746, file, 137, 216, 22862);
    			attr_dev(div747, "class", "boll svelte-quhomu");
    			add_location(div747, file, 137, 240, 22886);
    			attr_dev(div748, "class", "boll svelte-quhomu");
    			add_location(div748, file, 137, 264, 22910);
    			attr_dev(div749, "class", "boll svelte-quhomu");
    			add_location(div749, file, 137, 288, 22934);
    			attr_dev(div750, "class", "boll svelte-quhomu");
    			add_location(div750, file, 137, 312, 22958);
    			attr_dev(div751, "class", "boll svelte-quhomu");
    			add_location(div751, file, 137, 336, 22982);
    			attr_dev(div752, "class", "boll svelte-quhomu");
    			add_location(div752, file, 137, 360, 23006);
    			attr_dev(div753, "class", "boll svelte-quhomu");
    			add_location(div753, file, 137, 384, 23030);
    			attr_dev(div754, "class", "boll svelte-quhomu");
    			add_location(div754, file, 137, 408, 23054);
    			attr_dev(div755, "class", "boll svelte-quhomu");
    			add_location(div755, file, 137, 432, 23078);
    			attr_dev(div756, "class", "boll svelte-quhomu");
    			add_location(div756, file, 137, 456, 23102);
    			attr_dev(div757, "class", "row36 svelte-quhomu");
    			add_location(div757, file, 136, 1, 22626);
    			attr_dev(div758, "class", "boll svelte-quhomu");
    			add_location(div758, file, 140, 0, 23164);
    			attr_dev(div759, "class", "boll svelte-quhomu");
    			add_location(div759, file, 140, 24, 23188);
    			attr_dev(div760, "class", "boll svelte-quhomu");
    			add_location(div760, file, 140, 48, 23212);
    			attr_dev(div761, "class", "boll svelte-quhomu");
    			add_location(div761, file, 140, 72, 23236);
    			attr_dev(div762, "class", "boll svelte-quhomu");
    			add_location(div762, file, 140, 96, 23260);
    			attr_dev(div763, "class", "boll svelte-quhomu");
    			add_location(div763, file, 140, 120, 23284);
    			attr_dev(div764, "class", "boll svelte-quhomu");
    			add_location(div764, file, 140, 144, 23308);
    			attr_dev(div765, "class", "boll svelte-quhomu");
    			add_location(div765, file, 140, 168, 23332);
    			attr_dev(div766, "class", "boll svelte-quhomu");
    			add_location(div766, file, 140, 192, 23356);
    			attr_dev(div767, "class", "boll svelte-quhomu");
    			add_location(div767, file, 140, 216, 23380);
    			attr_dev(div768, "class", "boll svelte-quhomu");
    			add_location(div768, file, 140, 240, 23404);
    			attr_dev(div769, "class", "boll svelte-quhomu");
    			add_location(div769, file, 140, 264, 23428);
    			attr_dev(div770, "class", "boll svelte-quhomu");
    			add_location(div770, file, 140, 288, 23452);
    			attr_dev(div771, "class", "boll svelte-quhomu");
    			add_location(div771, file, 140, 312, 23476);
    			attr_dev(div772, "class", "boll svelte-quhomu");
    			add_location(div772, file, 140, 336, 23500);
    			attr_dev(div773, "class", "bollröd-punkt svelte-quhomu");
    			set_style(div773, "animation-delay", "2800ms");
    			add_location(div773, file, 140, 360, 23524);
    			attr_dev(div774, "class", "boll svelte-quhomu");
    			add_location(div774, file, 140, 424, 23588);
    			attr_dev(div775, "class", "boll svelte-quhomu");
    			add_location(div775, file, 140, 448, 23612);
    			attr_dev(div776, "class", "boll svelte-quhomu");
    			add_location(div776, file, 140, 472, 23636);
    			attr_dev(div777, "class", "boll svelte-quhomu");
    			add_location(div777, file, 140, 496, 23660);
    			attr_dev(div778, "class", "row37 svelte-quhomu");
    			add_location(div778, file, 139, 1, 23144);
    			attr_dev(div779, "class", "boll svelte-quhomu");
    			add_location(div779, file, 143, 0, 23722);
    			attr_dev(div780, "class", "boll svelte-quhomu");
    			add_location(div780, file, 143, 24, 23746);
    			attr_dev(div781, "class", "boll svelte-quhomu");
    			add_location(div781, file, 143, 48, 23770);
    			attr_dev(div782, "class", "boll svelte-quhomu");
    			add_location(div782, file, 143, 72, 23794);
    			attr_dev(div783, "class", "boll svelte-quhomu");
    			add_location(div783, file, 143, 96, 23818);
    			attr_dev(div784, "class", "boll svelte-quhomu");
    			add_location(div784, file, 143, 120, 23842);
    			attr_dev(div785, "class", "boll svelte-quhomu");
    			add_location(div785, file, 143, 144, 23866);
    			attr_dev(div786, "class", "boll svelte-quhomu");
    			add_location(div786, file, 143, 168, 23890);
    			attr_dev(div787, "class", "boll svelte-quhomu");
    			add_location(div787, file, 143, 192, 23914);
    			attr_dev(div788, "class", "boll svelte-quhomu");
    			add_location(div788, file, 143, 216, 23938);
    			attr_dev(div789, "class", "boll svelte-quhomu");
    			add_location(div789, file, 143, 240, 23962);
    			attr_dev(div790, "class", "boll svelte-quhomu");
    			add_location(div790, file, 143, 264, 23986);
    			attr_dev(div791, "class", "boll svelte-quhomu");
    			add_location(div791, file, 143, 288, 24010);
    			attr_dev(div792, "class", "boll svelte-quhomu");
    			add_location(div792, file, 143, 312, 24034);
    			attr_dev(div793, "class", "boll svelte-quhomu");
    			add_location(div793, file, 143, 336, 24058);
    			attr_dev(div794, "class", "boll svelte-quhomu");
    			add_location(div794, file, 143, 360, 24082);
    			attr_dev(div795, "class", "boll svelte-quhomu");
    			add_location(div795, file, 143, 384, 24106);
    			attr_dev(div796, "class", "boll svelte-quhomu");
    			add_location(div796, file, 143, 408, 24130);
    			attr_dev(div797, "class", "boll svelte-quhomu");
    			add_location(div797, file, 143, 432, 24154);
    			attr_dev(div798, "class", "boll svelte-quhomu");
    			add_location(div798, file, 143, 456, 24178);
    			attr_dev(div799, "class", "row38 svelte-quhomu");
    			add_location(div799, file, 142, 1, 23702);
    			attr_dev(div800, "class", "boll svelte-quhomu");
    			add_location(div800, file, 146, 0, 24240);
    			attr_dev(div801, "class", "boll svelte-quhomu");
    			add_location(div801, file, 146, 24, 24264);
    			attr_dev(div802, "class", "boll svelte-quhomu");
    			add_location(div802, file, 146, 48, 24288);
    			attr_dev(div803, "class", "boll svelte-quhomu");
    			add_location(div803, file, 146, 72, 24312);
    			attr_dev(div804, "class", "boll svelte-quhomu");
    			add_location(div804, file, 146, 96, 24336);
    			attr_dev(div805, "class", "boll svelte-quhomu");
    			add_location(div805, file, 146, 120, 24360);
    			attr_dev(div806, "class", "boll svelte-quhomu");
    			add_location(div806, file, 146, 144, 24384);
    			attr_dev(div807, "class", "boll svelte-quhomu");
    			add_location(div807, file, 146, 168, 24408);
    			attr_dev(div808, "class", "boll svelte-quhomu");
    			add_location(div808, file, 146, 192, 24432);
    			attr_dev(div809, "class", "boll svelte-quhomu");
    			add_location(div809, file, 146, 216, 24456);
    			attr_dev(div810, "class", "boll svelte-quhomu");
    			add_location(div810, file, 146, 240, 24480);
    			attr_dev(div811, "class", "boll svelte-quhomu");
    			add_location(div811, file, 146, 264, 24504);
    			attr_dev(div812, "class", "boll svelte-quhomu");
    			add_location(div812, file, 146, 288, 24528);
    			attr_dev(div813, "class", "boll svelte-quhomu");
    			add_location(div813, file, 146, 312, 24552);
    			attr_dev(div814, "class", "boll svelte-quhomu");
    			add_location(div814, file, 146, 336, 24576);
    			attr_dev(div815, "class", "bollröd-punkt svelte-quhomu");
    			set_style(div815, "animation-delay", "2900ms");
    			add_location(div815, file, 146, 360, 24600);
    			attr_dev(div816, "class", "boll svelte-quhomu");
    			add_location(div816, file, 146, 424, 24664);
    			attr_dev(div817, "class", "boll svelte-quhomu");
    			add_location(div817, file, 146, 448, 24688);
    			attr_dev(div818, "class", "boll svelte-quhomu");
    			add_location(div818, file, 146, 472, 24712);
    			attr_dev(div819, "class", "boll svelte-quhomu");
    			add_location(div819, file, 146, 496, 24736);
    			attr_dev(div820, "class", "row39 svelte-quhomu");
    			add_location(div820, file, 145, 1, 24220);
    			attr_dev(div821, "class", "boll svelte-quhomu");
    			add_location(div821, file, 149, 0, 24798);
    			attr_dev(div822, "class", "boll svelte-quhomu");
    			add_location(div822, file, 149, 24, 24822);
    			attr_dev(div823, "class", "boll svelte-quhomu");
    			add_location(div823, file, 149, 48, 24846);
    			attr_dev(div824, "class", "boll svelte-quhomu");
    			add_location(div824, file, 149, 72, 24870);
    			attr_dev(div825, "class", "boll svelte-quhomu");
    			add_location(div825, file, 149, 96, 24894);
    			attr_dev(div826, "class", "boll svelte-quhomu");
    			add_location(div826, file, 149, 120, 24918);
    			attr_dev(div827, "class", "boll svelte-quhomu");
    			add_location(div827, file, 149, 144, 24942);
    			attr_dev(div828, "class", "boll svelte-quhomu");
    			add_location(div828, file, 149, 168, 24966);
    			attr_dev(div829, "class", "boll svelte-quhomu");
    			add_location(div829, file, 149, 192, 24990);
    			attr_dev(div830, "class", "boll svelte-quhomu");
    			add_location(div830, file, 149, 216, 25014);
    			attr_dev(div831, "class", "boll svelte-quhomu");
    			add_location(div831, file, 149, 240, 25038);
    			attr_dev(div832, "class", "boll svelte-quhomu");
    			add_location(div832, file, 149, 264, 25062);
    			attr_dev(div833, "class", "boll svelte-quhomu");
    			add_location(div833, file, 149, 288, 25086);
    			attr_dev(div834, "class", "boll svelte-quhomu");
    			add_location(div834, file, 149, 312, 25110);
    			attr_dev(div835, "class", "boll svelte-quhomu");
    			add_location(div835, file, 149, 336, 25134);
    			attr_dev(div836, "class", "boll svelte-quhomu");
    			add_location(div836, file, 149, 360, 25158);
    			attr_dev(div837, "class", "boll svelte-quhomu");
    			add_location(div837, file, 149, 384, 25182);
    			attr_dev(div838, "class", "boll svelte-quhomu");
    			add_location(div838, file, 149, 408, 25206);
    			attr_dev(div839, "class", "boll svelte-quhomu");
    			add_location(div839, file, 149, 432, 25230);
    			attr_dev(div840, "class", "boll svelte-quhomu");
    			add_location(div840, file, 149, 456, 25254);
    			attr_dev(div841, "class", "row40 svelte-quhomu");
    			add_location(div841, file, 148, 1, 24778);
    			attr_dev(div842, "class", "boll svelte-quhomu");
    			add_location(div842, file, 152, 0, 25316);
    			attr_dev(div843, "class", "boll svelte-quhomu");
    			add_location(div843, file, 152, 24, 25340);
    			attr_dev(div844, "class", "boll svelte-quhomu");
    			add_location(div844, file, 152, 48, 25364);
    			attr_dev(div845, "class", "boll svelte-quhomu");
    			add_location(div845, file, 152, 72, 25388);
    			attr_dev(div846, "class", "boll svelte-quhomu");
    			add_location(div846, file, 152, 96, 25412);
    			attr_dev(div847, "class", "boll svelte-quhomu");
    			add_location(div847, file, 152, 120, 25436);
    			attr_dev(div848, "class", "boll svelte-quhomu");
    			add_location(div848, file, 152, 144, 25460);
    			attr_dev(div849, "class", "boll svelte-quhomu");
    			add_location(div849, file, 152, 168, 25484);
    			attr_dev(div850, "class", "boll svelte-quhomu");
    			add_location(div850, file, 152, 192, 25508);
    			attr_dev(div851, "class", "boll svelte-quhomu");
    			add_location(div851, file, 152, 216, 25532);
    			attr_dev(div852, "class", "boll svelte-quhomu");
    			add_location(div852, file, 152, 240, 25556);
    			attr_dev(div853, "class", "boll svelte-quhomu");
    			add_location(div853, file, 152, 264, 25580);
    			attr_dev(div854, "class", "boll svelte-quhomu");
    			add_location(div854, file, 152, 288, 25604);
    			attr_dev(div855, "class", "boll svelte-quhomu");
    			add_location(div855, file, 152, 312, 25628);
    			attr_dev(div856, "class", "boll svelte-quhomu");
    			add_location(div856, file, 152, 336, 25652);
    			attr_dev(div857, "class", "bollröd-punkt svelte-quhomu");
    			set_style(div857, "animation-delay", "3000ms");
    			add_location(div857, file, 152, 360, 25676);
    			attr_dev(div858, "class", "boll svelte-quhomu");
    			add_location(div858, file, 152, 424, 25740);
    			attr_dev(div859, "class", "boll svelte-quhomu");
    			add_location(div859, file, 152, 448, 25764);
    			attr_dev(div860, "class", "boll svelte-quhomu");
    			add_location(div860, file, 152, 472, 25788);
    			attr_dev(div861, "class", "boll svelte-quhomu");
    			add_location(div861, file, 152, 496, 25812);
    			attr_dev(div862, "class", "row41 svelte-quhomu");
    			add_location(div862, file, 151, 1, 25296);
    			attr_dev(div863, "class", "boll svelte-quhomu");
    			add_location(div863, file, 155, 0, 25874);
    			attr_dev(div864, "class", "boll svelte-quhomu");
    			add_location(div864, file, 155, 24, 25898);
    			attr_dev(div865, "class", "boll svelte-quhomu");
    			add_location(div865, file, 155, 48, 25922);
    			attr_dev(div866, "class", "boll svelte-quhomu");
    			add_location(div866, file, 155, 72, 25946);
    			attr_dev(div867, "class", "boll svelte-quhomu");
    			add_location(div867, file, 155, 96, 25970);
    			attr_dev(div868, "class", "boll svelte-quhomu");
    			add_location(div868, file, 155, 120, 25994);
    			attr_dev(div869, "class", "boll svelte-quhomu");
    			add_location(div869, file, 155, 144, 26018);
    			attr_dev(div870, "class", "boll svelte-quhomu");
    			add_location(div870, file, 155, 168, 26042);
    			attr_dev(div871, "class", "boll svelte-quhomu");
    			add_location(div871, file, 155, 192, 26066);
    			attr_dev(div872, "class", "boll svelte-quhomu");
    			add_location(div872, file, 155, 216, 26090);
    			attr_dev(div873, "class", "boll svelte-quhomu");
    			add_location(div873, file, 155, 240, 26114);
    			attr_dev(div874, "class", "boll svelte-quhomu");
    			add_location(div874, file, 155, 264, 26138);
    			attr_dev(div875, "class", "boll svelte-quhomu");
    			add_location(div875, file, 155, 288, 26162);
    			attr_dev(div876, "class", "boll svelte-quhomu");
    			add_location(div876, file, 155, 312, 26186);
    			attr_dev(div877, "class", "boll svelte-quhomu");
    			add_location(div877, file, 155, 336, 26210);
    			attr_dev(div878, "class", "boll svelte-quhomu");
    			add_location(div878, file, 155, 360, 26234);
    			attr_dev(div879, "class", "boll svelte-quhomu");
    			add_location(div879, file, 155, 384, 26258);
    			attr_dev(div880, "class", "boll svelte-quhomu");
    			add_location(div880, file, 155, 408, 26282);
    			attr_dev(div881, "class", "boll svelte-quhomu");
    			add_location(div881, file, 155, 432, 26306);
    			attr_dev(div882, "class", "boll svelte-quhomu");
    			add_location(div882, file, 155, 456, 26330);
    			attr_dev(div883, "class", "row42 svelte-quhomu");
    			add_location(div883, file, 154, 1, 25854);
    			attr_dev(div884, "class", "boll svelte-quhomu");
    			add_location(div884, file, 158, 0, 26392);
    			attr_dev(div885, "class", "boll svelte-quhomu");
    			add_location(div885, file, 158, 24, 26416);
    			attr_dev(div886, "class", "boll svelte-quhomu");
    			add_location(div886, file, 158, 48, 26440);
    			attr_dev(div887, "class", "boll svelte-quhomu");
    			add_location(div887, file, 158, 72, 26464);
    			attr_dev(div888, "class", "boll svelte-quhomu");
    			add_location(div888, file, 158, 96, 26488);
    			attr_dev(div889, "class", "boll svelte-quhomu");
    			add_location(div889, file, 158, 120, 26512);
    			attr_dev(div890, "class", "boll svelte-quhomu");
    			add_location(div890, file, 158, 144, 26536);
    			attr_dev(div891, "class", "boll svelte-quhomu");
    			add_location(div891, file, 158, 168, 26560);
    			attr_dev(div892, "class", "boll svelte-quhomu");
    			add_location(div892, file, 158, 192, 26584);
    			attr_dev(div893, "class", "boll svelte-quhomu");
    			add_location(div893, file, 158, 216, 26608);
    			attr_dev(div894, "class", "boll svelte-quhomu");
    			add_location(div894, file, 158, 240, 26632);
    			attr_dev(div895, "class", "boll svelte-quhomu");
    			add_location(div895, file, 158, 264, 26656);
    			attr_dev(div896, "class", "boll svelte-quhomu");
    			add_location(div896, file, 158, 288, 26680);
    			attr_dev(div897, "class", "boll svelte-quhomu");
    			add_location(div897, file, 158, 312, 26704);
    			attr_dev(div898, "class", "boll svelte-quhomu");
    			add_location(div898, file, 158, 336, 26728);
    			attr_dev(div899, "class", "boll svelte-quhomu");
    			add_location(div899, file, 158, 360, 26752);
    			attr_dev(div900, "class", "boll svelte-quhomu");
    			add_location(div900, file, 158, 384, 26776);
    			attr_dev(div901, "class", "boll svelte-quhomu");
    			add_location(div901, file, 158, 408, 26800);
    			attr_dev(div902, "class", "boll svelte-quhomu");
    			add_location(div902, file, 158, 432, 26824);
    			attr_dev(div903, "class", "boll svelte-quhomu");
    			add_location(div903, file, 158, 456, 26848);
    			attr_dev(div904, "class", "row43 svelte-quhomu");
    			add_location(div904, file, 157, 1, 26372);
    			attr_dev(div905, "class", "bollbox svelte-quhomu");
    			add_location(div905, file, 26, 0, 929);
    			attr_dev(input0, "class", "återställ-alternativ svelte-quhomu");
    			attr_dev(input0, "type", "submit");
    			input0.value = "Try again";
    			add_location(input0, file, 163, 3, 26975);
    			add_location(form0, file, 162, 2, 26965);
    			attr_dev(div906, "class", "alternativ-text svelte-quhomu");
    			add_location(div906, file, 161, 4, 26916);
    			attr_dev(div907, "class", "background svelte-quhomu");
    			add_location(div907, file, 22, 4, 829);
    			attr_dev(input1, "class", "återställ svelte-quhomu");
    			attr_dev(input1, "type", "submit");
    			input1.value = "Try again";
    			add_location(input1, file, 169, 0, 27134);
    			add_location(form1, file, 168, 0, 27127);
    			attr_dev(div908, "class", "bollbox failedfetchtext svelte-quhomu");
    			add_location(div908, file, 167, 0, 27072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div907, anchor);
    			append_dev(div907, div1);
    			append_dev(div1, div0);
    			append_dev(div907, t0);
    			append_dev(div907, div905);
    			append_dev(div905, div22);
    			append_dev(div22, div2);
    			append_dev(div22, div3);
    			append_dev(div22, div4);
    			append_dev(div22, div5);
    			append_dev(div22, div6);
    			append_dev(div22, div7);
    			append_dev(div22, div8);
    			append_dev(div22, div9);
    			append_dev(div22, div10);
    			append_dev(div22, div11);
    			append_dev(div22, div12);
    			append_dev(div22, div13);
    			append_dev(div22, div14);
    			append_dev(div22, div15);
    			append_dev(div22, div16);
    			append_dev(div22, div17);
    			append_dev(div22, div18);
    			append_dev(div22, div19);
    			append_dev(div22, div20);
    			append_dev(div22, div21);
    			append_dev(div905, t1);
    			append_dev(div905, div43);
    			append_dev(div43, div23);
    			append_dev(div43, div24);
    			append_dev(div43, div25);
    			append_dev(div43, div26);
    			append_dev(div43, div27);
    			append_dev(div43, div28);
    			append_dev(div43, div29);
    			append_dev(div43, div30);
    			append_dev(div43, div31);
    			append_dev(div43, div32);
    			append_dev(div43, div33);
    			append_dev(div43, div34);
    			append_dev(div43, div35);
    			append_dev(div43, div36);
    			append_dev(div43, div37);
    			append_dev(div43, div38);
    			append_dev(div43, div39);
    			append_dev(div43, div40);
    			append_dev(div43, div41);
    			append_dev(div43, div42);
    			append_dev(div905, t2);
    			append_dev(div905, div64);
    			append_dev(div64, div44);
    			append_dev(div64, div45);
    			append_dev(div64, div46);
    			append_dev(div64, div47);
    			append_dev(div64, div48);
    			append_dev(div64, div49);
    			append_dev(div64, div50);
    			append_dev(div64, div51);
    			append_dev(div64, div52);
    			append_dev(div64, div53);
    			append_dev(div64, div54);
    			append_dev(div64, div55);
    			append_dev(div64, div56);
    			append_dev(div64, div57);
    			append_dev(div64, div58);
    			append_dev(div64, div59);
    			append_dev(div64, div60);
    			append_dev(div64, div61);
    			append_dev(div64, div62);
    			append_dev(div64, div63);
    			append_dev(div905, t3);
    			append_dev(div905, div85);
    			append_dev(div85, div65);
    			append_dev(div85, div66);
    			append_dev(div85, div67);
    			append_dev(div85, div68);
    			append_dev(div85, div69);
    			append_dev(div85, div70);
    			append_dev(div85, div71);
    			append_dev(div85, div72);
    			append_dev(div85, div73);
    			append_dev(div85, div74);
    			append_dev(div85, div75);
    			append_dev(div85, div76);
    			append_dev(div85, div77);
    			append_dev(div85, div78);
    			append_dev(div85, div79);
    			append_dev(div85, div80);
    			append_dev(div85, div81);
    			append_dev(div85, div82);
    			append_dev(div85, div83);
    			append_dev(div85, div84);
    			append_dev(div905, t4);
    			append_dev(div905, div106);
    			append_dev(div106, div86);
    			append_dev(div106, div87);
    			append_dev(div106, div88);
    			append_dev(div106, div89);
    			append_dev(div106, div90);
    			append_dev(div106, div91);
    			append_dev(div106, div92);
    			append_dev(div106, div93);
    			append_dev(div106, div94);
    			append_dev(div106, div95);
    			append_dev(div106, div96);
    			append_dev(div106, div97);
    			append_dev(div106, div98);
    			append_dev(div106, div99);
    			append_dev(div106, div100);
    			append_dev(div106, div101);
    			append_dev(div106, div102);
    			append_dev(div106, div103);
    			append_dev(div106, div104);
    			append_dev(div106, div105);
    			append_dev(div905, t5);
    			append_dev(div905, div127);
    			append_dev(div127, div107);
    			append_dev(div127, div108);
    			append_dev(div127, div109);
    			append_dev(div127, div110);
    			append_dev(div127, div111);
    			append_dev(div127, div112);
    			append_dev(div127, div113);
    			append_dev(div127, div114);
    			append_dev(div127, div115);
    			append_dev(div127, div116);
    			append_dev(div127, div117);
    			append_dev(div127, div118);
    			append_dev(div127, div119);
    			append_dev(div127, div120);
    			append_dev(div127, div121);
    			append_dev(div127, div122);
    			append_dev(div127, div123);
    			append_dev(div127, div124);
    			append_dev(div127, div125);
    			append_dev(div127, div126);
    			append_dev(div905, t6);
    			append_dev(div905, div148);
    			append_dev(div148, div128);
    			append_dev(div148, div129);
    			append_dev(div148, div130);
    			append_dev(div148, div131);
    			append_dev(div148, div132);
    			append_dev(div148, div133);
    			append_dev(div148, div134);
    			append_dev(div148, div135);
    			append_dev(div148, div136);
    			append_dev(div148, div137);
    			append_dev(div148, div138);
    			append_dev(div148, div139);
    			append_dev(div148, div140);
    			append_dev(div148, div141);
    			append_dev(div148, div142);
    			append_dev(div148, div143);
    			append_dev(div148, div144);
    			append_dev(div148, div145);
    			append_dev(div148, div146);
    			append_dev(div148, div147);
    			append_dev(div905, t7);
    			append_dev(div905, div169);
    			append_dev(div169, div149);
    			append_dev(div169, div150);
    			append_dev(div169, div151);
    			append_dev(div169, div152);
    			append_dev(div169, div153);
    			append_dev(div169, div154);
    			append_dev(div169, div155);
    			append_dev(div169, div156);
    			append_dev(div169, div157);
    			append_dev(div169, div158);
    			append_dev(div169, div159);
    			append_dev(div169, div160);
    			append_dev(div169, div161);
    			append_dev(div169, div162);
    			append_dev(div169, div163);
    			append_dev(div169, div164);
    			append_dev(div169, div165);
    			append_dev(div169, div166);
    			append_dev(div169, div167);
    			append_dev(div169, div168);
    			append_dev(div905, t8);
    			append_dev(div905, div190);
    			append_dev(div190, div170);
    			append_dev(div190, div171);
    			append_dev(div190, div172);
    			append_dev(div190, div173);
    			append_dev(div190, div174);
    			append_dev(div190, div175);
    			append_dev(div190, div176);
    			append_dev(div190, div177);
    			append_dev(div190, div178);
    			append_dev(div190, div179);
    			append_dev(div190, div180);
    			append_dev(div190, div181);
    			append_dev(div190, div182);
    			append_dev(div190, div183);
    			append_dev(div190, div184);
    			append_dev(div190, div185);
    			append_dev(div190, div186);
    			append_dev(div190, div187);
    			append_dev(div190, div188);
    			append_dev(div190, div189);
    			append_dev(div905, t9);
    			append_dev(div905, div211);
    			append_dev(div211, div191);
    			append_dev(div211, div192);
    			append_dev(div211, div193);
    			append_dev(div211, div194);
    			append_dev(div211, div195);
    			append_dev(div211, div196);
    			append_dev(div211, div197);
    			append_dev(div211, div198);
    			append_dev(div211, div199);
    			append_dev(div211, div200);
    			append_dev(div211, div201);
    			append_dev(div211, div202);
    			append_dev(div211, div203);
    			append_dev(div211, div204);
    			append_dev(div211, div205);
    			append_dev(div211, div206);
    			append_dev(div211, div207);
    			append_dev(div211, div208);
    			append_dev(div211, div209);
    			append_dev(div211, div210);
    			append_dev(div905, t10);
    			append_dev(div905, div232);
    			append_dev(div232, div212);
    			append_dev(div232, div213);
    			append_dev(div232, div214);
    			append_dev(div232, div215);
    			append_dev(div232, div216);
    			append_dev(div232, div217);
    			append_dev(div232, div218);
    			append_dev(div232, div219);
    			append_dev(div232, div220);
    			append_dev(div232, div221);
    			append_dev(div232, div222);
    			append_dev(div232, div223);
    			append_dev(div232, div224);
    			append_dev(div232, div225);
    			append_dev(div232, div226);
    			append_dev(div232, div227);
    			append_dev(div232, div228);
    			append_dev(div232, div229);
    			append_dev(div232, div230);
    			append_dev(div232, div231);
    			append_dev(div905, t11);
    			append_dev(div905, div253);
    			append_dev(div253, div233);
    			append_dev(div253, div234);
    			append_dev(div253, div235);
    			append_dev(div253, div236);
    			append_dev(div253, div237);
    			append_dev(div253, div238);
    			append_dev(div253, div239);
    			append_dev(div253, div240);
    			append_dev(div253, div241);
    			append_dev(div253, div242);
    			append_dev(div253, div243);
    			append_dev(div253, div244);
    			append_dev(div253, div245);
    			append_dev(div253, div246);
    			append_dev(div253, div247);
    			append_dev(div253, div248);
    			append_dev(div253, div249);
    			append_dev(div253, div250);
    			append_dev(div253, div251);
    			append_dev(div253, div252);
    			append_dev(div905, t12);
    			append_dev(div905, div274);
    			append_dev(div274, div254);
    			append_dev(div274, div255);
    			append_dev(div274, div256);
    			append_dev(div274, div257);
    			append_dev(div274, div258);
    			append_dev(div274, div259);
    			append_dev(div274, div260);
    			append_dev(div274, div261);
    			append_dev(div274, div262);
    			append_dev(div274, div263);
    			append_dev(div274, div264);
    			append_dev(div274, div265);
    			append_dev(div274, div266);
    			append_dev(div274, div267);
    			append_dev(div274, div268);
    			append_dev(div274, div269);
    			append_dev(div274, div270);
    			append_dev(div274, div271);
    			append_dev(div274, div272);
    			append_dev(div274, div273);
    			append_dev(div905, t13);
    			append_dev(div905, div295);
    			append_dev(div295, div275);
    			append_dev(div295, div276);
    			append_dev(div295, div277);
    			append_dev(div295, div278);
    			append_dev(div295, div279);
    			append_dev(div295, div280);
    			append_dev(div295, div281);
    			append_dev(div295, div282);
    			append_dev(div295, div283);
    			append_dev(div295, div284);
    			append_dev(div295, div285);
    			append_dev(div295, div286);
    			append_dev(div295, div287);
    			append_dev(div295, div288);
    			append_dev(div295, div289);
    			append_dev(div295, div290);
    			append_dev(div295, div291);
    			append_dev(div295, div292);
    			append_dev(div295, div293);
    			append_dev(div295, div294);
    			append_dev(div905, t14);
    			append_dev(div905, div316);
    			append_dev(div316, div296);
    			append_dev(div316, div297);
    			append_dev(div316, div298);
    			append_dev(div316, div299);
    			append_dev(div316, div300);
    			append_dev(div316, div301);
    			append_dev(div316, div302);
    			append_dev(div316, div303);
    			append_dev(div316, div304);
    			append_dev(div316, div305);
    			append_dev(div316, div306);
    			append_dev(div316, div307);
    			append_dev(div316, div308);
    			append_dev(div316, div309);
    			append_dev(div316, div310);
    			append_dev(div316, div311);
    			append_dev(div316, div312);
    			append_dev(div316, div313);
    			append_dev(div316, div314);
    			append_dev(div316, div315);
    			append_dev(div905, t15);
    			append_dev(div905, div337);
    			append_dev(div337, div317);
    			append_dev(div337, div318);
    			append_dev(div337, div319);
    			append_dev(div337, div320);
    			append_dev(div337, div321);
    			append_dev(div337, div322);
    			append_dev(div337, div323);
    			append_dev(div337, div324);
    			append_dev(div337, div325);
    			append_dev(div337, div326);
    			append_dev(div337, div327);
    			append_dev(div337, div328);
    			append_dev(div337, div329);
    			append_dev(div337, div330);
    			append_dev(div337, div331);
    			append_dev(div337, div332);
    			append_dev(div337, div333);
    			append_dev(div337, div334);
    			append_dev(div337, div335);
    			append_dev(div337, div336);
    			append_dev(div905, t16);
    			append_dev(div905, div358);
    			append_dev(div358, div338);
    			append_dev(div358, div339);
    			append_dev(div358, div340);
    			append_dev(div358, div341);
    			append_dev(div358, div342);
    			append_dev(div358, div343);
    			append_dev(div358, div344);
    			append_dev(div358, div345);
    			append_dev(div358, div346);
    			append_dev(div358, div347);
    			append_dev(div358, div348);
    			append_dev(div358, div349);
    			append_dev(div358, div350);
    			append_dev(div358, div351);
    			append_dev(div358, div352);
    			append_dev(div358, div353);
    			append_dev(div358, div354);
    			append_dev(div358, div355);
    			append_dev(div358, div356);
    			append_dev(div358, div357);
    			append_dev(div905, t17);
    			append_dev(div905, div379);
    			append_dev(div379, div359);
    			append_dev(div379, div360);
    			append_dev(div379, div361);
    			append_dev(div379, div362);
    			append_dev(div379, div363);
    			append_dev(div379, div364);
    			append_dev(div379, div365);
    			append_dev(div379, div366);
    			append_dev(div379, div367);
    			append_dev(div379, div368);
    			append_dev(div379, div369);
    			append_dev(div379, div370);
    			append_dev(div379, div371);
    			append_dev(div379, div372);
    			append_dev(div379, div373);
    			append_dev(div379, div374);
    			append_dev(div379, div375);
    			append_dev(div379, div376);
    			append_dev(div379, div377);
    			append_dev(div379, div378);
    			append_dev(div905, t18);
    			append_dev(div905, div400);
    			append_dev(div400, div380);
    			append_dev(div400, div381);
    			append_dev(div400, div382);
    			append_dev(div400, div383);
    			append_dev(div400, div384);
    			append_dev(div400, div385);
    			append_dev(div400, div386);
    			append_dev(div400, div387);
    			append_dev(div400, div388);
    			append_dev(div400, div389);
    			append_dev(div400, div390);
    			append_dev(div400, div391);
    			append_dev(div400, div392);
    			append_dev(div400, div393);
    			append_dev(div400, div394);
    			append_dev(div400, div395);
    			append_dev(div400, div396);
    			append_dev(div400, div397);
    			append_dev(div400, div398);
    			append_dev(div400, div399);
    			append_dev(div905, t19);
    			append_dev(div905, div421);
    			append_dev(div421, div401);
    			append_dev(div421, div402);
    			append_dev(div421, div403);
    			append_dev(div421, div404);
    			append_dev(div421, div405);
    			append_dev(div421, div406);
    			append_dev(div421, div407);
    			append_dev(div421, div408);
    			append_dev(div421, div409);
    			append_dev(div421, div410);
    			append_dev(div421, div411);
    			append_dev(div421, div412);
    			append_dev(div421, div413);
    			append_dev(div421, div414);
    			append_dev(div421, div415);
    			append_dev(div421, div416);
    			append_dev(div421, div417);
    			append_dev(div421, div418);
    			append_dev(div421, div419);
    			append_dev(div421, div420);
    			append_dev(div905, t20);
    			append_dev(div905, div442);
    			append_dev(div442, div422);
    			append_dev(div442, div423);
    			append_dev(div442, div424);
    			append_dev(div442, div425);
    			append_dev(div442, div426);
    			append_dev(div442, div427);
    			append_dev(div442, div428);
    			append_dev(div442, div429);
    			append_dev(div442, div430);
    			append_dev(div442, div431);
    			append_dev(div442, div432);
    			append_dev(div442, div433);
    			append_dev(div442, div434);
    			append_dev(div442, div435);
    			append_dev(div442, div436);
    			append_dev(div442, div437);
    			append_dev(div442, div438);
    			append_dev(div442, div439);
    			append_dev(div442, div440);
    			append_dev(div442, div441);
    			append_dev(div905, t21);
    			append_dev(div905, div463);
    			append_dev(div463, div443);
    			append_dev(div463, div444);
    			append_dev(div463, div445);
    			append_dev(div463, div446);
    			append_dev(div463, div447);
    			append_dev(div463, div448);
    			append_dev(div463, div449);
    			append_dev(div463, div450);
    			append_dev(div463, div451);
    			append_dev(div463, div452);
    			append_dev(div463, div453);
    			append_dev(div463, div454);
    			append_dev(div463, div455);
    			append_dev(div463, div456);
    			append_dev(div463, div457);
    			append_dev(div463, div458);
    			append_dev(div463, div459);
    			append_dev(div463, div460);
    			append_dev(div463, div461);
    			append_dev(div463, div462);
    			append_dev(div905, t22);
    			append_dev(div905, div484);
    			append_dev(div484, div464);
    			append_dev(div484, div465);
    			append_dev(div484, div466);
    			append_dev(div484, div467);
    			append_dev(div484, div468);
    			append_dev(div484, div469);
    			append_dev(div484, div470);
    			append_dev(div484, div471);
    			append_dev(div484, div472);
    			append_dev(div484, div473);
    			append_dev(div484, div474);
    			append_dev(div484, div475);
    			append_dev(div484, div476);
    			append_dev(div484, div477);
    			append_dev(div484, div478);
    			append_dev(div484, div479);
    			append_dev(div484, div480);
    			append_dev(div484, div481);
    			append_dev(div484, div482);
    			append_dev(div484, div483);
    			append_dev(div905, t23);
    			append_dev(div905, div505);
    			append_dev(div505, div485);
    			append_dev(div505, div486);
    			append_dev(div505, div487);
    			append_dev(div505, div488);
    			append_dev(div505, div489);
    			append_dev(div505, div490);
    			append_dev(div505, div491);
    			append_dev(div505, div492);
    			append_dev(div505, div493);
    			append_dev(div505, div494);
    			append_dev(div505, div495);
    			append_dev(div505, div496);
    			append_dev(div505, div497);
    			append_dev(div505, div498);
    			append_dev(div505, div499);
    			append_dev(div505, div500);
    			append_dev(div505, div501);
    			append_dev(div505, div502);
    			append_dev(div505, div503);
    			append_dev(div505, div504);
    			append_dev(div905, t24);
    			append_dev(div905, div526);
    			append_dev(div526, div506);
    			append_dev(div526, div507);
    			append_dev(div526, div508);
    			append_dev(div526, div509);
    			append_dev(div526, div510);
    			append_dev(div526, div511);
    			append_dev(div526, div512);
    			append_dev(div526, div513);
    			append_dev(div526, div514);
    			append_dev(div526, div515);
    			append_dev(div526, div516);
    			append_dev(div526, div517);
    			append_dev(div526, div518);
    			append_dev(div526, div519);
    			append_dev(div526, div520);
    			append_dev(div526, div521);
    			append_dev(div526, div522);
    			append_dev(div526, div523);
    			append_dev(div526, div524);
    			append_dev(div526, div525);
    			append_dev(div905, t25);
    			append_dev(div905, div547);
    			append_dev(div547, div527);
    			append_dev(div547, div528);
    			append_dev(div547, div529);
    			append_dev(div547, div530);
    			append_dev(div547, div531);
    			append_dev(div547, div532);
    			append_dev(div547, div533);
    			append_dev(div547, div534);
    			append_dev(div547, div535);
    			append_dev(div547, div536);
    			append_dev(div547, div537);
    			append_dev(div547, div538);
    			append_dev(div547, div539);
    			append_dev(div547, div540);
    			append_dev(div547, div541);
    			append_dev(div547, div542);
    			append_dev(div547, div543);
    			append_dev(div547, div544);
    			append_dev(div547, div545);
    			append_dev(div547, div546);
    			append_dev(div905, t26);
    			append_dev(div905, div568);
    			append_dev(div568, div548);
    			append_dev(div568, div549);
    			append_dev(div568, div550);
    			append_dev(div568, div551);
    			append_dev(div568, div552);
    			append_dev(div568, div553);
    			append_dev(div568, div554);
    			append_dev(div568, div555);
    			append_dev(div568, div556);
    			append_dev(div568, div557);
    			append_dev(div568, div558);
    			append_dev(div568, div559);
    			append_dev(div568, div560);
    			append_dev(div568, div561);
    			append_dev(div568, div562);
    			append_dev(div568, div563);
    			append_dev(div568, div564);
    			append_dev(div568, div565);
    			append_dev(div568, div566);
    			append_dev(div568, div567);
    			append_dev(div905, t27);
    			append_dev(div905, div589);
    			append_dev(div589, div569);
    			append_dev(div589, div570);
    			append_dev(div589, div571);
    			append_dev(div589, div572);
    			append_dev(div589, div573);
    			append_dev(div589, div574);
    			append_dev(div589, div575);
    			append_dev(div589, div576);
    			append_dev(div589, div577);
    			append_dev(div589, div578);
    			append_dev(div589, div579);
    			append_dev(div589, div580);
    			append_dev(div589, div581);
    			append_dev(div589, div582);
    			append_dev(div589, div583);
    			append_dev(div589, div584);
    			append_dev(div589, div585);
    			append_dev(div589, div586);
    			append_dev(div589, div587);
    			append_dev(div589, div588);
    			append_dev(div905, t28);
    			append_dev(div905, div610);
    			append_dev(div610, div590);
    			append_dev(div610, div591);
    			append_dev(div610, div592);
    			append_dev(div610, div593);
    			append_dev(div610, div594);
    			append_dev(div610, div595);
    			append_dev(div610, div596);
    			append_dev(div610, div597);
    			append_dev(div610, div598);
    			append_dev(div610, div599);
    			append_dev(div610, div600);
    			append_dev(div610, div601);
    			append_dev(div610, div602);
    			append_dev(div610, div603);
    			append_dev(div610, div604);
    			append_dev(div610, div605);
    			append_dev(div610, div606);
    			append_dev(div610, div607);
    			append_dev(div610, div608);
    			append_dev(div610, div609);
    			append_dev(div905, t29);
    			append_dev(div905, div631);
    			append_dev(div631, div611);
    			append_dev(div631, div612);
    			append_dev(div631, div613);
    			append_dev(div631, div614);
    			append_dev(div631, div615);
    			append_dev(div631, div616);
    			append_dev(div631, div617);
    			append_dev(div631, div618);
    			append_dev(div631, div619);
    			append_dev(div631, div620);
    			append_dev(div631, div621);
    			append_dev(div631, div622);
    			append_dev(div631, div623);
    			append_dev(div631, div624);
    			append_dev(div631, div625);
    			append_dev(div631, div626);
    			append_dev(div631, div627);
    			append_dev(div631, div628);
    			append_dev(div631, div629);
    			append_dev(div631, div630);
    			append_dev(div905, t30);
    			append_dev(div905, div652);
    			append_dev(div652, div632);
    			append_dev(div652, div633);
    			append_dev(div652, div634);
    			append_dev(div652, div635);
    			append_dev(div652, div636);
    			append_dev(div652, div637);
    			append_dev(div652, div638);
    			append_dev(div652, div639);
    			append_dev(div652, div640);
    			append_dev(div652, div641);
    			append_dev(div652, div642);
    			append_dev(div652, div643);
    			append_dev(div652, div644);
    			append_dev(div652, div645);
    			append_dev(div652, div646);
    			append_dev(div652, div647);
    			append_dev(div652, div648);
    			append_dev(div652, div649);
    			append_dev(div652, div650);
    			append_dev(div652, div651);
    			append_dev(div905, t31);
    			append_dev(div905, div673);
    			append_dev(div673, div653);
    			append_dev(div673, div654);
    			append_dev(div673, div655);
    			append_dev(div673, div656);
    			append_dev(div673, div657);
    			append_dev(div673, div658);
    			append_dev(div673, div659);
    			append_dev(div673, div660);
    			append_dev(div673, div661);
    			append_dev(div673, div662);
    			append_dev(div673, div663);
    			append_dev(div673, div664);
    			append_dev(div673, div665);
    			append_dev(div673, div666);
    			append_dev(div673, div667);
    			append_dev(div673, div668);
    			append_dev(div673, div669);
    			append_dev(div673, div670);
    			append_dev(div673, div671);
    			append_dev(div673, div672);
    			append_dev(div905, t32);
    			append_dev(div905, div694);
    			append_dev(div694, div674);
    			append_dev(div694, div675);
    			append_dev(div694, div676);
    			append_dev(div694, div677);
    			append_dev(div694, div678);
    			append_dev(div694, div679);
    			append_dev(div694, div680);
    			append_dev(div694, div681);
    			append_dev(div694, div682);
    			append_dev(div694, div683);
    			append_dev(div694, div684);
    			append_dev(div694, div685);
    			append_dev(div694, div686);
    			append_dev(div694, div687);
    			append_dev(div694, div688);
    			append_dev(div694, div689);
    			append_dev(div694, div690);
    			append_dev(div694, div691);
    			append_dev(div694, div692);
    			append_dev(div694, div693);
    			append_dev(div905, t33);
    			append_dev(div905, div715);
    			append_dev(div715, div695);
    			append_dev(div715, div696);
    			append_dev(div715, div697);
    			append_dev(div715, div698);
    			append_dev(div715, div699);
    			append_dev(div715, div700);
    			append_dev(div715, div701);
    			append_dev(div715, div702);
    			append_dev(div715, div703);
    			append_dev(div715, div704);
    			append_dev(div715, div705);
    			append_dev(div715, div706);
    			append_dev(div715, div707);
    			append_dev(div715, div708);
    			append_dev(div715, div709);
    			append_dev(div715, div710);
    			append_dev(div715, div711);
    			append_dev(div715, div712);
    			append_dev(div715, div713);
    			append_dev(div715, div714);
    			append_dev(div905, t34);
    			append_dev(div905, div736);
    			append_dev(div736, div716);
    			append_dev(div736, div717);
    			append_dev(div736, div718);
    			append_dev(div736, div719);
    			append_dev(div736, div720);
    			append_dev(div736, div721);
    			append_dev(div736, div722);
    			append_dev(div736, div723);
    			append_dev(div736, div724);
    			append_dev(div736, div725);
    			append_dev(div736, div726);
    			append_dev(div736, div727);
    			append_dev(div736, div728);
    			append_dev(div736, div729);
    			append_dev(div736, div730);
    			append_dev(div736, div731);
    			append_dev(div736, div732);
    			append_dev(div736, div733);
    			append_dev(div736, div734);
    			append_dev(div736, div735);
    			append_dev(div905, t35);
    			append_dev(div905, div757);
    			append_dev(div757, div737);
    			append_dev(div757, div738);
    			append_dev(div757, div739);
    			append_dev(div757, div740);
    			append_dev(div757, div741);
    			append_dev(div757, div742);
    			append_dev(div757, div743);
    			append_dev(div757, div744);
    			append_dev(div757, div745);
    			append_dev(div757, div746);
    			append_dev(div757, div747);
    			append_dev(div757, div748);
    			append_dev(div757, div749);
    			append_dev(div757, div750);
    			append_dev(div757, div751);
    			append_dev(div757, div752);
    			append_dev(div757, div753);
    			append_dev(div757, div754);
    			append_dev(div757, div755);
    			append_dev(div757, div756);
    			append_dev(div905, t36);
    			append_dev(div905, div778);
    			append_dev(div778, div758);
    			append_dev(div778, div759);
    			append_dev(div778, div760);
    			append_dev(div778, div761);
    			append_dev(div778, div762);
    			append_dev(div778, div763);
    			append_dev(div778, div764);
    			append_dev(div778, div765);
    			append_dev(div778, div766);
    			append_dev(div778, div767);
    			append_dev(div778, div768);
    			append_dev(div778, div769);
    			append_dev(div778, div770);
    			append_dev(div778, div771);
    			append_dev(div778, div772);
    			append_dev(div778, div773);
    			append_dev(div778, div774);
    			append_dev(div778, div775);
    			append_dev(div778, div776);
    			append_dev(div778, div777);
    			append_dev(div905, t37);
    			append_dev(div905, div799);
    			append_dev(div799, div779);
    			append_dev(div799, div780);
    			append_dev(div799, div781);
    			append_dev(div799, div782);
    			append_dev(div799, div783);
    			append_dev(div799, div784);
    			append_dev(div799, div785);
    			append_dev(div799, div786);
    			append_dev(div799, div787);
    			append_dev(div799, div788);
    			append_dev(div799, div789);
    			append_dev(div799, div790);
    			append_dev(div799, div791);
    			append_dev(div799, div792);
    			append_dev(div799, div793);
    			append_dev(div799, div794);
    			append_dev(div799, div795);
    			append_dev(div799, div796);
    			append_dev(div799, div797);
    			append_dev(div799, div798);
    			append_dev(div905, t38);
    			append_dev(div905, div820);
    			append_dev(div820, div800);
    			append_dev(div820, div801);
    			append_dev(div820, div802);
    			append_dev(div820, div803);
    			append_dev(div820, div804);
    			append_dev(div820, div805);
    			append_dev(div820, div806);
    			append_dev(div820, div807);
    			append_dev(div820, div808);
    			append_dev(div820, div809);
    			append_dev(div820, div810);
    			append_dev(div820, div811);
    			append_dev(div820, div812);
    			append_dev(div820, div813);
    			append_dev(div820, div814);
    			append_dev(div820, div815);
    			append_dev(div820, div816);
    			append_dev(div820, div817);
    			append_dev(div820, div818);
    			append_dev(div820, div819);
    			append_dev(div905, t39);
    			append_dev(div905, div841);
    			append_dev(div841, div821);
    			append_dev(div841, div822);
    			append_dev(div841, div823);
    			append_dev(div841, div824);
    			append_dev(div841, div825);
    			append_dev(div841, div826);
    			append_dev(div841, div827);
    			append_dev(div841, div828);
    			append_dev(div841, div829);
    			append_dev(div841, div830);
    			append_dev(div841, div831);
    			append_dev(div841, div832);
    			append_dev(div841, div833);
    			append_dev(div841, div834);
    			append_dev(div841, div835);
    			append_dev(div841, div836);
    			append_dev(div841, div837);
    			append_dev(div841, div838);
    			append_dev(div841, div839);
    			append_dev(div841, div840);
    			append_dev(div905, t40);
    			append_dev(div905, div862);
    			append_dev(div862, div842);
    			append_dev(div862, div843);
    			append_dev(div862, div844);
    			append_dev(div862, div845);
    			append_dev(div862, div846);
    			append_dev(div862, div847);
    			append_dev(div862, div848);
    			append_dev(div862, div849);
    			append_dev(div862, div850);
    			append_dev(div862, div851);
    			append_dev(div862, div852);
    			append_dev(div862, div853);
    			append_dev(div862, div854);
    			append_dev(div862, div855);
    			append_dev(div862, div856);
    			append_dev(div862, div857);
    			append_dev(div862, div858);
    			append_dev(div862, div859);
    			append_dev(div862, div860);
    			append_dev(div862, div861);
    			append_dev(div905, t41);
    			append_dev(div905, div883);
    			append_dev(div883, div863);
    			append_dev(div883, div864);
    			append_dev(div883, div865);
    			append_dev(div883, div866);
    			append_dev(div883, div867);
    			append_dev(div883, div868);
    			append_dev(div883, div869);
    			append_dev(div883, div870);
    			append_dev(div883, div871);
    			append_dev(div883, div872);
    			append_dev(div883, div873);
    			append_dev(div883, div874);
    			append_dev(div883, div875);
    			append_dev(div883, div876);
    			append_dev(div883, div877);
    			append_dev(div883, div878);
    			append_dev(div883, div879);
    			append_dev(div883, div880);
    			append_dev(div883, div881);
    			append_dev(div883, div882);
    			append_dev(div905, t42);
    			append_dev(div905, div904);
    			append_dev(div904, div884);
    			append_dev(div904, div885);
    			append_dev(div904, div886);
    			append_dev(div904, div887);
    			append_dev(div904, div888);
    			append_dev(div904, div889);
    			append_dev(div904, div890);
    			append_dev(div904, div891);
    			append_dev(div904, div892);
    			append_dev(div904, div893);
    			append_dev(div904, div894);
    			append_dev(div904, div895);
    			append_dev(div904, div896);
    			append_dev(div904, div897);
    			append_dev(div904, div898);
    			append_dev(div904, div899);
    			append_dev(div904, div900);
    			append_dev(div904, div901);
    			append_dev(div904, div902);
    			append_dev(div904, div903);
    			append_dev(div907, t43);
    			append_dev(div907, div906);
    			append_dev(div906, t44);
    			append_dev(div906, form0);
    			append_dev(form0, input0);
    			insert_dev(target, t45, anchor);
    			insert_dev(target, div908, anchor);
    			append_dev(div908, t46);
    			append_dev(div908, form1);
    			append_dev(form1, input1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div907);
    			if (detaching) detach_dev(t45);
    			if (detaching) detach_dev(div908);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(22:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (20:4) {:then result}
    function create_then_block(ctx) {
    	let results;
    	let current;

    	results = new Results({
    			props: { json: /*result*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(results.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(results, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const results_changes = {};
    			if (dirty & /*$promise*/ 2) results_changes.json = /*result*/ ctx[2];
    			results.$set(results_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(results.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(results.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(results, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(20:4) {:then result}",
    		ctx
    	});

    	return block;
    }

    // (18:21)          <Spinner />     {:then result}
    function create_pending_block(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(18:21)          <Spinner />     {:then result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let main;
    	let div;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let search;
    	let t6;
    	let promise_1;
    	let current;
    	search = new Search({ $$inline: true });

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 2,
    		error: 3,
    		blocks: [,,,]
    	};

    	handle_promise(promise_1 = /*$promise*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			link1 = element("link");
    			t1 = space();
    			main = element("main");
    			div = element("div");
    			t2 = text("Du har gjort ");
    			t3 = text(/*sökninggånger*/ ctx[0]);
    			t4 = text(" sökningar!");
    			t5 = space();
    			create_component(search.$$.fragment);
    			t6 = space();
    			info.block.c();
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@1,300&family=Montserrat&family=Oswald:wght@200;700&family=PT+Serif&family=Poppins:wght@300&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			add_location(link0, file, 0, 0, 0);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@1&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			add_location(link1, file, 1, 0, 200);
    			attr_dev(div, "class", "sökt svelte-quhomu");
    			add_location(div, file, 14, 0, 632);
    			attr_dev(main, "class", "svelte-quhomu");
    			add_location(main, file, 13, 0, 625);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, link1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(main, t5);
    			mount_component(search, main, null);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*sökninggånger*/ 1) set_data_dev(t3, /*sökninggånger*/ ctx[0]);
    			info.ctx = ctx;

    			if (dirty & /*$promise*/ 2 && promise_1 !== (promise_1 = /*$promise*/ ctx[1]) && handle_promise(promise_1, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(link1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_component(search);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $promise;
    	validate_store(promise, 'promise');
    	component_subscribe($$self, promise, $$value => $$invalidate(1, $promise = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let sökninggånger;

    	sökningar.subscribe(gånger => {
    		$$invalidate(0, sökninggånger = gånger);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		sökningar,
    		Spinner,
    		Results,
    		Search,
    		promise,
    		sökninggånger,
    		$promise
    	});

    	$$self.$inject_state = $$props => {
    		if ('sökninggånger' in $$props) $$invalidate(0, sökninggånger = $$props.sökninggånger);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sökninggånger, $promise];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
