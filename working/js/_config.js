/** 
 * if true events and other useful information will display in the console 
 * also scripts will load a fresh version with each page load
 * @var {Boolean}
 * @final
 * */
const DEBUGGING = false; 
/** 
 * if true events and other useful information will display in the console
 * @var {Boolean}
 * @final
 * */
const SHOWLOG = false; 
/** 
 * @var 
 * */
var UPDATERUNNING = false;

/** 
 * Protects portential recursive Ajax operations that might get stuck in a look
 * @var {Boolean}
 * */
var ISERRORING = false;

/** 
 * @var {Object}
 * holds rendered screens for faster rendering
 * */
var SCREENS = {}
/** 
 * @var {Object}
 * holds rendered screens for faster rendering
 * */
var FORMS = {}
/** 
 * @var {Object}
 * holds rendered screens for faster rendering
 * */
var KEYBOARDS = {}

/** 
 * #const {Number}
 * */
const ANIMSPEED = 40;	

/** 
 * 
 * @const {String}
 * */
 const BINPATH = 'bin/';
/** 
 * 
 * @const {String}
 * */
 const ASSETPATH = BINPATH + 'assets/';
/** 
 * 
 * @const {String}
 * */
 const VIDEOPATH = ASSETPATH + 'video/';
 /** 
 * 
 * @const {String}
 * */
 const IMAGEPATH = ASSETPATH + 'images/';
 /** 
 * 
 * @const {String}
 * */
 const FONTSPATH = ASSETPATH + 'fonts/';
 /** 
 * 
 * @const {String}
 * */
 const FAVICONSPATH = ASSETPATH + 'favicons/';
/** 
 * @var {Boolean}
 * */
var BOOLKEYBOARD = false;
/** 
 * @var {Boolean}
 * */
var MOBILEMODE = false;
/** 
 * @var {Boolean}
 * */
var PUMPISRUNNING = false;
