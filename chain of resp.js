class ShoppingCart
  constructor: ->
    @products = []

  addProduct: (p) ->
    @products. push p

class Discount
  calc: (products) ->
    ndiscount = new NumberDiscount()
    pdiscount = new PriceDiscount()
    none = new NoneDiscount()
    ndiscount.setNext pdiscount
    pdiscount.setNext none
    ndiscount.exec products

class NumberDiscount
  constructor: ->
    @next = null

  setNext: (fn) ->
    @next = fn

  exec: (products) ->
    result = 0
    result = 0.05 if products.length > 3
    result + @next.exec products

class PriceDiscount
  constructor: ->
    @next = null

  setNext: (fn) ->
    @next = fn

  exec: (products) ->
    result = 0
    total = products.reduce (a, b) -> a + b
    result = 0.1 if total >= 500
    result + @next.exec products

class NoneDiscount
  exec: ->
    0

module.exports = { ShoppingCart, Discount }
