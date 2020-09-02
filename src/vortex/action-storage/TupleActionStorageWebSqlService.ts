import { Inject, Injectable } from "@angular/core"
import { TupleActionABC } from "../TupleAction"
import { WebSqlFactoryService, WebSqlService } from "../../websql/WebSqlService"
import { Payload } from "../Payload"
import { TupleActionStorageServiceABC } from "./TupleActionStorageServiceABC"

const datbaseName = "tupleActions.sqlite"

const tableName = "tupleActions"
const databaseSchema = [
    `CREATE TABLE IF NOT EXISTS ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scope TEXT,
        uuid REAL,
        payload TEXT,
        UNIQUE (scope, uuid)
     )`]

@Injectable()
export class TupleActionStorageWebSqlService extends TupleActionStorageServiceABC {
    private webSql: WebSqlService
    
    constructor(
        @Inject(WebSqlFactoryService) private webSqlFactory,
    ) {
        super()
        
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema)
        
    }
    
    storeAction(
        scope: string,
        tupleAction: TupleActionABC,
        payload: Payload
    ): Promise<void> {
        return payload.toEncodedPayload()
            .then((encodedPayload: string) => {
                
                let sql = `INSERT INTO ${tableName}
                    (scope, uuid, payload)
                    VALUES (?, ?, ?)`
                let bindParams = [scope, tupleAction.uuid, encodedPayload]
                
                return this.webSql.runSql(sql, bindParams)
                    .then(() => null)
            })
    }
    
    loadNextAction(): Promise<Payload | null> {
        let sql = `SELECT payload
                    FROM ${tableName}
                    ORDER BY id
                    LIMIT 1`
        let bindParams = []
        
        return this.webSql.querySql(sql, bindParams)
            .then((rows: any[]) => {
                if (rows.length === 0) {
                    return null
                }
                
                let row1 = rows[0]
                return Payload.fromEncodedPayload(row1.payload)
            })
    }
    
    countActions(): Promise<number> {
        let sql = `SELECT count(payload) as count
                    FROM ${tableName}`
        let bindParams = []
        
        return this.webSql.querySql(sql, bindParams)
            .then((rows: any[]) => rows[0].count)
    }
    
    deleteAction(
        scope: string,
        actionUuid: number
    ): Promise<void> {
        let sql = `DELETE FROM ${tableName}
                    WHERE scope=? AND uuid=?`
        let bindParams = [scope, actionUuid]
        
        return this.webSql.runSql(sql, bindParams)
            .then(() => null)
        
    }
    
}

