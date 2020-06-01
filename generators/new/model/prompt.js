module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'VuexORM model must have a name.'
      }
      return true
    },
  },
]
