"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var WebSqlService_1 = require("../../websql/WebSqlService");
var datbaseName = "offlineTuples.sqlite";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS websqlTest\n     (\n        id INTEGER PRIMARY KEY ASC,\n        data TEXT\n     )"
];
// TODO, IMPLEMENT DIRECT TEST
var WebsqlComponent = (function () {
    function WebsqlComponent(webSqlFactory) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        this.sampleData = new Date().toISOString();
    }
    WebsqlComponent.prototype.ngOnInit = function () {
    };
    WebsqlComponent.prototype.deleteAllRows = function () {
        var _this = this;
        return this.webSql.runSql('DELETE FROM websqlTest')
            .then(function () {
            _this.status = "DELETE Promise Resolved";
        });
    };
    WebsqlComponent.prototype.saveTest = function () {
        var _this = this;
        var sql = 'INSERT OR REPLACE INTO websqlTest (data) VALUES (?)';
        var bindParams = [this.sampleData];
        return this.webSql.runSql(sql, bindParams)
            .then(function () {
            _this.status = "INSERT Promise Resolved";
        });
    };
    WebsqlComponent.prototype.loadTest = function () {
        var _this = this;
        var sql = 'SELECT data FROM websqlTest LIMIT 1';
        return new Promise(function (resolve, reject) {
            _this.webSql.querySql(sql)
                .catch(reject)
                .then(function (rows) {
                if (rows.length === 0) {
                    resolve("");
                    return;
                }
                var row1 = rows[0];
                _this.lastLoaded = row1.data;
                resolve(row1.data);
            });
        })
            .then(function () { return _this.status = "LOAD Promise Resolved"; });
    };
    return WebsqlComponent;
}());
WebsqlComponent = __decorate([
    core_1.Component({
        selector: 'app-websql',
        templateUrl: './websql.component.html',
        styleUrls: ['./websql.component.css']
    }),
    __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService])
], WebsqlComponent);
exports.WebsqlComponent = WebsqlComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/app/websql/websql.component.js.map