const { now } = require('../core/time')
const { createHash } = require('crypto')
const { buildUidMatcher } = require('../core/task')

const { LOAD_TASKS, ADD_TASK, TOGGLE_TASK, DELETE_TASK } = require('../action/task')

const defaultTask = {
  uid: undefined,
  description: undefined,
  done: false,
  created: now(),
  updated: now(),
}

module.exports = (state = [], { type, payload }) => {
  let uidMatcher

  switch(type) {
    case LOAD_TASKS:
      console.log(payload)
      return payload
  
    case ADD_TASK:
      return [
        ...state,
        {
          ...defaultTask,
          uid: createHash('sha1').update(payload + now()).digest('hex'),
          description: payload,
        }
      ]

    case TOGGLE_TASK:
      uidMatcher = buildUidMatcher(payload)
      return state.map(task => {
        if (uidMatcher.test(task.uid)) {
          return {
            ...task, 
            done: !task.done, 
            updated: now() 
          }
        }

        return task
      })
    
    case DELETE_TASK:
      uidMatcher = buildUidMatcher(payload)
      return state.filter(task => !uidMatcher.test(task.uid))

    default:
      return state
  }
}
