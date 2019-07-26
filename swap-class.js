
var utils = utils || [];

(function() {
  /**
   *  Flip-flops two classes
   *  @param {HTMLElement} $el
   *  @param {String} _class
   *  @return {Object}
   *
   *	Usage:
   *	utils.swapClass(document.getElementById('some-element'), 'class1').forClass('class2');
   */
  var swapClass = function($el, _class) {
    $el.classList.remove(_class);

    // chain this method
    return {
      forClass: function(__class) {
        return forClass.call(this, $el, __class);
      }
    };
  };

  /////////////////////////////////////////////////////////////////////

  function forClass($el, _class) {
    $el.classList.add(_class);
  }

  utils.swapClass = swapClass;

}());
