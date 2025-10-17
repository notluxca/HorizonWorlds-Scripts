// this class will run in "default" server context and will control/handle player enter and exit references
// it will find local player controllers script in scene and properly distribute then among joining/exiting players
// https://dev.to/lnationorg/horizon-world-tutorial-player-management-part-1-server-and-local-controller-1k2

import { CodeBlockEvents, Component, Entity, Player } from 'horizon/core';

class Server_PlayersController extends Component<typeof Server_PlayersController> {
  static propsDefinition = {};
  private PlayersInServer = new Array<Player>();
  private localPlayerControllers = new Array<Entity>();

  preStart(): void {
    this.localPlayerControllers = this.world.getEntitiesWithTags(["LocalPlayerControler"])
  }

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterWorld,
      (player: Player) => this.RegisterPlayerOnEnter(player)
    )
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      (player: Player) => this.DeregisterPlayerOnExit(player)
    )
  }

  private RegisterPlayerOnEnter(player: Player) {
    console.log(`Player ${player.name.get()} has entered the world.`);
    if (!this.PlayersInServer.includes(player)) {
      this.PlayersInServer.push(player)
      let playerIndex = this.PlayersInServer.indexOf(player)
      if (playerIndex < this.localPlayerControllers.length) {
        this.localPlayerControllers[playerIndex].owner.set(player);
      }
    }
  }

  private DeregisterPlayerOnExit(player: Player) {
    console.log(`Player ${player.name.get()} has exited the world.`);
    const playerIndex = this.PlayersInServer.indexOf(player);
    if (playerIndex !== -1) {
      this.localPlayerControllers[playerIndex].owner.set(this.world.getServerPlayer())
      this.PlayersInServer.splice(playerIndex, 1);
    }
  }


}
Component.register(Server_PlayersController);