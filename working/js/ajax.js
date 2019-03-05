 /** 
 * Ajax connection singleton
 * @class Ajax
 * @author Jeremy Heminger <jheminger@tstwater.com> <contact@jeremyheminger.com>
 * @copyright 2018 TST Water LLC
 * @version 2.x
 * 
 * @binding jQuery
 * @since 1.0.0
 * */
 var Ajax = (function($) {

    var url = '/ajax';

    /** 
     * 
     * @method init
     * @params {String} path
     * */
    var init = function(path) {
        Helpers.log('Ajax :: init');

        if(undefined !== path) {
            url = path;
        }
    }
    /**
     * runs an ajax call and waits form promise finally running a callback
     * @method get
     * @param {String} method
     * @param {Object} data
     * @param {Function} callback
     * */
    var get = function(method,data,callback) {
        Helpers.log('get');

        let p = getData(method,data);
        dataResult(p,callback); 
    }
    /**
     * gets the data from the server
     * @method getData
     * @param {String} method
     * @param {Object} data 
     * @note this can allow files to be uploaded data.upload: true
     *       there is a filtered version in _ajax.v2.js
     * @returns {Object}
     * */
    var getData = function(method,data) { 
        Helpers.log('getData');
        return $.ajax({
            url         :url+'?method='+method, 
            headers: {
                "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Access-Control-Allow-Methods":"POST, GET",
                "Access-Control-Max-Age":1000,
                "Access-Control-Allow-Headers":"origin, x-csrftoken, content-type, accept"
            },
            data        :data,
            type        :"post", 
            cache       :(true == DEBUGGING ? false : true),       
            dataType:   "json"
        });
    };
    /**
     * gets the result from the promise
     * @method dataResult
     * @param {Object} p
     * @param {Function} callback
     * */
    var dataResult = function(p, callback) {
        Helpers.log('dataResult');

        p.success( function(data){
            /**
            * Whenever an Ajax event occurs this will check for a request from the server to update.
            * This will allow a remote update to the latest version.
            * */
            if(data.update == 1)
                $('#updatemessage').addClass('show');
            if(data.update == 2)
                window.location.reload();
            
            if(data.success == 1) {
                if (typeof callback === "function") {
                    callback(data.message);
                }
            } else {
                if (typeof data.errors !== 'undefined') {
                    ISERRORING = true;
                    var errors = "";
                    $.each(data.errors,function(k,v){
                        errors+=v+"\n";
                    });
                    alert("An error occured :: "+errors);
                }
            } 
        });
        p.error( function(xhr, ajaxOptions, thrownError){
            if(419 == xhr.status) {
                // this handles when the session has timed out
                window.location.reload();
            }else if(0 == xhr.status){
                // do nothing because this is just a user reloading the page before the task(s) are complete
            }else{
                ISERRORING = true;
                var error_text = 'An Error occurred...';
                if ( typeof xhr !== 'undefined') {
                    console.log('xhr error :: '+xhr.status);
                }
                if ( typeof thrownError !== 'undefined') {
                    console.log('thrownError :: '+thrownError);
                }
                alert(error_text); 
            }
        });    
    };
    
    return {
        init:init,
        get:get,
        getData:getData,
        dataResult:dataResult
    };
})(jQuery);