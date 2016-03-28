/*
  Dependencies: Isotope, PhotoSwipe

  Conventions:
    thumbnail      480x480           ID.jpg/png
    mobile full    up to 800x800     ID_M.jpg/png
    desktop full   up to 1920x1920   ID_D.jpg/png
*/

$(window).load(function() {

  var ITEMS = [  
    { id: 'jellyfish', title: 'Jellyfish', desc: 'Digital art for fun',
      type: 'png', cat: 3, dimM: '800x450', dimD: '1920x1080' },
    { id: 'fantasyzooweb', title: 'Fantasy Zoo', desc: 'Website for an imaginery zoo',
      type: 'jpg', cat: 1, dimM: '800x800', dimD: '1920x1514' },
    { id: 'surranocoming', title: 'Surrano', desc: 'Coming soon page for a startup',
      type: 'jpg', cat: 1, dimM: '800x415', dimD: '1920x996' },
    { id: 'pc_page', title: 'PC design', desc: '',
      type: 'jpg', cat: 1, dimM: '640x800', dimD: '1200x1500' },
    { id: 'fantasyzoologo', title: 'Fantasy Zoo logo', desc: 'Logo for an imaginery zoo',
      type: 'png', cat: 2, dimM: '800x800', dimD: '1920x1920' },
    { id: 'mathmonsterangry', title: 'Math Monster', desc: 'iOS app icon for a kids\' math game (for 6-12yrs old)',
      type: 'png', cat: 2, dimM: '800x800', dimD: '1920x1920' },
    { id: 'parkitectlogo', title: 'Parkitect logo', desc: 'Logo for an architecture company that designs, sells and installs playgrounds',
      type: 'png', cat: 2, dimM: '800x800', dimD: '1920x1920' },
    { id: 'pava', title: 'Peacock', desc: 'Digital art for fun',
      type: 'jpg', cat: 3, dimM: '500x800', dimD: '1200x1920' },
    { id: 'fox', title: 'Fox', desc: 'Digital art for fun',
      type: 'jpg', cat: 3, dimM: '600x800', dimD: '1440x1920' },
    { id: 'zebradigi', title: 'Zebra', desc: 'Digital art for fun',
      type: 'jpg', cat: 3, dimM: '800x800', dimD: '1920x1920' },
    { id: 'zebrac', title: 'Zebra drawing', desc: 'A/4 pencil drawing',
      type: 'jpg', cat: 3, dimM: '572x800', dimD: '1373x1920' },
    { id: 'buddha', title: 'Buddha', desc: 'A/3 pencil drawing',
      type: 'jpg', cat: 3, dimM: '581x800', dimD: '1395x1920' },
    { id: 'balerina', title: 'Ballerina', desc: 'A/3 pencil drawing',
      type: 'jpg', cat: 3, dimM: '600x800', dimD: '1440x1920' }
  ];

  function initPortfolioItems() {
    ITEMS.forEach(renderThumbnail);
    ITEMS.forEach(addClickAction);
  }


  function renderThumbnail(item) {
    var $newItem = $('<div class="sorting-item filter-' + item.cat + '">'
      + '  <div class="homepage-portfolio-preview-1 new-animation">'
      + '    <a id="pitem-' + item.id + '" class="" href="./img/portfolio/' + item.id + '_D.' + item.type + '">'
      + '      <span class="background full-size" style="background-image: url(./img/portfolio/' + item.id + '.' + item.type + ');">'
      + '      </span>'
      + '      <span class="text">'
      + '        <span class="h4 light">' + item.title + '</span>'
      + '        <span class="empty-space col-xs-b15"></span>'
      + '        <span class="simple-article large light transparent">' + item.desc + '</span>'
      + '      </span>'
      + '    </a>'
      + '  </div>'
      + '</div>');
    $('#portfolio-emese').isotope( 'insert', $newItem );
  }


  function addClickAction(item) {
    var $portfolioElement = $('#pitem-' + item.id);
    $portfolioElement.click(launchPhotoSwipe);
  }

  function launchPhotoSwipe(e) {
    e.preventDefault();
    var id = $(this).attr('id').slice(6); // truncate 'pitem-'
    var filteredList = ITEMS.filter(categoryFilter);
    var photoSwipeItemList = filteredList.map(createPhotoSwipeItem);
    var selectedIndex = 0;
    filteredList.forEach(function(item, index) {
      if (item.id === id) {
        selectedIndex = index;
      }
    });
    showPhotoSwipe(photoSwipeItemList, selectedIndex);
  }

  function categoryFilter(item) {
    // TODO: analytics event
    if (window.activePortfolioFilter) {
      return (String(item.cat) === window.activePortfolioFilter);
    } else {
      return true;
    }
  }


  function createPhotoSwipeItem(item) {
    var photoSwipeItem = {};
    mobileDims = item.dimM.split('x');
    desktopDims = item.dimD.split('x');
    photoSwipeItem.mediumImage = {
      src: './img/portfolio/' + item.id + '_M.' + item.type,
      w: mobileDims[0],
      h: mobileDims[1]
    };
    photoSwipeItem.originalImage = {
      src: './img/portfolio/' + item.id + '_D.' + item.type,
      w: desktopDims[0],
      h: desktopDims[1]
    };
    return photoSwipeItem;
  }


  function showPhotoSwipe(itemList, startIndex) {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var options = {
        index: startIndex // start at given slide
    };

    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, itemList, options);

    var realViewportWidth,
        useLargeImages = false,
        firstResize = true,
        imageSrcWillChange;

    // beforeResize event fires each time size of gallery viewport updates
    gallery.listen('beforeResize', function() {
      // calculate real pixels when size changes
      realViewportWidth = gallery.viewportSize.x /* * window.devicePixelRatio*/;

      // switch dynamically on window.resize
      // Find out if current images need to be changed
      if (useLargeImages && realViewportWidth < 900) {
        useLargeImages = false;
        imageSrcWillChange = true;
      } else if(!useLargeImages && realViewportWidth >= 900) {
        useLargeImages = true;
        imageSrcWillChange = true;
      }

      // Invalidate items only when source is changed and when it's not the first update
      if(imageSrcWillChange && !firstResize) {
        // invalidateCurrItems sets a flag on slides that are in DOM to force update of content (image) on window.resize
        gallery.invalidateCurrItems();
      }

      if (firstResize) {
        firstResize = false;
      }
      imageSrcWillChange = false;
    });


    // gettingData event fires each time PhotoSwipe retrieves image source & size
    gallery.listen('gettingData', function(index, item) {
      // Set image source & size based on real viewport width
      if( useLargeImages ) {
        item.src = item.originalImage.src;
        item.w = item.originalImage.w;
        item.h = item.originalImage.h;
      } else {
        item.src = item.mediumImage.src;
        item.w = item.mediumImage.w;
        item.h = item.mediumImage.h;
      }
    });

    // Initializes and opens PhotoSwipe
    gallery.init();
  }

  setTimeout(initPortfolioItems, 50);
});
