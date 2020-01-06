// resize is called initially and whenever page is resized. It also reset sectionPositions
    function resize() {
      // sectionPositions are sections with starting position relative to the top of the first section.
      sectionPositions = [];
      let startPos;
      sections.each(function(d,i) {
        let top = this.getBoundingClientRect().top; //getBoundingClientRect returns the size of an element and its position relative to the viewport.
        if (i === 0) {
          startPos = top; //reset to top if user refreshes, setting first section position to 0
        }
        sectionPositions.push(top - startPos);
      });
      // containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
    }

    // position gets current users position. If user scrolls to new section, dispatch an active envet with new section index.
    function position() {
      let pos = window.pageYOffset - 10; //find pos, current user's position
      let sectionIndex = d3.bisect(sectionPositions, pos); //  pull out the index of the current section
      sectionIndex = Math.min(sections.size() - 1, sectionIndex);
  
      if (currentIndex !== sectionIndex) {
        // @v4 you now `.call` the dispatch callback
        dispatch.call('active', this, sectionIndex);
        currentIndex = sectionIndex;
      }
  
      var prevIndex = Math.max(sectionIndex - 1, 0);
      var prevTop = sectionPositions[prevIndex];
      var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
      // @v4 you now `.call` the dispatch callback
      dispatch.call('progress', this, currentIndex, progress);
    }


    // scroll constructor - Sets up scroller to monitor scrolling of els selection.
    //  @param els - d3 selection of elements that will be scrolled through by user.

    function scroll(els) {
      sections = els;
  
      // when scrolling window, call position. When it is resized call resize.

      d3.select(window)
        .on('scroll.scroller', position)
        .on('resize.scroller', resize);
  
      // initial resize to set up scroller
      resize();
  
      // hack to get position
      // to be called once for
      // the scroll position on
      // load.
      // @v4 timer no longer stops if you
      // return true at the end of the callback
      // function - so here we stop it explicitly.
      var timer = d3.timer(function () {
        position();
        timer.stop();
      });
    }


//scroller determines which section user is scrolled to
  function scroller() {
    let container = d3.select('body');
    // event dispatcher
    let dispatch = d3.dispatch('active', 'progress');
  
    // d3 selection of all the text sections that will be scrolled through
    let sections = null;
  
    // array that will hold the y coordinate of each section that is scrolled through
    let sectionPositions = [];
    let currentIndex = -1;
    // y coordinate of
    let containerStart = 0;

    scroll.container = function (value) {
      if (arguments.length === 0) {
        return container;
      }
      container = value;
      return scroll;
    };
  
    // @v4 There is now no d3.rebind, so this implements
    // a .on method to pass in a callback to the dispatcher.
    scroll.on = function (action, callback) {
      dispatch.on(action, callback);
    };
  
    return scroll;
  }