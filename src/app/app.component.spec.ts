/* tslint:disable:no-unused-variable */
import {TestBed, async} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {Ng2BalloonMsgService, Ng2BalloonMsgModule} from "@synerty/ng2-balloon-msg";
import {Component} from "@angular/core";

// Do we really need 4 of these?

@Component({
    selector: 'app-tuple',
    template: '.<div></div>'
})
export class __TestTupleCompoent {
}


describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                Ng2BalloonMsgModule
            ],
            declarations: [
                AppComponent,
                __TestTupleCompoent
            ],
        });
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'app works!'`, async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual(app.title);
    }));

    it('should render title in a h1 tag', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        let app = fixture.debugElement.componentInstance;
        expect(compiled.querySelector('h1').textContent).toContain(app.title);
    }));
});
