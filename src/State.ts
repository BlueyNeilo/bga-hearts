class State {
  name: string
  onEnterState: (args: any) => void
  onLeaveState: () => void
  handleAction: (args: any[]) => void
  handleOutOfTurnAction: (args: any[]) => void

  constructor(
    name: string,
    onEnterState: (args: any) => void = () => {},
    onLeaveState: () => void = () => {},
    handleAction: (args: any[]) => void = () => {},
    handleOutOfTurnAction: (args: any[]) => void = () => {},
  ) {
    this.name = name
    this.onEnterState = onEnterState
    this.onLeaveState = onLeaveState
    this.handleAction = handleAction
    this.handleOutOfTurnAction = handleOutOfTurnAction
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StateSystem {
  private readonly main: Main
  public readonly states: Record<string, State>

  constructor(main: Main) {
    this.main = main
    this.states = Object.fromEntries(
      [new State('dummy')].map((state) => [state.name, state]),
    )
  }
}
