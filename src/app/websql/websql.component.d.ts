import { OnInit } from "@angular/core";
import { WebSqlFactoryService } from "../../websql/WebSqlService";
export declare class WebsqlComponent implements OnInit {
    private webSql;
    sampleData: string;
    lastLoaded: string;
    status: string;
    constructor(webSqlFactory: WebSqlFactoryService);
    ngOnInit(): void;
    deleteAllRows(): Promise<void>;
    saveTest(): Promise<void>;
    loadTest(): Promise<string>;
}
