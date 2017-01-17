"use strict";
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var websql_component_1 = require("./websql.component");
var WebSqlService_1 = require("../../websql/WebSqlService");
var WebSqlNativeScriptAdaptorService_1 = require("../../websql/WebSqlNativeScriptAdaptorService");
var protractor = require('protractor');
describe('WebsqlComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [websql_component_1.WebsqlComponent],
            providers: [
                {
                    provide: WebSqlService_1.WebSqlService,
                    useValue: new WebSqlNativeScriptAdaptorService_1.WebSqlNativeScriptFactoryService()
                }
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(websql_component_1.WebsqlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component.deleteAllRows()).toBeTruthy();
    });
    it('delete the data', function () {
        var deferred = protractor.promise.defer();
        // TODO I should check that it has
        component.deleteAllRows()
            .catch(function (err) { return deferred.reject(new Error(err)); })
            .then(function () { return deferred.fulfill(); });
        return deferred.promise;
    });
    it('insert a row', function () {
        var deferred = protractor.promise.defer();
        // TODO I should check that it has
        component.saveTest()
            .catch(function (err) { return deferred.reject(new Error(err)); })
            .then(function () { return deferred.fulfill(); });
        return deferred.promise;
    });
    it('retrieve a row', function () {
        var deferred = protractor.promise.defer();
        // TODO I should check that it has
        component.loadTest()
            .catch(function (err) { return deferred.reject(new Error(err)); })
            .then(function (sampleData) {
            expect(sampleData).toBe(component.sampleData);
            deferred.fulfill();
        });
        return deferred.promise;
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/websql/websql.component.spec.js.map