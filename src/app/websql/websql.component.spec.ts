/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {WebsqlComponent} from "./websql.component";
import {WebSqlService} from "../../websql/WebSqlService";
import {WebSqlNativeScriptFactoryService} from "../../websql/WebSqlNativeScriptAdaptorService";

let protractor = require('protractor');

describe('WebsqlComponent', () => {
    let component: WebsqlComponent;
    let fixture: ComponentFixture<WebsqlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WebsqlComponent],
            providers: [
                {
                    provide: WebSqlService,
                    useValue: new WebSqlNativeScriptFactoryService()
                }

            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WebsqlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component.deleteAllRows()).toBeTruthy();
    });

    it('delete the data', () => {
        let deferred = protractor.promise.defer();

        // TODO I should check that it has
        component.deleteAllRows()
            .catch((err) => deferred.reject(new Error(err)))
            .then(() => deferred.fulfill());

        return deferred.promise;
    });

    it('insert a row', () => {
        let deferred = protractor.promise.defer();

        // TODO I should check that it has
        component.saveTest()
            .catch((err) => deferred.reject(new Error(err)))
            .then(() => deferred.fulfill());

        return deferred.promise;
    });

    it('retrieve a row', () => {
        let deferred = protractor.promise.defer();

        // TODO I should check that it has
        component.loadTest()
            .catch((err) => deferred.reject(new Error(err)))
            .then((sampleData) => {
                expect(sampleData).toBe(component.sampleData);
                deferred.fulfill();
            });

        return deferred.promise;
    });
});
