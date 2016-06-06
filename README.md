# reportable

A simple alternative to event emitters, but with the "safety" that you are binding to events that will actually be sent.

## usage example

```js
import reportable from 'reportable'

class Something {
  constructor() {
    reportable(this, [
      'start',
      'success',
      'failure',
    ])
  }

  getGoing() {
    this.report.start()
  }
}

// later on, maybe in another file

const something = new Something();
something.consumeReports({
  start() {
    console.log('something has started')
  }
})

something.getGoing() // logs "something has started"
```
