/**
 * Crownix-Invoker
 * http://www.m2soft.co.kr/
 *
 * ⓒ 2021 M2Soft
 */
var m2soft = m2soft || {};

m2soft.ns = function (ns_string) {
	var parts = ns_string.split('.'),
		parent = m2soft;

	if (parts[0] === 'm2soft') {
		parts = parts.slice(1);
	}

	for (var i = 0, max = parts.length; i < max; i++) {
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

m2soft.ns('m2soft.crownix.ClientAgentInvoker');
m2soft.crownix.ClientAgentInvoker = (function () {
	var clientAgentUrl;
	var aliveCode = 0x06; // ACK
	var connTimeout = 30 * 1000;
	var readTimeout = 30 * 1000;
	var stayConnected = false;
	var useAliveCheck = false;
	var requestObj = {};
	var socket;
	var connectTimeout;
	var readtimeout;

	var setConnectTimeout = function (timeout) {
		connTimeout = timeout;
	};

	var setReadTimeout = function (timeout) {
		readTimeout = timeout;
	};

	var addParameter = function (key, obj) {
		requestObj[key] = obj;
	};

	var setRequestObj = function (obj) {
		requestObj = obj;
	};

	var setStayConnected = function (isStay) {
		stayConnected = isStay;
	};

	var getRequestObj = function () {
		return requestObj;
	};

	var setUseAliveCheck = function (useAlive) {
		useAliveCheck = useAlive;
	};

	var invoke = function (callback) {
		if (requestObj == undefined) {
			callback({ data: 'request is null' });
			return;
		}

		requestObj.useAliveCheck = useAliveCheck;

		if (socket == undefined || !stayConnected) {
			if (socket) socket.close();

			socket = new WebSocket(clientAgentUrl);

			var connectTimeout = setTimeout(function () {
				callback({ data: 'Socket connection timeout.' });
				socket.close();
			}, connTimeout);

			var readtimeout = setTimeout(function () {
				callback({ data: 'Socket read timeout.' });
				socket.close();
			}, readTimeout);
		} else socket.send(JSON.stringify(requestObj));

		socket.onopen = function (e) {
			clearTimeout(connectTimeout);
			socket.send(JSON.stringify(requestObj));
		};

		socket.onclose = function (e) {
			clearTimeout(connectTimeout);
			clearTimeout(readtimeout);
		};

		socket.onmessage = function (e) {
			if (e.data != aliveCode) {
				clearTimeout(readtimeout);
				callback(e);

				if (!requestObj.previewOption || !requestObj.previewOption.multiPrint) socket.close();
			}
		};

		socket.onerror = function (e) {
			clearTimeout(connectTimeout);
			clearTimeout(readtimeout);
			callback(e);
			socket.close();
		};
	};

	var Constructor;

	Constructor = function (url) {
		clientAgentUrl = url;
	};

	Constructor.prototype = {
		invoke: function (callback) {
			invoke(callback);
		},
		addParameter: function (key, obj) {
			addParameter(key, obj);
		},
		setRequestObj: function (obj) {
			setRequestObj(obj);
		},
		getRequestObj: function () {
			return getRequestObj();
		},
		setConnectTimeout: function (timeout) {
			setConnectTimeout(timeout);
		},
		setReadTimeout: function (timeout) {
			setReadTimeout(timeout);
		},
		setStayConnection: function (isStay) {
			setStayConnected(isStay);
		},
		setUseAliveCheck: function (useAlive) {
			setUseAliveCheck(useAlive);
		},
	};

	return Constructor;
})();
