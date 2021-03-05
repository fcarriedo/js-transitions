# JS Transitions

A JS Finite State Machine inspired on https://github.com/pytransitions/transitions

## Usage

sample.js:

```js
  const states = [
    {'name': 'idle', 'onEnter': startPoll, 'onExit': stopPoll},
    {'name': 'in_session'},
    {'name': 'in_checkout'},
  ];

  const transitions = [
    {'trigger': 'fsm_start',    'source': 'idle',         'dest': 'in_session'},
    {'trigger': 'fsm_checkout', 'source': ['in_session'], 'dest': 'in_checkout'},
    {'trigger': 'fsm_end',      'source': '*',            'dest': 'idle',        'before': prepareme, 'after': unwindme},
  ];

  (async () => {
    const sm = new StateMachine(states, transitions, 'idle');

    console.log('current state ===>', sm.state);
    sm.trigger('fsm_start')
    console.log('current state ===>', sm.state);
    sm.trigger('fsm_checkout')
    console.log('current state ===>', sm.state);
    sm.trigger('fsm_end')
    console.log('current state ===>', sm.state);
    sm.trigger('fsm_start')
    console.log('current state ===>', sm.state);
    sm.trigger('fsm_end')

    // Further calls, although valid from the definition, will not cause any
    // transition
    sm.trigger('fsm_end')
    console.log('current state ===>', sm.state);
    sm.trigger('fsm_end')
    console.log('current state ===>', sm.state);
  })();

  function prepareme() {
    console.log('Just before "fsm_end" transition fn being called');
  }
  function unwindme() {
    console.log('Just after "fsm_end" transition fn being called');
  }

  function startPoll() {
    console.log('[start polling]');
  }
  function stopPoll() {
    console.log('[stop polling]');
  }
```

Output:

```sh
$ node sample.js
>current state ===> idle
>[stop polling]
>[fsm_start] Successfully transitioned from 'idle' to 'in_session'
>current state ===> in_session
>[fsm_checkout] Successfully transitioned from 'in_session' to 'in_checkout'
>current state ===> in_checkout
>Just before "fsm_end" transition fn being called
>[start polling]
>[fsm_end] Successfully transitioned from 'in_checkout' to 'idle'
>Just after "fsm_end" transition fn being called
>current state ===> idle
>[stop polling]
>[fsm_start] Successfully transitioned from 'idle' to 'in_session'
>current state ===> in_session
>Just before "fsm_end" transition fn being called
>[start polling]
>[fsm_end] Successfully transitioned from 'in_session' to 'idle'
>Just after "fsm_end" transition fn being called
>WARN: 'fsm_end' will not cause any transition as already in 'idle'
>current state ===> idle
>WARN: 'fsm_end' will not cause any transition as already in 'idle'
>current state ===> idle
```

## TODO

A lot is missing:

  * Throw exceptions when trigger/source/dest does not exist
  * Manage exceptions from state and transition callbacks
  * Verification that the given states/transitions are correctly and fully defined (implement `__validate()`.
  * Better logs when executing states/transition callbacks
  * Transition conditions (predicate) anyone?
  * etc
