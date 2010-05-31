/*!
* ReUI v0.5 
* Copyright 2010, Michael Morton
*
* MIT Licensed - See LICENSE
*
* Sections of this code can be attributed
* to the iUI framework, on which this refactoring 
* is based.
*/
ReUI = {};

(function() {  
    var isIE = /msie/i.test(navigator.userAgent); 

    var apply = function (a, b, c) {
        var a = a || {};

        if (b) for (var n in b) a[n] = b[n];
        if (c) for (var n in c) a[n] = c[n];

        return a;
    };   

    var bind = isIE 
        ? function(target, type, fn) {
            target.attachEvent(type, fn);
        }
        : function(target, type, fn, capture) {        
            target.addEventListener(type, fn, capture);
        };

    var unbind = isIE
        ? function(target, type, fn) {
            target.detachEvent(type, fn);
        }
        : function(target, type, fn, capture) {
            target.removeEventListener(type, fn, capture);
        };

    var wait = isIE 
        ? function(fn, delay) {
            var pass = Array.prototype.slice.call(arguments, 2);
            setTimeout(function() {
                fn.apply(this, pass);
            }, delay);
        }
        : setTimeout;

    var clearWait = clearTimeout;

    var timer = isIE 
        ? function(fn, delay) {
            var pass = Array.prototype.slice.call(arguments, 2);
            setInterval(function() {
                fn.apply(this, pass);
            }, delay);
        }
        : setInterval;

    var clearTimer = clearInterval;

    var dispatch = function(el, type, bubble, cancel) {
        var evt = document.createEvent("UIEvent");

        evt.initEvent(type, bubble === false ? false : true, cancel === false ? false : true);
        
        el.dispatchEvent(evt);
    };

    var hasClass = function(el, cls) {
        return (new RegExp('(^|\\s)' + cls + '($|\\s)')).test(el.className);
    };

    var addClass = function(el, cls) {
        if (hasClass(el, cls) == false) el.className += ' ' + cls;            
    };

    var removeClass = function(el, cls) {
        if (hasClass(el, cls)) el.className = el.className.replace(new RegExp('(^|\\s)' + cls + '($|\\s)'), ' ');
    };

    var get = function(id) {
        return document.getElementById(id);
    };

    var up = function(node, name) {
        while (node && (node.nodeType != 1 || node.localName.toLowerCase() != name))
            node = node.parentNode;
        return node;
    };

    var select = function(el) {
        el.setAttribute('selected', 'true');
    };

    var unselect = function(el) {
        el.removeAttribute('selected');
    };

    var fx = {
        slideCompat: function(from, to, dir, fn) {

        },
        slide: function(from, to, dir, fn) {            
            var toStart = {value: '0%', axis: 'X'};
            var fromStop = {value: '0%', axis: 'X'};            

            switch (dir) 
            {
                case 'l': 
                    toStart.value = (window.innerWidth) + 'px';
                    toStart.axis = 'X';
                    fromStop.value = '-100%';
                    fromStop.axis = 'X';
                    break;
                case 'r':
                    toStart.value = (-1 * window.innerWidth) + 'px';
                    toStart.axis = 'X';
                    fromStop.value = '100%';
                    fromStop.axis = 'X';
                    break;
                case 'u':
                    toStart.value = (window.innerHeight) + 'px';
                    toStart.axis = 'Y';
                    fromStop.value = '-100%';
                    fromStop.axis = 'Y';
                    break;
                case 'd':
                    toStart.value = (-1 * window.innerHeight) + 'px';
                    toStart.axis = 'Y';
                    fromStop.value = '100%';
                    fromStop.axis = 'Y';
                    break;
            };

            to.style.webkitTransitionDuration = '0ms';
            from.style.webkitTransitionDuration = '0ms';

            to.style.webkitTransform = 'translate' + toStart.axis + '(' + toStart.value + ')';
            
            select(to);

            to.style.webkitTransitionDuration = 'inherit';
            from.style.webkitTransitionDuration = 'inherit';

            function complete() {
                unbind(from, 'webkitTransitionEnd', complete, false);

                if (hasClass(to, 'dialog') == false) unselect(from);  
     
                if (typeof fn === 'function') fn();
            };
            
            bind(from, 'webkitTransitionEnd', complete, false);
            
            wait(function() {
                from.style.webkitTransform = 'translate' + fromStop.axis + '(' + fromStop.value + ')';;

                to.style.webkitTransform = 'translate' + toStart.axis + '(0%)';
            }, 0);            
        },
        flip: function(from, to, dir, fn) {     
            /// for left       
            /// from card starts at 0 and goes to 180
            /// to card starts at -180 and goes to 0

            var toStart = {value: '0deg', axis: 'Y'};
            var fromStop = {value: '0deg', axis: 'Y'};            

            switch (dir) 
            {
                case 'l': 
                    toStart.value = '-180deg';
                    toStart.axis = 'Y';
                    fromStop.value = '180deg';
                    fromStop.axis = 'Y';
                    break;
                case 'r':
                     toStart.value = '180deg';
                    toStart.axis = 'Y';
                    fromStop.value = '-180deg';
                    fromStop.axis = 'Y';
                    break; 
                case 'u': 
                    toStart.value = '-180deg';
                    toStart.axis = 'X';
                    fromStop.value = '180deg';
                    fromStop.axis = 'X';
                    break;
                case 'd':
                     toStart.value = '180deg';
                    toStart.axis = 'X';
                    fromStop.value = '-180deg';
                    fromStop.axis = 'X';
                    break;                 
            };

            to.style.webkitTransitionDuration = '0ms';
            from.style.webkitTransitionDuration = '0ms';

            to.style.webkitTransform = 'rotate' + toStart.axis + '(' + toStart.value + ')';
            to.style.webkitTransformStyle = 'preserve-3d';
            to.style.webkitBackfaceVisibility = 'hidden';
            
            from.style.webkitTransformStyle = 'preserve-3d';
            from.style.webkitBackfaceVisibility = 'hidden';
            
            select(to);

            to.style.webkitTransitionDuration = 'inherit';
            from.style.webkitTransitionDuration = 'inherit';

            function complete() {
                unbind(from, 'webkitTransitionEnd', complete, false);
     
                if (hasClass(to, 'dialog') == false) unselect(from);  
                
                if (typeof fn === 'function') fn();
            };
            
            bind(from, 'webkitTransitionEnd', complete, false);
            
            wait(function() {
                from.style.webkitTransform = 'rotate' + fromStop.axis + '(' + fromStop.value + ')';;

                to.style.webkitTransform = 'rotate' + toStart.axis + '(0deg)';
            }, 0);     
        }        
    };    

    var resolveFx = function(name) {
        return ReUI.useCompatibleFx 
            ? fx[name + 'Compatible']
            : fx[name];
    };

    var context = {
        page: false,
        dialog: false,
        counter: 0,
        width: 0,
        height: 0,
        check: 0,
        history: []
    };
    
    apply(ReUI, {
        autoInit: true,
        useCompatibleFx: false,
        fx: fx,
        rootEl: false, 
        titleEl: false,      
        backEl: false, 
        backText: 'Back',
        hasOrientationEvent: false,        
        checkStateEvery: 250,     

        init: function() {
            ReUI.rootEl = document.body;            
            ReUI.backEl = ReUI.backEl || get('backButton');
            ReUI.titleEl = ReUI.titleEl || get('pageTitle');

            var selectedEl, hashEl;
            var el = ReUI.rootEl.firstChild;            
            for (; el; el = el.nextSibling)
                if (el.nodeType == 1 && el.getAttribute('selected') == 'true')
                    selectedEl = el;

            if (location.hash && location.hash.length > 1)
            {
                hashEl = get(location.hash.substr(1));
            }           

            if (hashEl)
            {
                if (selectedEl) unselect(selectedEl);                    

                ReUI.show(hashEl);
            }
            else if (selectedEl)
            {
                ReUI.show(selectedEl);
            }
            
            if (typeof window.onorientationchange === 'object')
            {
                window.onorientationchange = ReUI.orientationChanged;

                ReUI.hasOrientationEvent = true;                
            }
                      
            context.check = wait(ReUI.checkOrientationAndLocation, ReUI.checkStateEvery);

            bind(ReUI.rootEl, 'click', ReUI.onRootClick);
        },

        onRootClick: function(evt) {    
            var evt = evt || window.event;            
            var target = evt.target || evt.srcElement;

            var link = up(target, 'a');
            if (link) 
            {                
                if (link.href && link.hash && link.hash != '#' && !link.target)
                {
                    select(link);
                    
                    ReUI.show(get(link.hash.substr(1)));

                    wait(unselect, 500, link);
                }
                else if (link == ReUI.backEl)
                {
                    ReUI.back();
                }
                else if (link.getAttribute('type') == 'cancel')
                {
                    if (context.dialog) unselect(context.dialog);                        
                }
                else
                {
                    return;
                }

                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
                if (evt.preventDefault) evt.preventDefault();
            }
        },

        getCurrentPage: function() {
            return context.page;
        },

        getCurrentDialog: function() {
            return context.dialog;
        },

        back: function() {
            history.go(-1);
        },
        
        /// <summary>
        /// Available Options:
        ///     horizontal: True if the transition is horizontal, False otherwise.
        ///     reverse: True if the transition is a reverse transition (right/down), False otherwise.
        ///     track: False if the transition should not be tracked in history, True otherwise.
        ///     update: False if the transition should not update title and back button, True otherwise.
        /// </summary>
        show: function(page, o) {
            var o = apply({
                reverse: false
            }, o);

            if (o.track !== false)
            {
                var index = context.history.indexOf(page.id);
                if (index != -1)
                {
                    o.reverse = true;
                    context.history.splice(index);
                }
            }

            if (context.dialog)
            {
                unselect(context.dialog);
                
                dispatch(context.dialog, 'blur', false);

                context.dialog = false;
            }  

            if (hasClass(page, 'dialog'))
            {
                dispatch(page, 'focus', false);

                context.dialog = page;

                select(page);
            }
            else
            {
                dispatch(page, 'load', false);

                var from = context.page;

                if (context.page) dispatch(context.page, 'blur', false);

                context.page = page;

                dispatch(page, 'focus', false);

                if (from)
                {
                    if (o.reverse) dispatch(context.page, 'unload', false);

                    wait(ReUI.transition, 0, from, page, o);
                }       
                else
                {   
                    select(page);
                                     
                    ReUI.transitionComplete(page, o);
                }
            }
        },

        transition: function(from, to, o) {            
            function complete() {
                context.check = wait(ReUI.checkOrientationAndLocation, ReUI.checkStateEvery);    
                
                wait(ReUI.transitionComplete, 0, to, o);                               
                
                dispatch(from, 'aftertransition', {out: true});            
                dispatch(to, 'aftertransition', {out: false});
            };
                      
            clearWait(context.check);

            dispatch(from, 'beforetransition', {out: true});            
            dispatch(to, 'beforetransition', {out: false});

            if (typeof o.horizontal !== 'boolean')
            {
                var toHorizontal = to.getAttribute('horizontal');                
                var fromHorizontal = from.getAttribute('horizontal');

                if (toHorizontal === 'false' || fromHorizontal === 'false')
                {
                    o.horizontal = false;
                }
            }
            
            var dir = o.horizontal !== false
                ? o.reverse ? 'r' : 'l'
                : o.reverse ? 'd' : 'u';

            var toFx = to.getAttribute('effect');
            var fromFx = from.getAttribute('effect');
            var useFx = fromFx || toFx || 'slide';

            var fx = resolveFx(useFx);
            if (fx) 
                fx(from, to, dir, complete);
        },      
        
        transitionComplete: function(page, o) {
            if (o.track !== false) 
            {
                if (typeof page.id !== 'string' || page.id.length <= 0)
                    page.id = 'liui-' + (context.counter++);

                context.hash = location.hash = "#" + page.id;

                context.history.push(page.id);
            }
          
            if (o.update !== false) 
            {
                if (ReUI.titleEl)
                {
                    if (page.title) 
                        ReUI.titleEl.innerHTML = page.title;

                    var titleCls = page.getAttribute('titleCls') || page.getAttribute('ttlclass');
                    if (titleCls)
                        ReUI.titleEl.className = titleCls;
                }

                if (ReUI.backEl)
                {
                    var previous = get(context.history[context.history.length - 2]);
                    if (previous && !previous.getAttribute('hideBackButton'))
                    {
                        ReUI.backEl.style.display = 'inline';
                        ReUI.backEl.innerHTML = previous.title || ReUI.backText;

                        var backButtonCls = previous.getAttribute('backButtonCls') || previous.getAttribute('bbclass');

                        ReUI.backEl.className = backButtonCls ? 'button ' + backButtonCls : 'button';
                    }
                    else
                    {
                        ReUI.backEl.style.display = 'none';
                    }
                }
            }
        },                            

        checkOrientationAndLocation: function() {
            if (!ReUI.hasOrientationEvent)
            {
                if ((window.innerHeight != context.height) || (window.innerWidth != context.height))
                {
                    context.height = window.innerHeight;
                    context.width = window.innerWidth;

                    ReUI.setOrientation(context.height < context.width ? 'landscape' : 'portrait');
                }
            }

            if (context.hash != location.hash)
            {
                var el = get(location.hash.substr(1));
                if (el) 
                    ReUI.show(el);                    
            }
            
            context.check = wait(ReUI.checkOrientationAndLocation, ReUI.checkStateEvery);
        },

        orientationChanged: function() {
            switch (window.orientation) 
            {                
                case 90:
                case -90:
                    ReUI.setOrientation('landscape');
                    break;
                default:
                    ReUI.setOrientation('portrait');
                    break;
            }
        },

        setOrientation: function(value) {
            ReUI.rootEl.setAttribute('orient', value);

            if (value == 'portrait') 
            {
                removeClass(ReUI.rootEl, 'landscape');
                addClass(ReUI.rootEl, 'portrait');
            }
            else if (value == 'landscape')
            {
                removeClass(ReUI.rootEl, 'portrait');
                addClass(ReUI.rootEl, 'landscape');
            }
            else
            {
                removeClass(ReUI.rootEl, 'portrait');
                removeClass(ReUI.rootEl, 'landscape');
            }

            wait(scrollTo, 100, 0, 1);
        }
    });

    bind(window, 'load', function(evt) {
        if (ReUI.autoInit)
            ReUI.init();
    });
})();