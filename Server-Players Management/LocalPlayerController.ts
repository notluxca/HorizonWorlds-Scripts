// this class will be atached to player to object in scene
// it run definitiun should be set to Local or it will return ownership errors
// https://dev.to/lnationorg/horizon-world-tutorial-player-management-part-1-server-and-local-controller-1k2

import { Component, Player } from 'horizon/core';

class Local_PlayerController extends Component<typeof Local_PlayerController> {
  static propsDefinition = {};
  private owner!: Player;

  preStart() {
    this.owner = this.entity.owner.get()
    if (this.owner !== this.world.getServerPlayer()) {
      this.localPrestart()
    }
  }

  start(): void {
    if (this.owner === this.world.getServerPlayer()) {
      this.ServerStart();
    } else {
      this.localStart()
    }
  }
  private localStart() {
    console.log("LocalStart Called");
  }

  private localPrestart() {
    console.log(`Local_PlayerController prestart called on ${this.owner.name.get()}`)
  }


  private ServerStart() {
    console.log("Server Called");
  }

}
Component.register(Local_PlayerController);