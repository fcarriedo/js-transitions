
class StateMachine {

  constructor(states, transitions, initial) {
    this._state = initial;
    this._states = states;
    this._transitions = transitions;

    this.__validate();
  }

  __validate() {
  }

  /**
   * Returns the first defined state from the given name
   */
  __findState(name) {
    return this._states.find(state => state['name'] === name);
  }

  /**
   * Finds the first transition that matches the given trigger that is valid
   * from the given source state.
   */
  __findTransitionFor(trig, sourceState) {
    return this._transitions.find(t => {
      if (t['trigger'] !== trig) {
        return false;
      }

      // Filter for transitions where this._state is a valid source
      const source = t['source'];
      if (Array.isArray(source)) {
        return source.includes(sourceState);
      }

      // Check if equal or special case all: '*'
      return source === sourceState || source === '*';
    });
  }

  /**
   * Triggers the transition
   */
  trigger(trig) {

    const transition = this.__findTransitionFor(trig, this._state);

    if (!transition) {
      console.error(`ERROR: No transition found from s'${this._state}' with trigger t'${trig}'`);
      return;
    }

    const dest = transition['dest']
    if (!dest) {
      // FIXME: This is an error from the definition
      console.error(`ERROR: No destination defined from s'${this._state}' -> t'${trig} transition'`);
    }

    if (this._state === dest) {
      console.warn(`WARN: t'${trig}' will not cause any transition as already in s'${this._state}'`);
      return;
    }

    const curState = this.__findState(this._state);
    const newState = this.__findState(dest);

    // Before Transition Fn call
    const beforeFn = transition['before'];
    if (beforeFn) {
      beforeFn();
    }

    const onExitFn = curState['onExit'];
    if (onExitFn) {
      onExitFn();
    }

    // Now 'dest' is the new state. THIS IS the transition of state
    this._state = dest;

    const onEnterFn = newState['onEnter'];
    if (onEnterFn) {
      onEnterFn();
    }

    console.log(`[t'${trig}'] Successfully transitioned from s'${curState["name"]}' to s'${newState["name"]}'`);

    // After Transition Fn call
    const afterFn = transition['after'];
    if (afterFn) {
      afterFn();
    }
  }

  get state() {
    return this._state;
  }
}
