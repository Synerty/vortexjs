"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------
// Typescript date - date fooler
function now() {
    return new Date();
}
exports.now = now;
function logLong(message, start, payload) {
    if (payload === void 0) { payload = null; }
    var duration = now() - start;
    var desc = '';
    // You get 5ms to do what you need before i call the performance cops.
    if (duration < 5)
        return;
    if (payload != null) {
        desc = ', ' + JSON.stringify(payload.filt);
    }
    console.log(message + ", took " + duration + desc);
}
exports.logLong = logLong;
// ----------------------------------------------------------------------------
var PayloadDelegateABC = (function () {
    function PayloadDelegateABC() {
    }
    return PayloadDelegateABC;
}());
exports.PayloadDelegateABC = PayloadDelegateABC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF5bG9hZERlbGVnYXRlQUJDLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGF5bG9hZERlbGVnYXRlQUJDLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsK0VBQStFO0FBQy9FLGdDQUFnQztBQUNoQztJQUNFLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3BCLENBQUM7QUFGRCxrQkFFQztBQUVELGlCQUF3QixPQUFlLEVBQUUsS0FBVSxFQUFFLE9BQTBCO0lBQTFCLHdCQUFBLEVBQUEsY0FBMEI7SUFDN0UsSUFBSSxRQUFRLEdBQUcsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzdCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUVkLHNFQUFzRTtJQUN0RSxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDO0lBRVQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBSSxPQUFPLGVBQVUsUUFBUSxHQUFHLElBQU0sQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFiRCwwQkFhQztBQUdELCtFQUErRTtBQUMvRTtJQUFBO0lBTUEsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOcUIsZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiXG5cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUeXBlc2NyaXB0IGRhdGUgLSBkYXRlIGZvb2xlclxuZXhwb3J0IGZ1bmN0aW9uIG5vdygpOiBhbnkge1xuICByZXR1cm4gbmV3IERhdGUoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0xvbmcobWVzc2FnZTogc3RyaW5nLCBzdGFydDogYW55LCBwYXlsb2FkOiBhbnkgfCBudWxsID0gbnVsbCkge1xuICBsZXQgZHVyYXRpb24gPSBub3coKSAtIHN0YXJ0O1xuICBsZXQgZGVzYyA9ICcnO1xuXG4gIC8vIFlvdSBnZXQgNW1zIHRvIGRvIHdoYXQgeW91IG5lZWQgYmVmb3JlIGkgY2FsbCB0aGUgcGVyZm9ybWFuY2UgY29wcy5cbiAgaWYgKGR1cmF0aW9uIDwgNSlcbiAgICByZXR1cm47XG5cbiAgaWYgKHBheWxvYWQgIT0gbnVsbCkge1xuICAgIGRlc2MgPSAnLCAnICsgSlNPTi5zdHJpbmdpZnkocGF5bG9hZC5maWx0KTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGAke21lc3NhZ2V9LCB0b29rICR7ZHVyYXRpb259JHtkZXNjfWApO1xufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYXlsb2FkRGVsZWdhdGVBQkMge1xuXG4gIGFic3RyYWN0IGRlZmxhdGVBbmRFbmNvZGUocGF5bG9hZEpzb24gOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IDtcblxuICBhYnN0cmFjdCBkZWNvZGVBbmRJbmZsYXRlKHZvcnRleFN0ciA6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4gO1xuXG59XG4iXX0=