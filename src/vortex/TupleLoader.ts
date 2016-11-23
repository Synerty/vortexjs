import Payload from "../vortex/Payload";
import {IPayloadFilt} from "../vortex/Payload";
import PayloadEndpoint from "../vortex/PayloadEndpoint";
import {Tuple} from "../vortex/Tuple";
import {
    vortexSendPayload,
    vortexSendTuple,
    SERVER_RESPONSE_TIMEOUT, Vortex
} from "../vortex/Vortex";
import {STOP_PROCESSING} from "../vortex/PayloadIO";
import {plIdKey, plDeleteKey} from "../vortex/PayloadFiterKeys";
import {EventEmitter, Component} from "@angular/core";
import {Ng2CompLifecycleEvent} from "./Ng2CompLifecycleEvent";

/**
 * The signature for the callback function when you want the TupleLoader
 * to call when it receives and single tuple with an ID
 */
interface ISetIdCallback {
    (newId: any): void;
}

interface INg2TupleLoaderParams {
    tupleType?: string;
    vortexSendFilt?: string | IPayloadFilt;
    objName: string;
    objId?: string | number ;
    scopeObjIdName?: string;
    scopeSetObjIdFunc?: null | ISetIdCallback;
    loadOnInit: boolean;
    loadOnIdChange: boolean;
    dataIsArray: boolean;
    actionPostfix?: string;
}

export default class TupleLoader {

    _payloadFilt: IPayloadFilt;
    _tupleType: string;
    _vortexSendFilt: IPayloadFilt;
    _objName: string;
    _objId: number | string;
    _scopeObjIdName: string | null;
    _scopeSetObjIdFunc: null | ISetIdCallback;
    _loadOnInit: boolean;
    _loadOnIdChange: boolean;
    _dataIsArray: boolean;
    _actionPostfix: string | null;

    _tuple: Tuple | null;

    _timer: number;
    _loadDeferred: Promise<Payload>;
    _saveDeferred: null | any; // $.Deferred;

    loadCallback: EventEmitter<boolean>;
    saveCallback: EventEmitter<boolean>;

    _endpoint: PayloadEndpoint;

    /**
     *
     * @param ngComp The Angular scope to load data into. This scope also tears down the
     * PayloadEndpoint when $on.destroy
     *
     * @param payloadFilt ??? The Payload filt to send to the server.
     *
     * @param tupleType ???? The tuple type to use when creating new tuples.
     *
     * @param vortexSendFilt ??? The payload filter sent to the server
     *
     * @param objName The name of the property on the $scope that will be populated
     * with the payload.tuples that is received from the server.
     *
     * @param loadOnInit Should the loader load (send request payload to server) when
     * it's constructed.
     *
     * @param objId The ID to start with, this will be loaded into the payload filt sent
     * to the server.
     *
     * @param scopeObjIdName The name of property on $scope that contains the ID of the
     * object(s) to load.
     *
     * @param scopeSetObjIdFunc The function to call when one tuple is received and it
     * has an id. The id will be passed to the function when it's called.
     *
     * @param loadOnIdChange Watch the $scope[loadOnInit] property, if it  changes,
     * call load automatically.
     *
     * @param dataIsArray If true, the data from the server will be converted to an array.
     *
     * @param actionPostfix If specified, action functions will be added to the $scope
     * object. If the value was "Widget", the callbacks are:
     * * "$scope.loadWidget()"
     * * "$scope.saveWidget()"
     * * "$scope.deWidget()"
     */
    constructor(private ngComp: Ng2CompLifecycleEvent,
                private vortex:Vortex,
                payloadFilt: IPayloadFilt,
        {
            tupleType,
            vortexSendFilt,
            objName = "data",
            objId,
            scopeObjIdName,
            scopeSetObjIdFunc,
            loadOnInit = true,
            loadOnIdChange = true,
            dataIsArray = false,
            actionPostfix
        }: INg2TupleLoaderParams) {

        let self = this;

        self._payloadFilt = payloadFilt;

        self._tupleType = tupleType;
        self._objName = objName;
        self._objId = objId;
        self._scopeObjIdName = scopeObjIdName;
        self._scopeSetObjIdFunc = scopeSetObjIdFunc;
        self._loadOnInit = loadOnInit;
        self._loadOnIdChange = loadOnIdChange;
        self._dataIsArray = dataIsArray;
        self._actionPostfix = actionPostfix;

        self._tuple = (self._tupleType ? new Tuple(self._tupleType) : null);

        self._timer = null;
        self._loadDeferred = null;
        self._saveDeferred = null;

        self.loadCallback = new EventEmitter<boolean>();
        // self.delCallback = $.Callbacks();
        self.saveCallback = new EventEmitter<boolean>();

        // Check data name
        if (self.ngComp[self._objName] != null) {
            console.error(
                "There is already data defined for attribute "
                + self._objName + " on this scope");
        }

        // Register endpoint

        // If we've been passed a string, convert it
        if (typeof payloadFilt === "string") {
            self._payloadFilt = {key: payloadFilt};
        }

        if (typeof vortexSendFilt === "string") {
            self._vortexSendFilt = {key: vortexSendFilt};
        } else if (vortexSendFilt != null) {
            self._vortexSendFilt = vortexSendFilt;
        }

        if (self._objId !== "new" && self._objId != null)
            self._payloadFilt["id"] = self._objId;

        self.ngComp[self._objName] = self._dataIsArray ? [] : null;

        // Get the details object
        self._endpoint = new PayloadEndpoint(self._payloadFilt,
            bind(self, self._processPayload),
            self.ngComp,
            true);

        if (self._loadOnInit)
            vortexSendPayload(new Payload(self._payloadFilt));

        if (self._scopeObjIdName) {

            ngComp.$watch(function () {
                let val = self.ngComp;
                let splits = self._scopeObjIdName.split(".");
                for (let i = 0; val != null && i < splits.length; ++i)
                    val = val[splits[i]];
                // console.log(self._scopeObjIdName + " = " + val);
                return val;
            }, function (newVal: any) {
                newVal = newVal === "new" ? null : newVal;

                if (newVal == null)
                    delete self._payloadFilt[plIdKey];
                else
                    self._payloadFilt[plIdKey] = newVal;

                if (self._loadOnIdChange) {
                    let mergeFilt = {};
                    mergeFilt[plIdKey] = newVal;
                    self.load(mergeFilt);
                }
            });
        }

        // Assign functions to scope that interact with us
        if (self._actionPostfix) {
            ngComp["save" + self._actionPostfix] = function () {
                self.save();
            };

            ngComp["load" + self._actionPostfix] = function () {
                self.load();
            };

            ngComp["del" + self._actionPostfix] = function () {
                self.del();
            };
        }

    }

    /**
     * Load Loads the data from a server
     *
     * @returns Deferred, which is called when the load succeeds or fails.
     *
     */
    load(filtUpdate: {} = {}, updateSendFilter: boolean = false) {
        let self = this;

        if (self._setupTimer() !== true)
            return;

        if (updateSendFilter == null)
            updateSendFilter = true;

        self._resetTimer();
        self._loadDeferred = $.Deferred();

        let sendFilt = $.extend({}, self._vortexSendFilt);

        if (filtUpdate) {
            $.extend(sendFilt, filtUpdate);

            if (updateSendFilter) {
                $.extend(self._vortexSendFilt, filtUpdate);
            }
        }

        // Send request for data
        vortexSendPayload(new Payload(sendFilt));

        return self._loadDeferred;
    }

    /**
     * Save
     *
     * Collects the data from the form, into the tuple and sends it through the
     * vortex.
     *
     * @returns Deferred, which is called when the save succeeds or fails.
     *
     */
    save(filt: { } = {}) {
        let self = this;

        if (self._setupTimer() !== true)
            return;

        self._resetTimer();
        self._saveDeferred = $.Deferred();

        filt = $.extend({}, self._vortexSendFilt, (filt ? filt : {}));
        vortexSendTuple(filt, self.ngComp[self._objName]);

        return self._saveDeferred;
    }

    /**
     * Delete
     *
     * Collects the data from the form, into the tuple and sends it through the
     * vortex.
     *
     * @returns Deferred, which is called when the save succeeds or fails.
     *
     */
    del() {
        let self = this;

        console.log("Using save callback, formloader needs improving");

        if (self._setupTimer() !== true)
            return;

        self._resetTimer();
        self._saveDeferred = $.Deferred();

        let filt = $.extend({}, self._vortexSendFilt);
        filt[plDeleteKey] = true;

        vortexSendTuple(filt, self.ngComp[self._objName]);

        return self._saveDeferred;
    }

    private _processPayload(payload: Payload) {
        let self = this;

        clearTimeout(self._timer);
        self._timer = null;

        if (payload.result === null || payload.result === true) {

            if (self._dataIsArray) {
                self.ngComp[self._objName] = payload.tuples;

            } else if (payload.tuples.length) {
                let o = payload.tuples[0];
                self.ngComp[self._objName] = o;

                // If we need to update the $scope with the new id, do so
                if (self._scopeSetObjIdFunc && o.hasOwnProperty("id") && o.id != null) {
                    // bind(self.$scope, self._scopeSetObjIdFunc)(o.id);
                    self._scopeSetObjIdFunc(o.id);

                }

            } else {
                self.ngComp[self._objName] = null;

            }
            applyScope(self.ngComp);
        }

        // No result, means this was a load
        if (payload.result === null) {
            self._loadDeferred && self._loadDeferred.notify();

            try {
                self.loadCallback.fire(true);
            } catch (e) {
                console.log("TupleLoader - Caught angular apply error");
                console.error(e);
                // console.trace();
            }

            self._loadDeferred = null;
            return;
        }

        // Result, means this was a save
        if (payload.result === true) {
            self._saveDeferred && self._saveDeferred.notify();
            try {
                self.saveCallback.fire(true);
            } catch (e) {
                console.log("TupleLoader - Caught angular apply error");
                console.error(e);
                // console.trace();
            }

            if (payload.filt.hasOwnProperty("delete")) {
                logSuccess("Delete Successfull");
            } else {
                logSuccess("Save Successfull");
            }

        } else {
            logError(payload.result.toString());
            self._saveDeferred && self._saveDeferred.reject();

            try {
                self.saveCallback.fire(payload.result);
            } catch (e) {
                console.log("TupleLoader - Caught angular apply error");
                console.error(e);
                // console.trace();
            }

        }

        self._saveDeferred = null;

        if (payload.result !== true) {
            return STOP_PROCESSING;
        }
    }

    private _resetTimer(): void {
        let self = this;

        self._timer = null;

        self._loadDeferred && self._loadDeferred.reject();
        self._loadDeferred = null;

        self._saveDeferred && self._saveDeferred.reject();
        self._saveDeferred = null;
    }

    private _setupTimer(): boolean {
        let self = this;
        if (self._timer != null) {
            logError("TupleLoader is already processing a request" +
                ", Command failed");
            return false;
        }

        self._timer = setTimeout(SERVER_RESPONSE_TIMEOUT,
            bind(self, self._operationTimeout));
        return true;
    }

    private _operationTimeout(): void {
        let self = this;
        self._resetTimer();

        logError("Server Data Request - Operation Timed Out");

    }
}

