import {Injectable} from '@angular/core';
import {WebSqlFactoryService, WebSqlService, WebSqlTransaction} from './WebSqlService';

declare let openDatabase: any;

const RETRY_NO_SPACE = 'there was not enough remaining storage space';
const RETRY_DISK_ERROR = 'unable to begin transaction (3850 disk I/O error)';

@Injectable()
export class WebSqlBrowserFactoryService implements WebSqlFactoryService {

    hasStorageLimitations(): boolean {
        // iOS safari supports up to a 50mb limit, MAX.
        // In this case, IndexedDB should be used.
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
        // Other conditions
        return iOS;
    }

    supportsWebSql(): boolean {
        try {
            return openDatabase != null;
        } catch (e) {
            return false;
        }
    }

    createWebSql(dbName: string, dbSchema: string[]): WebSqlService {
        return new WebSqlBrowserAdaptorService(dbName, dbSchema);
    }
}

export class WDBException {
    constructor(public message: string) {
    }

    toString(): string {
        return 'WDBException: ' + this.message;
    }
}

@Injectable()
class WebSqlBrowserAdaptorService extends WebSqlService {

    constructor(protected dbName: string, protected dbSchema: string[]) {
        super(dbName, dbSchema);
    }

    open(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.isOpen()) {
                resolve();
                return;
            }

            this.db = openDatabase(this.dbName, '1', this.dbName, 4 * 1024 * 1024);
            if (this.schemaInstalled) {
                resolve();
                return;
            }

            this.installSchema()
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                })
                .then(() => resolve());
        });
    }

    isOpen(): boolean {
        return this.db != null;
    }

    close(): void {
        this.db = null;
    }

    transaction(): Promise<WebSqlTransaction> {
        if (!this.isOpen())
            throw new Error(`SQLDatabase ${this.dbName} is not open`);

        return new Promise<WebSqlTransaction>((resolve, reject) => {
            this.db.transaction((t) => {
                resolve(new WebSqlBrowserTransactionAdaptor(t));
            }, (tx, err) => {
                reject(err == null ? tx : err);
            });
        });
    }
}

class WebSqlBrowserTransactionAdaptor implements WebSqlTransaction {
    constructor(private websqlTransaction: any) {

    }

    executeSql(sql: string, bindParams: any[] | null = []): Promise<null | any[]> {
        return new Promise<null | any[]>((resolve, reject) => {
            this.retryExecuteSql(5, sql, bindParams, resolve, reject);
        });
    }

    private retryExecuteSql(retries: number, sql: string,
                            bindParams: any[] | null, resolve: any, reject: any) {

        this.websqlTransaction.executeSql(sql, bindParams,
            (transaction, results) => {
                /*
                 * results:(SQLResultSet) {
                 *      insertId:0,
                 *      rows:(SQLResultSetRowList){
                 *          length:0
                 *      },
                 *      rowsAffected:0
                 *  }
                 */
                // ALL GOOD, Return the rows
                let rowArray = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    rowArray.push(results.rows.item(i));
                }

                resolve(rowArray);

            }, (tx, err) => {
                err = err == null ? tx : err; // Sometimes tx is the err

                // Bug in Safari (at least), when the user approves the storage space
                // The WebSQL still gets the exception
                // "there was not enough remaining storage space, or the storage quota was reached and the user declined to allow more space"
                if (retries >= 0 && WebSqlBrowserTransactionAdaptor.checkRetryMessage(err.message)) {
                    this.retryExecuteSql(retries - 1, sql, bindParams, resolve, reject);
                    return;
                }

                // Otherwise, REJECT
                reject(err);

            }
        );

    }

    public static checkRetryMessage(message: string): boolean {
        if (message.indexOf(RETRY_NO_SPACE) !== -1)
            return true;

        return message.indexOf(RETRY_DISK_ERROR) !== -1;
    }

}
