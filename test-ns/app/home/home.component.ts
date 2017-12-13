import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

// Enable the use of workers for the payload
import { Payload } from "../vortexjs";
import { PayloadDelegateNs } from "../vortexjs/index-nativescript";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    payloadWorkerStatus = 'idle';

    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    private _sideDrawerTransition: DrawerTransitionBase;

    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    testPayloadEncoding(): void {
        this.payloadWorkerStatus = 'started';
        Payload.setWorkerDelegate(new PayloadDelegateNs());

        let payload = new Payload();

        payload.toVortexMsg()
            .then((vortexMsg) => {
                this.payloadWorkerStatus = 'encoded';
                return Payload.fromVortexMsg(vortexMsg)
                    .then((vortexMsg) => {
                        this.payloadWorkerStatus = "SUCCESS";
                    });
            })
            .catch((err) => {
                this.payloadWorkerStatus = `Failed : \n${err}`;
            });

    }

}
