$(document)
  .ready(function() {

    if (!Number.prototype.toRad) {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }
    }
    if (!String.prototype.trim) {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      };
    }

    $('body')
      .on('click', '.btn.ajax-edit, .btn.ajax-view', function(e) {
        e.preventDefault();
      });

    APP = {
      error: function(msg) {
        alert('-=| ERROR |=-\n' + msg);
        throw new Error(msg);
      },

      log: function() {
        var msg = Array.prototype.slice.call(arguments)
          .join(' ');
        console.log(msg);
      },

      datetimeInputInit: function() {
        APP.log('APP.datetimeInputInit');
        // in loops to ensure the container is the closest to each instance
        $('.datepicker')
          .each(function() {
            var $this = $(this);
            $this.pickadate({
              clear: '',
              format: 'yyyy-mm-dd',
              formatSubmit: 'yyyy/mm/dd',
              container: $this.closest('.pickadate-container')
            });
          });
        $('.timepicker')
          .each(function() {
            var $this = $(this);
            $this.pickatime({
              clear: '',
              format: 'HH:i',
              container: $this.closest('.pickadate-container')
            });
          });
      },

      distance: function(latlng1, latlng2) {
        var R = 6371; // km	- earth radius
        var lat1 = latlng1.lat()
          .toRad();
        var lat2 = latlng2.lat()
          .toRad();
        var dLat = (latlng2.lat() - latlng1.lat())
          .toRad();
        var dLng = (latlng2.lng() - latlng1.lng())
          .toRad();

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // km
      },

      // a utility that takes a hh:mm string and returns an int bet 0 and 47 (1 = 30m)
      time2int: function(hhmm) {
        var x = hhmm.split(':'),
          res = parseInt(x[0]) * 2 + Math.floor(parseInt(x[1]) / 30);
        return res;
      },
      // reverse the above
      int2time: function(i) {
        var h = Math.floor(i / 2),
          m = (i % 2) ? '30' : '00';
        return ('00' + h)
          .substr(-2) + ':' + m;
      },
      minutesUnformatted: function(s) {
        var x = s.split(':'),
          res = parseInt(x[0]) * 60 + parseInt(x[1]);
        // APP.log( 'unformat: ' + s + ' -> ' + res);
        return res;
      },
      minutesFormatted: function(x) {
        var h, m, d = x,
          res;
        if (typeof x === 'string') { // assume a date format
          d = new Date(x);
        }
        h = d instanceof Date ? d.getHours() : Math.floor(x / 60);
        m = d instanceof Date ? d.getMinutes() : x % 60;
        res = ('00' + h)
          .substr(-2) + ':' + ('00' + m)
          .substr(-2);
        // APP.log( 'format: ' + n + ' -> ' + res);
        return res;
      },

      dateTimeToString: function(d) {
        APP.log('dateTimeToString: ' + d);
        return ('0000' + d.getFullYear())
          .substr(-4) + '-' + ('00' + (d.getMonth() + 1))
          .substr(-2) + '-' + ('00' + d.getDate())
          .substr(-2) + ' ' + ('00' + d.getHours())
          .substr(-2) + ':' + ('00' + d.getMinutes())
          .substr(-2);
      },

      dateToString: function(d) {
        APP.log('dateTimeToString: ' + d);
        return ('0000' + d.getFullYear())
          .substr(-4) + '-' + ('00' + (d.getMonth() + 1))
          .substr(-2) + '-' + ('00' + d.getDate())
          .substr(-2);
      },

      // parse anything that looks like yyyy mm dd  w/ or w/o separators
      stringToDate: function(s) {
        APP.log('stringToDate: ' + s);
        var m = /(\d{4})\D*(\d{2})\D*(\d{2})/.exec(s);
        if (!m) {
          throw 'APP.stringToDate: cannot deal with: ' + s;
        }
        return APP.dateIdToDate('' + m[1] + m[2] + m[3]);
      },

      // dateId = yyyymmdd
      dateIdToDate: function(did) {
        did = '' + did; // force it to be a string
        APP.log('dateIdToDate: ' + did);
        if (did.length !== 8) {
          throw 'APP.dateIdToDate: invalid dateId:' + did + ': len=' + did.length;
        }
        return new Date(did.substr(0, 4) + '/' + did.substr(4, 2) + '/' + did.substr(-2));
      },

      MILLISECONDS_PER_DAY: 60 * 60 * 24 * 1000,

      forms: {
        init: function(jqForm, jqBtn) {
          var $form = $(jqForm),
            $btn = $(jqBtn);
          $(".saptcha")
            .QapTcha();
          $btn.attr('disabled', 'disabled');
          $form
            .on('stateChange', function(ev) {
              APP.forms.recalcState($form, $btn);
            })
            .find('input, textarea')
            .each(function() {
              APP.forms.validate($(this));
            })
            .on('keyup change', function(event) {
              APP.forms.validate($(this));
              APP.forms.recalcState($form, $btn);
            });
        },
        recalcState: function($form, $btn) {
          var n = $form.find('.has-error, .has-warning, .cont.x0')
            .size();
          $btn.attr('disabled', n ? 'disabled' : false);

        },
        validate: function($this) {
          var valid = true,
            blank = ($this.val()
              .trim() == ''),
            $saptcha;
          // console.log( $this.attr('id') + '/' + $this.attr('id') + ': ' + (blank? 'blank' : $this.val().trim()));
          if ($this.hasClass('tsw-v-1')) { // required?
            valid = !blank;
          }
          if ($this.hasClass('tsw-v') && !blank) {
            if ($this.hasClass('tsw-v-email')) {
              valid = this.validateEmail($this.val());
            } else if ($this.hasClass('tsw-v-phone')) {
              valid = this.validatePhone($this.val());
            } else if ($this.hasClass('tsw-v-int')) {
              valid = this.validateInt($this.val());
            } else if ($this.hasClass('tsw-v-date')) {
              valid = this.validateDate($this.val());
            } else if ($this.hasClass('tsw-v-currency')) { // float
              valid = this.validateCurrency($this.val());
            }
          }
          APP.forms.setStatus($this, valid);
        },
        validateEmail: function(val) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(val);
        },
        validatePhone: function(val) {
          // not tested!!
          var re = /^[0-9\.\-\+\ ]+/;
          return re.test(val);
        },
        validateInt: function(val) {
          return parseFloat(val) == parseInt(val, 10) && !isNaN(val);
        },
        validateCurrency: function(val) {
          val = val.replace('$', '')
            .replace(',', '');
          return parseFloat(val) == val && !isNaN(val);
        },
        validateDate: function(val) {
          var d = new Date(val),
            today = new Date(),
            d0 = Math.floor(today.getTime() / APP.MILLISECONDS_PER_DAY),
            d1 = Math.floor(d.getTime() / APP.MILLISECONDS_PER_DAY);
          return d1 >= d0;
        },
        validateTime: function(val) {
          console.log('time: -' + val + '-');
          return val.length > 0;
        },
        setStatus: function($this, b) {
          var x = (b === 'warning') ? 'warning' : (b ? 'success' : 'error');
          $this
            .closest('.form-group')
            .removeClass('has-success has-error has-warning')
            .addClass('has-' + x);
        },
        setStatusSame: function(a, b) {
          var $a = $(a),
            $b = $(b);
          // only do this when both fields are present
          if ($a.size() && $b.size()) {
            APP.forms.setStatus($(a + '.tsw-v'), $b.val() !== '' && $a.val() === $b.val());
            APP.forms.setStatus($(b + '.tsw-v'), $a.val() !== '' && $a.val() === $b.val());
          }
        },
        panelInit: function() {
          $('.panel-collapse')
            .on('hidden.bs.collapse', function() {
              $(this)
                .find('.collapse_note')
                .val(0);
            });
          $('.panel-collapse')
            .on('shown.bs.collapse', function() {
              $(this)
                .find('.collapse_note')
                .val(1);
            });
        }

      },

      makeCard: function(itm) {
        return "<div class='tsw-card col-md-4'><a href='" + itm.url + "' >" + "<img src='" + itm.img + "' />" + "<h4>" + itm.title + "</h4></a></div>";
      },

      RCDMap: {
        markerDefine: function(marker) {
          var o = marker.cargo,
            itm;
          switch (o.type) {
            case 'card':
              // open the info window
              google.maps.event.addListener(marker, 'click', function(e) {
                if (!APP.RCDMap.infoWindow) {
                  APP.RCDMap.infoWindow = new google.maps.InfoWindow({
                    content: 'nothing'
                  });
                }
                APP.RCDMap.infoWindow.setContent(APP.RCDMap._infoWindowContent(marker));
                APP.RCDMap.infoWindow.open(RCDMap.map, marker);
              });
              if (o.title) {
                marker.setTitle(o.title);
              }
              // marker.setAnimation( google.maps.Animation.BOUNCE );
              // setTimeout(function() { marker.setAnimation( null );}, 2000);

              break;

            case 'logo':
              itm = o.items[0]; // if there's more than 1 item, we don't care
              // make our own popup
              google.maps.event.addListener(marker, 'mouseover', function(e) {
                var html = APP.makeCard(itm),
                  posMarker = RCDMap.fromLatLngToPoint(this.position),
                  posMap = $('#map')
                  .offset();
                // 1st time?
                if ($('#app-map-hint')
                  .length === 0) {
                  // let system css handle the rest
                  $('body')
                    .append("<div id='app-map-hint' class='map-note'></div>");
                }
                $('#app-map-hint')
                  .html(html)
                  .fadeIn()
                  .css({
                    top: posMarker.y + posMap.top,
                    left: posMarker.x + posMap.left
                  });
              });

              google.maps.event.addListener(marker, 'mouseout', function(e) {
                $('#app-map-hint')
                  .hide();
              });

              if (itm.url) {
                google.maps.event.addListener(marker, 'click', function(e) {
                  window.location.href = itm.url;
                });
              }
              break;

            default:
              marker.setCursor('default');
              // console.log(o);
              if (o.title) {
                marker.setTitle(o.title);
              }
              break;
          }
        },

        markerTitle: function(objs) {
          var i, res;
          switch (objs.type) {
            case 'card':
              return objs.items.length + (objs.items.length > 1 ? ' spaces' : ' space');
            default:
              res = [];
              for (i = 0; i < objs.items.length; i++) {
                res.push(objs.items[i].title);
              }
              return res.join(' | ');
          }
        },

        infoWindow: null,

        _infoWindowContent: function(marker) {
          var items = marker.cargo.items,
            i, n = items.length,
            itm,
            res = '';
          for (i = 0; i < n; i++) {
            res += APP.makeCard(items[i]);
          }
          return "<div class='map-note'>" + res + "</div>";
        }
      }

    };

    // JIT video behaviour
    $('.jit-video button')
      .on('click', function(ev) {
        var $this = $(this),
          $cont = $this.next('.jit-video-container'),
          $parent = $this.closest('.jit-video');
        if ($parent.hasClass('oui')) {
          // showing, so hide it
          $parent.toggleClass('oui non');
          $cont.slideUp();
        } else {
          $parent.addClass('oui');
          $cont.slideDown();
        }
      });

    // book now! button needs intercepting -- its destination context-sensitive
    $('.nav-booking,.book-btn')
      .on('click', function(ev) {
        var $body = $('body');

        function _locn(i) {
          var url = window.location.href,
            urlClean = url[url.length - 1] === '/' ? url.substr(0, url.length - 1) : url,
            parts = urlClean.split('/');
          return parts[parts.length - i];
        }

        if ($(this)
          .closest('.active')
          .length) {
          // don't go away to the active self!
        } else if ($body.hasClass('cities')) {
          alert(APP.lang('Please select a city to book a space.'));
        } else if ($body.hasClass('city')) {
          window.location.href = '/contact/booking/' + APP.pageId;
        } else if ($body.hasClass('space')) {
          window.location.href = '/contact/booking/' + APP.pageId;
        } else {
          window.location.href = '/cities';
        }
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      });

    $('.btn-back-to-search')
      .each(function() {
        var $this = $(this),
          ref = document.referrer;
        if (ref.indexOf('?') != -1) {
          $this.attr('href', ref);
          $this.fadeIn();
        }
      });

  });

