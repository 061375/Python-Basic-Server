/** 
* 
* General functions
*
* resources/assets/js/core/_helpers.js
* TST Water 
* @class Helpers
* @author Jeremy Heminger <jheminger@tstwater.com> <contact@jeremyheminger.com>
* @copyright   2018 TST Water LLC
* @version 1.x
* @protected
* 
* @since 1.0.0
* */
var Helpers = (function($){
    /** 
     * convert HTML hexidecimal color values in to R,G,G int
     * @method hexToRgb
     * @param {String} hex
     * @returns {Object}
     * */
	var hexToRgb = function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    /** 
     * convert an int to a hexidecimal color component
     * @method componentToHex
     * @param {Number} c
     * @returns {String}
     * */
    var componentToHex = function(c) {
        c = parseInt(c);
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    /** 
     * convert R,G,B int to an HTML hexidecimal color
     * @method rgbToHex
     * @param {Number} r
     * @param {Number} g
     * @param {Number} b
     * @returns {String}
     * */
    var rgbToHex = function(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    /**  
     * @method resetFootables
     * @param {String} $t DOM the target (defaults to .footables)
     * @param {Number} pause How long until reset (allows DOM to finish rendering)
     * @returns {Void}
     */
    var resetFootables = function($t,pause) {

        if(typeof $t === 'undefined') 
            $t = '.footable';
        if(typeof pause === 'undefined') 
            pause = 0;

        $($t).removeClass('footable-loaded');
        setTimeout(function(){
            $($t).footable();
        },pause);
    }
    /** 
     * @method addCommas
     * @param {Number} x
     * @param (Number) round
     * @returns {String}
     * */
    var addCommas = function(x,round) {
        
        x = parseFloat(x).toFixed(2);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /**  
     * @method tooltip
     * @param {Object} $t
     * @param {String} altlist A list of HTML tags to target
     * @param {Object} csettings Add a list of HTML attributes to the popup - example: style:'height:500px'
     * @param {String} tid If set this will grab an HTMl template from the server
     * @note template and tid require the title to be a JSON string
     * @returns {Object}
     * */
    var tooltip = function($t,altlist,csettings,tid) {
        var $nt = null;
        // @param {String} 
        let list = 'a,td,th,div',
            active = false;
        // if altlist set then use that as a list of potential targets
        if(undefined !== altlist)list = altlist;

        // loop items that can take a tooltip based on the DOM node passed $t
        $t.find(list).on('mouseover',function(e){
            e.preventDefault();
            if(typeof $(this).attr('title') !== 'undefined' || typeof $(this).attr('data-tooltip') !== 'undefined') {
                if(false == active) {
                    let tt;
                    if(typeof $(this).attr('title') !== 'undefined') {
                        tt = $(this).attr('title');
                        $(this).attr('data-tooltip',$(this).attr('title'));
                    }else{
                        tt = $(this).attr('data-tooltip');
                    }
                    try {
                        let pt = JSON.parse(tt);
                        Ajax.getHTMLTemplate('tooltip',function(data){
                            $nt = data[tid].clone();
                            $.each(pt,function(k,v){
                                $nt.find('.'+k).html(v);
                            });
                        });
                    } catch(e) {
                        // I don't need to do anything here
                    }
                    
                    $(this).addClass('hastooltip');
                    let div = document.createElement('div');
                        $(div).attr('class','tooltip');
                        if(null === $nt) {
                            $(div).html(tt);
                        }else{
                            $(div).append($nt);
                        }
                        $(div).css('top',$(this).outerHeight()+3);
                        if(undefined !== csettings) {
                            $.each(csettings,function(k,v){
                                $(div).attr(k,v);
                            });
                        }
                    $(this).append(div);
                    $(this).removeAttr('title');
                    active = true;
                }
            }
        });
        $t.find(list).on('mouseout',function(e){
            
            e.preventDefault();
            if(typeof $(this).attr('data-tooltip') !== 'undefined') {
                active = false;
                $(this).removeClass('hastooltip');
                $(this).find('.tooltip').remove();
            }
        });
    }
    /** 
     * accordion drop-down
     * @method moreinfo
     * @param {Object} $t DOM
     * @returns {Void}
     * */
    var moreinfo = function($t) {

        $t.on('click','.showmore',showmore);
        
        $t.find('td,th').each(function(){
            let $this = $(this);
            if(typeof $(this).find('.showmore').html() !== 'object') {
                $this.parent().addClass('hasmore');
                let div = document.createElement('div');
                    $(div).attr('class','moreinfo hidden');
                    $(div).html($this.attr('data-more'));
                $this.append(div);
            }
        });
    }
    /** 
     * does the same as the accoridon method only using a plus / minus icon and a simpler method
     * @method showmore
     * @param {Event} e
     * @returns {Void}
     */
    var showmore = function(e) {
        e.stopPropagation();
        let $m = $(this).parent().find('.moreinfo');
        if($m.hasClass('hidden')){
            $m.removeClass('hidden');
        }else{
            $m.addClass('hidden');
        }
        $m = $(this).parent().find('.showmore');
        if($m.hasClass('fa-plus')){
            $m.removeClass('fa-plus');
            $m.addClass('fa-minus');
        }else{
            $m.removeClass('fa-minus');
            $m.addClass('fa-plus');
        }
    }
    /** 
     * opens an accordion but allows callback to be run first
     * @method plusminus
     * @param {Object} $t
     * */
    var plusminus = function($t) {
        $t.on('click','.plusminus',function(e){
            e.stopPropagation();
            let $t = $(this);
            let _class = $(this).attr('data-class');
            let func = $(this).attr('data-func');

            if(undefined !== func) {
                let fs = func.split(',');
                // re-assign the callback to a temp variable
                // this way we anly assign a callback once
                let cb = runplusminus;
                for(let i=0; i<fs.length; i++) {
                    if(undefined !== _class) {
                        if(typeof window['TSTwater'][_class][fs[i]] === 'function') 
                            window['TSTwater'][_class][fs[i]]($t,cb);
                    }else{
                        if(typeof window['TSTwater'][fs[i]] === 'function')
                            window['TSTwater'][fs[i]]($t,cb);
                    }
                    // don;t need this anymore
                    cb = undefined;
                }
            }else{
                runplusminus($t);
            }
        });
    }
    /** 
     * accordion with a plus / minus
     * @method runplusminus
     * @param {Object} $t DOM
     * @returns {Void}
     * */
    var runplusminus = function($t) {
            let $m = $t.parent().find('.pluminus_target').first();
            if($m.hasClass('hidden')){
                $m.removeClass('hidden');
            }else{
                $m.addClass('hidden');
            }
            let $n = $t.find('.fa').first();
            if($n.hasClass('fa-plus')){
                $n.removeClass('fa-plus');
                $n.addClass('fa-minus');
            }else{
                if($n.hasClass('fa-minus')) {
                    $n.removeClass('fa-minus');
                    $n.addClass('fa-plus');
                } 
            }
    }
    /** 
     * comment
     * @method buildModule
     * @param {Object} $t
     * @param {Object} _ajax an instantiate Ajax class
     * */
    var buildModule = function($t,_ajax) {

        let id = $t.closest('.module').attr('id');

        if(null === templates) {
            _ajax.getHTMLTemplate('desktop',function(data){
                templates = data;
                buildModuleCallback($t,id);
            });
        }else{
            buildModuleCallback($t,id);
        }
    }
    /** 
     * action to take after the template is loaded
     * @method buildModuleCallback
     * @param {Object} $t DOM
     * @param {String} in a location in the template object  
     * @param {Function} callback
     * */
    var buildModuleCallback = function($t,id,callback) {

        $t.append(templates[id]);

        if(typeof callback === 'function')callback($t);
    } 
    /** 
     * a node may have a number of classes that represent colors
     * this strips them to prepare for a new color
     * @method removeColors
     * @param {Object} $t DOM
     * */
    var removeColors = function($t) {
        let c = ['red','green','yellow','blue','orange','white','black','grey'];
        for(let i=0; i<c.length; i++) {
            $t.removeClass(c[i]);
        }
    }
    /** 
     * allows a select tag to be searched
     * @method searchSelect
     * @param {String} $t DOM a class selector input [type=text]
     * @param {Object} $s select tag
     * @param {String} searchtext
     * */
    var searchSelect = function($t,$s,searchtext) {

        if(undefined === searchtext)
            searchtext ='.seachtext';

        $(searchtext+' ul').addClass('searchtextul');
        
        $('body').on('keyup',$t,function() {
            let q = $(this).val().toLowerCase();
            if(q.length < 1) {
                //$s.find('option').css('display','block');
                $s.attr('size',1);
                $(searchtext+' ul').html('');
                //$s.css('height','initial');
            }else{
                let s = 1;
                //$s.css('height','auto');
                let found = {};
                $(searchtext+' ul').html('');
                $s.find('option').each(function(){
                    if($(this).html().toLowerCase().indexOf(q) > -1) {
                        //$(this).css('visibility','visible');
                        s++;
                        //if(s > 10)s = 10;
                        //$s.attr('size',s);
                        if(s < 10)found[$(this).val()] = $(this).html();
                    }else{
                        //$(this).css('visibility','hidden');
                    }
                });
            
                $.each(found,function(k,v){
                    let li = document.createElement('li');
                        $(li).data('val',k);
                        $(li).html(v+' - '+k);
                        $(li).attr('class','searchfound');
                    $(searchtext+' ul').append(li);
                });
            }
        });
        $('body').on('click','.searchfound',function(){
            $s.val($(this).data('val'));
             $(searchtext+' ul').html('');
        });
        $('body').on('click',$s,function() {
            //$s.attr('size',1);
            //$s.css('height','initial');
        });
    }
    /** 
     * fade from one color to another then clears the result if clear = true
     * @method colorFade
     * @param {Object} $t
     * @param {String} from hex color
     * @param {String} to hex color
     * @param {Number} speed milliseconds
     * @param {Boolean} clear
     * */
    var colorFade = function($t,from,to,speed,clear) {

        var from = hexToRgb(from);
        var to = hexToRgb(to);
        var current = from;

        var r = true;
        if(current.r > to.r) r = false;
        var g = true;
        if(current.g > to.g) g = false;
        var b = true;
        if(current.b > to.b) b = false;

        var rdone = false;
        var gdone = false;
        var bdone = false;

        $t.colorchangeid = setInterval(function(){

            if(!rdone)
            if(r) {
                if(current.r >= to.r){rdone = true;}
                else{
                    current.r++;
                }
            }else{
                if(current.r <= to.r){rdone = true;}
                else{
                    current.r--;
                }
                
            }
            if(!gdone)
            if(g) {
                if(current.g >= to.g){gdone = true;}
                else{
                    current.g++;
                }
                
            }else{
                if(current.g <= to.g){gdone = true;}
                else{
                    current.g--;
                }
            }
            if(!bdone)
            if(b) {
                
                if(current.b >= to.b){bdone = true;}
                else{
                    current.b++;
                }
            }else{
                
                if(current.b <= to.b){bdone = true;}
                else{
                    current.b--;
                }
            }
            
            $t.css('background-color',rgbToHex(current.r,current.g,current.b));

            if(rdone && gdone && bdone) {
                clearInterval($t.colorchangeid);
                $t.css('background-color','');
            }
        },speed);
    }
    /** 
     * if debugging then console.log
     * @method log
     * @param {String} s
     * */
    var log = function(s) {
        if(DEBUGGING && SHOWLOG) {
            if(window.console) {
                console.log(s);
            }
        }
    }
    /** 
     * console.log error as long as console.log exists
     * @method log
     * @param {String} m the method or function
     * @param {String} s the error string
     * @param {Variant} e anything else
     * */
    var logError = function(m,s,e) {
        if(window.console) {
            console.log(m,s,e);
        }
    }
    /** 
     * comment
     * @method loadScript
     * @param {String} scr
     * @param {Function} callback
     * @param {Object} $t DOM
     * */
    var loadScript = function(scr,callback,$t) {
        if(undefined === $t)
            $t = $('body');
        let s = document.createElement('script');
            $(s).attr('src',scr);
        $t.append(s);
        if(typeof callback === 'function')
            callback();
    }
    /** 
     * get query string parameters from a URL
     * @method getParameterByName
     * @param {String} name the key to search for
     * @param {String} url
     * @returns {String}
     * */
    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    /** 
     * comment
     * @method setFavicon
     * */
    var setFavicon = function() {
        if(M_FAVICON || T_FAVICON) {
            $('.favicon').attr('href','/edibase/favicon/favicon2.ico?v='+(Math.floor(Math.random() * 100)));
        }else{
            $('.favicon').attr('href','/edibase/favicon/favicon.ico?v='+(Math.floor(Math.random() * 100)));
        }
    }
    /** 
     * displays a help icon that links to a help file
     * @param {String} name of a cookie (the page) so the need help doesn't always show
     * @method showHelp
     * */
    var showHelp = function(cookie) {
        $('.gethelpfile').removeClass('hidden');
        if(undefined === $.cookie(cookie)) {
            setTimeout(function(){
                $('#needhelp').addClass('show');  
            },10000);
        }
    }
    /** 
     * returns a date as epoch ( seconds since 1970 )
     * @method dateToEpoch
     * @param {String}
     * @returns {Number}
     * */
    var dateToEpoch = function(date) {
        date = new Date(date);
        return date.getTime();
    }
    /** 
     * convert a clock value into an integer for sorting
     * @method clockToNumber
     * @return {Number}
     * */
    var clockToNumber = function(c) {
        // replace : with ''
        c = c.replace(/:/g,'');
        console.log(parseInt(c));
        return parseInt(c);
    }
    /** 
     * comment
     * @method
     * */
    var stringToNumber = function(s) {
        let n = '';
        for(let i=0; i<s.length; i++) {
            n += s.charCodeAt(i);
        }
        return n;
    }
    /** 
     * sort an array of objects
     * @method aSort
     * @param {Array} a [{sort:value},{sort:value}]
     * @returns {Array}
     * */
    var aSort = function(a,desc) {

        if(a.length < 1)
            return a;
        if(desc) {
            return a.sort(function(a,b){
                return a.sortable.toString().toLowerCase().localeCompare(b.sortable.toString().toLowerCase());
            });
        }else{
            return a.sort(function(a,b){
                return b.sortable.toString().toLowerCase().localeCompare(a.sortable.toString().toLowerCase());
            });
        }
    }
    /** 
     * comment
     * @method boolOrText
     * @param {Object} DOM
     * */
     var boolOrText = function($t) {
        $t.on('change','.bool_or',function(){
            $(this).parent().find('.bool_ortext').toggleClass('hidden');
        });
     }
     /** 
      * when data is pulled in the form needs a method to display the text results
      * @method showOrText
      * */
     var showOrText = function($t) {
        $t.find('.bool_ortext').each(function(){
            if($(this).val() != '') {
                $(this).removeClass('hidden');
            }
        });
     }
     /** 
      * comment
      * @method ifOtherSelect
      * @param {Object} DOM
      * */
     var ifOtherSelect = function($t) {
        $t.on('change','.bool_selectother',function(){
            if($(this).val() == 'other') {
                $(this).parent().find('.bool_selectother_text').removeClass('hidden');
            }else{
                $(this).parent().find('.bool_selectother_text').addClass('hidden');
            }
        });
     }
     /** 
      * when data is pulled in the form needs a method to display the text results
      * @method showOtherSelect
      * */
     var showOtherSelect = function($t) {
        $t.find('.bool_selectother_text').each(function(){
            if($(this).val() != '') {
                $(this).removeClass('hidden');
            }
        });
     }
     var formatAMPM = function(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    /** 
     * comment
     * @method
     * */
    function mergeObjects(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }

    return {
    	hexToRgb:hexToRgb,
    	resetFootables:resetFootables,
        addCommas:addCommas,
        tooltip:tooltip,
        moreinfo:moreinfo,
        plusminus:plusminus,
        buildModule:buildModule,
        removeColors:removeColors,
        rgbToHex:rgbToHex,
        searchSelect:searchSelect,
        colorFade:colorFade,
        log:log,
        loadScript:loadScript,
        getParameterByName:getParameterByName,
        setFavicon:setFavicon,
        showHelp:showHelp,
        dateToEpoch:dateToEpoch,
        aSort:aSort,
        clockToNumber:clockToNumber,
        boolOrText:boolOrText,
        ifOtherSelect:ifOtherSelect,
        showOrText:showOrText,
        showOtherSelect:showOtherSelect,
        mergeObjects:mergeObjects,
        logError:logError,
        formatAMPM:formatAMPM
    }
})(jQuery);