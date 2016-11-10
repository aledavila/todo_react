import Realm from 'realm';

let realm = new Realm({
  schema: [
    {
      name: 'Todo',
      properties: {
        taks: 'string',
        completed: { type: 'bool', default: false }
      }
    }
  ]
})

export default realm;
