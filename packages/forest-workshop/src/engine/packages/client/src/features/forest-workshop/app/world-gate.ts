// Which world answers may change the screen (handoff v1.7 §1, mid-review defect 1). Two rules, kept apart:
//   - updates of the world on screen (command answers, heartbeats, reads) apply only when they are for that same world
//     and not older than what is shown: a late heartbeat with revision 11 never undoes a command answer with 12;
//   - opening a world (open, create, restore) is a navigation: each one starts a new epoch, and an answer that belongs
//     to an older navigation is dropped, so a slow answer for world A cannot replace world B the player opened since.
// Pure: no DOM, no store; the controller asks it before applying anything.
export interface ShownWorld {
  worldId: string;
  revision: number;
}

export class WorldGate {
  private epoch = 0;

  /** Starts a navigation; the returned ticket is checked when its answer arrives. */
  beginNavigation(): number {
    this.epoch += 1;
    return this.epoch;
  }

  isCurrentNavigation(ticket: number): boolean {
    return ticket === this.epoch;
  }

  /** An update for the shown world: same world, and not older than what is on screen. */
  acceptsUpdate(shown: ShownWorld | null, incoming: ShownWorld): boolean {
    if (!shown || shown.worldId !== incoming.worldId) return false;
    return incoming.revision >= shown.revision;
  }
}
