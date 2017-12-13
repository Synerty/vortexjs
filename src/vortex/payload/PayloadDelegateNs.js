"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadDelegateABC_1 = require("./PayloadDelegateABC");
var PayloadDelegateNs = (function (_super) {
    __extends(PayloadDelegateNs, _super);
    function PayloadDelegateNs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PayloadDelegateNs.prototype.deflateAndEncode = function (payloadJson) {
        var worker = new Worker('./PayloadDelegateNsEncodeWorker.js');
        // var w;
        // if (global.TNS_WEBPACK) {
        //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
        //     w = new GrayscaleWorker();
        // } else {
        //     w = new Worker("./workers/grayscaler.js");
        // }
        return new Promise(function (resolve, reject) {
            function callError(error) {
                reject(error);
                console.log("ERROR: PayloadDelegateNs.deflateAndEncode " + error);
            }
            worker.onmessage = function (result) {
                var resultAny = result.data;
                var error = resultAny["error"];
                if (error == null) {
                    resolve(resultAny["encodedData"]);
                }
                else {
                    callError(error);
                }
                worker.terminate();
            };
            worker.onerror = function (error) {
                callError(error);
                worker.terminate();
            };
            worker.postMessage({ payloadJson: payloadJson });
        });
    };
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        var worker = new Worker('./PayloadDelegateNsDecodeWorker.js');
        // var w;
        // if (global.TNS_WEBPACK) {
        //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
        //     w = new GrayscaleWorker();
        // } else {
        //     w = new Worker("./workers/grayscaler.js");
        // }
        return new Promise(function (resolve, reject) {
            function callError(error) {
                reject(error);
                console.log("ERROR: PayloadDelegateNs.decodeAndInflate " + error);
            }
            worker.onmessage = function (result) {
                var resultAny = result.data;
                var error = resultAny["error"];
                if (error == null) {
                    resolve(resultAny["payloadJson"]);
                }
                else {
                    callError(error);
                }
                worker.terminate();
            };
            worker.onerror = function (error) {
                callError(error);
                worker.terminate();
            };
            worker.postMessage({ vortexStr: vortexStr });
        });
    };
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF5bG9hZERlbGVnYXRlTnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJQYXlsb2FkRGVsZWdhdGVOcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUF3RDtBQUV4RDtJQUF1QyxxQ0FBa0I7SUFBekQ7O0lBNEZBLENBQUM7SUExRkMsNENBQWdCLEdBQWhCLFVBQWlCLFdBQW1CO1FBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFFOUQsU0FBUztRQUNULDRCQUE0QjtRQUM1QiwyRkFBMkY7UUFDM0YsaUNBQWlDO1FBQ2pDLFdBQVc7UUFDWCxpREFBaUQ7UUFDakQsSUFBSTtRQUVKLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBUyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBRXpDLG1CQUFtQixLQUFLO2dCQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FDVCwrQ0FBNkMsS0FBTyxDQUNyRCxDQUFDO1lBQ0osQ0FBQztZQUVELE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBQyxNQUFNO2dCQUN4QixJQUFJLFNBQVMsR0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNqQyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRS9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQixPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBRXBDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixDQUFDO2dCQUVELE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUM7WUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsS0FBSztnQkFDckIsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqQixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBRWpELENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVELDRDQUFnQixHQUFoQixVQUFpQixTQUFpQjtRQUNoQyxJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBRTlELFNBQVM7UUFDVCw0QkFBNEI7UUFDNUIsMkZBQTJGO1FBQzNGLGlDQUFpQztRQUNqQyxXQUFXO1FBQ1gsaURBQWlEO1FBQ2pELElBQUk7UUFFSixNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUV6QyxtQkFBbUIsS0FBSztnQkFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQ1QsK0NBQTZDLEtBQU8sQ0FDckQsQ0FBQztZQUNKLENBQUM7WUFFRCxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQUMsTUFBTTtnQkFDeEIsSUFBSSxTQUFTLEdBQVEsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDakMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUUvQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUVwQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztnQkFFRCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQUs7Z0JBQ3JCLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUU3QyxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFSCx3QkFBQztBQUFELENBQUMsQUE1RkQsQ0FBdUMsdUNBQWtCLEdBNEZ4RDtBQTVGWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1BheWxvYWREZWxlZ2F0ZUFCQ30gZnJvbSBcIi4vUGF5bG9hZERlbGVnYXRlQUJDXCI7XG5cbmV4cG9ydCBjbGFzcyBQYXlsb2FkRGVsZWdhdGVOcyBleHRlbmRzIFBheWxvYWREZWxlZ2F0ZUFCQyB7XG5cbiAgZGVmbGF0ZUFuZEVuY29kZShwYXlsb2FkSnNvbjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBsZXQgd29ya2VyID0gbmV3IFdvcmtlcignLi9QYXlsb2FkRGVsZWdhdGVOc0VuY29kZVdvcmtlci5qcycpO1xuXG4gICAgLy8gdmFyIHc7XG4gICAgLy8gaWYgKGdsb2JhbC5UTlNfV0VCUEFDSykge1xuICAgIC8vICAgICB2YXIgR3JheXNjYWxlV29ya2VyID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC13b3JrZXItbG9hZGVyIS4vd29ya2Vycy9ncmF5c2NhbGVyLmpzXCIpO1xuICAgIC8vICAgICB3ID0gbmV3IEdyYXlzY2FsZVdvcmtlcigpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAgIHcgPSBuZXcgV29ya2VyKFwiLi93b3JrZXJzL2dyYXlzY2FsZXIuanNcIik7XG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBmdW5jdGlvbiBjYWxsRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgYEVSUk9SOiBQYXlsb2FkRGVsZWdhdGVOcy5kZWZsYXRlQW5kRW5jb2RlICR7ZXJyb3J9YFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB3b3JrZXIub25tZXNzYWdlID0gKHJlc3VsdCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0QW55OiBhbnkgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgbGV0IGVycm9yID0gcmVzdWx0QW55W1wiZXJyb3JcIl07XG5cbiAgICAgICAgaWYgKGVycm9yID09IG51bGwpIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdEFueVtcImVuY29kZWREYXRhXCJdKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrZXIudGVybWluYXRlKCk7XG4gICAgICB9O1xuXG4gICAgICB3b3JrZXIub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBjYWxsRXJyb3IoZXJyb3IpO1xuICAgICAgICB3b3JrZXIudGVybWluYXRlKCk7XG4gICAgICB9O1xuXG4gICAgICB3b3JrZXIucG9zdE1lc3NhZ2Uoe3BheWxvYWRKc29uOiBwYXlsb2FkSnNvbn0pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIGRlY29kZUFuZEluZmxhdGUodm9ydGV4U3RyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGxldCB3b3JrZXIgPSBuZXcgV29ya2VyKCcuL1BheWxvYWREZWxlZ2F0ZU5zRGVjb2RlV29ya2VyLmpzJyk7XG5cbiAgICAvLyB2YXIgdztcbiAgICAvLyBpZiAoZ2xvYmFsLlROU19XRUJQQUNLKSB7XG4gICAgLy8gICAgIHZhciBHcmF5c2NhbGVXb3JrZXIgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXdvcmtlci1sb2FkZXIhLi93b3JrZXJzL2dyYXlzY2FsZXIuanNcIik7XG4gICAgLy8gICAgIHcgPSBuZXcgR3JheXNjYWxlV29ya2VyKCk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgdyA9IG5ldyBXb3JrZXIoXCIuL3dvcmtlcnMvZ3JheXNjYWxlci5qc1wiKTtcbiAgICAvLyB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGZ1bmN0aW9uIGNhbGxFcnJvcihlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgRVJST1I6IFBheWxvYWREZWxlZ2F0ZU5zLmRlY29kZUFuZEluZmxhdGUgJHtlcnJvcn1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHdvcmtlci5vbm1lc3NhZ2UgPSAocmVzdWx0KSA9PiB7XG4gICAgICAgIGxldCByZXN1bHRBbnk6IGFueSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICBsZXQgZXJyb3IgPSByZXN1bHRBbnlbXCJlcnJvclwiXTtcblxuICAgICAgICBpZiAoZXJyb3IgPT0gbnVsbCkge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0QW55W1wicGF5bG9hZEpzb25cIl0pO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgIH07XG5cbiAgICAgIHdvcmtlci5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIGNhbGxFcnJvcihlcnJvcik7XG4gICAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgIH07XG5cbiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7dm9ydGV4U3RyOiB2b3J0ZXhTdHJ9KTtcblxuICAgIH0pO1xuXG4gIH1cblxufVxuIl19