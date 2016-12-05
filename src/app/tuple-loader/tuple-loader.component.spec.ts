/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {TupleLoaderComponent} from "./tuple-loader.component";

describe('TupleLoaderComponent', () => {
    let component: TupleLoaderComponent;
    let fixture: ComponentFixture<TupleLoaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [TupleLoaderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TupleLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
