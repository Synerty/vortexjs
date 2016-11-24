# VortexJS

Synerty's observable, routable, data serialisation and transport code.

The "vortex" is designed to transport "Payloads" from a web browser (VortexJS) to a
twisted web server (VortexPY). There is also a python client for python client to python server
communication.


See the VortexPY project for more details.
https://github.com/Synerty/vortexpy

# Example Usage

There are some unit tests under src/app/[dir], these may be usefull for further reference.

## Add the providers to the main app module

    
    import {VortexService} from "@synerty/vortex";
    import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";
    
    ...
    
    @NgModule({
            ...
            providers: [VortexService, Ng2BalloonMsgService]
            ...

## Send tuples to the server

    import {Component, OnInit} from "@angular/core";
    import {VortexService, Tuple, Payload} from "@synerty/vortex";
    
    // Declare a custom Tuple Type
    class ExampleTuple extends Tuple {
        attr1: string;
    
        constructor() {
            super("doc.example.tuple.info"); // <-- This string can be anything
        }
    }
    
    
    // Declare a custom Tuple Type, with constructor params
    class BreifExampleTuple extends Tuple {
        constructor(public attr1: string) {
            // tuple name that matches a tuple in the other end (for reconstruction)
            super("doc.example.bried.tuple.info"); // <-- This string can be anything
        }
    }
    
    @Component({
        selector: 'app-example',
        template: '<div></div>'
    })
    export class ExampleComponent implements OnInit {
    
        constructor(public vortexService: VortexService) {
        }
    
        ngOnInit() {
            let goodTuple = new ExampleTuple();
            goodTuple.attr1 = "Some sample data";
            
            let destinationFilt = {
                key: "a unique string" // <-- Matches server PayloadEndpoint or Handler
            };
            
            let payload = new Payload(destinationFilt, [goodTuple]);
            
            // Send the payload to the server.
            
            this.vortexService.sendPayload(payload);
            
            // OR, shorter
            
            this.vortexService.sendTuple(destinationFilt, [goodTuple]);
            
            // OR even shorter
            
            this.vortexService.sendTuple(
                { key: "a unique string" },
                [new BreifExampleTuple("attr1 value")]
            );
            
        }
    
    }
    
## Listen to data from the server

To receive data from the server, the Component must extend `ComponentLifecycleEventEmitter`


    ...
    import {..., ComponentLifecycleEventEmitter } from "@synerty/vortex";
    
    @Component({
       ...
    })
    export class ExampleComponent extends ComponentLifecycleEventEmitter implements OnInit {
    ...

Example code for listening with a `PayloadEndpoint`

    import {Component, OnInit} from "@angular/core";
    import {VortexService, Tuple, Payload,
               ComponentLifecycleEventEmitter } from "@synerty/vortex";

    // Declare a custom Tuple Type, with constructor params
    class BreifExampleTuple extends Tuple {
        constructor(public attr1: string) {
            super("doc.example.tuple.info");
        }
    }

    @Component({
        selector: 'app-example',
        template: '<div></div>'
    })
    export class ExampleComponent extends ComponentLifecycleEventEmitter implements OnInit {

        private tuples:Array<BreifExampleTuple> = [];

        constructor(public vortexService: VortexService) {
            super();
        }

        ngOnInit() {
            // There is also a vortexService.createPayloadObserable
            // this is the createEndpoint

            let endpoint = this.vortexService.createEndpoint(
                    this, {key:"listen.for.some.data"});

            // Subscribe to the tuples, using the RxJS Obserable
            let subscription = endpoint.observable.subscribe(
                    payload => this.tuples = < Array<BreifExampleTuple> > payload.tuples);
                    
            // Unsubscribe if you so desire.
            subscription.unsubscribe();

            // You don't need to keep a reference to the endpoint, it will automatically
            // shutdown when when this components onDestroy is called.
            
            // If you do want to shutdown the endpoint prematurely, call shutdown.
            // The endpoint will no longer have payloads delivered to it.
            endpoint.shutdown();
        }

    }

## Use the TupleLoader

The `TupleLoader` is designed to work with the `OrmCrudHandler` in the VortexPY
This streamlines the work involved to take data from the browser and apply it to a
database using SQLAlchemys ORM.

The TupleLoader has the following functionality :
* Sends an initial payload to the server. This should trigger the server to send back 
the data
* Sends tuples back to the server to be created, updated and deleted.

To receive data from the server, the Component must extend ComponentLifecycleEventEmitter,
see PayloadEndpoint section above.

Example code for working with a TupleLoader

    import {Component, OnInit} from "@angular/core";
    import {VortexService, Tuple, TupleLoader,
               ComponentLifecycleEventEmitter } from "@synerty/vortex";

    // Declare a custom Tuple Type, with constructor params
    class BreifExampleTuple extends Tuple {
        constructor(public attr1: string) {
            super("doc.example.tuple.info");
        }
    }

    @Component({
        selector: 'app-example',
        template: '<div></div>'
    })
    export class ExampleComponent extends ComponentLifecycleEventEmitter implements OnInit {

        private tuples:Array<BreifExampleTuple> = [];

        private someItemId:number = 4;

        loader : TupleLoader;

        constructor(public vortexService: VortexService) {
            super();
        }

        ngOnInit() {
            // Create the loader, it takes a function that returns the payload filter.
            // This allows the TupleLoader to request more specific data, such as single
            // items in a form scenario.
            // The loader will automattically reload data when the filter changes, it
            // listens to the DoCheck Angular2 component life cycle event.
            this.loader = this.vortexService.createTupleLoader(this,
                    () => { return {
                        key : "listen.for.some.data",
                        id : this.someItemId
                    }; });

            // Subscribe to the tuples, using the RxJS Obserable
            // Unlike the PayloadEndpoint, the tuples are observed, not the payload.
            let subscription = this.loader.observable.subscribe(
                    tuples => this.tuples = < Array<BreifExampleTuple> > tuples);

            // Unsubscribe if you so desire.
            subscription.unsubscribe();

            // The following three functions are usefull if called
            // from HTML Reset, Save, Delete buttons respectivly.

            // Reload the current data
            this.loader.load();

            // Save the updates
            this.loader.save();

            // Delete the data
            this.loader.delete();


        }

    }


# Project development info

## Scaffolding

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.20-4.

This test app requires access to the VortexPY

    ng serve --proxy proxy.conf.json

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
