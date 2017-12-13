"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
function btoa(data) {
    try {
        return window["btoa"](data);
    }
    catch (e) {
        return base64.encode(data);
    }
}
function atob(data) {
    try {
        return window["atob"](data);
    }
    catch (e) {
        return base64.decode(data);
    }
}
var PayloadDelegateABC_1 = require("./PayloadDelegateABC");
var PayloadDelegateInMain = (function (_super) {
    __extends(PayloadDelegateInMain, _super);
    function PayloadDelegateInMain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PayloadDelegateInMain.prototype.deflateAndEncode = function (payloadJson) {
        return new Promise(function (resolve, reject) {
            var compressedData = pako.deflate(payloadJson, { to: "string" });
            var encodedData = btoa(compressedData);
            resolve(encodedData);
        });
    };
    PayloadDelegateInMain.prototype.decodeAndInflate = function (vortexStr) {
        return new Promise(function (resolve, reject) {
            var compressedData = atob(vortexStr);
            var payloadJson = pako.inflate(compressedData, { to: "string" });
            resolve(payloadJson);
        });
    };
    return PayloadDelegateInMain;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateInMain = PayloadDelegateInMain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF5bG9hZERlbGVnYXRlSW5NYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGF5bG9hZERlbGVnYXRlSW5NYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTZCO0FBQzdCLGdDQUFrQztBQUVsQyxjQUFjLElBQUk7SUFDaEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7QUFDSCxDQUFDO0FBRUQsY0FBYyxJQUFJO0lBQ2hCLElBQUksQ0FBQztRQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0FBQ0gsQ0FBQztBQUVELDJEQUF3RDtBQUV4RDtJQUEyQyx5Q0FBa0I7SUFBN0Q7O0lBa0JBLENBQUM7SUFoQkMsZ0RBQWdCLEdBQWhCLFVBQWlCLFdBQW1CO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBUyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3pDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDL0QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnREFBZ0IsR0FBaEIsVUFBaUIsU0FBaUI7UUFDaEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFTLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDekMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDL0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVILDRCQUFDO0FBQUQsQ0FBQyxBQWxCRCxDQUEyQyx1Q0FBa0IsR0FrQjVEO0FBbEJZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBha28gZnJvbSBcInBha29cIjtcbmltcG9ydCAqIGFzIGJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xuXG5mdW5jdGlvbiBidG9hKGRhdGEpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gd2luZG93W1wiYnRvYVwiXShkYXRhKTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIHJldHVybiBiYXNlNjQuZW5jb2RlKGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGF0b2IoZGF0YSkge1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3dbXCJhdG9iXCJdKGRhdGEpO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5kZWNvZGUoZGF0YSk7XG4gIH1cbn1cblxuaW1wb3J0IHtQYXlsb2FkRGVsZWdhdGVBQkN9IGZyb20gXCIuL1BheWxvYWREZWxlZ2F0ZUFCQ1wiO1xuXG5leHBvcnQgY2xhc3MgUGF5bG9hZERlbGVnYXRlSW5NYWluIGV4dGVuZHMgUGF5bG9hZERlbGVnYXRlQUJDIHtcblxuICBkZWZsYXRlQW5kRW5jb2RlKHBheWxvYWRKc29uOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBjb21wcmVzc2VkRGF0YSA9IHBha28uZGVmbGF0ZShwYXlsb2FkSnNvbiwge3RvOiBcInN0cmluZ1wifSk7XG4gICAgICBsZXQgZW5jb2RlZERhdGEgPSBidG9hKGNvbXByZXNzZWREYXRhKTtcbiAgICAgIHJlc29sdmUoZW5jb2RlZERhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVjb2RlQW5kSW5mbGF0ZSh2b3J0ZXhTdHI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGNvbXByZXNzZWREYXRhID0gYXRvYih2b3J0ZXhTdHIpO1xuICAgICAgbGV0IHBheWxvYWRKc29uID0gcGFrby5pbmZsYXRlKGNvbXByZXNzZWREYXRhLCB7dG86IFwic3RyaW5nXCJ9KTtcbiAgICAgIHJlc29sdmUocGF5bG9hZEpzb24pO1xuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==