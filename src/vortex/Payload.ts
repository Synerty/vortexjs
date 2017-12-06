import {Tuple} from "./Tuple";
import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {assert} from "./UtilMisc";
import "./UtilArray";
import {PayloadDelegateInMain} from "./payload/PayloadDelegateInMain";
import {logLong, now, PayloadDelegateABC} from "./payload/PayloadDelegateABC";


// ----------------------------------------------------------------------------
// Types

/**
 * IPayloadFilt
 * This interface defines the structure for a valid payload filter.
 */
export interface IPayloadFilt {
  key: string;

  [more: string]: any;
}

// ----------------------------------------------------------------------------
// Payload class

/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export class Payload extends Jsonable {

  private static workerDelegate = new PayloadDelegateInMain();

  static readonly vortexUuidKey = "__vortexUuid__";
  static readonly vortexNameKey = "__vortexName__";

  filt: {};
  tuples: Array<Tuple | any>;
  result: string | {} | null = null;
  date: Date | null = null;

  /**
   * Payload
   * This class is serialised and tranferred over the vortex to the server.
   * @param filt The filter that the server handler is listening for
   * @param tuples: The tuples to init the Payload with
   * different location @depreciated
   */
  constructor(filt: {} = {}, tuples: Array<Tuple | any> = []) {
    super();
    let self = this;

    self.__rst = SerialiseUtil.T_RAPUI_PAYLOAD;

    self.filt = filt;
    self.tuples = tuples;

  }

  static setWorkerDelegate(delegate: PayloadDelegateABC) {
    Payload.workerDelegate = delegate;
  }

  isEmpty() {
    let self = this;

    // Ignore the connection start vortexUuid value
    // It's sent as the first response when we connect.
    for (let property in self.filt) {
      if (property === Payload.vortexUuidKey)
        continue;
      // Anything else, return false
      return false;
    }

    return (self.tuples.length === 0 && self.result == null);
  }

// -------------------------------------------
// JSON Related method

  private _fromJson(jsonStr: string): Payload {
    let self = this;
    let jsonDict = JSON.parse(jsonStr);

    assert(jsonDict[Jsonable.JSON_CLASS_TYPE] === self.__rst);
    return self.fromJsonDict(jsonDict);
  }

  private _toJson(): string {
    let self = this;
    let jsonDict = self.toJsonDict();
    return JSON.stringify(jsonDict);
  }

  static fromVortexMsg(vortexStr: string): Promise<Payload> {
    let start = now();

    return new Promise<Payload>((resolve, reject) => {

      Payload.workerDelegate.decodeAndInflate(vortexStr)
        .then((jsonStr) => {
          logLong('Payload.fromVortexMsg decode+inflate', start);
          return jsonStr;
        })
        .then((jsonStr) => {
          start = now();
          let payload = new Payload()._fromJson(jsonStr);
          logLong('Payload.fromVortexMsg _fromJson', start, payload);

          resolve(payload);
        })
        .catch(e => console.log(`ERROR: toVortexMsg ${e}`));

    });
  }

  toVortexMsg(): Promise<string> {
    let start = now();

    return new Promise<string>((resolve, reject) => {

      let jsonStr = this._toJson();
      logLong('Payload.toVortexMsg _toJson', start, this);
      start = now();

      Payload.workerDelegate.deflateAndEncode(jsonStr)
        .then((jsonStr) => {
          logLong('Payload.toVortexMsg deflate+encode', start, this);
          resolve(jsonStr);
        })
        .catch(e => console.log(`ERROR: toVortexMsg ${e}`));

    });
  }

}
