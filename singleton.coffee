class Person
  instance = null

  constructor: ->
    if instance? 
      return instance
    instance = this

module.exports = Person
