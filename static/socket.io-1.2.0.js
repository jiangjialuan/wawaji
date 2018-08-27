!function (e) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
    var t;
    "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.io = e()
  }
}(function () {
  var e, t, n;
  return function r(e, t, n) {
    function i(o, u) {
      if (!t[o]) {
        if (!e[o]) {
          var a = typeof require == "function" && require;
          if (!u && a)return a(o, !0);
          if (s)return s(o, !0);
          throw new Error("Cannot find module '" + o + "'")
        }
        var f = t[o] = {exports: {}};
        e[o][0].call(f.exports, function (t) {
          var n = e[o][1][t];
          return i(n ? n : t)
        }, f, f.exports, r, e, t, n)
      }
      return t[o].exports
    }

    var s = typeof require == "function" && require;
    for (var o = 0; o < n.length; o++)i(n[o]);
    return i
  }({
    1: [function (e, t, n) {
      t.exports = e("./lib/")
    }, {"./lib/": 2}],
    2: [function (e, t, n) {
      function r(e, t) {
        typeof e == "object" && (t = e, e = undefined), t = t || {};
        var n = i(e), r = n.source, s = n.id, f;
        return t.forceNew || t["force new connection"] || !1 === t.multiplex ? (u("ignoring socket cache for %s", r), f = o(r, t)) : (a[s] || (u("new io instance for %s", r), a[s] = o(r, t)), f = a[s]), f.socket(n.path)
      }

      var i = e("./url"), s = e("socket.io-parser"), o = e("./manager"), u = e("debug")("socket.io-client");
      t.exports = n = r;
      var a = n.managers = {};
      n.protocol = s.protocol, n.connect = r, n.Manager = e("./manager"), n.Socket = e("./socket")
    }, {"./manager": 3, "./socket": 5, "./url": 6, debug: 10, "socket.io-parser": 46}],
    3: [function (e, t, n) {
      function r(e, t) {
        if (!(this instanceof r))return new r(e, t);
        e && "object" == typeof e && (t = e, e = undefined), t = t || {}, t.path = t.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = t, this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || Infinity), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor(t.randomizationFactor || .5), this.backoff = new d({
          min: this.reconnectionDelay(),
          max: this.reconnectionDelayMax(),
          jitter: this.randomizationFactor()
        }), this.timeout(null == t.timeout ? 2e4 : t.timeout), this.readyState = "closed", this.uri = e, this.connected = [], this.encoding = !1, this.packetBuffer = [], this.encoder = new a.Encoder, this.decoder = new a.Decoder, this.autoConnect = t.autoConnect !== !1, this.autoConnect && this.open()
      }

      var i = e("./url"), s = e("engine.io-client"), o = e("./socket"), u = e("component-emitter"), a = e("socket.io-parser"), f = e("./on"), l = e("component-bind"), c = e("object-component"), h = e("debug")("socket.io-client:manager"), p = e("indexof"), d = e("backo2");
      t.exports = r, r.prototype.emitAll = function () {
        this.emit.apply(this, arguments);
        for (var e in this.nsps)this.nsps[e].emit.apply(this.nsps[e], arguments)
      }, r.prototype.updateSocketIds = function () {
        for (var e in this.nsps)this.nsps[e].id = this.engine.id
      }, u(r.prototype), r.prototype.reconnection = function (e) {
        return arguments.length ? (this._reconnection = !!e, this) : this._reconnection
      }, r.prototype.reconnectionAttempts = function (e) {
        return arguments.length ? (this._reconnectionAttempts = e, this) : this._reconnectionAttempts
      }, r.prototype.reconnectionDelay = function (e) {
        return arguments.length ? (this._reconnectionDelay = e, this.backoff && this.backoff.setMin(e), this) : this._reconnectionDelay
      }, r.prototype.randomizationFactor = function (e) {
        return arguments.length ? (this._randomizationFactor = e, this.backoff && this.backoff.setJitter(e), this) : this._randomizationFactor
      }, r.prototype.reconnectionDelayMax = function (e) {
        return arguments.length ? (this._reconnectionDelayMax = e, this.backoff && this.backoff.setMax(e), this) : this._reconnectionDelayMax
      }, r.prototype.timeout = function (e) {
        return arguments.length ? (this._timeout = e, this) : this._timeout
      }, r.prototype.maybeReconnectOnOpen = function () {
        !this.reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect()
      }, r.prototype.open = r.prototype.connect = function (e) {
        h("readyState %s", this.readyState);
        if (~this.readyState.indexOf("open"))return this;
        h("opening %s", this.uri), this.engine = s(this.uri, this.opts);
        var t = this.engine, n = this;
        this.readyState = "opening", this.skipReconnect = !1;
        var r = f(t, "open", function () {
          n.onopen(), e && e()
        }), i = f(t, "error", function (t) {
          h("connect_error"), n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", t);
          if (e) {
            var r = new Error("Connection error");
            r.data = t, e(r)
          } else n.maybeReconnectOnOpen()
        });
        if (!1 !== this._timeout) {
          var o = this._timeout;
          h("connect attempt will timeout after %d", o);
          var u = setTimeout(function () {
            h("connect attempt timed out after %d", o), r.destroy(), t.close(), t.emit("error", "timeout"), n.emitAll("connect_timeout", o)
          }, o);
          this.subs.push({
            destroy: function () {
              clearTimeout(u)
            }
          })
        }
        return this.subs.push(r), this.subs.push(i), this
      }, r.prototype.onopen = function () {
        h("open"), this.cleanup(), this.readyState = "open", this.emit("open");
        var e = this.engine;
        this.subs.push(f(e, "data", l(this, "ondata"))), this.subs.push(f(this.decoder, "decoded", l(this, "ondecoded"))), this.subs.push(f(e, "error", l(this, "onerror"))), this.subs.push(f(e, "close", l(this, "onclose")))
      }, r.prototype.ondata = function (e) {
        this.decoder.add(e)
      }, r.prototype.ondecoded = function (e) {
        this.emit("packet", e)
      }, r.prototype.onerror = function (e) {
        h("error", e), this.emitAll("error", e)
      }, r.prototype.socket = function (e) {
        var t = this.nsps[e];
        if (!t) {
          t = new o(this, e), this.nsps[e] = t;
          var n = this;
          t.on("connect", function () {
            t.id = n.engine.id, ~p(n.connected, t) || n.connected.push(t)
          })
        }
        return t
      }, r.prototype.destroy = function (e) {
        var t = p(this.connected, e);
        ~t && this.connected.splice(t, 1);
        if (this.connected.length)return;
        this.close()
      }, r.prototype.packet = function (e) {
        h("writing packet %j", e);
        var t = this;
        t.encoding ? t.packetBuffer.push(e) : (t.encoding = !0, this.encoder.encode(e, function (e) {
            for (var n = 0; n < e.length; n++)t.engine.write(e[n]);
            t.encoding = !1, t.processPacketQueue()
          }))
      }, r.prototype.processPacketQueue = function () {
        if (this.packetBuffer.length > 0 && !this.encoding) {
          var e = this.packetBuffer.shift();
          this.packet(e)
        }
      }, r.prototype.cleanup = function () {
        var e;
        while (e = this.subs.shift())e.destroy();
        this.packetBuffer = [], this.encoding = !1, this.decoder.destroy()
      }, r.prototype.close = r.prototype.disconnect = function () {
        this.skipReconnect = !0, this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
      }, r.prototype.onclose = function (e) {
        h("close"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", e), this._reconnection && !this.skipReconnect && this.reconnect()
      }, r.prototype.reconnect = function () {
        if (this.reconnecting || this.skipReconnect)return this;
        var e = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) h("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1; else {
          var t = this.backoff.duration();
          h("will wait %dms before reconnect attempt", t), this.reconnecting = !0;
          var n = setTimeout(function () {
            if (e.skipReconnect)return;
            h("attempting reconnect"), e.emitAll("reconnect_attempt", e.backoff.attempts), e.emitAll("reconnecting", e.backoff.attempts);
            if (e.skipReconnect)return;
            e.open(function (t) {
              t ? (h("reconnect attempt error"), e.reconnecting = !1, e.reconnect(), e.emitAll("reconnect_error", t.data)) : (h("reconnect success"), e.onreconnect())
            })
          }, t);
          this.subs.push({
            destroy: function () {
              clearTimeout(n)
            }
          })
        }
      }, r.prototype.onreconnect = function () {
        var e = this.backoff.attempts;
        this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", e)
      }
    }, {
      "./on": 4,
      "./socket": 5,
      "./url": 6,
      backo2: 7,
      "component-bind": 8,
      "component-emitter": 9,
      debug: 10,
      "engine.io-client": 11,
      indexof: 42,
      "object-component": 43,
      "socket.io-parser": 46
    }],
    4: [function (e, t, n) {
      function r(e, t, n) {
        return e.on(t, n), {
          destroy: function () {
            e.removeListener(t, n)
          }
        }
      }

      t.exports = r
    }, {}],
    5: [function (e, t, n) {
      function r(e, t) {
        this.io = e, this.nsp = t, this.json = this, this.ids = 0, this.acks = {}, this.io.autoConnect && this.open(), this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0
      }

      var i = e("socket.io-parser"), s = e("component-emitter"), o = e("to-array"), u = e("./on"), a = e("component-bind"), f = e("debug")("socket.io-client:socket"), l = e("has-binary");
      t.exports = n = r;
      var c = {
        connect: 1,
        connect_error: 1,
        connect_timeout: 1,
        disconnect: 1,
        error: 1,
        reconnect: 1,
        reconnect_attempt: 1,
        reconnect_failed: 1,
        reconnect_error: 1,
        reconnecting: 1
      }, h = s.prototype.emit;
      s(r.prototype), r.prototype.subEvents = function () {
        if (this.subs)return;
        var e = this.io;
        this.subs = [u(e, "open", a(this, "onopen")), u(e, "packet", a(this, "onpacket")), u(e, "close", a(this, "onclose"))]
      }, r.prototype.open = r.prototype.connect = function () {
        return this.connected ? this : (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this)
      }, r.prototype.send = function () {
        var e = o(arguments);
        return e.unshift("message"), this.emit.apply(this, e), this
      }, r.prototype.emit = function (e) {
        if (c.hasOwnProperty(e))return h.apply(this, arguments), this;
        var t = o(arguments), n = i.EVENT;
        l(t) && (n = i.BINARY_EVENT);
        var r = {type: n, data: t};
        return "function" == typeof t[t.length - 1] && (f("emitting packet with ack id %d", this.ids), this.acks[this.ids] = t.pop(), r.id = this.ids++), this.connected ? this.packet(r) : this.sendBuffer.push(r), this
      }, r.prototype.packet = function (e) {
        e.nsp = this.nsp, this.io.packet(e)
      }, r.prototype.onopen = function () {
        f("transport is open - connecting"), "/" != this.nsp && this.packet({type: i.CONNECT})
      }, r.prototype.onclose = function (e) {
        f("close (%s)", e), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", e)
      }, r.prototype.onpacket = function (e) {
        if (e.nsp != this.nsp)return;
        switch (e.type) {
          case i.CONNECT:
            this.onconnect();
            break;
          case i.EVENT:
            this.onevent(e);
            break;
          case i.BINARY_EVENT:
            this.onevent(e);
            break;
          case i.ACK:
            this.onack(e);
            break;
          case i.BINARY_ACK:
            this.onack(e);
            break;
          case i.DISCONNECT:
            this.ondisconnect();
            break;
          case i.ERROR:
            this.emit("error", e.data)
        }
      }, r.prototype.onevent = function (e) {
        var t = e.data || [];
        f("emitting event %j", t), null != e.id && (f("attaching ack callback to event"), t.push(this.ack(e.id))), this.connected ? h.apply(this, t) : this.receiveBuffer.push(t)
      }, r.prototype.ack = function (e) {
        var t = this, n = !1;
        return function () {
          if (n)return;
          n = !0;
          var r = o(arguments);
          f("sending ack %j", r);
          var s = l(r) ? i.BINARY_ACK : i.ACK;
          t.packet({type: s, id: e, data: r})
        }
      }, r.prototype.onack = function (e) {
        f("calling ack %s with %j", e.id, e.data);
        var t = this.acks[e.id];
        t.apply(this, e.data), delete this.acks[e.id]
      }, r.prototype.onconnect = function () {
        this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
      }, r.prototype.emitBuffered = function () {
        var e;
        for (e = 0; e < this.receiveBuffer.length; e++)h.apply(this, this.receiveBuffer[e]);
        this.receiveBuffer = [];
        for (e = 0; e < this.sendBuffer.length; e++)this.packet(this.sendBuffer[e]);
        this.sendBuffer = []
      }, r.prototype.ondisconnect = function () {
        f("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
      }, r.prototype.destroy = function () {
        if (this.subs) {
          for (var e = 0; e < this.subs.length; e++)this.subs[e].destroy();
          this.subs = null
        }
        this.io.destroy(this)
      }, r.prototype.close = r.prototype.disconnect = function () {
        return this.connected && (f("performing disconnect (%s)", this.nsp), this.packet({type: i.DISCONNECT})), this.destroy(), this.connected && this.onclose("io client disconnect"), this
      }
    }, {
      "./on": 4,
      "component-bind": 8,
      "component-emitter": 9,
      debug: 10,
      "has-binary": 38,
      "socket.io-parser": 46,
      "to-array": 50
    }],
    6: [function (e, t, n) {
      (function (n) {
        function r(e, t) {
          var r = e, t = t || n.location;
          return null == e && (e = t.protocol + "//" + t.host), "string" == typeof e && ("/" == e.charAt(0) && ("/" == e.charAt(1) ? e = t.protocol + e : e = t.hostname + e), /^(https?|wss?):\/\//.test(e) || (s("protocol-less url %s", e), "undefined" != typeof t ? e = t.protocol + "//" + e : e = "https://" + e), s("parse %s", e), r = i(e)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/", r.id = r.protocol + "://" + r.host + ":" + r.port, r.href = r.protocol + "://" + r.host + (t && t.port == r.port ? "" : ":" + r.port), r
        }

        var i = e("parseuri"), s = e("debug")("socket.io-client:url");
        t.exports = r
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {debug: 10, parseuri: 44}],
    7: [function (e, t, n) {
      function r(e) {
        e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0
      }

      t.exports = r, r.prototype.duration = function () {
        var e = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var t = Math.random(), n = Math.floor(t * this.jitter * e);
          e = (Math.floor(t * 10) & 1) == 0 ? e - n : e + n
        }
        return Math.min(e, this.max) | 0
      }, r.prototype.reset = function () {
        this.attempts = 0
      }, r.prototype.setMin = function (e) {
        this.ms = e
      }, r.prototype.setMax = function (e) {
        this.max = e
      }, r.prototype.setJitter = function (e) {
        this.jitter = e
      }
    }, {}],
    8: [function (e, t, n) {
      var r = [].slice;
      t.exports = function (e, t) {
        "string" == typeof t && (t = e[t]);
        if ("function" != typeof t)throw new Error("bind() requires a function");
        var n = r.call(arguments, 2);
        return function () {
          return t.apply(e, n.concat(r.call(arguments)))
        }
      }
    }, {}],
    9: [function (e, t, n) {
      function r(e) {
        if (e)return i(e)
      }

      function i(e) {
        for (var t in r.prototype)e[t] = r.prototype[t];
        return e
      }

      t.exports = r, r.prototype.on = r.prototype.addEventListener = function (e, t) {
        return this._callbacks = this._callbacks || {}, (this._callbacks[e] = this._callbacks[e] || []).push(t), this
      }, r.prototype.once = function (e, t) {
        function n() {
          r.off(e, n), t.apply(this, arguments)
        }

        var r = this;
        return this._callbacks = this._callbacks || {}, n.fn = t, this.on(e, n), this
      }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (e, t) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length)return this._callbacks = {}, this;
        var n = this._callbacks[e];
        if (!n)return this;
        if (1 == arguments.length)return delete this._callbacks[e], this;
        var r;
        for (var i = 0; i < n.length; i++) {
          r = n[i];
          if (r === t || r.fn === t) {
            n.splice(i, 1);
            break
          }
        }
        return this
      }, r.prototype.emit = function (e) {
        this._callbacks = this._callbacks || {};
        var t = [].slice.call(arguments, 1), n = this._callbacks[e];
        if (n) {
          n = n.slice(0);
          for (var r = 0, i = n.length; r < i; ++r)n[r].apply(this, t)
        }
        return this
      }, r.prototype.listeners = function (e) {
        return this._callbacks = this._callbacks || {}, this._callbacks[e] || []
      }, r.prototype.hasListeners = function (e) {
        return !!this.listeners(e).length
      }
    }, {}],
    10: [function (e, t, n) {
      function r(e) {
        return r.enabled(e) ? function (t) {
            t = i(t);
            var n = new Date, s = n - (r[e] || n);
            r[e] = n, t = e + " " + t + " +" + r.humanize(s), window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
          } : function () {
          }
      }

      function i(e) {
        return e instanceof Error ? e.stack || e.message : e
      }

      t.exports = r, r.names = [], r.skips = [], r.enable = function (e) {
        try {
          localStorage.debug = e
        } catch (t) {
        }
        var n = (e || "").split(/[\s,]+/), i = n.length;
        for (var s = 0; s < i; s++)e = n[s].replace("*", ".*?"), e[0] === "-" ? r.skips.push(new RegExp("^" + e.substr(1) + "$")) : r.names.push(new RegExp("^" + e + "$"))
      }, r.disable = function () {
        r.enable("")
      }, r.humanize = function (e) {
        var t = 1e3, n = 6e4, r = 60 * n;
        return e >= r ? (e / r).toFixed(1) + "h" : e >= n ? (e / n).toFixed(1) + "m" : e >= t ? (e / t | 0) + "s" : e + "ms"
      }, r.enabled = function (e) {
        for (var t = 0, n = r.skips.length; t < n; t++)if (r.skips[t].test(e))return !1;
        for (var t = 0, n = r.names.length; t < n; t++)if (r.names[t].test(e))return !0;
        return !1
      };
      try {
        window.localStorage && r.enable(localStorage.debug)
      } catch (s) {
      }
    }, {}],
    11: [function (e, t, n) {
      t.exports = e("./lib/")
    }, {"./lib/": 12}],
    12: [function (e, t, n) {
      t.exports = e("./socket"), t.exports.parser = e("engine.io-parser")
    }, {"./socket": 13, "engine.io-parser": 25}],
    13: [function (e, t, n) {
      (function (n) {
        function r() {
        }

        function i(e, t) {
          if (!(this instanceof i))return new i(e, t);
          t = t || {}, e && "object" == typeof e && (t = e, e = null), e && (e = c(e), t.host = e.host, t.secure = e.protocol == "https" || e.protocol == "wss", t.port = e.port, e.query && (t.query = e.query)), this.secure = null != t.secure ? t.secure : n.location && "https:" == location.protocol;
          if (t.host) {
            var r = t.host.split(":");
            t.hostname = r.shift(), r.length ? t.port = r.pop() : t.port || (t.port = this.secure ? "443" : "80")
          }
          this.agent = t.agent || !1, this.hostname = t.hostname || (n.location ? location.hostname : "localhost"), this.port = t.port || (n.location && location.port ? location.port : this.secure ? 443 : 80), this.query = t.query || {}, "string" == typeof this.query && (this.query = p.decode(this.query)), this.upgrade = !1 !== t.upgrade, this.path = (t.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!t.forceJSONP, this.jsonp = !1 !== t.jsonp, this.forceBase64 = !!t.forceBase64, this.enablesXDR = !!t.enablesXDR, this.timestampParam = t.timestampParam || "t", this.timestampRequests = t.timestampRequests, this.transports = t.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.callbackBuffer = [], this.policyPort = t.policyPort || 843, this.rememberUpgrade = t.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = t.onlyBinaryUpgrades, this.pfx = t.pfx || null, this.key = t.key || null, this.passphrase = t.passphrase || null, this.cert = t.cert || null, this.ca = t.ca || null, this.ciphers = t.ciphers || null, this.rejectUnauthorized = t.rejectUnauthorized || null, this.open()
        }

        function s(e) {
          var t = {};
          for (var n in e)e.hasOwnProperty(n) && (t[n] = e[n]);
          return t
        }

        var o = e("./transports"), u = e("component-emitter"), a = e("debug")("engine.io-client:socket"), f = e("indexof"), l = e("engine.io-parser"), c = e("parseuri"), h = e("parsejson"), p = e("parseqs");
        t.exports = i, i.priorWebsocketSuccess = !1, u(i.prototype), i.protocol = l.protocol, i.Socket = i, i.Transport = e("./transport"), i.transports = e("./transports"), i.parser = e("engine.io-parser"), i.prototype.createTransport = function (e) {
          a('creating transport "%s"', e);
          var t = s(this.query);
          t.EIO = l.protocol, t.transport = e, this.id && (t.sid = this.id);
          var n = new o[e]({
            agent: this.agent,
            hostname: this.hostname,
            port: this.port,
            secure: this.secure,
            path: this.path,
            query: t,
            forceJSONP: this.forceJSONP,
            jsonp: this.jsonp,
            forceBase64: this.forceBase64,
            enablesXDR: this.enablesXDR,
            timestampRequests: this.timestampRequests,
            timestampParam: this.timestampParam,
            policyPort: this.policyPort,
            socket: this,
            pfx: this.pfx,
            key: this.key,
            passphrase: this.passphrase,
            cert: this.cert,
            ca: this.ca,
            ciphers: this.ciphers,
            rejectUnauthorized: this.rejectUnauthorized
          });
          return n
        }, i.prototype.open = function () {
          var e;
          if (this.rememberUpgrade && i.priorWebsocketSuccess && this.transports.indexOf("websocket") != -1) e = "websocket"; else {
            if (0 == this.transports.length) {
              var t = this;
              setTimeout(function () {
                t.emit("error", "No transports available")
              }, 0);
              return
            }
            e = this.transports[0]
          }
          this.readyState = "opening";
          var e;
          try {
            e = this.createTransport(e)
          } catch (n) {
            this.transports.shift(), this.open();
            return
          }
          e.open(), this.setTransport(e)
        }, i.prototype.setTransport = function (e) {
          a("setting transport %s", e.name);
          var t = this;
          this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = e, e.on("drain", function () {
            t.onDrain()
          }).on("packet", function (e) {
            t.onPacket(e)
          }).on("error", function (e) {
            t.onError(e)
          }).on("close", function () {
            t.onClose("transport close")
          })
        }, i.prototype.probe = function (e) {
          function t() {
            if (h.onlyBinaryUpgrades) {
              var t = !this.supportsBinary && h.transport.supportsBinary;
              c = c || t
            }
            if (c)return;
            a('probe transport "%s" opened', e), l.send([{
              type: "ping",
              data: "probe"
            }]), l.once("packet", function (t) {
              if (c)return;
              if ("pong" == t.type && "probe" == t.data) {
                a('probe transport "%s" pong', e), h.upgrading = !0, h.emit("upgrading", l);
                if (!l)return;
                i.priorWebsocketSuccess = "websocket" == l.name, a('pausing current transport "%s"', h.transport.name), h.transport.pause(function () {
                  if (c)return;
                  if ("closed" == h.readyState)return;
                  a("changing transport and sending upgrade packet"), f(), h.setTransport(l), l.send([{type: "upgrade"}]), h.emit("upgrade", l), l = null, h.upgrading = !1, h.flush()
                })
              } else {
                a('probe transport "%s" failed', e);
                var n = new Error("probe error");
                n.transport = l.name, h.emit("upgradeError", n)
              }
            })
          }

          function n() {
            if (c)return;
            c = !0, f(), l.close(), l = null
          }

          function r(t) {
            var r = new Error("probe error: " + t);
            r.transport = l.name, n(), a('probe transport "%s" failed because of error: %s', e, t), h.emit("upgradeError", r)
          }

          function s() {
            r("transport closed")
          }

          function o() {
            r("socket closed")
          }

          function u(e) {
            l && e.name != l.name && (a('"%s" works - aborting "%s"', e.name, l.name), n())
          }

          function f() {
            l.removeListener("open", t), l.removeListener("error", r), l.removeListener("close", s), h.removeListener("close", o), h.removeListener("upgrading", u)
          }

          a('probing transport "%s"', e);
          var l = this.createTransport(e, {probe: 1}), c = !1, h = this;
          i.priorWebsocketSuccess = !1, l.once("open", t), l.once("error", r), l.once("close", s), this.once("close", o), this.once("upgrading", u), l.open()
        }, i.prototype.onOpen = function () {
          a("socket open"), this.readyState = "open", i.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush();
          if ("open" == this.readyState && this.upgrade && this.transport.pause) {
            a("starting upgrade probes");
            for (var e = 0, t = this.upgrades.length; e < t; e++)this.probe(this.upgrades[e])
          }
        }, i.prototype.onPacket = function (e) {
          if ("opening" == this.readyState || "open" == this.readyState) {
            a('socket receive: type "%s", data "%s"', e.type, e.data), this.emit("packet", e), this.emit("heartbeat");
            switch (e.type) {
              case"open":
                this.onHandshake(h(e.data));
                break;
              case"pong":
                this.setPing();
                break;
              case"error":
                var t = new Error("server error");
                t.code = e.data, this.emit("error", t);
                break;
              case"message":
                this.emit("data", e.data), this.emit("message", e.data)
            }
          } else a('packet received with socket readyState "%s"', this.readyState)
        }, i.prototype.onHandshake = function (e) {
          this.emit("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.onOpen();
          if ("closed" == this.readyState)return;
          this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat)
        }, i.prototype.onHeartbeat = function (e) {
          clearTimeout(this.pingTimeoutTimer);
          var t = this;
          t.pingTimeoutTimer = setTimeout(function () {
            if ("closed" == t.readyState)return;
            t.onClose("ping timeout")
          }, e || t.pingInterval + t.pingTimeout)
        }, i.prototype.setPing = function () {
          var e = this;
          clearTimeout(e.pingIntervalTimer), e.pingIntervalTimer = setTimeout(function () {
            a("writing ping packet - expecting pong within %sms", e.pingTimeout), e.ping(), e.onHeartbeat(e.pingTimeout)
          }, e.pingInterval)
        }, i.prototype.ping = function () {
          this.sendPacket("ping")
        }, i.prototype.onDrain = function () {
          for (var e = 0; e < this.prevBufferLen; e++)this.callbackBuffer[e] && this.callbackBuffer[e]();
          this.writeBuffer.splice(0, this.prevBufferLen), this.callbackBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, this.writeBuffer.length == 0 ? this.emit("drain") : this.flush()
        }, i.prototype.flush = function () {
          "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
        }, i.prototype.write = i.prototype.send = function (e, t) {
          return this.sendPacket("message", e, t), this
        }, i.prototype.sendPacket = function (e, t, n) {
          if ("closing" == this.readyState || "closed" == this.readyState)return;
          var r = {type: e, data: t};
          this.emit("packetCreate", r), this.writeBuffer.push(r), this.callbackBuffer.push(n), this.flush()
        }, i.prototype.close = function () {
          if ("opening" == this.readyState || "open" == this.readyState) {
            this.readyState = "closing";
            var e = this;

            function t() {
              e.onClose("forced close"), a("socket closing - telling transport to close"), e.transport.close()
            }

            function n() {
              e.removeListener("upgrade", n), e.removeListener("upgradeError", n), t()
            }

            function r() {
              e.once("upgrade", n), e.once("upgradeError", n)
            }

            this.writeBuffer.length ? this.once("drain", function () {
                this.upgrading ? r() : t()
              }) : this.upgrading ? r() : t()
          }
          return this
        }, i.prototype.onError = function (e) {
          a("socket error %j", e), i.priorWebsocketSuccess = !1, this.emit("error", e), this.onClose("transport error", e)
        }, i.prototype.onClose = function (e, t) {
          if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
            a('socket close with reason: "%s"', e);
            var n = this;
            clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), setTimeout(function () {
              n.writeBuffer = [], n.callbackBuffer = [], n.prevBufferLen = 0
            }, 0), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", e, t)
          }
        }, i.prototype.filterUpgrades = function (e) {
          var t = [];
          for (var n = 0, r = e.length; n < r; n++)~f(this.transports, e[n]) && t.push(e[n]);
          return t
        }
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {
      "./transport": 14,
      "./transports": 15,
      "component-emitter": 9,
      debug: 22,
      "engine.io-parser": 25,
      indexof: 42,
      parsejson: 34,
      parseqs: 35,
      parseuri: 36
    }],
    14: [function (e, t, n) {
      function r(e) {
        this.path = e.path, this.hostname = e.hostname, this.port = e.port, this.secure = e.secure, this.query = e.query, this.timestampParam = e.timestampParam, this.timestampRequests = e.timestampRequests, this.readyState = "", this.agent = e.agent || !1, this.socket = e.socket, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized
      }

      var i = e("engine.io-parser"), s = e("component-emitter");
      t.exports = r, s(r.prototype), r.timestamps = 0, r.prototype.onError = function (e, t) {
        var n = new Error(e);
        return n.type = "TransportError", n.description = t, this.emit("error", n), this
      }, r.prototype.open = function () {
        if ("closed" == this.readyState || "" == this.readyState) this.readyState = "opening", this.doOpen();
        return this
      }, r.prototype.close = function () {
        if ("opening" == this.readyState || "open" == this.readyState) this.doClose(), this.onClose();
        return this
      }, r.prototype.send = function (e) {
        if ("open" != this.readyState)throw new Error("Transport not open");
        this.write(e)
      }, r.prototype.onOpen = function () {
        this.readyState = "open", this.writable = !0, this.emit("open")
      }, r.prototype.onData = function (e) {
        var t = i.decodePacket(e, this.socket.binaryType);
        this.onPacket(t)
      }, r.prototype.onPacket = function (e) {
        this.emit("packet", e)
      }, r.prototype.onClose = function () {
        this.readyState = "closed", this.emit("close")
      }
    }, {"component-emitter": 9, "engine.io-parser": 25}],
    15: [function (e, t, n) {
      (function (t) {
        function r(e) {
          var n, r = !1, u = !1, a = !1 !== e.jsonp;
          if (t.location) {
            var f = "https:" == location.protocol, l = location.port;
            l || (l = f ? 443 : 80), r = e.hostname != location.hostname || l != e.port, u = e.secure != f
          }
          e.xdomain = r, e.xscheme = u, n = new i(e);
          if ("open" in n && !e.forceJSONP)return new s(e);
          if (!a)throw new Error("JSONP disabled");
          return new o(e)
        }

        var i = e("xmlhttprequest"), s = e("./polling-xhr"), o = e("./polling-jsonp"), u = e("./websocket");
        n.polling = r, n.websocket = u
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {"./polling-jsonp": 16, "./polling-xhr": 17, "./websocket": 19, xmlhttprequest: 20}],
    16: [function (e, t, n) {
      (function (n) {
        function r() {
        }

        function i(e) {
          s.call(this, e), this.query = this.query || {}, f || (n.___eio || (n.___eio = []), f = n.___eio), this.index = f.length;
          var t = this;
          f.push(function (e) {
            t.onData(e)
          }), this.query.j = this.index, n.document && n.addEventListener && n.addEventListener("beforeunload", function () {
            t.script && (t.script.onerror = r)
          }, !1)
        }

        var s = e("./polling"), o = e("component-inherit");
        t.exports = i;
        var u = /\n/g, a = /\\n/g, f, l = 0;
        o(i, s), i.prototype.supportsBinary = !1, i.prototype.doClose = function () {
          this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), s.prototype.doClose.call(this)
        }, i.prototype.doPoll = function () {
          var e = this, t = document.createElement("script");
          this.script && (this.script.parentNode.removeChild(this.script), this.script = null), t.async = !0, t.src = this.uri(), t.onerror = function (t) {
            e.onError("jsonp poll error", t)
          };
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(t, n), this.script = t;
          var r = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
          r && setTimeout(function () {
            var e = document.createElement("iframe");
            document.body.appendChild(e), document.body.removeChild(e)
          }, 100)
        }, i.prototype.doWrite = function (e, t) {
          function n() {
            r(), t()
          }

          function r() {
            if (i.iframe)try {
              i.form.removeChild(i.iframe)
            } catch (e) {
              i.onError("jsonp polling iframe removal error", e)
            }
            try {
              var t = '<iframe src="javascript:0" name="' + i.iframeId + '">';
              l = document.createElement(t)
            } catch (e) {
              l = document.createElement("iframe"), l.name = i.iframeId, l.src = "javascript:0"
            }
            l.id = i.iframeId, i.form.appendChild(l), i.iframe = l
          }

          var i = this;
          if (!this.form) {
            var s = document.createElement("form"), o = document.createElement("textarea"), f = this.iframeId = "eio_iframe_" + this.index, l;
            s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = f, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), o.name = "d", s.appendChild(o), document.body.appendChild(s), this.form = s, this.area = o
          }
          this.form.action = this.uri(), r(), e = e.replace(a, "\\\n"), this.area.value = e.replace(u, "\\n");
          try {
            this.form.submit()
          } catch (c) {
          }
          this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
              i.iframe.readyState == "complete" && n()
            } : this.iframe.onload = n
        }
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {"./polling": 18, "component-inherit": 21}],
    17: [function (e, t, n) {
      (function (n) {
        function r() {
        }

        function i(e) {
          a.call(this, e);
          if (n.location) {
            var t = "https:" == location.protocol, r = location.port;
            r || (r = t ? 443 : 80), this.xd = e.hostname != n.location.hostname || r != e.port, this.xs = e.secure != t
          }
        }

        function s(e) {
          this.method = e.method || "GET", this.uri = e.uri, this.xd = !!e.xd, this.xs = !!e.xs, this.async = !1 !== e.async, this.data = undefined != e.data ? e.data : null, this.agent = e.agent, this.isBinary = e.isBinary, this.supportsBinary = e.supportsBinary, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.create()
        }

        function o() {
          for (var e in s.requests)s.requests.hasOwnProperty(e) && s.requests[e].abort()
        }

        var u = e("xmlhttprequest"), a = e("./polling"), f = e("component-emitter"), l = e("component-inherit"), c = e("debug")("engine.io-client:polling-xhr");
        t.exports = i, t.exports.Request = s, l(i, a), i.prototype.supportsBinary = !0, i.prototype.request = function (e) {
          return e = e || {}, e.uri = this.uri(), e.xd = this.xd, e.xs = this.xs, e.agent = this.agent || !1, e.supportsBinary = this.supportsBinary, e.enablesXDR = this.enablesXDR, e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized, new s(e)
        }, i.prototype.doWrite = function (e, t) {
          var n = typeof e != "string" && e !== undefined, r = this.request({
            method: "POST",
            data: e,
            isBinary: n
          }), i = this;
          r.on("success", t), r.on("error", function (e) {
            i.onError("xhr post error", e)
          }), this.sendXhr = r
        }, i.prototype.doPoll = function () {
          c("xhr poll");
          var e = this.request(), t = this;
          e.on("data", function (e) {
            t.onData(e)
          }), e.on("error", function (e) {
            t.onError("xhr poll error", e)
          }), this.pollXhr = e
        }, f(s.prototype), s.prototype.create = function () {
          var e = {agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR};
          e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized;
          var t = this.xhr = new u(e), r = this;
          try {
            c("xhr open %s: %s", this.method, this.uri), t.open(this.method, this.uri, this.async), this.supportsBinary && (t.responseType = "arraybuffer");
            if ("POST" == this.method)try {
              this.isBinary ? t.setRequestHeader("Content-type", "application/octet-stream") : t.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
            } catch (i) {
            }
            "withCredentials" in t && (t.withCredentials = !0), this.hasXDR() ? (t.onload = function () {
                r.onLoad()
              }, t.onerror = function () {
                r.onError(t.responseText)
              }) : t.onreadystatechange = function () {
                if (4 != t.readyState)return;
                200 == t.status || 1223 == t.status ? r.onLoad() : setTimeout(function () {
                    r.onError(t.status)
                  }, 0)
              }, c("xhr data %s", this.data), t.send(this.data)
          } catch (i) {
            setTimeout(function () {
              r.onError(i)
            }, 0);
            return
          }
          n.document && (this.index = s.requestsCount++, s.requests[this.index] = this)
        }, s.prototype.onSuccess = function () {
          this.emit("success"), this.cleanup()
        }, s.prototype.onData = function (e) {
          this.emit("data", e), this.onSuccess()
        }, s.prototype.onError = function (e) {
          this.emit("error", e), this.cleanup(!0)
        }, s.prototype.cleanup = function (e) {
          if ("undefined" == typeof this.xhr || null === this.xhr)return;
          this.hasXDR() ? this.xhr.onload = this.xhr.onerror = r : this.xhr.onreadystatechange = r;
          if (e)try {
            this.xhr.abort()
          } catch (t) {
          }
          n.document && delete s.requests[this.index], this.xhr = null
        }, s.prototype.onLoad = function () {
          var e;
          try {
            var t;
            try {
              t = this.xhr.getResponseHeader("Content-Type").split(";")[0]
            } catch (n) {
            }
            t === "application/octet-stream" ? e = this.xhr.response : this.supportsBinary ? e = "ok" : e = this.xhr.responseText
          } catch (n) {
            this.onError(n)
          }
          null != e && this.onData(e)
        }, s.prototype.hasXDR = function () {
          return "undefined" != typeof n.XDomainRequest && !this.xs && this.enablesXDR
        }, s.prototype.abort = function () {
          this.cleanup()
        }, n.document && (s.requestsCount = 0, s.requests = {}, n.attachEvent ? n.attachEvent("onunload", o) : n.addEventListener && n.addEventListener("beforeunload", o, !1))
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {"./polling": 18, "component-emitter": 9, "component-inherit": 21, debug: 22, xmlhttprequest: 20}],
    18: [function (e, t, n) {
      function r(e) {
        var t = e && e.forceBase64;
        if (!f || t) this.supportsBinary = !1;
        i.call(this, e)
      }

      var i = e("../transport"), s = e("parseqs"), o = e("engine.io-parser"), u = e("component-inherit"), a = e("debug")("engine.io-client:polling");
      t.exports = r;
      var f = function () {
        var t = e("xmlhttprequest"), n = new t({xdomain: !1});
        return null != n.responseType
      }();
      u(r, i), r.prototype.name = "polling", r.prototype.doOpen = function () {
        this.poll()
      }, r.prototype.pause = function (e) {
        function t() {
          a("paused"), r.readyState = "paused", e()
        }

        var n = 0, r = this;
        this.readyState = "pausing";
        if (this.polling || !
            this.writable) {
          var i = 0;
          this.polling && (a("we are currently polling - waiting to pause"), i++, this.once("pollComplete", function () {
            a("pre-pause polling complete"), --i || t()
          })), this.writable || (a("we are currently writing - waiting to pause"), i++, this.once("drain", function () {
            a("pre-pause writing complete"), --i || t()
          }))
        } else t()
      }, r.prototype.poll = function () {
        a("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
      }, r.prototype.onData = function (e) {
        var t = this;
        a("polling got data %s", e);
        var n = function (e, n, r) {
          "opening" == t.readyState && t.onOpen();
          if ("close" == e.type)return t.onClose(), !1;
          t.onPacket(e)
        };
        o.decodePayload(e, this.socket.binaryType, n), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : a('ignoring poll - transport state "%s"', this.readyState))
      }, r.prototype.doClose = function () {
        function e() {
          a("writing close packet"), t.write([{type: "close"}])
        }

        var t = this;
        "open" == this.readyState ? (a("transport open - closing"), e()) : (a("transport not open - deferring close"), this.once("open", e))
      }, r.prototype.write = function (e) {
        var t = this;
        this.writable = !1;
        var n = function () {
          t.writable = !0, t.emit("drain")
        }, t = this;
        o.encodePayload(e, this.supportsBinary, function (e) {
          t.doWrite(e, n)
        })
      }, r.prototype.uri = function () {
        var e = this.query || {}, t = this.secure ? "https" : "http", n = "";
        return !1 !== this.timestampRequests && (e[this.timestampParam] = +(new Date) + "-" + i.timestamps++), !this.supportsBinary && !e.sid && (e.b64 = 1), e = s.encode(e), this.port && ("https" == t && this.port != 443 || "http" == t && this.port != 80) && (n = ":" + this.port), e.length && (e = "?" + e), t + "://" + this.hostname + n + this.path + e
      }
    }, {
      "../transport": 14,
      "component-inherit": 21,
      debug: 22,
      "engine.io-parser": 25,
      parseqs: 35,
      xmlhttprequest: 20
    }],
    19: [function (e, t, n) {
      function r(e) {
        var t = e && e.forceBase64;
        t && (this.supportsBinary = !1), i.call(this, e)
      }

      var i = e("../transport"), s = e("engine.io-parser"), o = e("parseqs"), u = e("component-inherit"), a = e("debug")("engine.io-client:websocket"), f = e("ws");
      t.exports = r, u(r, i), r.prototype.name = "websocket", r.prototype.supportsBinary = !0, r.prototype.doOpen = function () {
        if (!this.check())return;
        var e = this, t = this.uri(), n = void 0, r = {agent: this.agent};
        r.pfx = this.pfx, r.key = this.key, r.passphrase = this.passphrase, r.cert = this.cert, r.ca = this.ca, r.ciphers = this.ciphers, r.rejectUnauthorized = this.rejectUnauthorized, this.ws = new f(t, n, r), this.ws.binaryType === undefined && (this.supportsBinary = !1), this.ws.binaryType = "arraybuffer", this.addEventListeners()
      }, r.prototype.addEventListeners = function () {
        var e = this;
        this.ws.onopen = function () {
          e.onOpen()
        }, this.ws.onclose = function () {
          e.onClose()
        }, this.ws.onmessage = function (t) {
          e.onData(t.data)
        }, this.ws.onerror = function (t) {
          e.onError("websocket error", t)
        }
      }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (r.prototype.onData = function (e) {
        var t = this;
        setTimeout(function () {
          i.prototype.onData.call(t, e)
        }, 0)
      }), r.prototype.write = function (e) {
        function t() {
          n.writable = !0, n.emit("drain")
        }

        var n = this;
        this.writable = !1;
        for (var r = 0, i = e.length; r < i; r++)s.encodePacket(e[r], this.supportsBinary, function (e) {
          try {
            n.ws.send(e)
          } catch (t) {
            a("websocket closed before onclose event")
          }
        });
        setTimeout(t, 0)
      }, r.prototype.onClose = function () {
        i.prototype.onClose.call(this)
      }, r.prototype.doClose = function () {
        typeof this.ws != "undefined" && this.ws.close()
      }, r.prototype.uri = function () {
        var e = this.query || {}, t = this.secure ? "wss" : "ws", n = "";
        return this.port && ("wss" == t && this.port != 443 || "ws" == t && this.port != 80) && (n = ":" + this.port), this.timestampRequests && (e[this.timestampParam] = +(new Date)), this.supportsBinary || (e.b64 = 1), e = o.encode(e), e.length && (e = "?" + e), t + "://" + this.hostname + n + this.path + e
      }, r.prototype.check = function () {
        return !!f && !("__initialize" in f && this.name === r.prototype.name)
      }
    }, {"../transport": 14, "component-inherit": 21, debug: 22, "engine.io-parser": 25, parseqs: 35, ws: 37}],
    20: [function (e, t, n) {
      var r = e("has-cors");
      t.exports = function (e) {
        var t = e.xdomain, n = e.xscheme, i = e.enablesXDR;
        try {
          if ("undefined" != typeof XMLHttpRequest && (!t || r))return new XMLHttpRequest
        } catch (s) {
        }
        try {
          if ("undefined" != typeof XDomainRequest && !n && i)return new XDomainRequest
        } catch (s) {
        }
        if (!t)try {
          return new ActiveXObject("Microsoft.XMLHTTP")
        } catch (s) {
        }
      }
    }, {"has-cors": 40}],
    21: [function (e, t, n) {
      t.exports = function (e, t) {
        var n = function () {
        };
        n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
      }
    }, {}],
    22: [function (e, t, n) {
      function r() {
        return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
      }

      function i() {
        var e = arguments, t = this.useColors;
        e[0] = (t ? "%c" : "") + this.namespace + (t ? " %c" : " ") + e[0] + (t ? "%c " : " ") + "+" + n.humanize(this.diff);
        if (!t)return e;
        var r = "color: " + this.color;
        e = [e[0], r, "color: inherit"].concat(Array.prototype.slice.call(e, 1));
        var i = 0, s = 0;
        return e[0].replace(/%[a-z%]/g, function (e) {
          if ("%" === e)return;
          i++, "%c" === e && (s = i)
        }), e.splice(s, 0, r), e
      }

      function s() {
        return "object" == typeof console && "function" == typeof console.log && Function.prototype.apply.call(console.log, console, arguments)
      }

      function o(e) {
        try {
          null == e ? localStorage.removeItem("debug") : localStorage.debug = e
        } catch (t) {
        }
      }

      function u() {
        var e;
        try {
          e = localStorage.debug
        } catch (t) {
        }
        return e
      }

      n = t.exports = e("./debug"), n.log = s, n.formatArgs = i, n.save = o, n.load = u, n.useColors = r, n.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], n.formatters.j = function (e) {
        return JSON.stringify(e)
      }, n.enable(u())
    }, {"./debug": 23}],
    23: [function (e, t, n) {
      function r() {
        return n.colors[f++ % n.colors.length]
      }

      function i(e) {
        function t() {
        }

        function i() {
          var e = i, t = +(new Date), s = t - (l || t);
          e.diff = s, e.prev = l, e.curr = t, l = t, null == e.useColors && (e.useColors = n.useColors()), null == e.color && e.useColors && (e.color = r());
          var o = Array.prototype.slice.call(arguments);
          o[0] = n.coerce(o[0]), "string" != typeof o[0] && (o = ["%o"].concat(o));
          var u = 0;
          o[0] = o[0].replace(/%([a-z%])/g, function (t, r) {
            if (t === "%")return t;
            u++;
            var i = n.formatters[r];
            if ("function" == typeof i) {
              var s = o[u];
              t = i.call(e, s), o.splice(u, 1), u--
            }
            return t
          }), "function" == typeof n.formatArgs && (o = n.formatArgs.apply(e, o));
          var a = i.log || n.log || console.log.bind(console);
          a.apply(e, o)
        }

        t.enabled = !1, i.enabled = !0;
        var s = n.enabled(e) ? i : t;
        return s.namespace = e, s
      }

      function s(e) {
        n.save(e);
        var t = (e || "").split(/[\s,]+/), r = t.length;
        for (var i = 0; i < r; i++) {
          if (!t[i])continue;
          e = t[i].replace(/\*/g, ".*?"), e[0] === "-" ? n.skips.push(new RegExp("^" + e.substr(1) + "$")) : n.names.push(new RegExp("^" + e + "$"))
        }
      }

      function o() {
        n.enable("")
      }

      function u(e) {
        var t, r;
        for (t = 0, r = n.skips.length; t < r; t++)if (n.skips[t].test(e))return !1;
        for (t = 0, r = n.names.length; t < r; t++)if (n.names[t].test(e))return !0;
        return !1
      }

      function a(e) {
        return e instanceof Error ? e.stack || e.message : e
      }

      n = t.exports = i, n.coerce = a, n.disable = o, n.enable = s, n.enabled = u, n.humanize = e("ms"), n.names = [], n.skips = [], n.formatters = {};
      var f = 0, l
    }, {ms: 24}],
    24: [function (e, t, n) {
      function r(e) {
        var t = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(e);
        if (!t)return;
        var n = parseFloat(t[1]), r = (t[2] || "ms").toLowerCase();
        switch (r) {
          case"years":
          case"year":
          case"y":
            return n * c;
          case"days":
          case"day":
          case"d":
            return n * l;
          case"hours":
          case"hour":
          case"h":
            return n * f;
          case"minutes":
          case"minute":
          case"m":
            return n * a;
          case"seconds":
          case"second":
          case"s":
            return n * u;
          case"ms":
            return n
        }
      }

      function i(e) {
        return e >= l ? Math.round(e / l) + "d" : e >= f ? Math.round(e / f) + "h" : e >= a ? Math.round(e / a) + "m" : e >= u ? Math.round(e / u) + "s" : e + "ms"
      }

      function s(e) {
        return o(e, l, "day") || o(e, f, "hour") || o(e, a, "minute") || o(e, u, "second") || e + " ms"
      }

      function o(e, t, n) {
        if (e < t)return;
        return e < t * 1.5 ? Math.floor(e / t) + " " + n : Math.ceil(e / t) + " " + n + "s"
      }

      var u = 1e3, a = u * 60, f = a * 60, l = f * 24, c = l * 365.25;
      t.exports = function (e, t) {
        return t = t || {}, "string" == typeof e ? r(e) : t.long ? s(e) : i(e)
      }
    }, {}],
    25: [function (e, t, n) {
      (function (t) {
        function r(e, t) {
          var r = "b" + n.packets[e.type] + e.data.data;
          return t(r)
        }

        function i(e, t, r) {
          if (!t)return n.encodeBase64Packet(e, r);
          var i = e.data, s = new Uint8Array(i), o = new Uint8Array(1 + i.byteLength);
          o[0] = g[e.type];
          for (var u = 0; u < s.length; u++)o[u + 1] = s[u];
          return r(o.buffer)
        }

        function s(e, t, r) {
          if (!t)return n.encodeBase64Packet(e, r);
          var i = new FileReader;
          return i.onload = function () {
            e.data = i.result, n.encodePacket(e, t, !0, r)
          }, i.readAsArrayBuffer(e.data)
        }

        function o(e, t, r) {
          if (!t)return n.encodeBase64Packet(e, r);
          if (m)return s(e, t, r);
          var i = new Uint8Array(1);
          i[0] = g[e.type];
          var o = new w([i.buffer, e.data]);
          return r(o)
        }

        function u(e, t, n) {
          var r = new Array(e.length), i = h(e.length, n), s = function (e, n, i) {
            t(n, function (t, n) {
              r[e] = n, i(t, r)
            })
          };
          for (var o = 0; o < e.length; o++)s(o, e[o], i)
        }

        var a = e("./keys"), f = e("has-binary"), l = e("arraybuffer.slice"), c = e("base64-arraybuffer"), h = e("after"), p = e("utf8"), d = navigator.userAgent.match(/Android/i), v = /PhantomJS/i.test(navigator.userAgent), m = d || v;
        n.protocol = 3;
        var g = n.packets = {
          open: 0,
          close: 1,
          ping: 2,
          pong: 3,
          message: 4,
          upgrade: 5,
          noop: 6
        }, y = a(g), b = {type: "error", data: "parser error"}, w = e("blob");
        n.encodePacket = function (e, n, s, u) {
          "function" == typeof n && (u = n, n = !1), "function" == typeof s && (u = s, s = null);
          var a = e.data === undefined ? undefined : e.data.buffer || e.data;
          if (t.ArrayBuffer && a instanceof ArrayBuffer)return i(e, n, u);
          if (w && a instanceof t.Blob)return o(e, n, u);
          if (a && a.base64)return r(e, u);
          var f = g[e.type];
          return undefined !== e.data && (f += s ? p.encode(String(e.data)) : String(e.data)), u("" + f)
        }, n.encodeBase64Packet = function (e, r) {
          var i = "b" + n.packets[e.type];
          if (w && e.data instanceof w) {
            var s = new FileReader;
            return s.onload = function () {
              var e = s.result.split(",")[1];
              r(i + e)
            }, s.readAsDataURL(e.data)
          }
          var o;
          try {
            o = String.fromCharCode.apply(null, new Uint8Array(e.data))
          } catch (u) {
            var a = new Uint8Array(e.data), f = new Array(a.length);
            for (var l = 0; l < a.length; l++)f[l] = a[l];
            o = String.fromCharCode.apply(null, f)
          }
          return i += t.btoa(o), r(i)
        }, n.decodePacket = function (e, t, r) {
          if (typeof e == "string" || e === undefined) {
            if (e.charAt(0) == "b")return n.decodeBase64Packet(e.substr(1), t);
            if (r)try {
              e = p.decode(e)
            } catch (i) {
              return b
            }
            var s = e.charAt(0);
            return Number(s) != s || !y[s] ? b : e.length > 1 ? {type: y[s], data: e.substring(1)} : {type: y[s]}
          }
          var o = new Uint8Array(e), s = o[0], u = l(e, 1);
          return w && t === "blob" && (u = new w([u])), {type: y[s], data: u}
        }, n.decodeBase64Packet = function (e, n) {
          var r = y[e.charAt(0)];
          if (!t.ArrayBuffer)return {type: r, data: {base64: !0, data: e.substr(1)}};
          var i = c.decode(e.substr(1));
          return n === "blob" && w && (i = new w([i])), {type: r, data: i}
        }, n.encodePayload = function (e, t, r) {
          function i(e) {
            return e.length + ":" + e
          }

          function s(e, r) {
            n.encodePacket(e, o ? t : !1, !0, function (e) {
              r(null, i(e))
            })
          }

          typeof t == "function" && (r = t, t = null);
          var o = f(e);
          if (t && o)return w && !m ? n.encodePayloadAsBlob(e, r) : n.encodePayloadAsArrayBuffer(e, r);
          if (!e.length)return r("0:");
          u(e, s, function (e, t) {
            return r(t.join(""))
          })
        }, n.decodePayload = function (e, t, r) {
          if (typeof e != "string")return n.decodePayloadAsBinary(e, t, r);
          typeof t == "function" && (r = t, t = null);
          var i;
          if (e == "")return r(b, 0, 1);
          var s = "", o, u;
          for (var a = 0, f = e.length; a < f; a++) {
            var l = e.charAt(a);
            if (":" != l) s += l; else {
              if ("" == s || s != (o = Number(s)))return r(b, 0, 1);
              u = e.substr(a + 1, o);
              if (s != u.length)return r(b, 0, 1);
              if (u.length) {
                i = n.decodePacket(u, t, !0);
                if (b.type == i.type && b.data == i.data)return r(b, 0, 1);
                var c = r(i, a + o, f);
                if (!1 === c)return
              }
              a += o, s = ""
            }
          }
          if (s != "")return r(b, 0, 1)
        }, n.encodePayloadAsArrayBuffer = function (e, t) {
          function r(e, t) {
            n.encodePacket(e, !0, !0, function (e) {
              return t(null, e)
            })
          }

          if (!e.length)return t(new ArrayBuffer(0));
          u(e, r, function (e, n) {
            var r = n.reduce(function (e, t) {
              var n;
              return typeof t == "string" ? n = t.length : n = t.byteLength, e + n.toString().length + n + 2
            }, 0), i = new Uint8Array(r), s = 0;
            return n.forEach(function (e) {
              var t = typeof e == "string", n = e;
              if (t) {
                var r = new Uint8Array(e.length);
                for (var o = 0; o < e.length; o++)r[o] = e.charCodeAt(o);
                n = r.buffer
              }
              t ? i[s++] = 0 : i[s++] = 1;
              var u = n.byteLength.toString();
              for (var o = 0; o < u.length; o++)i[s++] = parseInt(u[o]);
              i[s++] = 255;
              var r = new Uint8Array(n);
              for (var o = 0; o < r.length; o++)i[s++] = r[o]
            }), t(i.buffer)
          })
        }, n.encodePayloadAsBlob = function (e, t) {
          function r(e, t) {
            n.encodePacket(e, !0, !0, function (e) {
              var n = new Uint8Array(1);
              n[0] = 1;
              if (typeof e == "string") {
                var r = new Uint8Array(e.length);
                for (var i = 0; i < e.length; i++)r[i] = e.charCodeAt(i);
                e = r.buffer, n[0] = 0
              }
              var s = e instanceof ArrayBuffer ? e.byteLength : e.size, o = s.toString(), u = new Uint8Array(o.length + 1);
              for (var i = 0; i < o.length; i++)u[i] = parseInt(o[i]);
              u[o.length] = 255;
              if (w) {
                var a = new w([n.buffer, u.buffer, e]);
                t(null, a)
              }
            })
          }

          u(e, r, function (e, n) {
            return t(new w(n))
          })
        }, n.decodePayloadAsBinary = function (e, t, r) {
          typeof t == "function" && (r = t, t = null);
          var i = e, s = [], o = !1;
          while (i.byteLength > 0) {
            var u = new Uint8Array(i), a = u[0] === 0, f = "";
            for (var c = 1; ; c++) {
              if (u[c] == 255)break;
              if (f.length > 310) {
                o = !0;
                break
              }
              f += u[c]
            }
            if (o)return r(b, 0, 1);
            i = l(i, 2 + f.length), f = parseInt(f);
            var h = l(i, 0, f);
            if (a)try {
              h = String.fromCharCode.apply(null, new Uint8Array(h))
            } catch (p) {
              var d = new Uint8Array(h);
              h = "";
              for (var c = 0; c < d.length; c++)h += String.fromCharCode(d[c])
            }
            s.push(h), i = l(i, f)
          }
          var v = s.length;
          s.forEach(function (e, i) {
            r(n.decodePacket(e, t, !0), i, v)
          })
        }
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {
      "./keys": 26,
      after: 27,
      "arraybuffer.slice": 28,
      "base64-arraybuffer": 29,
      blob: 30,
      "has-binary": 31,
      utf8: 33
    }],
    26: [function (e, t, n) {
      t.exports = Object.keys || function (e) {
          var t = [], n = Object.prototype.hasOwnProperty;
          for (var r in e)n.call(e, r) && t.push(r);
          return t
        }
    }, {}],
    27: [function (e, t, n) {
      function r(e, t, n) {
        function r(e, i) {
          if (r.count <= 0)throw new Error("after called too many times");
          --r.count, e ? (s = !0, t(e), t = n) : r.count === 0 && !s && t(null, i)
        }

        var s = !1;
        return n = n || i, r.count = e, e === 0 ? t() : r
      }

      function i() {
      }

      t.exports = r
    }, {}],
    28: [function (e, t, n) {
      t.exports = function (e, t, n) {
        var r = e.byteLength;
        t = t || 0, n = n || r;
        if (e.slice)return e.slice(t, n);
        t < 0 && (t += r), n < 0 && (n += r), n > r && (n = r);
        if (t >= r || t >= n || r === 0)return new ArrayBuffer(0);
        var i = new Uint8Array(e), s = new Uint8Array(n - t);
        for (var o = t, u = 0; o < n; o++, u++)s[u] = i[o];
        return s.buffer
      }
    }, {}],
    29: [function (e, t, n) {
      (function (e) {
        "use strict";
        n.encode = function (t) {
          var n = new Uint8Array(t), r, i = n.length, s = "";
          for (r = 0; r < i; r += 3)s += e[n[r] >> 2], s += e[(n[r] & 3) << 4 | n[r + 1] >> 4], s += e[(n[r + 1] & 15) << 2 | n[r + 2] >> 6], s += e[n[r + 2] & 63];
          return i % 3 === 2 ? s = s.substring(0, s.length - 1) + "=" : i % 3 === 1 && (s = s.substring(0, s.length - 2) + "=="), s
        }, n.decode = function (t) {
          var n = t.length * .75, r = t.length, i, s = 0, o, u, a, f;
          t[t.length - 1] === "=" && (n--, t[t.length - 2] === "=" && n--);
          var l = new ArrayBuffer(n), c = new Uint8Array(l);
          for (i = 0; i < r; i += 4)o = e.indexOf(t[i]), u = e.indexOf(t[i + 1]), a = e.indexOf(t[i + 2]), f = e.indexOf(t[i + 3]), c[s++] = o << 2 | u >> 4, c[s++] = (u & 15) << 4 | a >> 2, c[s++] = (a & 3) << 6 | f & 63;
          return l
        }
      })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
    }, {}],
    30: [function (e, t, n) {
      (function (e) {
        function n(e, t) {
          t = t || {};
          var n = new r;
          for (var i = 0; i < e.length; i++)n.append(e[i]);
          return t.type ? n.getBlob(t.type) : n.getBlob()
        }

        var r = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder, i = function () {
          try {
            var e = new Blob(["hi"]);
            return e.size == 2
          } catch (t) {
            return !1
          }
        }(), s = r && r.prototype.append && r.prototype.getBlob;
        t.exports = function () {
          return i ? e.Blob : s ? n : undefined
        }()
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {}],
    31: [function (e, t, n) {
      (function (n) {
        function r(e) {
          function t(e) {
            if (!e)return !1;
            if (n.Buffer && n.Buffer.isBuffer(e) || n.ArrayBuffer && e instanceof ArrayBuffer || n.Blob && e instanceof Blob || n.File && e instanceof File)return !0;
            if (i(e)) {
              for (var r = 0; r < e.length; r++)if (t(e[r]))return !0
            } else if (e && "object" == typeof e) {
              e.toJSON && (e = e.toJSON());
              for (var s in e)if (e.hasOwnProperty(s) && t(e[s]))return !0
            }
            return !1
          }

          return t(e)
        }

        var i = e("isarray");
        t.exports = r
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {isarray: 32}],
    32: [function (e, t, n) {
      t.exports = Array.isArray || function (e) {
          return Object.prototype.toString.call(e) == "[object Array]"
        }
    }, {}],
    33: [function (t, n, r) {
      (function (t) {
        (function (i) {
          function s(e) {
            var t = [], n = 0, r = e.length, i, s;
            while (n < r)i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < r ? (s = e.charCodeAt(n++), (s & 64512) == 56320 ? t.push(((i & 1023) << 10) + (s & 1023) + 65536) : (t.push(i), n--)) : t.push(i);
            return t
          }

          function o(e) {
            var t = e.length, n = -1, r, i = "";
            while (++n < t)r = e[n], r > 65535 && (r -= 65536, i += m(r >>> 10 & 1023 | 55296), r = 56320 | r & 1023), i += m(r);
            return i
          }

          function u(e, t) {
            return m(e >> t & 63 | 128)
          }

          function a(e) {
            if ((e & 4294967168) == 0)return m(e);
            var t = "";
            return (e & 4294965248) == 0 ? t = m(e >> 6 & 31 | 192) : (e & 4294901760) == 0 ? (t = m(e >> 12 & 15 | 224), t += u(e, 6)) : (e & 4292870144) == 0 && (t = m(e >> 18 & 7 | 240), t += u(e, 12), t += u(e, 6)), t += m(e & 63 | 128), t
          }

          function f(e) {
            var t = s(e), n = t.length, r = -1, i, o = "";
            while (++r < n)i = t[r], o += a(i);
            return o
          }

          function l() {
            if (b >= y)throw Error("Invalid byte index");
            var e = g[b] & 255;
            b++;
            if ((e & 192) == 128)return e & 63;
            throw Error("Invalid continuation byte")
          }

          function c() {
            var e, t, n, r, i;
            if (b > y)throw Error("Invalid byte index");
            if (b == y)return !1;
            e = g[b] & 255, b++;
            if ((e & 128) == 0)return e;
            if ((e & 224) == 192) {
              var t = l();
              i = (e & 31) << 6 | t;
              if (i >= 128)return i;
              throw Error("Invalid continuation byte")
            }
            if ((e & 240) == 224) {
              t = l(), n = l(), i = (e & 15) << 12 | t << 6 | n;
              if (i >= 2048)return i;
              throw Error("Invalid continuation byte")
            }
            if ((e & 248) == 240) {
              t = l(), n = l(), r = l(), i = (e & 15) << 18 | t << 12 | n << 6 | r;
              if (i >= 65536 && i <= 1114111)return i
            }
            throw Error("Invalid UTF-8 detected")
          }

          function h(e) {
            g = s(e), y = g.length, b = 0;
            var t = [], n;
            while ((n = c()) !== !1)t.push(n);
            return o(t)
          }

          var p = typeof r == "object" && r, d = typeof n == "object" && n && n.exports == p && n, v = typeof t == "object" && t;
          if (v.global === v || v.window === v) i = v;
          var m = String.fromCharCode, g, y, b, w = {version: "2.0.0", encode: f, decode: h};
          if (typeof e == "function" && typeof e.amd == "object" && e.amd) e(function () {
            return w
          }); else if (p && !p.nodeType)if (d) d.exports = w; else {
            var E = {}, S = E.hasOwnProperty;
            for (var x in w)S.call(w, x) && (p[x] = w[x])
          } else i.utf8 = w
        })(this)
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {}],
    34: [function (e, t, n) {
      (function (e) {
        var n = /^[\],:{}\s]*$/, r = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, i = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, s = /(?:^|:|,)(?:\s*\[)+/g, o = /^\s+/, u = /\s+$/;
        t.exports = function (t) {
          if ("string" != typeof t || !t)return null;
          t = t.replace(o, "").replace(u, "");
          if (e.JSON && JSON.parse)return JSON.parse(t);
          if (n.test(t.replace(r, "@").replace(i, "]").replace(s, "")))return (new Function("return " + t))()
        }
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {}],
    35: [function (e, t, n) {
      n.encode = function (e) {
        var t = "";
        for (var n in e)e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
        return t
      }, n.decode = function (e) {
        var t = {}, n = e.split("&");
        for (var r = 0, i = n.length; r < i; r++) {
          var s = n[r].split("=");
          t[decodeURIComponent(s[0])] = decodeURIComponent(s[1])
        }
        return t
      }
    }, {}],
    36: [function (e, t, n) {
      var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, i = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
      t.exports = function (e) {
        var t = e, n = e.indexOf("["), s = e.indexOf("]");
        n != -1 && s != -1 && (e = e.substring(0, n) + e.substring(n, s).replace(/:/g, ";") + e.substring(s, e.length));
        var o = r.exec(e || ""), u = {}, a = 14;
        while (a--)u[i[a]] = o[a] || "";
        return n != -1 && s != -1 && (u.source = t, u.host = u.host.substring(1, u.host.length - 1).replace(/;/g, ":"), u.authority = u.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), u.ipv6uri = !0), u
      }
    }, {}],
    37: [function (e, t, n) {
      function r(e, t, n) {
        var r;
        return t ? r = new s(e, t) : r = new s(e), r
      }

      var i = function () {
        return this
      }(), s = i.WebSocket || i.MozWebSocket;
      t.exports = s ? r : null, s && (r.prototype = s.prototype)
    }, {}],
    38: [function (e, t, n) {
      (function (n) {
        function r(e) {
          function t(e) {
            if (!e)return !1;
            if (n.Buffer && n.Buffer.isBuffer(e) || n.ArrayBuffer && e instanceof ArrayBuffer || n.Blob && e instanceof Blob || n.File && e instanceof File)return !0;
            if (i(e)) {
              for (var r = 0; r < e.length; r++)if (t(e[r]))return !0
            } else if (e && "object" == typeof e) {
              e.toJSON && (e = e.toJSON());
              for (var s in e)if (Object.prototype.hasOwnProperty.call(e, s) && t(e[s]))return !0
            }
            return !1
          }

          return t(e)
        }

        var i = e("isarray");
        t.exports = r
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {isarray: 39}],
    39: [function (e, t, n) {
      t.exports = e(32)
    }, {}],
    40: [function (e, t, n) {
      var r = e("global");
      try {
        t.exports = "XMLHttpRequest" in r && "withCredentials" in new r.XMLHttpRequest
      } catch (i) {
        t.exports = !1
      }
    }, {global: 41}],
    41: [function (e, t, n) {
      t.exports = function () {
        return this
      }()
    }, {}],
    42: [function (e, t, n) {
      var r = [].indexOf;
      t.exports = function (e, t) {
        if (r)return e.indexOf(t);
        for (var n = 0; n < e.length; ++n)if (e[n] === t)return n;
        return -1
      }
    }, {}],
    43: [function (e, t, n) {
      var r = Object.prototype.hasOwnProperty;
      n.keys = Object.keys || function (e) {
          var t = [];
          for (var n in e)r.call(e, n) && t.push(n);
          return t
        }, n.values = function (e) {
        var t = [];
        for (var n in e)r.call(e, n) && t.push(e[n]);
        return t
      }, n.merge = function (e, t) {
        for (var n in t)r.call(t, n) && (e[n] = t[n]);
        return e
      }, n.length = function (e) {
        return n.keys(e).length
      }, n.isEmpty = function (e) {
        return 0 == n.length(e)
      }
    }, {}],
    44: [function (e, t, n) {
      var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, i = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
      t.exports = function (e) {
        var t = r.exec(e || ""), n = {}, s = 14;
        while (s--)n[i[s]] = t[s] || "";
        return n
      }
    }, {}],
    45: [function (e, t, n) {
      (function (t) {
        var r = e("isarray"), i = e("./is-buffer");
        n.deconstructPacket = function (e) {
          function t(e) {
            if (!e)return e;
            if (i(e)) {
              var s = {_placeholder: !0, num: n.length};
              return n.push(e), s
            }
            if (r(e)) {
              var o = new Array(e.length);
              for (var u = 0; u < e.length; u++)o[u] = t(e[u]);
              return o
            }
            if ("object" != typeof e || e instanceof Date)return e;
            var o = {};
            for (var a in e)o[a] = t(e[a]);
            return o
          }

          var n = [], s = e.data, o = e;
          return o.data = t(s), o.attachments = n.length, {packet: o, buffers: n}
        }, n.reconstructPacket = function (e, t) {
          function n(e) {
            if (e && e._placeholder) {
              var i = t[e.num];
              return i
            }
            if (r(e)) {
              for (var s = 0; s < e.length; s++)e[s] = n(e[s]);
              return e
            }
            if (e && "object" == typeof e) {
              for (var o in e)e[o] = n(e[o]);
              return e
            }
            return e
          }

          var i = 0;
          return e.data = n(e.data), e.attachments = undefined, e
        }, n.removeBlobs = function (e, n) {
          function s(e, a, f) {
            if (!e)return e;
            if (t.Blob && e instanceof Blob || t.File && e instanceof File) {
              o++;
              var l = new FileReader;
              l.onload = function () {
                f ? f[a] = this.result : u = this.result, --o || n(u)
              }, l.readAsArrayBuffer(e)
            } else if (r(e))for (var c = 0; c < e.length; c++)s(e[c], c, e); else if (e && "object" == typeof e && !i(e))for (var h in e)s(e[h], h, e)
          }

          var o = 0, u = e;
          s(u), o || n(u)
        }
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {"./is-buffer": 47, isarray: 48}],
    46: [function (e, t, n) {
      function r() {
      }

      function i(e) {
        var t = "", r = !1;
        t += e.type;
        if (n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type) t += e.attachments, t += "-";
        return e.nsp && "/" != e.nsp && (r = !0, t += e.nsp), null != e.id && (r && (t += ",", r = !1), t += e.id), null != e.data && (r && (t += ","), t += c.stringify(e.data)), l("encoded %j as %s", e, t), t
      }

      function s(e, t) {
        function n(e) {
          var n = d.deconstructPacket(e), r = i(n.packet), s = n.buffers;
          s.unshift(r), t(s)
        }

        d.removeBlobs(e, n)
      }

      function o() {
        this.reconstructor = null
      }

      function u(e) {
        var t = {}, r = 0;
        t.type = Number(e.charAt(0));
        if (null == n.types[t.type])return f();
        if (n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type) {
          var i = "";
          while (e.charAt(++r) != "-") {
            i += e.charAt(r);
            if (r == e.length)break
          }
          if (i != Number(i) || e.charAt(r) != "-")throw new Error("Illegal attachments");
          t.attachments = Number(i)
        }
        if ("/" == e.charAt(r + 1)) {
          t.nsp = "";
          while (++r) {
            var s = e.charAt(r);
            if ("," == s)break;
            t.nsp += s;
            if (r == e.length)break
          }
        } else t.nsp = "/";
        var o = e.charAt(r + 1);
        if ("" !== o && Number(o) == o) {
          t.id = "";
          while (++r) {
            var s = e.charAt(r);
            if (null == s || Number(s) != s) {
              --r;
              break
            }
            t.id += e.charAt(r);
            if (r == e.length)break
          }
          t.id = Number(t.id)
        }
        if (e.charAt(++r))try {
          t.data = c.parse(e.substr(r))
        } catch (u) {
          return f()
        }
        return l("decoded %s as %j", e, t), t
      }

      function a(e) {
        this.reconPack = e, this.buffers = []
      }

      function f(e) {
        return {type: n.ERROR, data: "parser error"}
      }

      var l = e("debug")("socket.io-parser"), c = e("json3"), h = e("isarray"), p = e("component-emitter"), d = e("./binary"), v = e("./is-buffer");
      n.protocol = 4, n.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], n.CONNECT = 0, n.DISCONNECT = 1, n.EVENT = 2, n.ACK = 3, n.ERROR = 4, n.BINARY_EVENT = 5, n.BINARY_ACK = 6, n.Encoder = r, n.Decoder = o, r.prototype.encode = function (e, t) {
        l("encoding packet %j", e);
        if (n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type) s(e, t); else {
          var r = i(e);
          t([r])
        }
      }, p(o.prototype), o.prototype.add = function (e) {
        var t;
        if ("string" == typeof e) t = u(e), n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type ? (this.reconstructor = new a(t), this.reconstructor.reconPack.attachments === 0 && this.emit("decoded", t)) : this.emit("decoded", t); else {
          if (!v(e) && !e.base64)throw new Error("Unknown type: " + e);
          if (!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");
          t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, this.emit("decoded", t))
        }
      }, o.prototype.destroy = function () {
        this.reconstructor && this.reconstructor.finishedReconstruction()
      }, a.prototype.takeBinaryData = function (e) {
        this.buffers.push(e);
        if (this.buffers.length == this.reconPack.attachments) {
          var t = d.reconstructPacket(this.reconPack, this.buffers);
          return this.finishedReconstruction(), t
        }
        return null
      }, a.prototype.finishedReconstruction = function () {
        this.reconPack = null, this.buffers = []
      }
    }, {"./binary": 45, "./is-buffer": 47, "component-emitter": 9, debug: 10, isarray: 48, json3: 49}],
    47: [function (e, t, n) {
      (function (e) {
        function n(t) {
          return e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer
        }

        t.exports = n
      }).call(this, typeof self != "undefined" ? self : typeof window != "undefined" ? window : {})
    }, {}],
    48: [function (e, t, n) {
      t.exports = e(32)
    }, {}],
    49: [function (t, n, r) {
      (function (t) {
        function n(e) {
          if (n[e] !== u)return n[e];
          var t;
          if (e == "bug-string-char-index") t = "a"[0] != "a"; else if (e == "json") t = n("json-stringify") && n("json-parse"); else {
            var r, s = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
            if (e == "json-stringify") {
              var o = l.stringify, a = typeof o == "function" && c;
              if (a) {
                (r = function () {
                  return 1
                }).toJSON = r;
                try {
                  a = o(0) === "0" && o(new Number) === "0" && o(new String) == '""' && o(i) === u && o(u) === u && o() === u && o(r) === "1" && o([r]) == "[1]" && o([u]) == "[null]" && o(null) == "null" && o([u, i, null]) == "[null,null,null]" && o({a: [r, true, false, null, "\0\b\n\f\r	"]}) == s && o(null, r) === "1" && o([1, 2], null, 1) == "[\n 1,\n 2\n]" && o(new Date(-864e13)) == '"-271821-04-20T00:00:00.000Z"' && o(new Date(864e13)) == '"+275760-09-13T00:00:00.000Z"' && o(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' && o(new Date(-1)) == '"1969-12-31T23:59:59.999Z"'
                } catch (f) {
                  a = !1
                }
              }
              t = a
            }
            if (e == "json-parse") {
              var h = l.parse;
              if (typeof h == "function")try {
                if (h("0") === 0 && !h(!1)) {
                  r = h(s);
                  var p = r["a"].length == 5 && r.a[0] === 1;
                  if (p) {
                    try {
                      p = !h('"	"')
                    } catch (f) {
                    }
                    if (p)try {
                      p = h("01") !== 1
                    } catch (f) {
                    }
                    if (p)try {
                      p = h("1.") !== 1
                    } catch (f) {
                    }
                  }
                }
              } catch (f) {
                p = !1
              }
              t = p
            }
          }
          return n[e] = !!t
        }

        var i = {}.toString, s, o, u, a = typeof e == "function" && e.amd, f = typeof JSON == "object" && JSON, l = typeof r == "object" && r && !r.nodeType && r;
        l && f ? (l.stringify = f.stringify, l.parse = f.parse) : l = t.JSON = f || {};
        var c = new Date(-0xc782b5b800cec);
        try {
          c = c.getUTCFullYear() == -109252 && c.getUTCMonth() === 0 && c.getUTCDate() === 1 && c.getUTCHours() == 10 && c.getUTCMinutes() == 37 && c.getUTCSeconds() == 6 && c.getUTCMilliseconds() == 708
        } catch (h) {
        }
        if (!n("json")) {
          var p = "[object Function]", d = "[object Date]", v = "[object Number]", m = "[object String]", g = "[object Array]", y = "[object Boolean]", b = n("bug-string-char-index");
          if (!c)var w = Math.floor, E = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], S = function (e, t) {
            return E[t] + 365 * (e - 1970) + w((e - 1969 + (t = +(t > 1))) / 4) - w((e - 1901 + t) / 100) + w((e - 1601 + t) / 400)
          };
          (s = {}.hasOwnProperty) || (s = function (e) {
            var t = {}, n;
            return (t.__proto__ = null, t.__proto__ = {toString: 1}, t).toString != i ? s = function (e) {
                var t = this.__proto__, n = e in (this.__proto__ = null, this);
                return this.__proto__ = t, n
              } : (n = t.constructor, s = function (e) {
                var t = (this.constructor || n).prototype;
                return e in this && !(e in t && this[e] === t[e])
              }), t = null, s.call(this, e)
          });
          var x = {"boolean": 1, number: 1, string: 1, "undefined": 1}, T = function (e, t) {
            var n = typeof e[t];
            return n == "object" ? !!e[t] : !x[n]
          };
          o = function (e, t) {
            var n = 0, r, u, a;
            (r = function () {
              this.valueOf = 0
            }).prototype.valueOf = 0, u = new r;
            for (a in u)s.call(u, a) && n++;
            return r = u = null, n ? n == 2 ? o = function (e, t) {
                  var n = {}, r = i.call(e) == p, o;
                  for (o in e)(!r || o != "prototype") && !s.call(n, o) && (n[o] = 1) && s.call(e, o) && t(o)
                } : o = function (e, t) {
                  var n = i.call(e) == p, r, o;
                  for (r in e)(!n || r != "prototype") && s.call(e, r) && !(o = r === "constructor") && t(r);
                  (o || s.call(e, r = "constructor")) && t(r)
                } : (u = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], o = function (e, t) {
                var n = i.call(e) == p, r, o, a = !n && typeof e.constructor != "function" && T(e, "hasOwnProperty") ? e.hasOwnProperty : s;
                for (r in e)(!n || r != "prototype") && a.call(e, r) && t(r);
                for (o = u.length; r = u[--o]; a.call(e, r) && t(r));
              }), o(e, t)
          };
          if (!n("json-stringify")) {
            var N = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t"
            }, C = "000000", k = function (e, t) {
              return (C + (t || 0)).slice(-e)
            }, L = "\\u00", A = function (e) {
              var t = '"', n = 0, r = e.length, i = r > 10 && b, s;
              i && (s = e.split(""));
              for (; n < r; n++) {
                var o = e.charCodeAt(n);
                switch (o) {
                  case 8:
                  case 9:
                  case 10:
                  case 12:
                  case 13:
                  case 34:
                  case 92:
                    t += N[o];
                    break;
                  default:
                    if (o < 32) {
                      t += L + k(2, o.toString(16));
                      break
                    }
                    t += i ? s[n] : b ? e.charAt(n) : e[n]
                }
              }
              return t + '"'
            }, O = function (e, t, n, r, a, f, l) {
              var c, h, p, b, E, x, T, N, C, L, M, _, D, P, H, B;
              try {
                c = t[e]
              } catch (j) {
              }
              if (typeof c == "object" && c) {
                h = i.call(c);
                if (h == d && !s.call(c, "toJSON"))if (c > -1 / 0 && c < 1 / 0) {
                  if (S) {
                    E = w(c / 864e5);
                    for (p = w(E / 365.2425) + 1970 - 1; S(p + 1, 0) <= E; p++);
                    for (b = w((E - S(p, 0)) / 30.42); S(p, b + 1) <= E; b++);
                    E = 1 + E - S(p, b), x = (c % 864e5 + 864e5) % 864e5, T = w(x / 36e5) % 24, N = w(x / 6e4) % 60, C = w(x / 1e3) % 60, L = x % 1e3
                  } else p = c.getUTCFullYear(), b = c.getUTCMonth(), E = c.getUTCDate(), T = c.getUTCHours(), N = c.getUTCMinutes(), C = c.getUTCSeconds(), L = c.getUTCMilliseconds();
                  c = (p <= 0 || p >= 1e4 ? (p < 0 ? "-" : "+") + k(6, p < 0 ? -p : p) : k(4, p)) + "-" + k(2, b + 1) + "-" + k(2, E) + "T" + k(2, T) + ":" + k(2, N) + ":" + k(2, C) + "." + k(3, L) + "Z"
                } else c = null; else typeof c.toJSON == "function" && (h != v && h != m && h != g || s.call(c, "toJSON")) && (c = c.toJSON(e))
              }
              n && (c = n.call(t, e, c));
              if (c === null)return "null";
              h = i.call(c);
              if (h == y)return "" + c;
              if (h == v)return c > -1 / 0 && c < 1 / 0 ? "" + c : "null";
              if (h == m)return A("" + c);
              if (typeof c == "object") {
                for (P = l.length; P--;)if (l[P] === c)throw TypeError();
                l.push(c), M = [], H = f, f += a;
                if (h == g) {
                  for (D = 0, P = c.length; D < P; D++)_ = O(D, c, n, r, a, f, l), M.push(_ === u ? "null" : _);
                  B = M.length ? a ? "[\n" + f + M.join(",\n" + f) + "\n" + H + "]" : "[" + M.join(",") + "]" : "[]"
                } else o(r || c, function (e) {
                  var t = O(e, c, n, r, a, f, l);
                  t !== u && M.push(A(e) + ":" + (a ? " " : "") + t)
                }), B = M.length ? a ? "{\n" + f + M.join(",\n" + f) + "\n" + H + "}" : "{" + M.join(",") + "}" : "{}";
                return l.pop(), B
              }
            };
            l.stringify = function (e, t, n) {
              var r, s, o, u;
              if (typeof t == "function" || typeof t == "object" && t)if ((u = i.call(t)) == p) s = t; else if (u == g) {
                o = {};
                for (var a = 0, f = t.length, l; a < f; l = t[a++], (u = i.call(l), u == m || u == v) && (o[l] = 1));
              }
              if (n)if ((u = i.call(n)) == v) {
                if ((n -= n % 1) > 0)for (r = "", n > 10 && (n = 10); r.length < n; r += " ");
              } else u == m && (r = n.length <= 10 ? n : n.slice(0, 10));
              return O("", (l = {}, l[""] = e, l), s, o, r, "", [])
            }
          }
          if (!n("json-parse")) {
            var M = String.fromCharCode, _ = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "	",
              110: "\n",
              102: "\f",
              114: "\r"
            }, D, P, H = function () {
              throw D = P = null, SyntaxError()
            }, B = function () {
              var e = P, t = e.length, n, r, i, s, o;
              while (D < t) {
                o = e.charCodeAt(D);
                switch (o) {
                  case 9:
                  case 10:
                  case 13:
                  case 32:
                    D++;
                    break;
                  case 123:
                  case 125:
                  case 91:
                  case 93:
                  case 58:
                  case 44:
                    return n = b ? e.charAt(D) : e[D], D++, n;
                  case 34:
                    for (n = "@", D++; D < t;) {
                      o = e.charCodeAt(D);
                      if (o < 32) H(); else if (o == 92) {
                        o = e.charCodeAt(++D);
                        switch (o) {
                          case 92:
                          case 34:
                          case 47:
                          case 98:
                          case 116:
                          case 110:
                          case 102:
                          case 114:
                            n += _[o], D++;
                            break;
                          case 117:
                            r = ++D;
                            for (i = D + 4; D < i; D++)o = e.charCodeAt(D), o >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || H();
                            n += M("0x" + e.slice(r, D));
                            break;
                          default:
                            H()
                        }
                      } else {
                        if (o == 34)break;
                        o = e.charCodeAt(D), r = D;
                        while (o >= 32 && o != 92 && o != 34)o = e.charCodeAt(++D);
                        n += e.slice(r, D)
                      }
                    }
                    if (e.charCodeAt(D) == 34)return D++, n;
                    H();
                  default:
                    r = D, o == 45 && (s = !0, o = e.charCodeAt(++D));
                    if (o >= 48 && o <= 57) {
                      o == 48 && (o = e.charCodeAt(D + 1), o >= 48 && o <= 57) && H(), s = !1;
                      for (; D < t && (o = e.charCodeAt(D), o >= 48 && o <= 57); D++);
                      if (e.charCodeAt(D) == 46) {
                        i = ++D;
                        for (; i < t && (o = e.charCodeAt(i), o >= 48 && o <= 57); i++);
                        i == D && H(), D = i
                      }
                      o = e.charCodeAt(D);
                      if (o == 101 || o == 69) {
                        o = e.charCodeAt(++D), (o == 43 || o == 45) && D++;
                        for (i = D; i < t && (o = e.charCodeAt(i), o >= 48 && o <= 57); i++);
                        i == D && H(), D = i
                      }
                      return +e.slice(r, D)
                    }
                    s && H();
                    if (e.slice(D, D + 4) == "true")return D += 4, !0;
                    if (e.slice(D, D + 5) == "false")return D += 5, !1;
                    if (e.slice(D, D + 4) == "null")return D += 4, null;
                    H()
                }
              }
              return "$"
            }, j = function (e) {
              var t, n;
              e == "$" && H();
              if (typeof e == "string") {
                if ((b ? e.charAt(0) : e[0]) == "@")return e.slice(1);
                if (e == "[") {
                  t = [];
                  for (; ; n || (n = !0)) {
                    e = B();
                    if (e == "]")break;
                    n && (e == "," ? (e = B(), e == "]" && H()) : H()), e == "," && H(), t.push(j(e))
                  }
                  return t
                }
                if (e == "{") {
                  t = {};
                  for (; ; n || (n = !0)) {
                    e = B();
                    if (e == "}")break;
                    n && (e == "," ? (e = B(), e == "}" && H()) : H()), (e == "," || typeof e != "string" || (b ? e.charAt(0) : e[0]) != "@" || B() != ":") && H(), t[e.slice(1)] = j(B())
                  }
                  return t
                }
                H()
              }
              return e
            }, F = function (e, t, n) {
              var r = I(e, t, n);
              r === u ? delete e[t] : e[t] = r
            }, I = function (e, t, n) {
              var r = e[t], s;
              if (typeof r == "object" && r)if (i.call(r) == g)for (s = r.length; s--;)F(r, s, n); else o(r, function (e) {
                F(r, e, n)
              });
              return n.call(e, t, r)
            };
            l.parse = function (e, t) {
              var n, r;
              return D = 0, P = "" + e, n = j(B()), B() != "$" && H(), D = P = null, t && i.call(t) == p ? I((r = {}, r[""] = n, r), "", t) : n
            }
          }
        }
        a && e(function () {
          return l
        })
      })(this)
    }, {}],
    50: [function (e, t, n) {
      function r(e, t) {
        var n = [];
        t = t || 0;
        for (var r = t || 0; r < e.length; r++)n[r - t] = e[r];
        return n
      }

      t.exports =
        r
    }, {}]
  }, {}, [1])(1)
});
