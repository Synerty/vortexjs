



// ----------------------------------------------------------------------------
// Typescript date - date fooler
export function now(): any {
  return new Date();
}

export function logLong(message: string, start: any, payload: any | null = null) {
  let duration = now() - start;
  let desc = '';

  // You get 5ms to do what you need before i call the performance cops.
  if (duration < 5)
    return;

  if (payload != null) {
    desc = ', ' + JSON.stringify(payload.filt);
  }

  console.log(`${message}, took ${duration}${desc}`);
}


// ----------------------------------------------------------------------------
export abstract class PayloadDelegateABC {

  abstract deflateAndEncode(payloadJson : string) : Promise<string> ;

  abstract decodeAndInflate(vortexStr : string) : Promise<string> ;

}
