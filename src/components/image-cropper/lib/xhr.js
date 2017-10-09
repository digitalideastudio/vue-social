// ADD sendAsBinary compatibilty to older browsers
if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function sendAsBinary(string) {
        const bytes = Array.prototype.map.call(
            string,
            c => c.charCodeAt(0) & 0xff // eslint-disable-line no-bitwise
        );
        this.send(new Uint8Array(bytes).buffer);
    };
}

// Headers are returned as a string
function headersToJSON(s) {
    const o = {};
    const reg = /([a-z-]+):\s?(.*);?/gi;
    let m = reg.exec(s);
    while (m) {
        m = reg.exec(s);
        o[m[1]] = m[2];
    }
    return o;
}

function xhr(m, url, h, d, callback, err, isBinary) {
    const req = new XMLHttpRequest();
    const error = err || function XMLHttpRequest() {
        throw new Error('XMLHttpRequest');
    };
    const boundary = 'vuecodeimageupload';
    // Binary?
    let binary = false;
    let method = m;
    let headers = h;
    let data = d;
    if (method === 'blob') {
        binary = method;
        method = 'GET';
    }

    method = method.toUpperCase();
    // Xhr.responseType 'json' is not supported in any of the vendors yet.
    req.onload = function reqOnload() {
        let json = req.response;
        try {
            json = JSON.parse(req.responseText);
        } catch (_e) {
            if (req.status === 401) {
                json = error('access_denied', req.statusText);
            }
        }
        headers = headersToJSON(req.getAllResponseHeaders());
        headers.statusCode = req.status;
        callback(json || (method === 'GET' ? error('empty_response', 'Could not get resource') : {}), headers);
    };
    req.onerror = function reqOnerror() {
        let json = req.responseText;
        try {
            json = JSON.parse(req.responseText);
        } catch (e) {
            // TODO: Make it more user-friendly
            throw e;
        }
        callback(json || error('access_denied', 'Could not get resource'));
    };

    // Should we add the query to the URL?
    if (method === 'GET' || method === 'DELETE') {
        data = null;
    } else if (isBinary) {
        const keyData = data;
        const code = data.base64Code.replace(`data:${data.type};base64,`, '');
        data = [`--${boundary}`, `Content-Disposition: form-data; name="${data.filed}"; filename="${data.filename}"`, `Content-Type: ${data.type}`, '', window.atob(code), ''].join('\r\n');
        const keyArr = Object.keys(keyData);
        if (keyArr.length > 4) {
            keyArr.forEach((k) => {
                if (['filed', 'filename', 'type', 'base64Code'].indexOf(k) === -1) {
                    data += [`--${boundary}`, `Content-Disposition: form-data; name="${k}";`, '', ''].join('\r\n');
                    data += [typeof keyData[k] === 'object' ? JSON.stringify(keyData[k]) : keyData[k], ''].join('\r\n');
                }
            });
        }
        data += `--${boundary}--`;
    }
    // Open the path, async
    req.open(method, url, true);
    if (binary) {
        if ('responseType' in req) {
            req.responseType = binary;
        } else {
            req.overrideMimeType('text/plain; charset=x-user-defined');
        }
    }
    // Set any bespoke headers
    if (headers) {
        headers.forEach(hdr => req.setRequestHeader(hdr, headers[hdr]));

        if (isBinary) {
            req.setRequestHeader('Content-Type', `multipart/form-data; boundary=${boundary}`);
        }
    }
    if (isBinary) {
        return req.sendAsBinary(data);
    }

    req.withCredentials = true;
    req.send(data);
    return req;
}

export default xhr;
