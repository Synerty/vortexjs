import {Component, OnInit} from "@angular/core";
import {WebSqlFactoryService, WebSqlService} from "../../websql/WebSqlService";

let datbaseName = "offlineTuples.sqlite";
let databaseSchema = [
    `CREATE TABLE IF NOT EXISTS websqlTest
     (
        id INTEGER PRIMARY KEY ASC,
        data TEXT
     )`];

// TODO, IMPLEMENT DIRECT TEST
@Component({
    selector: 'app-websql',
    templateUrl: './websql.component.html',
    styleUrls: ['./websql.component.css']
})
export class WebsqlComponent implements OnInit {
    private webSql: WebSqlService;
    sampleData: string;
    lastLoaded: string;
    status: string;

    constructor(webSqlFactory: WebSqlFactoryService) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);

        this.sampleData = new Date().toISOString();
    }

    ngOnInit() {
    }

    deleteAllRows(): Promise<boolean> {
        return this.webSql.runSql('DELETE FROM websqlTest')
            .then(() => {
                this.status = "DELETE Promise Resolved";
            });
    }

    saveTest(): Promise<boolean> {
        let sql = 'INSERT OR REPLACE INTO websqlTest (data) VALUES (?)';
        let bindParams = [this.sampleData];
        return this.webSql.runSql(sql, bindParams)
            .then(() => {
                this.status = "INSERT Promise Resolved";
            });
    }

    loadTest() {

        let sql = 'SELECT data FROM websqlTest LIMIT 1';

        return new Promise<string>((resolve, reject) => {
            this.webSql.querySql(sql)
                .catch(reject)
                .then((rows: any[]) => {
                    if (rows.length === 0) {
                        resolve("");
                        return;
                    }
                    let row1 = rows[0];
                    this.lastLoaded = row1.data;
                    resolve(row1.data);

                });
        })
            .then(() => this.status = "LOAD Promise Resolved");
    }

}
