"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var app_component_1 = require("./app.component");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
var core_1 = require("@angular/core");
// Do we really need 4 of these?
var __TestTupleCompoent = (function () {
    function __TestTupleCompoent() {
    }
    return __TestTupleCompoent;
}());
__TestTupleCompoent = __decorate([
    core_1.Component({
        selector: 'app-tuple',
        template: '.<div></div>'
    })
], __TestTupleCompoent);
exports.__TestTupleCompoent = __TestTupleCompoent;
describe('AppComponent', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_balloon_msg_1.Ng2BalloonMsgModule
            ],
            declarations: [
                app_component_1.AppComponent,
                __TestTupleCompoent
            ],
        });
    });
    it('should create the app', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        var app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it("should have as title 'app works!'", testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        var app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual(app.title);
    }));
    it('should render title in a h1 tag', testing_1.async(function () {
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        fixture.detectChanges();
        var compiled = fixture.debugElement.nativeElement;
        var app = fixture.debugElement.componentInstance;
        expect(compiled.querySelector('h1').textContent).toContain(app.title);
    }));
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/app.component.spec.js.map