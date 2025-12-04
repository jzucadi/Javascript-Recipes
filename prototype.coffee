class Sheep
  constructor: (name, weight) ->
    @name = name
    @weight = weight

  clone: ->
    new Sheep @name, @weight

export default Sheep
