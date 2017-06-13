/*!  2017-06-12 */
//! moment.js
//! version : 2.11.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')$', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')$', 'i');
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             if (this.isValid() && other.isValid()) {
                 return other < this ? this : other;
             } else {
                 return valid__createInvalid();
             }
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this > +localInput;
        } else {
            return +localInput < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this < +localInput;
        } else {
            return +this.clone().endOf(units) < +localInput;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return +this === +localInput;
        } else {
            inputMs = +localInput;
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // JSON.stringify(new Date(NaN)) === 'null'
        return this.isValid() ? this.toISOString() : 'null';
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        // console.log("got", weekYear, week, weekday, "set", date.toISOString());
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = local__createLocal([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = getSet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = getSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto._months           = defaultLocaleMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto._monthsRegex      = defaultMonthsRegex;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.11.1';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
(function(window) {
    var re = {
        not_string: /[^s]/,
        number: /[diefg]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key)
        }
        return sprintf.format.call(null, cache[key], arguments)
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i])
            if (node_type === "string") {
                output[output.length] = parse_tree[i]
            }
            else if (node_type === "array") {
                match = parse_tree[i] // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                        }
                        arg = arg[match[2][k]]
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (get_type(arg) == "function") {
                    arg = arg()
                }

                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2)
                    break
                    case "c":
                        arg = String.fromCharCode(arg)
                    break
                    case "d":
                    case "i":
                        arg = parseInt(arg, 10)
                    break
                    case "j":
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
                    break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                    break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                    break
                    case "g":
                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
                    break
                    case "o":
                        arg = arg.toString(8)
                    break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                    break
                    case "u":
                        arg = arg >>> 0
                    break
                    case "x":
                        arg = arg.toString(16)
                    break
                    case "X":
                        arg = arg.toString(16).toUpperCase()
                    break
                }
                if (re.json.test(match[8])) {
                    output[output.length] = arg
                }
                else {
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
                        sign = is_positive ? "+" : "-"
                        arg = arg.toString().replace(re.sign, "")
                    }
                    else {
                        sign = ""
                    }
                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
                    pad_length = match[6] - (sign + arg).length
                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output.join("")
    }

    sprintf.cache = {}

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0]
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%"
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1]
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key")
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key")
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                }
                parse_tree[parse_tree.length] = match
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder")
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return parse_tree
    }

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0)
        _argv.splice(0, 0, fmt)
        return sprintf.apply(null, _argv)
    }

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input)
    }

    /**
     * export to either browser or node.js
     */
    if (typeof exports !== "undefined") {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    else {
        window.sprintf = sprintf
        window.vsprintf = vsprintf

        if (typeof define === "function" && define.amd) {
            define(function() {
                return {
                    sprintf: sprintf,
                    vsprintf: vsprintf
                }
            })
        }
    }
})(typeof window === "undefined" ? this : window);

//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

/*global window, require, define */
(function(_window) {
  'use strict';

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;

  function setupBrowser() {
    // Allow for MSIE11 msCrypto
    var _crypto = _window.crypto || _window.msCrypto;

    if (!_rng && _crypto && _crypto.getRandomValues) {
      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
      //
      // Moderately fast, high quality
      try {
        var _rnds8 = new Uint8Array(16);
        _whatwgRNG = _rng = function whatwgRNG() {
          _crypto.getRandomValues(_rnds8);
          return _rnds8;
        };
        _rng();
      } catch(e) {}
    }

    if (!_rng) {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var  _rnds = new Array(16);
      _mathRNG = _rng = function() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return _rnds;
      };
      if ('undefined' !== typeof console && console.warn) {
        console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
      }
    }
  }

  function setupNode() {
    // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
    //
    // Moderately fast, high quality
    if ('function' === typeof require) {
      try {
        var _rb = require('crypto').randomBytes;
        _nodeRNG = _rng = _rb && function() {return _rb(16);};
        _rng();
      } catch(e) {}
    }
  }

  if (_window) {
    setupBrowser();
  } else {
    setupNode();
  }

  // Buffer class to use
  var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) === 'string') {
      buf = (options === 'binary') ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;
  uuid._rng = _rng;
  uuid._mathRNG = _mathRNG;
  uuid._nodeRNG = _nodeRNG;
  uuid._whatwgRNG = _whatwgRNG;

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // Publish as node.js module
    module.exports = uuid;
  } else if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});


  } else {
    // Publish as global (in browsers)
    _previousRoot = _window.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _window.uuid = _previousRoot;
      return uuid;
    };

    _window.uuid = uuid;
  }
})(this);

(function() {
    // Establish the root object,
    // `window` (`self`) in the browser,
    // `global`on the server,
    // `this` in some virtual machines.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;

    //Declare game's namespace
    var Namespace = root.Game = root.DejuPoker = {};

    Namespace.isNodeJS = (typeof exports === "object");

    Namespace.inherits = function(ctor, superCtor) {
        ctor._super = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });

        ctor.prototype._super = superCtor;
        ctor.super = function(o) { ctor._super.call(o) };
    };

    Namespace.extend = function(origin, add) {
        if (add === null || typeof add !== 'object') return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    };

    //init libs reference
    if (Namespace.isNodeJS) {
        Namespace.uuid      = require('uuid');
        Namespace.moment    = require('moment');
        Namespace.sprintf   = require('../libs/sprintf').sprintf;
        Namespace.CryptoJS  = require('crypto-js');
    } else {
        Namespace.uuid      = root.uuid;
        Namespace.moment    = root.moment;
        Namespace.sprintf   = root.sprintf;
        Namespace.CryptoJS  = root.CryptoJS;

        if (typeof console.info != "function") {
            console.info = console.log;
        }
    }
}());

(function(root) {
    var Handler = root.Handler = function(caller,method,args,once) {
        //this.caller = null;
        //this.method = null;
        //this.args = null;
        this.once = false;
        this._id = 0;
        (once===void 0)&& (once=false);
        this.setTo(caller,method,args,once);
    };

    var __proto = Handler.prototype;
    /**
     *设置此对象的指定属性值。
     *@param caller 执行域(this)。
     *@param method 回调方法。
     *@param args 携带的参数。
     *@param once 是否只执行一次，如果为true，执行后执行recover()进行回收。
     *@return 返回 handler 本身。
     */
    __proto.setTo=function(caller,method,args,once){
        this._id=Handler._gid++;
        this.caller=caller;
        this.method=method;
        this.args=args;
        this.once=once;
        return this;
    };

    /**
     *执行处理器。
     */
    __proto.run=function(){
        if (this.method==null)return null;
        var id=this._id;
        var result=this.method.apply(this.caller,this.args);
        this._id===id && this.once && this.recover();
        return result;
    };

    /**
     *执行处理器，携带额外数据。
     *@param data 附加的回调数据，可以是单数据或者Array(作为多参)。
     */
    __proto.runWith=function(data){
        if (this.method==null)return null;
        var id=this._id;
        if (data==null)
            var result=this.method.apply(this.caller,this.args);
        else if (!this.args && !data.unshift)result=this.method.call(this.caller,data);
        else if (this.args)result=this.method.apply(this.caller,this.args.concat(data));
        else result=this.method.apply(this.caller,data);
        this._id===id && this.once && this.recover();
        return result;
    };

    /**
     *清理对象引用。
     */
    __proto.clear=function(){
        this.caller=null;
        this.method=null;
        this.args=null;
        return this;
    };

    /**
     *清理并回收到 Handler 对象池内。
     */
    __proto.recover=function(){
        if (this._id > 0){
            this._id=0;
            Handler._pool.push(this.clear());
        }
    };

    Handler.create = function(caller,method,args,once){
        (once===void 0) && (once=true);
        if (Handler._pool.length) {
            return Handler._pool.pop().setTo(caller,method,args,once);
        }
        return new Handler(caller,method,args,once);
    };

    Handler._pool=[];
    Handler._gid=1;
})(DejuPoker);

(function(root){
    var _super = root.Handler;
    
    var EventHandler = root.EventHandler = function(caller, method, args, once) {
        _super.call(this, caller, method, args, once);
    };

    root.inherits(EventHandler, _super);

    var __proto=EventHandler.prototype;

    __proto.recover = function() {
        if (this._id > 0){
            this._id=0;
            EventHandler._pool.push(this.clear());
        }
    };

    EventHandler.create = function(caller,method,args,once){
        (once===void 0)&& (once=true);
        if (EventHandler._pool.length) {
            return EventHandler._pool.pop().setTo(caller,method,args,once);
        }
        return new EventHandler(caller,method,args,once);
    };

    EventHandler._pool = [];
})(DejuPoker);

(function(root) {
    var EventHandler = root.EventHandler;
    var EventDispatcher = root.EventDispatcher = function() {
        this._events = null;
    };

    var __proto = EventDispatcher.prototype;
    /**
     *检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
     *@param type 事件的类型。
     *@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
     */
    __proto.hasListener = function(type) {
        var listener= this._events && this._events[type];
        return !!listener;
    };

    /**
     *派发事件。
     *@param type 事件类型。
     *@param data 回调数据。
     *<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
     *@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
     */
    __proto.event = function(type, data) {
        if (!this._events || !this._events[type]) {
            return false;
        }
        var listeners=this._events[type];
        if (listeners.run) {
            if (listeners.once)delete this._events[type];
            data !=null ? listeners.runWith(data): listeners.run();
        } else {
            for (var i=0, n=listeners.length; i < n; i++) {
                var listener=listeners[i];
                if (listener) {
                    (data !=null)? listener.runWith(data):listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i,1);
                    i--;
                    n--;
                }
            }
            if (listeners.length===0)delete this._events[type];
        }
        return true;
    };

    /**
     *使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
     *@param type 事件的类型。
     *@param caller 事件侦听函数的执行域。
     *@param listener 事件侦听函数。
     *@param args 事件侦听函数的回调参数。
     *@return 此 EventDispatcher 对象。
     */
    __proto.on=function(type, caller, listener, args) {
        return this._createListener(type, caller, listener, args, false);
    };

    /**
     *使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
     *@param type 事件的类型。
     *@param caller 事件侦听函数的执行域。
     *@param listener 事件侦听函数。
     *@param args 事件侦听函数的回调参数。
     *@return 此 EventDispatcher 对象。
     */
    __proto.once = function(type,caller,listener,args){
        return this._createListener(type,caller,listener,args,true);
    };

    __proto._createListener=function(type,caller,listener,args,once){
        this.off(type,caller,listener,once);
        var handler=EventHandler.create(caller || this,listener,args,once);
        this._events || (this._events={});
        var events=this._events;
        if (!events[type])events[type]=handler;
        else {
            if (!events[type].run)events[type].push(handler);
            else events[type]=[events[type],handler];
        }
        return this;
    };

    /**
     *从 EventDispatcher 对象中删除侦听器。
     *@param type 事件的类型。
     *@param caller 事件侦听函数的执行域。
     *@param listener 事件侦听函数。
     *@param onceOnly 如果值为 true ,则只移除通过 once 方法添加的侦听器。
     *@return 此 EventDispatcher 对象。
     */
    __proto.off=function(type,caller,listener,onceOnly){
        (onceOnly===void 0)&& (onceOnly=false);
        if (!this._events || !this._events[type])return this;
        var listeners=this._events[type];
        if (listener !=null){
            if (listeners.run){
                if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
                    delete this._events[type];
                    listeners.recover();
                }
            }else {
                var count=0;
                for (var i=0,n=listeners.length;i < n;i++){
                    var item=listeners[i];
                    if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
                        count++;
                        listeners[i]=null;
                        item.recover();
                    }
                }
                if (count===n)delete this._events[type];
            }
        }
        return this;
    };

    /**
     *从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
     *@param type 事件类型，如果值为 null，则移除本对象所有类型的侦听器。
     *@return 此 EventDispatcher 对象。
     */
    __proto.offAll=function(type){
        var events=this._events;
        if (!events)return this;
        if (type){
            this._recoverHandlers(events[type]);
            delete events[type];
        }else {
            for (var name in events){
                this._recoverHandlers(events[name]);
            }
            this._events=null;
        }
        return this;
    };

    __proto._recoverHandlers=function(arr){
        if(!arr)return;
        if (arr.run){
            arr.recover();
        }else {
            for (var i=arr.length-1;i >-1;i--){
                if (arr[i]){
                    arr[i].recover();
                    arr[i]=null;
                }
            }
        }
    };
})(DejuPoker);

(function(root) {
    var _super = root.EventDispatcher;

    var Serialize = root.Serialize = function(opts) {
        opts = opts || {};

        _super.call(this, opts);
    };

    root.inherits(Serialize, _super);

    root.extend(Serialize.prototype, {
        inspector: function(obj) {
            if (obj == null) {
                return obj;
            }

            if (typeof obj !== 'object') {
                return obj;
            }

            if (obj instanceof Array) {
                var new_arr = [];

                for (var i in obj) {
                    if (typeof obj[i] === 'object') {
                        new_arr[i] = this.inspector(obj[i]);
                    } else {
                        new_arr[i] = obj[i];
                    }
                }

                return new_arr;
            }

            if (typeof obj.clone === 'function') {
                return obj.clone();
            }

            var new_obj = {};
            for (var key in obj) {
                var val = obj[key];
                if (typeof val === 'object') {
                    new_obj[key] = this.inspector(val);
                } else {
                    if (obj.hasOwnProperty(key)) {
                        new_obj[key] = val;
                    }
                }
            }

            return new_obj;
        },

        clone: function() {
            var obj = {};

            for (var key in this) {
                var val = this[key];

                if (this.hasOwnProperty(key) == false) {
                    continue;
                }

                if (key[0] == '_') {
                    continue;
                }

                obj[key] = this.inspector(val);
            }

            return obj;
        },

        toString: function() {
            return JSON.stringify(this.clone());
        },

        sync: function(opts) {
            for (var key in opts) {
                if (this.hasOwnProperty(key)) {
                    this[key] = opts[key];
                }
            }
        }
    });
}(DejuPoker));

(function(root) {
    var _super = root.Serialize;
    var Entity = root.Entity = function(opts) {
        opts = opts || {};

        Entity.super(this, opts);

        //private members
        this._properties    = {};

        //public members
        this.uuid           = opts.uuid || root.uuid.v4();
        this.createTime     = opts.createTime || Number(root.moment().format('x'));
    };

    //Inherits Class
    root.inherits(Entity, _super);

    //Extend Prototype
    root.extend(Entity.prototype, {
        set: function(key, val) {
            this._properties[key] = val;
        },

        get: function(key) {
            return this._properties[key];
        }
    });
}(DejuPoker));
(function(root) {
    root.wrapMsg = function(err, data) {
        var msg = {};

        if (err != null) {
            msg.code = root.Code.FAILED;
            msg.err  = err;
            msg.msg  = "";
        } else {
            msg.code = root.Code.OK;
            msg.data = data;
        }

        return msg;
    };

    root.ROUTE = {
        ROOM: {
            READY:              "room.ready",               // 准备结束
            ENTER:              "room.enter",
            LEAVE:              "room.leave",               // 离开房间
            KICK:               "room.kick",                // 提出房间
            STATE:              "room.state",
            ACTION:             "room.action",
            COMMAND:            "room.command",             // 玩家操作的反馈
            ROB:                "room.rob",                 // 抢庄操作
            DEAL:               "room.deal",                // 发牌完结
            BID:                "room.bid",                 // bid完结
            DRAW:               "room.draw",                // 闲家要牌完结
            BANKER_DRAW:        "room.banker.draw",         // 庄家操作结束
            PAY:                "room.pay",                 // 结算操作
            END:                "room.end",                 // 牌局结束
            CLOSE:              "room.close",               // 房间关闭
            DISMISS_APPLY:      "room.dismiss.apply",       // 申请关房
            DISMISS_CONFIRM:    "room.dismiss.confirm",     // 申请关房确认
            DISMISS_RESULT:     "room.dismiss.result",      // 申请关房结果
            AFK:                "room.afk",                 // 离线
        },

        CHAT: {
            SEND:               "chat.send",                // 发送聊天信息
            FORBID:             "chat.forbid",              // 禁言
            FORBID_CANCEL:      "chat.forbid.cancel"        // 取消禁言
        },

        CHAIR: {
            SIT_DOWN:           "sit.down",                 // 坐下
            STAND_UP:           "stand.up",                 // 站起
            LET_STAND_UP:       "let.stand.up"              // 强制站起
        }
    };

    root.Code = {
        OK: 200,
        FAILED: 500,
        TIMEOUT: 1000,

        SYSTEM: {
            MySQL_ERROR:        1001,
            REDIS_ERROR:        1002,
            HTTP_ERROR:         1003,
            CHANNEL_ERROR:      1004,
            RPC_ERROR:          1005,
            SESSION_ERROR:      1006,
            TOKEN_ERROR:        1007
        },

        ROUTE: {
            UNAUTHORIZED:       1101,
            INVALID_PARAMS:     1102,
            INVALID_SESSION:    1103
        },

        // 1200~1299
        GATE: {
            NOT_EXIST_ENTRY:    1201
        },

        // 1300~1399
        AUTH: {
            REJECT_GUEST:       1301
        },

        // 1400~1499
        CONNECTOR: {

        },

        // 1500~1599
        LOBBY: {
            NOT_PRODUCT:        1500
        },

        // 1600~1699
        ROOM: {
            NOT_EXIST:          1601,
            NOT_IN_ROOM:        1602,
            ALREADY_HAVE_ROOM:  1603,
            USER_IS_FORBIDDEN:  1604,
            IS_LOCKED:          1605,
            IS_FULL:            1606,
            NOT_ENOUGH_TOKENS:  1607                //钻石(房卡)不足
        }
    };

    var Error = root.ERROR = {
        INTERNAL_ERROR:                 "1000",
        INVALID_ARGUMENT:               "1001",
        MISSING_ARGUMENT:               "1002",
        ALREADY_EXISTS:                 "1003",
        NOT_EXISTS:                     "1004",
        INVALID_PASSWORD:               "1005",
        UNAUTHORIZED_REQUEST:           "1006",
        INVALID_TOKEN:                  "1007",
        ACCESS_DENIED:                  "1008",
        INVALID_REQUEST:                "1009",
        INVALID_AUTHORIZE_CODE:         "1010",
        REMOTE_SERVER_ERROR:            "1011",
        ALREADY_BIND:                   "1012",
        ALREADY_FREEZE:                 '1013',
        ALREADY_REMOVE:                 '1014',
        ARGUMENT_FORMAT_ERROR:          '1015',
        NULL_VALUE:                     '1016',
        ERROR_VALUE:                    '1017',
        OBJECT_HAVING_NULL_VALUE:       '1018',
        NOT_EQUAL_PASSWORD:             '1019',
        ERROR_PASSWORD:                 '1010'
    };

    var Message = root.MESSAGE = {
        "1000": [ 500, "InternalError" ],
        "1001": [ 400, "InvalidArgument" ],
        "1002": [ 400, "MissingArgument" ],
        "1003": [ 400, "AlreadyExists" ],
        "1004": [ 400, "NotExists" ],
        "1005": [ 400, "InvalidPassword" ],
        "1006": [ 401, "UnauthorizedRequest" ],
        "1007": [ 401, "InvalidToken" ],
        "1008": [ 400, "AccessDenied" ],
        "1009": [ 400, "InvalidRequest" ],
        "1010": [ 400, "InvalidAuthorizeCode" ],
        "1011": [ 500, "RemoteServerError" ],
        "1012": [ 400, "AlreadyBind" ],
        "1013": [ 400, "AlreadyFreeze" ],
        "1014": [ 400, "AlreadyRemove" ],
        "1015": [ 400, "ArgumentFormatError" ],
        "1016": [ 400, "NullValue" ],
        "1017": [ 400, "ErrorValue" ],
        "1018": [ 400, "ObjectHavingNullValue" ],
        "1019": [ 400, "NotEqualPassword" ],
        "1020": [ 400, "ErrorPassword" ]
    };

    var OrderType = root.ORDER_TYPE = {
        IOS:      1,
        ANDROID:  2,
        H5:       3,
        WEB:      4
    };

    var OrderStatus = root.ORDER_STATUS = {
        PROCESSING:    0,
        SUCCESS:       1,
        FAILURE:       2,
        EXPIRED:       3,
        PROCESSED:     4
    };
}(DejuPoker));
(function(root) {
    var Game = root.Game = function() {
          
    };

    Game.ORIGIN = {
        WeChat: 0,
        WebApp: 1,
        APP:    2
    };

    Game.GENDER = {
        MALE:       0,          //男
        FEMALE:     1,          //女
        OTHER:      2           //其他
    };

    //*牌型倍数
    Game.POKER_FORMATION_MULTIPLE = {
        STRAIGHT_FLUSH: {min:5, max:8},     //*同花顺
        THREES: {min:5, max:8},             //*三条
        STRAIGHT: {min:4, max:10},          //*顺子
        DOUBLE_GHOST: {min:10, max:20}      //*双鬼
    };

    //*定制模式设置(局数，点数倍率)
    Game.CUSTOMIZED_SETTINGS = {
        ROUND: {min:10, max:100, dValue:10},
        POINT_MULTIPLE: {min:1, max: 10},
        STRAIGHT_FLUSH: {min:10, max:20},   //*同花顺
        THREES: {min:10, max:20},           //*三条
        STRAIGHT: {min:10, max:20}          //*顺子
    };

    //牌型
    Game.POKER_MODELS = {
        THREES:         'threes',           //三条
        STRAIGHT:       'straight',         //顺子
        STRAIGHT_FLUSH: 'straight_flush',   //同花顺
        DOUBLE_GHOST:   'double_ghost',     //双鬼
        THREE_GHOST:    'three_ghost',      //三鬼
        GOD_NINE:       'god_nine',         //天公9
        GOD_EIGHT:      'god_eight',        //天公8
        POINT:          'point'             //点数
    };

    Game.POKER_MODEL_NAMES = {
        'threes':           "三条",
        'straight':         "顺子",
        'straight_flush':   "同花顺",
        'double_ghost':     "双鬼",
        'three_ghost':      "三鬼",
        'god_nine':         "天公9",
        'god_eight':        "天公8",
        'point':            "点数"
    };

    // 花色
    Game.FANCY = {
        FLUSH_TWO:      'flush2',           //2张同花
        FLUSH_THREE:    'flush3',           //3张同花
        PAIR:           'pair',             //对子
        NORMAL:         'normal'            //普通 纯点数
    };

    // 花色倍数
    Game.FANCY_MULTIPLE = {};
    Game.FANCY_MULTIPLE[Game.FANCY.FLUSH_THREE] = 3;
    Game.FANCY_MULTIPLE[Game.FANCY.FLUSH_TWO]   = 2;
    Game.FANCY_MULTIPLE[Game.FANCY.PAIR]        = 2;
    Game.FANCY_MULTIPLE[Game.FANCY.NORMAL]      = 1;

    //*房间类型(模式)
    Game.ROOM_TYPE = {
        STATIC:     0,          //长庄模式
        CLASSICAL:  1,          //经典模式
        CHAOS:      2,          //混战模式
        CUSTOMIZED: 3           //定制模式
    };

    //*下注类型
    Game.BET_TYPE = {
        ARBITRARILY:        0,  //任意下注
        MORE_THEN_MORE:     1   //一杠到底，要比之前的多
    };

    // 上庄条件
    Game.BANKER_CONDITION = {
        NORMAL:     0,          //顺子上庄：双鬼 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）
        GOD:        1           //天公上庄：双鬼 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）> 天公9 > 天公8
    };

    // 木虱赢双鬼的条件
    Game.BEAT_DBL_GHOST = {
        ALL_BEAT:           0,  // 木虱赢双鬼
        FLUSH_THREE_BEAT:   1   // 三条同花木虱赢双鬼
    };

    // 要牌操作
    Game.DRAW_COMMAND = {
        OPEN:       0,      //明牌
        PASS:       1,      //过牌
        DRAW:       2,      //补牌
        RUBBED:     3,      //搓牌
        BET_ALL:    4,      //全开
        BET_DRAW:   5       //开补
    };
    // 玩法说明界面
    Game.Explain = [
        {
            title:"一、游戏介绍",
            details:"木虱是广东潮汕地区盛行的一种纸牌竞技游戏，以其独特的比牌规则，玩法多样，节奏轻快，挑战玩家的胆识，深受广大玩家欢迎"
        },

        {
            title:"二、基本规则",
            details:
                "1.游戏人数：2-8人N" +
                "2.游戏牌数：一副扑克牌，包括大小王和广告牌，其中广告牌定义为功能牌，功能牌可选择是否加入，共54-55张牌"
        },

        {
            title:"三、玩法介绍",
            details:
            "1.游戏模式：经典模式，长庄模式，混战模式，定制模式N" +
            "经典模式：经典抢庄，可选择天公上庄或者顺子以上上庄N" +
            "长庄模式：房主霸王庄，不可换庄N" +
            "混战模式：俗称木虱鱼，无庄家，各玩家之间相互比牌N" +
            "定制模式：私人定制，牌型倍数自定义，玩法更刺激N" +
            "2.发牌：每位玩家首轮牌为两张牌N" +
            "3.补牌：玩家根据首轮牌情况，选择是否补牌，每位玩家有且仅有一次补牌机会N" +
            "4.比牌：玩家根据手中持有牌进行牌型大小比较"
        },

        //{title:"四、牌型说明", details:"img_paixing.png"},
        //
        {
            title:"五、牌型比较",
            details:
            "1.特殊牌型：双鬼>天公9>天公8>三条,同花顺>顺子，其中三条，同花顺可自定义倍数，倍数大者为大，同一牌型中的牌不比较大小顺子定义：A-K为闭环关系，任何顺序连在一起的牌都算为顺子，例如9、10、J为顺子，K、A、2亦为顺子，如果花色相同，即为同花顺N" +
            "2.普通牌型：点数牌>木虱（0点）N" +
            "点数说明：A-9分别为1-9点，10，J，Q，K均按10点算。三张或两张牌点数相加，个位数点数大者为大，若两张花色相同或者对子，则为2倍，三张牌花色相同为3倍N" +
            "3.特殊牌型>普通牌型N" +
            "4.木虱为最小点数牌型，但可以赢双鬼"
        },

        {
            title:"六、大小王（鬼牌）",
            details:
            "游戏可设置鬼牌不同功能N" +
            "1.鬼牌跟牌型，能拼出特殊牌型，如鬼牌、7、8为顺子或同花顺，鬼牌、7、7为三条，其他情况鬼牌算10点，如鬼牌、5、8为3点。鬼、8（9）算天公N" +
            "2.鬼牌可当任意一张牌及花色，即是拿到鬼牌若不能拼出特殊牌型，也最少是9点。首轮牌鬼、8（9）不能算天公，必须补牌N"
        },

        {
            title:"七、特殊可选规则",
            details:
            "1.鬼牌：默认为不翻鬼，即只有2张鬼牌(大小王)；翻鬼，可选择翻1或2张牌当鬼牌，即牌中最多有8张鬼牌。若翻出的鬼牌为大小王，系统会重新再翻一张牌当鬼牌N" +
            "2.鬼牌百变：鬼牌可当任意一张牌及花色，首轮牌鬼、8（9）不能算天公，必须补牌N" +
            "3.鬼牌成型：鬼牌不能拼成特殊牌型(三支、同花顺、顺子)时，仅能当10点，可变花色。首轮牌鬼、8（9）算天公，可不补牌，同时可选择首轮牌鬼、8（9）是否算双倍天公N" +
            "4.任意下注：每一局可任意选择下注倍数N" +
            "5.一杠到底：在同一个庄上，开弓没有回头箭，下注倍数只能加不能减。换庄后，可重新选择下注倍数N" +
            "6.功能牌：游戏中增加一张功能牌，游戏过程中拿到功能牌的玩家，赢牌时，按照手中牌型翻倍计算积分，同时，此牌具备鬼牌功能。N" +
            "7.木虱：设置木虱赢双鬼、三鬼的条件N"
        }
    ];

    Game.Chat = {
        normal:[
            "快点吧，我等到花儿都谢了",
            "又天公，赢定了",
            "玩太小，没意思",
            "风水不好，换个位置",
            "哇，你抢钱啊",
            "不好意思，又赢了",
            "来手好牌",
            "底裤都输光了",
            "这个庄也太弱了",
            "又断线，郁闷",
            "各位不好意思，离开一会",
            "大家一起下他庄"
        ],

        expression:[
            {code:"/001",img:"Expression_001.png"},
            {code:"/002",img:"Expression_002.png"},
            {code:"/003",img:"Expression_003.png"},
            {code:"/004",img:"Expression_004.png"},
            {code:"/005",img:"Expression_005.png"},
            {code:"/006",img:"Expression_006.png"},
            {code:"/007",img:"Expression_007.png"},
            {code:"/008",img:"Expression_008.png"},
            {code:"/009",img:"Expression_009.png"},
            {code:"/010",img:"Expression_010.png"},
            {code:"/011",img:"Expression_011.png"},
            {code:"/012",img:"Expression_012.png"},
            {code:"/013",img:"Expression_013.png"},
            {code:"/014",img:"Expression_014.png"},
            {code:"/015",img:"Expression_015.png"},
            {code:"/016",img:"Expression_016.png"},
            {code:"/017",img:"Expression_017.png"},
            {code:"/018",img:"Expression_018.png"},
            {code:"/019",img:"Expression_019.png"},
            {code:"/020",img:"Expression_020.png"},
        ]
    };

    Game.NOTICE_TEXT = "    所有玩家数据、运算均由服务器端下发，任何人都不可通过外挂破解客户端等手段前提获知其他玩家手牌或公共牌。";
    Game.PHONE_NUMBER = "18922217616";
    Game.WECHAT_NUMBER = "橄榄欢乐木虱";

    //3颗钻6元，15颗钻30元，30颗50元
    Game.DIAMOND_TYPE = {
        10001: {
            id: 10001,
            name: "3颗钻石",
            price: 6,
            diamonds: 3,
            SKU: "cn.glfun.dejupoker.product001"
        },
        10002: {
            id: 10002,
            name: "15颗钻石",
            price: 30,
            diamonds: 15,
            SKU: "cn.glfun.dejupoker.product002"
        },
        10003: {
            id: 10003,
            name: "30颗钻石",
            price: 50,
            diamonds: 30,
            SKU: "cn.glfun.dejupoker.product003"
        }
    };

}(DejuPoker));
(function(root) {
    var Utils = root.Utils = {};

    //根据权重从列表中抽取礼品并且返回下标
    Utils.calcWeight = function(list) {
        //list 需要抽取的礼品列表
        //格式 [ {xxx:xx, weight: 10}, {xxx:xx, weight: 20} ]  每个object里面至少要有一个weight
        if (typeof list != "object" || !(list instanceof Array)) {
            return null;
        }

        var i;
        var row;
        var result = 0;
        var totalWeight = 0;

        for (i = 0; i < list.length; i++) {
            row = list[i];
            if (row.weight > 0) {
                totalWeight += row.weight;
            }
        }

        if (totalWeight <= 0) {
            return null;
        }

        var rand = Math.floor(Math.random() *  totalWeight);
        for (i = 0; i < list.length; i++) {
            row = list[i];
            if (rand < row.weight) {
                result = i;
                break;
            }

            rand -= row.weight;
        }

        return result;
    };

    //返回 min~max之间的一个数 不包含max 如果需要包含最大值 可在调用的时候max为你需要的最大值+1
    Utils.range_value = function(min, max) {
        return Math.floor(Math.random()*(max-min) + min);
    };

    //返回 0~max之间的一个数 不包含max
    Utils.random_number = function(max) {
        return Utils.range_value(0, max);
    };

    // 将数字的小数点转换成A (replaceSymbol：被替换的字符，transformSymbol：替换后的字符)
    Utils.transform_font_type = function(number, replaceSymbol, transformSymbol) {
        var str = String(number);
        var transformStr = transformSymbol || "A";
        var replaceStr = replaceSymbol || ".";

        return str.replace(replaceStr,transformStr);
    };

    // 分割数字，每3位加个逗号
    Utils.format_by_comma = function(number) {
        var str = String(number);
        var newStr = "";
        
        var format = function(params) {
            var resultStr = "";
            var count = 0;
            for (var index = params.length-1 ; index >= 0 ; index--) {
                if (count % 3 == 0 && count != 0) {
                    resultStr = params.charAt(index) + "," + resultStr;
                }
                else {
                    resultStr = params.charAt(index) + resultStr;
                }
                count++;
            }
            return resultStr;
        };


        if (str.indexOf(".") == -1) {
            newStr = format(str);
        }
        else {
            // 小数点后的数字
            var commaRight = str.slice(str.indexOf("."));

            // 小数点前的数字
            var commaLeft = str.slice(0,str.indexOf("."));

            newStr = format(commaLeft);
            newStr += commaRight;
        }
        
        return newStr;
    };

    //随机生成一个N位数字
    Utils.gen_room_id = function(n) {
        var id = "";
        for (var i = 0; i < n; i++) {
            id += Utils.random_number(10);
        }
        
        return id;
    };

    Utils.object_clone = function(obj) {
        if (obj == null || typeof obj != "object") {
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    };
}(DejuPoker));
(function(root) {
    /*
     I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
     so it's better encapsulated. Now you can have multiple random number generators
     and they won't stomp all over eachother's state.

     If you want to use this as a substitute for Math.random(), use the random()
     method like so:

     var m = new MersenneTwister();
     var randomNumber = m.random();

     You can also call the other genrand_{foo}() methods on the instance.

     If you want to use a specific seed in order to get a repeatable random
     sequence, pass an integer into the constructor:

     var m = new MersenneTwister(123);

     and that will always produce the same random sequence.

     Sean McCullough (banksean@gmail.com)
     */
    /*
     A C-program for MT19937, with initialization improved 2002/1/26.
     Coded by Takuji Nishimura and Makoto Matsumoto.

     Before using, initialize the state by using init_genrand(seed)
     or init_by_array(init_key, key_length).

     Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
     All rights reserved.

     Redistribution and use in source and binary forms, with or without
     modification, are permitted provided that the following conditions
     are met:

     1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
     products derived from this software without specific prior written
     permission.

     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
     "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
     LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
     A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
     CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
     PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
     PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
     LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


     Any feedback is very welcome.
     http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
     email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
     */
    var MersenneTwister = root.MersenneTwister = function(seed) {
        if (seed == undefined) {
            seed = new Date().getTime();
        }
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df; /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

        this.init_genrand(seed);
    };

    /* initializes mt[N] with a seed */
    MersenneTwister.prototype.init_genrand = function(s) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    };

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
        var i, j, k;
        this.init_genrand(19650218);
        i = 1;
        j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
            if (j >= key_length) j = 0;
        }
        for (k = this.N - 1; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    };

    /* generates a random number on [0,0xffffffff]-interval */
    MersenneTwister.prototype.genrand_int32 = function() {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */

            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    };

    /* generates a random number on [0,0x7fffffff]-interval */
    MersenneTwister.prototype.genrand_int31 = function() {
        return (this.genrand_int32() >>> 1);
    };

    /* generates a random number on [0,1]-real-interval */
    MersenneTwister.prototype.genrand_real1 = function() {
        return this.genrand_int32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    };

    /* generates a random number on [0,1)-real-interval */
    MersenneTwister.prototype.random = function() {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };

    /* generates a random number on (0,1)-real-interval */
    MersenneTwister.prototype.genrand_real3 = function() {
        return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };

    /* generates a random number on [0,1) with 53-bit resolution*/
    MersenneTwister.prototype.genrand_res53 = function() {
        var a = this.genrand_int32() >>> 5,
            b = this.genrand_int32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    };

    MersenneTwister.prototype.range_value = function(min, max) {
        return Math.floor(this.random()*(max-min) + min);
    };

    //range_value 是不包含max的, range_between 是包含max的
    MersenneTwister.prototype.range_between = function(min, max) {
        return this.range_value(min, max + 1);
    };

    MersenneTwister.prototype.random_number = function(max) {
        return this.range_value(0, max);
    };
    /* These real versions are due to Isaku Wada, 2002/01/09 added */

    // Export an instance
    root.m = new MersenneTwister();
})(DejuPoker);

(function(root) {
    var _super = root.Serialize;
    var Player = root.Player = function(opts) {
        opts = opts || {};
        
        this.id             = opts.id || 0;
        this.name           = opts.name || "";
        this.avatar         = opts.avatar || "";
        this.tokens         = opts.tokens || 0;
        this.gender         = opts.gender || 0;
        this.data           = {};

        // this.playTimes      = opts.playTimes || 0;          //参与牌局数
        // this.winTimes       = opts.winTimes || 0;           //胜利次数
        // this.fightTimes     = opts.fightTimes || 0;         //比牌次数 用于计算胜率
        // this.godTimes       = opts.godTimes || 0;           //天公次数
        // this.ghostTimes     = opts.ghostTimes || 0;
        // this.logs           = opts.logs || [];

        this.init(opts.data);
    };

    root.inherits(Player, _super);

    root.extend(Player.prototype, {
        init: function(opts) {
            opts = opts || {};

            this.data.playTimes      = opts.playTimes || 0;          //参与牌局数
            this.data.winTimes       = opts.winTimes || 0;           //胜利次数
            this.data.fightTimes     = opts.fightTimes || 0;         //比牌次数 用于计算胜率
            this.data.godTimes       = opts.godTimes || 0;           //天公次数
            this.data.ghostTimes     = opts.ghostTimes || 0;
            this.data.logs           = opts.logs || [];
        },

        getId: function() {
            return this.id;
        },

        addLog: function(id) {
            this.data.logs.unshift(id);
            if (this.data.logs.length > 100) {
                this.data.logs.pop();
            }
        },
        
        addPlayTimes: function(times) {
            times = times || 0;
            this.data.playTimes += times;
        },

        addWinTimes: function(times) {
            times = times || 0;
            this.data.winTimes += times;
        },

        addFightTimes: function(times) {
            times = times || 0;
            this.data.fightTimes += times;
        },

        addGodTimes: function(times) {
            times = times || 0;
            this.data.godTimes += times;
        },

        addGhostTimes: function(times) {
            times = times || 0;
            this.data.ghostTimes += times;
        },
        
        update: function(opts) {
            var obj = this;
            opts = opts || {};

            for (var key in opts) {
                if (opts.hasOwnProperty(key)
                    && obj.hasOwnProperty(key)) {
                    obj[key] = opts[key];
                }
            }
        }
    });
} (DejuPoker));

(function(root) {
    var _super = root.Serialize;
    var Poker = root.Poker = function(opts) {
        opts = opts || {};

        this.value      = opts.value || 0;
        this.type       = opts.type  || 0;
        this.showTarget = opts.showTarget || 0;
    };

    root.inherits(Poker, _super);

    root.extend(Poker.prototype, {
        isJoker: function() {
            return this.type === Poker.TYPE.JOKER;
        },
        
        setShow: function(type) {
            this.showTarget = type;
        }
    });

    Poker.TYPE         = {};
    Poker.TYPE.DIAMOND = 1;
    Poker.TYPE.CLUB    = 2;
    Poker.TYPE.HEART   = 3;
    Poker.TYPE.SPADE   = 4;
    Poker.TYPE.JOKER   = 5;

    Poker.VALUES       = {};
    Poker.VALUES[Poker.TYPE.JOKER]   = [ 14, 15, 16 ];              // 14 小王 15 大王 16 翻倍
    Poker.VALUES[Poker.TYPE.DIAMOND] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    Poker.VALUES[Poker.TYPE.CLUB]    = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    Poker.VALUES[Poker.TYPE.HEART]   = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    Poker.VALUES[Poker.TYPE.SPADE]   = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    
    Poker.DOUBLE_POKER_VALUE    = 16;               // 翻倍牌的值
    Poker.POKER_A_VALUE         = 1;                // 牌面A的值
    Poker.POKER_2_VALUE         = 2;                // 牌面2的值
    Poker.POKER_Q_VALUE         = 12;               // 牌面Q的值
    Poker.POKER_K_VALUE         = 13;               // 牌面K的值

    Poker.SHOW_TARGET = {
        NONE    : 0,
        ME      : 1,
        ALL     : 2
    }
} (DejuPoker));

(function(root) {
    var _super = root.Serialize;
    var Poker = root.Poker;
    
    var Deck = root.Deck = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.pokers         = opts.pokers;

        this.init();
    };

    root.inherits(Deck, _super);

    root.extend(Deck.prototype, {
        init: function(opts) {

        }
    });

} (DejuPoker));

(function(root) {
    var _super = root.Serialize;

    var Poker = root.Poker;
    var Game = root.Game;

    var Utils = root.Utils;

    var Gamble = root.StaticGamble = function(opts) {
        opts = opts || {};

        _super.call(this, opts);
        this.data = opts;
        this.data.ghost = [];           // ghost 是正式翻出的鬼牌 撇除了joker的 里面只有value 便于判断

        this.init(opts);
    };

    root.inherits(Gamble, _super);

    root.extend(Gamble.prototype, {
        init: function(opts) {
            var i;

            for (i in opts.ghostPokers) {
                var poker = opts.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    this.data.ghost.push(poker.value);
                }
            }
        },

        pokerScore: function(handPokers) {
            var pokers = Utils.object_clone(handPokers);
            var results = {
                score: 0,
                multiple: 1,
                fancy: Game.FANCY.NORMAL,
                type: Game.POKER_MODELS.POINT
            };

            // 按照牌面大小排序 倒序
            var compare = function(a, b) {
                if (a.value < b.value) {
                    return 1;
                }
                else if (a.value == b.value) {
                    return 0;
                }
                else {
                    return -1;
                }
            };

            pokers.sort(compare);

            // (三鬼 > 双鬼 > 天公9 > 天公8) > (三条\同花顺\顺子 内部大小由设置的倍数决定 倍数大者胜) > (点数按大小)
            // 第一类型  10000  第二类型  1000  第三类型  100
            var i;
            var analyse = [];           // 用于分析的扑克信息
            var ghostCnt = 0;
            var double_poker = 1;

            for (i in pokers) {
                var poker = pokers[i];
                if (poker.type === Poker.TYPE.JOKER || this.data.ghost.indexOf(poker.value) != -1) {
                    ghostCnt++;
                    // 鬼牌从后面插入
                    analyse.push({
                        type: "ghost",
                        value: poker.value,
                        realValue: 10
                    });
                    if (poker.value === Poker.DOUBLE_POKER_VALUE) {
                        double_poker = 2;
                    }
                    continue;
                }
                var realValue = poker.value;
                if (realValue > 10) {
                    realValue = 10;
                }

                // 普通牌在前面插入
                analyse.unshift({
                    type: poker.type,
                    value: poker.value,
                    realValue: realValue
                });
            }
            // 记录双倍牌给上一层知道
            results.double_poker = double_poker;

            var point = 0;

            // 两张牌情况
            if (analyse.length === 2) {
                // 花式情况
                if (pokers[0].type === pokers[1].type) {
                    results.fancy = Game.FANCY.FLUSH_TWO;
                }
                else if (pokers[0].value === pokers[1].value) {
                    results.fancy = Game.FANCY.PAIR;
                }

                // 点数
                point = analyse[0].realValue + analyse[1].realValue || 0;
                results.point = point;
                
                // 双鬼
                if (ghostCnt === 2) {
                    results.score = 11000;
                    results.type = Game.POKER_MODELS.DOUBLE_GHOST;
                    results.multiple = this.data.settings.pokerModels[results.type];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
                // 有一只鬼
                if (ghostCnt > 0) {
                    // 鬼牌万能只能有三张牌 所以这里的情况都是鬼牌成型的处理
                    if (analyse[0].value === 9) {
                        results.score = 10100;
                        results.type = Game.POKER_MODELS.GOD_NINE;
                        results.multiple = this.data.settings.pokerModels[results.type];
                        // 花式天公
                        if (this.data.settings.fancyGod) {
                            // 变成同花花式
                            results.fancy = Game.FANCY.FLUSH_TWO;
                            results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                        }
                        // 翻倍牌
                        results.multiple *= double_poker;
                        return results;
                    }
                    else if (analyse[0].value === 8) {
                        results.score = 10010;
                        results.type = Game.POKER_MODELS.GOD_EIGHT;
                        results.multiple = this.data.settings.pokerModels[results.type];
                        // 花式天公
                        if (this.data.settings.fancyGod) {
                            // 变成同花花式
                            results.fancy = Game.FANCY.FLUSH_TWO;
                            results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                        }
                        // 翻倍牌
                        results.multiple *= double_poker;
                        return results;
                    }
                }
                // 点数形成的天公9
                if ((analyse[0].realValue + analyse[1].realValue) % 10 === 9) {
                    results.score = 10100;
                    results.type = Game.POKER_MODELS.GOD_NINE;
                    results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                    return results;
                }
                // 点数形成的天公8
                if ((analyse[0].realValue + analyse[1].realValue) % 10 === 8) {
                    results.score = 10010;
                    results.type = Game.POKER_MODELS.GOD_EIGHT;
                    results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                    return results;
                }
                // 剩下的只能是普通点数牌了
                results.score = (analyse[0].realValue + analyse[1].realValue) % 10 + 100;
                results.type = Game.POKER_MODELS.POINT;
                results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                // 翻倍牌
                results.multiple *= double_poker;
                return results;
            }

            // 接下来是三张牌情况

            // 点数
            point = analyse[0].realValue + analyse[1].realValue + analyse[2].realValue || 0;
            results.point = point;

            // 顺子判断
            var flushDecide = function (v1, v2, v3) {
                if (v1 == null || v2 == null) {
                    return false;
                }
                
                // 只需要判断两张 那么就是有一张鬼牌的情况
                if (v3 == null) {
                    // 连着或者隔一个
                    if (v1 === v2 - 1 || v1 === v2 - 2) {
                        return true;
                    }
                    // A + K
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                    // A + Q
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_Q_VALUE) {
                        return true;
                    }
                    // 2 + K
                    if (v1 === Poker.POKER_2_VALUE && v2 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                }
                else {
                    // 正常的 1 2 3
                    if (v1 === v2 - 1 && v2 === v3 - 1) {
                        return true;
                    }
                    // Q K A
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_Q_VALUE && v3 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                    // K A 2
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_2_VALUE && v3 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                }

                return false;
            };
            
            // 花式情况
            if (pokers[0].type === pokers[1].type && pokers[0].type === pokers[2].type) {
                results.fancy = Game.FANCY.FLUSH_THREE;
            }

            // 没有鬼牌
            if (ghostCnt === 0) {
                // 三条
                if (analyse[0].value === analyse[1].value && analyse[1].value === analyse[2].value) {
                    results.type = Game.POKER_MODELS.THREES;
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.THREES];
                    results.multiple = this.data.settings.pokerModels[results.type];
                    return results;
                }
                // 顺子
                if (flushDecide(analyse[0].value, analyse[1].value, analyse[2].value)) {
                    // 同花顺
                    if (analyse[0].type === analyse[1].type && analyse[1].type === analyse[2].type) {
                        results.type = Game.POKER_MODELS.STRAIGHT_FLUSH;
                        results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT_FLUSH];
                        results.multiple = this.data.settings.pokerModels[results.type];
                        return results;
                    }
                    // 普通顺子
                    results.type = Game.POKER_MODELS.STRAIGHT;
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT];
                    results.multiple = this.data.settings.pokerModels[results.type];
                    return results;
                }
            }

            // 在排序的时候 因为鬼牌会排在后面 所以一张鬼牌的时候只判断前面两张即可
            if (ghostCnt === 1) {
                // 三条
                if (analyse[0].value === analyse[1].value) {
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.THREES];
                    results.type = Game.POKER_MODELS.THREES;
                    results.multiple = this.data.settings.pokerModels[results.type];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
                // 顺子
                if (flushDecide(analyse[0].value, analyse[1].value, null)) {
                    // 同花顺
                    if (analyse[0].type === analyse[1].type) {
                        results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT_FLUSH];
                        results.type = Game.POKER_MODELS.STRAIGHT_FLUSH;
                        results.multiple = this.data.settings.pokerModels[results.type];
                        // 翻倍牌
                        results.multiple *= double_poker;
                        return results;
                    }
                    results.type = Game.POKER_MODELS.STRAIGHT;
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT];
                    results.multiple = this.data.settings.pokerModels[results.type];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
                // 三张同花的概念
                if (analyse[0].type === analyse[1].type) {
                    results.fancy = Game.FANCY.FLUSH_THREE;
                }

                // 不成型的牌 如果鬼牌万能 直接等于9点
                if (this.data.settings.universalGhost == true) {
                    results.type = Game.POKER_MODELS.POINT;
                    results.score = 9 + 100;
                    results.point = 9;
                    results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
            }

            // 两只鬼的情况 变成三条
            if (ghostCnt == 2) {
                results.type = Game.POKER_MODELS.THREES;
                results.score = 1000 + this.data.settings.pokerModels[results.type];
                results.multiple = this.data.settings.pokerModels[results.type];
                // 翻倍牌
                results.multiple *= double_poker;
                return results;
            }

            // 三鬼
            if (ghostCnt == 3) {
                results.type = Game.POKER_MODELS.THREE_GHOST;
                results.score = 12000;
                results.multiple = this.data.settings.pokerModels[results.type];
                // 翻倍牌
                results.multiple *= double_poker;
                return results;
            }

            // 剩下的就是点数牌了
            results.type = Game.POKER_MODELS.POINT;
            results.score = (analyse[0].realValue + analyse[1].realValue + analyse[2].realValue) % 10 + 100;
            results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
            // 翻倍牌
            results.multiple *= double_poker;
            
            return results;
        }
    });
} (DejuPoker));
// 定制模式比牌
(function(root) {
    var _super = root.Serialize;

    var Poker = root.Poker;
    var Game = root.Game;

    var Utils = root.Utils;

    var Gamble = root.CustomizedGamble = function(opts) {
        opts = opts || {};

        _super.call(this, opts);
        this.data = opts;
        this.data.ghost = [];           // ghost 是正式翻出的鬼牌 撇除了joker的 里面只有value 便于判断

        this.init(opts);
    };

    root.inherits(Gamble, _super);

    root.extend(Gamble.prototype, {
        init: function(opts) {
            var i;

            for (i in opts.ghostPokers) {
                var poker = opts.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    this.data.ghost.push(poker.value);
                }
            }
        },

        pokerScore: function(handPokers) {
            var pokers = Utils.object_clone(handPokers);
            var results = {
                score: 0,
                multiple: 1,
                fancy: Game.FANCY.NORMAL,
                type: Game.POKER_MODELS.POINT
            };

            // 按照牌面大小排序
            var compare = function(a, b) {
                if (a.value > b.value) {
                    return 1;
                }
                else if (a.value == b.value) {
                    return 0;
                }
                else {
                    return -1;
                }
            };

            pokers.sort(compare);

            // 没有鬼牌 都是三张
            // 除了 顺子 同花顺 三条 可以设置倍数之外 每个点数也需要设置倍数
            // 使用倍数比较 倍数大的胜利
            var i;
            var analyse = [];           // 用于分析的扑克信息

            for (i in pokers) {
                var poker = pokers[i];
                var realValue = poker.value;
                if (realValue > 10) {
                    realValue = 10;
                }

                analyse.push({
                    type: poker.type,
                    value: poker.value,
                    realValue: realValue
                });
            }

            // 两张牌就是出错 给最低的他
            if (analyse.length === 2) {
                return results;
            }

            // 接下来是三张牌情况
            
            // 花式情况
            if (pokers[0].type === pokers[1].type && pokers[0].type === pokers[2].type) {
                results.fancy = Game.FANCY.FLUSH_THREE;
            }
            
            // 点数
            var point = analyse[0].realValue + analyse[1].realValue + analyse[2].realValue || 0;
            results.point = point;

            // 三条
            if (analyse[0].value === analyse[1].value && analyse[1].value === analyse[2].value) {
                results.type = Game.POKER_MODELS.THREES;
                results.multiple = this.data.settings.pokerModels[results.type];
                results.score = results.multiple;
                return results;
            }

            // 顺子判断
            var flushDecide = function (v1, v2, v3) {
                if (v1 == null || v2 == null) {
                    return false;
                }
                
                // 正常的 1 2 3
                if (v1 === v2 - 1 && v2 === v3 - 1) {
                    return true;
                }
                // Q K A
                if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_Q_VALUE && v3 === Poker.POKER_K_VALUE) {
                    return true;
                }
                // K A 2
                if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_2_VALUE && v3 === Poker.POKER_K_VALUE) {
                    return true;
                }

                return false;
            };
            
            // 顺子
            if (flushDecide(analyse[0].value, analyse[1].value, analyse[2].value)) {
                // 同花顺
                if (analyse[0].type === analyse[1].type && analyse[1].type === analyse[2].type) {
                    results.type = Game.POKER_MODELS.STRAIGHT_FLUSH;
                    results.multiple = this.data.settings.pokerModels[results.type];
                    results.score = results.multiple;
                    return results;
                }
                // 普通顺子
                results.type = Game.POKER_MODELS.STRAIGHT;
                results.multiple = this.data.settings.pokerModels[results.type];
                results.score = results.multiple;
                return results;
            }

            // 剩下的就是点数牌了
            results.type = Game.POKER_MODELS.POINT;
            var realPoint = point%10;
            if (realPoint == 0) {
                results.multiple = 0;
            }
            else {
                results.multiple = this.data.settings.pokerPoint[point % 10] || 1;
            }
            results.score = results.multiple;
            return results;
        }
    });
} (DejuPoker));
/**
 * Created by publish on 2017/3/24.
 */
//一副牌
(function(root) {
    var _super = root.Serialize;
    var PokerSet = root.PokerSet = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        /**
         * poker结构
         * ..number 0~13 0为Joker 1为Ace 11为J 12为Q 13为K
         * ..flower 0~3 0为方块 1为梅花 2为红桃 3为黑桃   当joker时 0为小鬼 1为大鬼 2为翻倍
         * ..name 名字 主要用于客户端寻找资源
         * ..showTarget 显示对象 对谁显示
         */

        this.pokers         = opts.pokers || [];
        this.needJoker      = opts.needJoker;
        this.init();
    };
    
    root.inherits(PokerSet, _super);

    root.extend(PokerSet.prototype, {
        init: function() {
            //创建的时候已经传入牌了 就不用初始化
            if (this.pokers.length > 0) {
                return;
            }

            if (this.needJoker) {
                this.pokers.push({
                    number: 0, 
                    flower: 2, 
                    showTarget: 0, 
                    name: PokerSet.NUMBERS_NAME[0] + "_" + PokerSet.JOKER_NAME[2]
                });       //翻倍牌
                this.pokers.push({
                    number: 0,
                    flower: 1,
                    showTarget: 0,
                    name: PokerSet.NUMBERS_NAME[0] + "_" + PokerSet.JOKER_NAME[1]
                });       //大鬼
                this.pokers.push({
                    number: 0,
                    flower: 0,
                    showTarget: 0,
                    name: PokerSet.NUMBERS_NAME[0] + "_" + PokerSet.JOKER_NAME[0]
                });       //小鬼
            }

            for (var number = 1; number <= 13; number++) {
                for (var flower = 0; flower <= 3; flower++) {
                    this.pokers.push({
                        number: number,
                        flower: flower,
                        showTarget: 0,
                        name: PokerSet.FLOWERS_NAME[flower] + "_" + PokerSet.NUMBERS_NAME[number]
                    });
                }
            }
        },

        //发牌
        extract: function() {
            if (this.pokers.length <= 0) {
                return null;
            }

            var i = root.Utils.random_number(this.pokers.length);
            var result = this.pokers[i];
            this.pokers.splice(i, 1);
            return result;
        },

        update: function(opts) {
            var obj = this;
            opts = opts || {};

            for (var key in opts) {
                if (opts.hasOwnProperty(key)
                    && obj.hasOwnProperty(key)) {
                    obj[key] = opts[key];
                }
            }
        }
    });

    //花色 0 方块 1 梅花 2 红桃 3 黑桃
    PokerSet.FLOWERS_NAME = ["diamond", "club", "heart", "spade"];
    PokerSet.NUMBERS_NAME = ["joker", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
    PokerSet.JOKER_NAME = ["small", "big", "double"];

    PokerSet.SHOW_TARGET = {
        NONE    : 0,
        ME      : 1,
        ALL     : 2
    };
} (DejuPoker));
/**
 * Created by monkey on 2017/3/25.
 */

(function(root){
    var _super = root.Entity;

    var Poker = root.Poker;
    var Game = root.Game;
    var StaticGamble = root.StaticGamble;
    var CustomizedGamble = root.CustomizedGamble;
    var FancyPayTypes = [Game.POKER_MODELS.GOD_NINE, Game.POKER_MODELS.GOD_EIGHT, Game.POKER_MODELS.POINT];

    var Utils = root.Utils;

    var Client = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.userID        = opts.userID || 0;          // id
        this.chairID       = opts.chairID || 0;         // 座位ID
        this.name          = opts.name || "";           // 玩家名字
        this.avatar        = opts.avatar || 0;          // 玩家头像
        this.ready         = opts.ready || false;       // 是否准备好
        this.started       = opts.started || false;     // 是否开始过游戏
        this.bid           = opts.bid || false;         // 是否下注
        this.bidRate       = opts.bidRate || 0;         // 下注倍数
        this.end           = opts.end || false;         // 是否结束
        this.compared      = opts.compared || false;    // 是否比过牌
        this.notBank       = opts.notBank || false;     // 不坐庄 true就不做
        this.isRubbing     = opts.isRubbing || false;   // 是否在搓牌
        this.showResult    = opts.showResult || false;  // 是否需要展示牌局结果 这个在reset的时候不能重置
        this.isAfk         = opts.isAfk || false;       // 是否离线

        this.handPokers    = [];                        // 手牌
        if (opts.handPokers) {
            for (var i = 0, size = opts.handPokers.length; i < size; i++) {
                this.handPokers.push(
                    new Poker(opts.handPokers[i])
                );
            }
        }
    };

    var Table = root.Table = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.deck           = null;                     // 整副牌
        this.ghostPokers    = null;                     // 桌面鬼牌
        this.dealSequence   = opts.dealSequence || [];  // 发牌列表
        this.drawList       = opts.drawList || [];      // 要牌列表
        this.banker         = opts.banker || 0;         // 庄家
        this.scoreBak       = opts.scoreBak || 0;       // 用于暂存下个庄家的分数以便分辨大小
        this.typeBak        = opts.typeBak || null;     // 用于暂存下个庄家的牌型评分
        this.bankerBak      = opts.bankerBak || this.banker;    // 经典模式下个庄家
        this.bankerDraw     = opts.bankerDraw || 0;     // 庄家操作情况
        this.settings       = opts.settings || {};
        this.type           = opts.type;                // 牌局类型

        this.indicator      = opts.indicator || 0;      // 指示器
        this.clients        = {};                       // 客人列表
        this.golds          = opts.golds || {};         // 参与过的用户在房间中的金币情况
        this.lastBidRates   = opts.lastBidRates || {};  // 参与过的用户 上次投注倍数的列表
        this.whosRubbing    = opts.whosRubbing || 0;

        this.roundLog       = opts.roundLog || {clients: {}};

        this.init(opts);
    };

    root.inherits(Table, _super);

    root.extend(Table.prototype, {
        init: function(opts) {
            var i;
            var size;

            this.deck = [];
            //如果新桌子 就等start的时候才拿牌出来
            //旧桌子 有牌就把牌拿出来
            if (opts.deck) {
                for (i = 0, size = opts.deck.length; i < size; i++) {
                    this.deck.push(
                        new Poker(opts.deck[i])
                    );
                }
            }

            this.ghostPokers = [];
            if (opts.ghostPokers) {
                for (i = 0, size = opts.ghostPokers.length; i < size; i++) {
                    this.ghostPokers.push(
                        new Poker(opts.ghostPokers[i])
                    );
                }
            }

            if (opts.clients) {
                var keys = Object.keys(opts.clients);
                for (i = 0, size = keys.length; i < size; i++) {
                    var userID = keys[i];
                    this.clients[userID] = new Client(opts.clients[userID]);
                }
            }
        },

        enter: function(userID, chairID) {
            var client = this.clients[userID];
            if (client != null) {
                return;
            }

            this.clients[userID] = new Client({userID: userID, chairID: chairID});
        },

        leave: function(userID) {
            delete this.clients[userID];
        },
        
        changeChair: function(userID, chairID) {
            var client = this.clients[userID];
            if (client == null) {
                return false;
            }
            
            client.chairID = chairID;
            return true;
        },

        genDealSequence: function() {
            var chairs = new Array(8);
            var sequence = [];

            for (var userID in this.clients) {
                chairs[this.clients[userID].chairID] = this.clients[userID].userID;
            }

            var bankerIndex = -1;
            if (this.type != Game.ROOM_TYPE.CHAOS) {
                bankerIndex = chairs.indexOf(this.banker);
            }

            var index;
            for (index = bankerIndex + 1; index < chairs.length; index++) {
                if (chairs[index] == null) {
                    continue;
                }

                sequence.push(chairs[index]);
            }

            if (bankerIndex >= 0) {
                for (index = 0; index <= bankerIndex; index++) {
                    if (chairs[index] == null) {
                        continue;
                    }

                    sequence.push(chairs[index]);
                }
            }

            this.dealSequence = sequence;
        },

        decreaseGold: function(userID, amount) {
            if (this.golds[userID] == null) {
                this.golds[userID] = 0;
            }

            this.golds[userID] -= Math.abs(amount);

            if (this.roundLog.clients[userID] != null) {
                this.roundLog.clients[userID].gold -= Math.abs(amount);
            }
        },

        increaseGold: function(userID, amount) {
            if (this.golds[userID] == null) {
                this.golds[userID] = 0;
            }

            this.golds[userID] += Math.abs(amount);

            if (this.roundLog.clients[userID] != null) {
                this.roundLog.clients[userID].gold += Math.abs(amount);
            }
        },

        ready: function(userID, data) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            client.ready = data ? true : false;
            if (client.showResult == true) {
                client.showResult = false;
            }
            return {userID: userID, ready: client.ready};
        },

        isClientReady: function(userID) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            return client.ready;
        },

        getClient: function(userID) {
            return this.clients[userID];
        },

        setAwk: function(userID, state) {
            var client = this.getClient(userID);
            if (client) {
                client.isAfk = state;
            }
        },

        //是否全部客人都做了某操作
        getClientState: function(state) {
            var i;
            var size;
            var keys;

            keys = Object.keys(this.clients);
            size = keys.length;
            // 一个人就不能成型
            if (size <= 1) {
                return false;
            }

            for (i = 0; i < size; i++) {
                var userID = keys[i];
                var client = this.getClient(userID);

                if (client[state] != true) {
                    return false;
                }
            }

            return true;
        },

        getClientReady: function() {
            return this.getClientState("ready");
        },

        getClientStarted: function() {
            return this.getClientState("started");
        },

        getClientBid: function() {
            return this.getClientState("bid");
        },

        getClientFight: function() {
            return this.getClientState("compared");
        },

        getClientEnd: function() {
            return this.getClientState("end");
        },

        getClientDraw: function() {
            return this.drawList.length <= 0;
        },

        //开局
        start: function(roomType) {
            //先拿出一副新牌
            this.deck = [];
            for (var typeKey in Poker.TYPE) {
                var type = Poker.TYPE[typeKey];

                //定制模式没有王牌
                if (roomType === Game.ROOM_TYPE.CUSTOMIZED && type === Poker.TYPE.JOKER) {
                    continue;
                }

                for (var valId = 0; valId < Poker.VALUES[type].length; valId++) {
                    var value = Poker.VALUES[type][valId];
                    // 有没有翻倍牌呢
                    if (value === Poker.DOUBLE_POKER_VALUE && this.settings.isDouble != true) {
                        continue;
                    }

                    this.deck.push(new Poker({value: value, type: type}));
                }
            }
        },

        //洗牌
        shuffle: function() {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        //根据规则发牌
        deal: function() {
            var i;
            var j;
            var client;
            
            // 清理手牌
            for (i in this.clients) {
                client = this.getClient(i);
                client.handPokers = [];
            }
            
            // 发两张牌
            for (i = 0; i < 2; i++) {
                //按顺序发牌
                for (j = 0; j < this.dealSequence.length; j++) {
                    var userID = this.dealSequence[j];
                    client = this.getClient(userID);
                    if (client && this.deck.length > 0) {
                        client.handPokers.push(this.deck.shift());
                    }
                }
            }
        },

        // 翻鬼牌
        ghost: function() {
            var amount = this.settings.ghostCount;
            this.ghostPokers = [];

            var i = 0;
            while (i < amount) {
                var poker = this.deck.shift();
                this.ghostPokers.push(poker);
                if (poker.type != Poker.TYPE.JOKER) {
                    i++;
                }
            }
        },

        bid: function(userID, rate) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            if (typeof rate != "number") {
                rate = 1;
            }

            // 一杠到底
            if (this.settings.betType === Game.BET_TYPE.MORE_THEN_MORE) {
                var lastBidRate = this.lastBidRates[userID] || 1;
                // 当前倍数 不小于 上一次倍数
                if (rate < lastBidRate) {
                    return null;
                }
            }

            client.bid = true;
            client.bidRate = rate;
            this.lastBidRates[userID] = rate;
            for (var i in client.handPokers) {
                // 定制模式直接开牌
                if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                    client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
                }
                else {
                    client.handPokers[i].setShow(Poker.SHOW_TARGET.ME);
                }
            }
            return {userID: userID, bidRate: rate};
        },

        clearDraw: function() {
            this.drawList = [];
        },

        insertDraw: function(userID) {
            if (!(this.drawList instanceof Array)) {
                this.drawList = [];
            }

            this.drawList.push(userID);
        },

        show: function() {

        },

        rob: function(userID, data) {
            if (this.banker != 0) {
                return null;
            }

            this.banker = userID;
            return {userID: userID};
        },

        draw: function(userID, type) {
            //排队来
            if (userID != this.drawList[0]) {
                return null;
            }

            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            var i;
            var poker;
            var results = {
                userID: userID
            };

            var ghostArray = [];
            for (i in this.ghostPokers) {
                poker = this.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    ghostArray.push(poker.value);
                }
            }

            // 双鬼判断
            var ghostCnt = 0;
            // 天公判断 累计点数
            var totalValue = 0;
            for (i in client.handPokers) {
                poker = client.handPokers[i];
                if (poker) {
                    if (poker.type === Poker.TYPE.JOKER || ghostArray.indexOf(poker.value) != -1) {
                        ghostCnt++;
                        totalValue += 10;
                    }
                    else {
                        if (poker.value > 10) {
                            totalValue += 10;
                        }
                        else {
                            totalValue += poker.value;
                        }
                    }
                }
            }

            totalValue = totalValue % 10;

            var cantOpen = false;
            var cantPass = false;
            var cantDraw = false;
            var cantRubbed = false;

            switch (this.type) {
                // 长庄
                case Game.ROOM_TYPE.STATIC: {
                    // 一只鬼的时候
                    if (ghostCnt === 1) {
                        // 鬼牌万能 只能补牌
                        if (this.settings.universalGhost == true) {
                            cantOpen = true;
                            cantPass = true;
                        }
                    }
                    // 天公不能过牌
                    if (totalValue == 8 || totalValue == 9) {
                        cantPass = true;
                    }
                    break;
                }
                // 经典
                case Game.ROOM_TYPE.CLASSICAL: {
                    // 一只鬼的时候
                    if (ghostCnt === 1) {
                        // 鬼牌万能 只能补牌
                        if (this.settings.universalGhost == true) {
                            cantOpen = true;
                            cantPass = true;
                        }
                    }
                    // 天公不能过牌
                    if (totalValue == 8 || totalValue == 9) {
                        cantPass = true;
                    }
                    break;
                }
                // 混战
                case Game.ROOM_TYPE.CHAOS: {
                    // 一只鬼的时候
                    if (ghostCnt === 1) {
                        // 鬼牌万能 只能补牌
                        if (this.settings.universalGhost == true) {
                            cantOpen = true;
                            cantPass = true;
                        }
                    }
                    break;
                }
                // 定制
                case Game.ROOM_TYPE.CUSTOMIZED: {
                    // 定制模式不能明牌和过牌 只能补牌和搓牌
                    cantPass = true;
                    cantOpen = true;
                    break;
                }
            }

            switch (type) {
                // 明牌 不补牌 直接将牌面公开
                case Game.DRAW_COMMAND.OPEN: {
                    if (cantOpen) {
                        return null;
                    }

                    for (i in client.handPokers) {
                        client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
                    }
                    break;
                }
                // 要一张牌
                case Game.DRAW_COMMAND.DRAW: {
                    if (cantDraw) {
                        return null;
                    }

                    poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                        poker.setShow(Poker.SHOW_TARGET.ALL);
                    }
                    client.handPokers.push(poker);
                    break;
                }
                // 搓牌 要扣东西的
                case Game.DRAW_COMMAND.RUBBED: {
                    if (cantRubbed) {
                        return null;
                    }

                    this.whosRubbing = userID;
                    client.isRubbing = true;

                    poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                        poker.setShow(Poker.SHOW_TARGET.ALL);
                    }
                    client.handPokers.push(poker);
                    break;
                }
                // 过牌
                default: {
                    if (cantPass) {
                        return null;
                    }

                    type = Game.DRAW_COMMAND.PASS;
                    break;
                }
            }

            this.drawList.shift();
            results.type = type;
            
            if (this.drawList.length <= 0) {
                if (this.type === Game.ROOM_TYPE.CHAOS
                    || this.type === Game.ROOM_TYPE.CUSTOMIZED
                ) {
                    this.doPay();
                }
            }

            return results;
        },

        doBankerDraw: function(userID, type) {
            //闲家捣乱
            if (userID != this.banker) {
                return null;
            }

            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            var i;
            var j;
            var results = {
                userID: userID
            };

            var ghostArray = [];
            for (i in this.ghostPokers) {
                poker = this.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    ghostArray.push(poker.value);
                }
            }

            // 双鬼判断
            var ghostCnt = 0;
            for (i in client.handPokers) {
                poker = client.handPokers[i];
                if (poker && (poker.type === Poker.TYPE.JOKER || ghostArray.indexOf(poker.value) != -1)) {
                    ghostCnt++;
                }
            }

            var cantBetAll = false;
            var cantBetDraw = false;
            var cantDraw = false;
            var cantRubbed = false;
            
            // 一只鬼的时候
            if (ghostCnt === 1) {
                // 鬼牌万能 只能补牌
                if (this.settings.universalGhost == true) {
                    cantBetAll = true;
                    cantBetDraw = true;
                }
            }

            var gambleList = [];

            switch (type) {
                // 开补 对已经补牌的玩家进行开牌比牌操作 已经明牌的也要加上
                case Game.DRAW_COMMAND.BET_DRAW: {
                    if (cantBetDraw) {
                        return null;
                    }
                    
                    this.bankerDraw = 1;
                    var drawCnt = 0;
                    var openCnt = 0;
                    var openArr = [];
                    var playerCnt = 0;

                    for (i in this.clients) {
                        var c = this.getClient(i);
                        if (c == null) {
                            continue;
                        }

                        //庄家自己
                        if (c.userID == userID) {
                            continue;
                        }

                        playerCnt++;
                        if (c.handPokers.length > 2) {
                            gambleList.push(c.userID);
                            drawCnt++;
                        }
                        else {
                            // 两张牌都是开牌的
                            if (c.handPokers[0].showTarget == Poker.SHOW_TARGET.ALL
                                && c.handPokers[1].showTarget == Poker.SHOW_TARGET.ALL) {
                                openCnt++;
                                openArr.push(c.userID);
                            }
                        }

                        // 闲家开牌
                        for (j in c.handPokers) {
                            c.handPokers[j].setShow(Poker.SHOW_TARGET.ALL);
                        }
                    }

                    // 有人补牌 并且补牌+明牌的人数小于总人数 则走开补流程
                    if (drawCnt > 0 && drawCnt + openCnt < playerCnt) {
                        for (i in client.handPokers) {
                            client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
                        }
                        // 联合补牌和明牌的人
                        gambleList = gambleList.concat(openArr);
                        results.gamble = this.fight(gambleList);
                    }
                    // 其他情况都全部开牌
                    else {
                        this.bankerDraw = 2;
                    }
                    break;
                }
                // 补牌 要一张牌
                case Game.DRAW_COMMAND.DRAW: {
                    if (cantDraw) {
                        return null;
                    }
                    
                    var poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    client.handPokers.push(poker);
                    this.bankerDraw = 2;
                    break;
                }
                // 搓牌 要扣东西的
                case Game.DRAW_COMMAND.RUBBED: {
                    if (cantRubbed) {
                        return null;
                    }

                    this.whosRubbing = userID;
                    client.isRubbing = true;
                    
                    var poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    client.handPokers.push(poker);
                    this.bankerDraw = 2;
                    break;
                }
                // 全开 不补牌直接跟全部人比较
                default: {
                    if (cantBetAll) {
                        return null;
                    }
                    type = Game.DRAW_COMMAND.BET_ALL;

                    this.bankerDraw = 2;
                    break;
                }
            }

            results.type = type;
            
            if (this.bankerDraw == 2) {
                this.doPay();
            }

            return results;
        },

        rubDone: function(userID, data) {
            if (userID == this.whosRubbing) {
                this.whosRubbing = 0;

                var client = this.getClient(this.banker);
                if (client != null) {
                    client.isRubbing = false;
                }
            }

            return {userID: userID};
        },

        doPay: function() {
            var client = this.getClient(this.banker);
            if (client == null) {
                return null;
            }

            if (this.roundLog.ghostPokers == null) {
                this.roundLog.ghostPokers = Utils.object_clone(this.ghostPokers);
            }

            var i;
            var j;
            var gambleList = [];
            for (i in this.clients) {
                var c = this.getClient(i);
                if (c == null) {
                    continue;
                }

                // 比牌要展示结果
                c.showResult = true;

                //庄家自己 非混战模式不参与
                if (this.type != Game.ROOM_TYPE.CHAOS) {
                    if (c.userID == this.banker) {
                        continue;
                    }
                }

                if (c.compared == false) {
                    gambleList.push(c.userID);
                }

                // 闲家开牌
                for (j in c.handPokers) {
                    c.handPokers[j].setShow(Poker.SHOW_TARGET.ALL);
                }
            }

            // 庄家操作之后 就可以展示所有牌给大家看了
            for (i in client.handPokers) {
                client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
            }

            var gamble = this.fight(gambleList);
            return {gamble: gamble};
        },

        end: function(userID, data) {
            var client = this.getClient(userID);
            if (client == null || client.end == true) {
                return null;
            }

            client.end = true;
            return {
                userID: userID,
                end: true
            };
        },

        rejectBanker: function(userID, data) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            if (client.notBank) {
                client.notBank = false;
            }
            else {
                client.notBank = true;
            }

            return {
                userID: userID,
                notBank: client.notBank
            };
        },

        //比牌的入口 一般情况下是庄家与list里面的玩家比牌
        fight: function(list) {
            var l = Utils.object_clone(list);

            switch (this.type) {
                // 长庄模式
                case Game.ROOM_TYPE.STATIC: {
                    return this.staticFight(l);
                }
                // 经典模式
                case Game.ROOM_TYPE.CLASSICAL: {
                    return this.classicalFight(l);
                }
                // 混战模式
                case Game.ROOM_TYPE.CHAOS: {
                    return this.chaosFight(l);
                }
                // 定制模式
                case Game.ROOM_TYPE.CUSTOMIZED: {
                    return this.customizedFight(l);
                }
            }
        },

        // 长庄模式比牌
        staticFight: function(list) {
            var results  = {};
            var gamble = new StaticGamble(this.clone());
            var bankerObj = this.getClient(this.banker);

            if (bankerObj == null) {
                return null;
            }

            var bankerScore = gamble.pokerScore(Utils.object_clone(bankerObj.handPokers));
            if (bankerScore == null) {
                return null;
            }

            bankerObj.compared = true;
            results.bankerScore = bankerScore;

            var pokerId;

            if (this.roundLog.clients == null) {
                this.roundLog.clients = {};
            }

            if (this.roundLog.clients[this.banker] == null) {
                this.roundLog.clients[this.banker] = {
                    gold:       0,    // 需要初始化一个gold
                    fightTimes: 0,
                    winTimes:   0,
                    bidRate:    bankerObj.bidRate
                };
            }

            this.roundLog.clients[this.banker].score = bankerScore.score;
            this.roundLog.clients[this.banker].type = bankerScore.type;
            this.roundLog.clients[this.banker].isBanker = true;
            this.roundLog.clients[this.banker].point = bankerScore.point;
            this.roundLog.clients[this.banker].fancy = bankerScore.fancy;
            this.roundLog.clients[this.banker].handPokers = [];
            for (pokerId = 0; pokerId < bankerObj.handPokers.length; pokerId++) {
                if (bankerObj.handPokers[pokerId]) {
                    this.roundLog.clients[this.banker].handPokers.push(bankerObj.handPokers[pokerId].clone());
                }
            }

            var i;
            var playerScore;
            var client;

            for (i = 0; i < list.length; i++) {
                var userID = list[i];
                // 只处理闲家
                if (userID === this.banker) {
                    continue;
                }

                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = playerScore.score;
                this.roundLog.clients[userID].type = playerScore.type;
                this.roundLog.clients[userID].point = playerScore.point;
                this.roundLog.clients[userID].fancy = playerScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                for (pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                client.compared = true;
                if (playerScore.score > bankerScore.score) {
                    playerScore.result = "win";             //闲家胜利
                }
                else if (playerScore.score == bankerScore.score) {
                    playerScore.result = "draw";            //平局
                    // 比牌算花式
                    if (this.settings.fancyWin && bankerScore.type === playerScore.type) {
                        if (FancyPayTypes.indexOf(bankerScore.type) != -1) {
                            if (Game.FANCY_MULTIPLE[playerScore.fancy] > Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "win";             //闲家胜利
                            }
                            else if (Game.FANCY_MULTIPLE[playerScore.fancy] < Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "lose";            //输牌
                            }
                        }
                    }
                }
                else {
                    playerScore.result = "lose";            //输牌
                }

                // 需要判断0点赢双鬼
                var winGhostMultiple = 0;
                // 任何木虱赢双鬼
                if (this.settings.beatDBLGhost === Game.BEAT_DBL_GHOST.ALL_BEAT) {
                    // 闲家双鬼 庄家0点
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && bankerScore.score === 100) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && playerScore.score === 100) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * playerScore.double_poker;
                    }
                }
                // 三条同花木虱赢双鬼
                else {
                    // 闲家双鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                // 三条同花木虱赢三鬼
                if (this.settings.beatThreeGhost) {
                    // 闲家三鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家三鬼
                    else if (bankerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                var payMultiple = 0;
                // 闲家赢牌 庄家输牌
                if (playerScore.result == "win") {
                    this.roundLog.clients[userID].winTimes++;
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = playerScore.multiple;
                    }
                    
                    this.increaseGold(userID, payMultiple * client.bidRate);
                    this.decreaseGold(this.banker, payMultiple * client.bidRate);
                }
                // 闲家输牌 庄家赢牌
                else if (playerScore.result == "lose") {
                    this.roundLog.clients[this.banker].winTimes++;
                    // 需要用庄家的牌型倍率
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = bankerScore.multiple;
                    }
                    
                    this.increaseGold(this.banker, payMultiple * client.bidRate);
                    this.decreaseGold(userID, payMultiple * client.bidRate);
                }

                this.roundLog.clients[this.banker].fightTimes++;
                this.roundLog.clients[userID].fightTimes++;

                results[userID] = playerScore;
            }

            return results;
        },

        // 经典模式比牌
        classicalFight: function(list) {
            var results  = {};
            var gamble = new StaticGamble(this.clone());
            var bankerObj = this.getClient(this.banker);

            if (bankerObj == null) {
                return null;
            }

            var bankerScore = gamble.pokerScore(Utils.object_clone(bankerObj.handPokers));
            if (bankerScore == null) {
                return null;
            }

            bankerObj.compared = true;
            results.bankerScore = bankerScore;

            var pokerId;

            if (this.roundLog.clients == null) {
                this.roundLog.clients = {};
            }

            if (this.roundLog.clients[this.banker] == null) {
                this.roundLog.clients[this.banker] = {
                    gold:       0,    // 需要初始化一个gold
                    fightTimes: 0,
                    winTimes:   0,
                    bidRate:    bankerObj.bidRate
                };
            }

            this.roundLog.clients[this.banker].score = bankerScore.score;
            this.roundLog.clients[this.banker].type = bankerScore.type;
            this.roundLog.clients[this.banker].isBanker = true;
            this.roundLog.clients[this.banker].point = bankerScore.point;
            this.roundLog.clients[this.banker].fancy = bankerScore.fancy;
            this.roundLog.clients[this.banker].handPokers = [];
            for (pokerId = 0; pokerId < bankerObj.handPokers.length; pokerId++) {
                if (bankerObj.handPokers[pokerId]) {
                    this.roundLog.clients[this.banker].handPokers.push(bankerObj.handPokers[pokerId].clone());
                }
            }

            var self = this;
            var bankerChangeCalc = function(userID, scoreInfo) {
                // 第一次处理总是庄家 所以可以直接存相应信息
                if (self.typeBak == null) {
                    self.typeBak = scoreInfo.type;
                    return;
                }

                // 下面就是闲家了

                // 顺子上庄：双鬼 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）
                // 天公上庄：双鬼 > 天公9 > 天公8 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）

                // 点数牌的话就别想了
                if (scoreInfo.type == Game.POKER_MODELS.POINT) {
                    return;
                }

                if (self.settings.condition === Game.BANKER_CONDITION.NORMAL) {
                    // 顺子上庄 天公8 天公9 不上庄
                    if (scoreInfo.type == Game.POKER_MODELS.GOD_EIGHT || scoreInfo.type == Game.POKER_MODELS.GOD_NINE) {
                        return;
                    }
                }

                var typeGrade = {};
                // 第一波 双鬼 最屌
                typeGrade[Game.POKER_MODELS.THREE_GHOST] = 2000;
                typeGrade[Game.POKER_MODELS.DOUBLE_GHOST] = 1000;

                // 第二波 天公9 > 天公8  直接用 9 和 8 来评分
                typeGrade[Game.POKER_MODELS.GOD_NINE] = 109;
                typeGrade[Game.POKER_MODELS.GOD_EIGHT] = 108;

                // 第三波 同花顺 三条 顺子
                // 用设置的倍数来判断 如果倍数相同 按 同花顺 > 三条 > 顺子
                typeGrade[Game.POKER_MODELS.STRAIGHT_FLUSH]
                    = self.settings.pokerModels[Game.POKER_MODELS.STRAIGHT_FLUSH];

                typeGrade[Game.POKER_MODELS.THREES]
                    = self.settings.pokerModels[Game.POKER_MODELS.THREES];

                typeGrade[Game.POKER_MODELS.STRAIGHT]
                    = self.settings.pokerModels[Game.POKER_MODELS.STRAIGHT];

                typeGrade[Game.POKER_MODELS.POINT] = 0;

                var bakGrade = typeGrade[self.typeBak] || 0;
                var currGrade = typeGrade[scoreInfo.type] || 0;

                // 大于就直接换
                if (currGrade > bakGrade) {
                    self.typeBak = scoreInfo.type;
                    self.bankerBak = userID;
                    return;
                }

                // 相等的话 按发牌顺序
                if (currGrade == bakGrade) {
                    var bankerOrder = self.dealSequence.indexOf(self.bankerBak);
                    var clientOrder = self.dealSequence.indexOf(userID);

                    if (clientOrder != -1 && clientOrder < bankerOrder) {
                        self.typeBak = scoreInfo.type;
                        self.bankerBak = userID;
                    }
                }
            };

            bankerChangeCalc(this.banker, bankerScore);

            var i;
            var playerScore;
            var client;

            for (i = 0; i < list.length; i++) {
                var userID = list[i];
                // 只处理闲家
                if (userID === this.banker) {
                    continue;
                }

                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = playerScore.score;
                this.roundLog.clients[userID].type = playerScore.type;
                this.roundLog.clients[userID].point = playerScore.point;
                this.roundLog.clients[userID].fancy = playerScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                for (pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                client.compared = true;
                if (playerScore.score > bankerScore.score) {
                    playerScore.result = "win";             //闲家胜利
                }
                else if (playerScore.score == bankerScore.score) {
                    playerScore.result = "draw";            //平局
                    // 比牌算花式
                    if (this.settings.fancyWin && bankerScore.type === playerScore.type) {
                        if (FancyPayTypes.indexOf(bankerScore.type) != -1) {
                            if (Game.FANCY_MULTIPLE[playerScore.fancy] > Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "win";             //闲家胜利
                            }
                            else if (Game.FANCY_MULTIPLE[playerScore.fancy] < Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "lose";            //输牌
                            }
                        }
                    }
                }
                else {
                    playerScore.result = "lose";            //输牌
                }

                // 需要判断0点赢双鬼
                var winGhostMultiple = 0;
                // 任何木虱赢双鬼
                if (this.settings.beatDBLGhost === Game.BEAT_DBL_GHOST.ALL_BEAT) {
                    // 闲家双鬼 庄家0点
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && bankerScore.score === 100) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && playerScore.score === 100) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * playerScore.double_poker;
                    }
                }
                // 三条同花木虱赢双鬼
                else {
                    // 闲家双鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                // 三条同花木虱赢三鬼
                if (this.settings.beatThreeGhost) {
                    // 闲家三鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家三鬼
                    else if (bankerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                var payMultiple = 0;
                // 闲家赢牌 庄家输牌
                if (playerScore.result == "win") {
                    this.roundLog.clients[userID].winTimes++;
                    // 用闲家的牌型倍率
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = playerScore.multiple;
                    }
                    
                    this.increaseGold(userID, payMultiple * client.bidRate);
                    this.decreaseGold(this.banker, payMultiple * client.bidRate);

                    // 上庄设定 闲家赢牌才有资格上庄
                    // 这里判断的是他是否选择了不坐庄
                    if (client.notBank != true) {
                        bankerChangeCalc(userID, playerScore);
                    }
                }
                // 闲家输牌 庄家赢牌
                else if (playerScore.result == "lose") {
                    this.roundLog.clients[this.banker].winTimes++;
                    // 需要用庄家的牌型倍率
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = bankerScore.multiple;
                    }
                    
                    this.increaseGold(this.banker, payMultiple * client.bidRate);
                    this.decreaseGold(userID, payMultiple * client.bidRate);
                }

                this.roundLog.clients[this.banker].fightTimes++;
                this.roundLog.clients[userID].fightTimes++;

                results[userID] = playerScore;
            }

            return results;
        },

        // 混战模式比牌
        chaosFight: function(list) {
            var results  = {};
            var scoreList = {};

            var gamble = new StaticGamble(this.clone());
            var i;
            var j;
            var playerScore;
            var client;
            var userID;

            for (i = 0; i < list.length; i++) {
                userID = list[i];
                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                scoreList[userID] = playerScore;
            }

            var gambleResult = {};
            for (i = 0; i < list.length; i++) {
                userID = list[i];
                var baseScore = scoreList[userID];
                if (baseScore == null) {
                    continue;
                }

                if (this.roundLog.clients == null) {
                    this.roundLog.clients = {};
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = baseScore.score;
                this.roundLog.clients[userID].type = baseScore.type;
                this.roundLog.clients[userID].point = baseScore.point;
                this.roundLog.clients[userID].fancy = baseScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                client = this.getClient(userID);
                for (var pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                gambleResult[userID] = {};

                for (j = 0; j < list.length; j++) {
                    var pId = list[j];
                    if (pId == userID) {
                        continue;
                    }

                    playerScore = scoreList[pId];
                    if (playerScore.score > baseScore.score) {
                        gambleResult[userID][pId] = "lose";            //userID失败
                    }
                    else if (playerScore.score == baseScore.score) {
                        gambleResult[userID][pId] = "draw";            //平局
                        // 比牌算花式
                        if (this.settings.fancyWin && baseScore.type === playerScore.type) {
                            if (FancyPayTypes.indexOf(baseScore.type) != -1) {
                                if (Game.FANCY_MULTIPLE[playerScore.fancy] > Game.FANCY_MULTIPLE[baseScore.fancy]) {
                                    gambleResult[userID][pId] = "lose";            //userID失败
                                }
                                else if (Game.FANCY_MULTIPLE[playerScore.fancy] < Game.FANCY_MULTIPLE[baseScore.fancy]) {
                                    gambleResult[userID][pId] = "win";             //userID胜利
                                }
                            }
                        }
                    }
                    else {
                        gambleResult[userID][pId] = "win";             //userID胜利
                    }

                    var target = this.getClient(pId);

                    // 需要判断0点赢双鬼
                    var winGhostMultiple = 0;
                    // 任何木虱赢双鬼
                    if (this.settings.beatDBLGhost === Game.BEAT_DBL_GHOST.ALL_BEAT) {
                        // 闲家双鬼 庄家0点
                        if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && baseScore.score === 100) {
                            gambleResult[userID][pId] = "win";            //userID胜利
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * baseScore.double_poker;
                        }
                        // 闲家0点 庄家双鬼
                        else if (baseScore.type === Game.POKER_MODELS.DOUBLE_GHOST && playerScore.score === 100) {
                            gambleResult[userID][pId] = "lose";            //userID失败
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * playerScore.double_poker;
                        }
                    }
                    // 三条同花木虱赢双鬼
                    else {
                        // 闲家双鬼 庄家0点并且是三张同花
                        if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                            && baseScore.score === 100
                            && baseScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "win";            //userID胜利
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * baseScore.double_poker;
                        }
                        // 闲家0点并且是三张同花 庄家双鬼
                        else if (baseScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                            && playerScore.score === 100
                            && playerScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "lose";            //userID失败
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                        }
                    }

                    // 三条同花木虱赢三鬼
                    if (this.settings.beatThreeGhost) {
                        // 闲家三鬼 庄家0点并且是三张同花
                        if (playerScore.type === Game.POKER_MODELS.THREE_GHOST
                            && baseScore.score === 100
                            && baseScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "win";            //userID胜利
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * baseScore.double_poker;
                        }
                        // 闲家0点并且是三张同花 庄家三鬼
                        else if (baseScore.type === Game.POKER_MODELS.THREE_GHOST
                            && playerScore.score === 100
                            && playerScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "lose";            //userID失败
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                        }
                    }

                    //设置已经比牌的状态
                    client.compared = true;

                    // 技巧: 因为这里重复比较了 所以这里在扣费和增费 只做单方面的 比如 userID 赢 只给他钱 不扣 pId的钱 当pId为主的时候就会扣了
                    var payMultiple = 0;
                    if (gambleResult[userID][pId] == "win") {
                        this.roundLog.clients[userID].winTimes++;
                        // 赢的时候要用自己的牌型倍数
                        if (winGhostMultiple > 0) {
                            payMultiple = winGhostMultiple;
                        }
                        else {
                            payMultiple = baseScore.multiple;
                        }
                        this.increaseGold(userID, payMultiple * target.bidRate * client.bidRate);
                    }
                    else if (gambleResult[userID][pId] == "lose") {
                        // 赢的时候要用自己的牌型倍数
                        if (winGhostMultiple > 0) {
                            payMultiple = winGhostMultiple;
                        }
                        else {
                            payMultiple = playerScore.multiple;
                        }
                        this.decreaseGold(userID, payMultiple * target.bidRate * client.bidRate);
                    }
                    
                    this.roundLog.clients[userID].fightTimes++;
                }
            }

            results.gambleResult = gambleResult;
            results.scoreList = scoreList;

            return results;
        },

        // 定制模式比牌
        customizedFight: function(list) {
            var results  = {};
            var gamble = new CustomizedGamble(this.clone());
            var bankerObj = this.getClient(this.banker);

            if (bankerObj == null) {
                return null;
            }

            var bankerScore = gamble.pokerScore(Utils.object_clone(bankerObj.handPokers));
            if (bankerScore == null) {
                return null;
            }

            bankerObj.compared = true;
            results.bankerScore = bankerScore;

            var pokerId;

            if (this.roundLog.clients == null) {
                this.roundLog.clients = {};
            }

            if (this.roundLog.clients[this.banker] == null) {
                this.roundLog.clients[this.banker] = {
                    gold:       0,    // 需要初始化一个gold
                    fightTimes: 0,
                    winTimes:   0,
                    bidRate:    bankerObj.bidRate
                };
            }

            this.roundLog.clients[this.banker].score = bankerScore.score;
            this.roundLog.clients[this.banker].type = bankerScore.type;
            this.roundLog.clients[this.banker].isBanker = true;
            this.roundLog.clients[this.banker].point = bankerScore.point;
            this.roundLog.clients[this.banker].fancy = bankerScore.fancy;
            this.roundLog.clients[this.banker].handPokers = [];
            for (pokerId = 0; pokerId < bankerObj.handPokers.length; pokerId++) {
                if (bankerObj.handPokers[pokerId]) {
                    this.roundLog.clients[this.banker].handPokers.push(bankerObj.handPokers[pokerId].clone());
                }
            }

            var i;
            var playerScore;
            var client;

            for (i = 0; i < list.length; i++) {
                var userID = list[i];
                // 只处理闲家
                if (userID === this.banker) {
                    continue;
                }

                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = playerScore.score;
                this.roundLog.clients[userID].type = playerScore.type;
                this.roundLog.clients[userID].point = playerScore.point;
                this.roundLog.clients[userID].fancy = playerScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                for (pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                client.compared = true;
                if (playerScore.score > bankerScore.score) {
                    playerScore.result = "win";             //闲家胜利
                    this.roundLog.clients[userID].winTimes++;
                    this.increaseGold(userID, playerScore.multiple * client.bidRate);
                    this.decreaseGold(this.banker, playerScore.multiple * client.bidRate);
                }
                else if (playerScore.score == bankerScore.score) {
                    playerScore.result = "draw";            //平局
                }
                else {
                    playerScore.result = "lose";            //输牌  用庄家的牌型倍数
                    this.roundLog.clients[this.banker].winTimes++;
                    this.increaseGold(this.banker, bankerScore.multiple * client.bidRate);
                    this.decreaseGold(userID, bankerScore.multiple * client.bidRate);
                }

                this.roundLog.clients[this.banker].fightTimes++;
                this.roundLog.clients[userID].fightTimes++;

                results[userID] = playerScore;
            }

            return results;
        },

        reset: function() {
            switch (this.type) {
                // 长庄模式
                case Game.ROOM_TYPE.STATIC: {
                    break;
                }
                // 经典模式
                case Game.ROOM_TYPE.CLASSICAL: {
                    // 上庄
                    // 如果庄家不同了
                    if (this.banker != this.bankerBak) {
                        this.lastBidRates = {};
                    }
                    this.banker = this.bankerBak;
                    this.scoreBak = 0;
                    this.typeBak = null;
                    break;
                }
                // 混战模式
                case Game.ROOM_TYPE.CHAOS: {
                    break;
                }
                // 定制模式
                case Game.ROOM_TYPE.CUSTOMIZED: {
                    // 去掉庄家 要重新抢
                    this.banker = 0;
                    break;
                }
            }

            this.deck           = [];       // 整副牌
            this.ghostPokers    = [];       // 桌面鬼牌
            this.drawList       = [];       // 要牌列表
            this.bankerDraw     = 0;        // 庄家操作情况
            this.whosRubbing    = 0;        // 搓牌信息刷新
            this.roundLog       = {clients: {}};       // 比牌记录

            for (var userID in this.clients) {
                var client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                client.ready        = false;        // 是否准备好
                client.started      = false;        // 是否开始过游戏
                client.bid          = false;        // 是否下注
                client.bidRate      = 0;            // 下注倍数
                client.compared     = false;        // 是否比过牌
                client.end          = false;        // 是否结束
                client.handPokers   = [];           // 手牌
                client.isRubbing    = false;        // 是否在搓牌
            }
        },

        infoToPlayer: function(userID) {
            var info = {};
            info.ghostPokers        = Utils.object_clone(this.ghostPokers);
            info.drawList           = Utils.object_clone(this.drawList);
            info.dealSequence       = Utils.object_clone(this.dealSequence);
            info.roundLog           = Utils.object_clone(this.roundLog);
            info.banker             = this.banker;
            info.bankerDraw         = this.bankerDraw;
            info.indicator          = this.indicator;
            info.whosRubbing        = this.whosRubbing;

            info.clients = {};
            for (var uid in this.clients) {
                info.clients[uid] = {};
                var client = info.clients[uid];
                var c = this.getClient(uid);
                client.userID       = c.userID;
                client.chairID      = c.chairID;
                client.gold         = this.golds[uid] || 0;
                client.lastBidRate  = this.lastBidRates[uid] || 0;
                client.ready        = c.ready;
                client.started      = c.started;
                client.bid          = c.bid;
                client.bidRate      = c.bidRate;
                client.end          = c.end;
                client.compared     = c.compared;
                client.notBank      = c.notBank;
                client.isRubbing    = c.isRubbing;
                client.showResult   = c.showResult;
                client.isAfk        = c.isAfk;

                client.handPokers = [];                        // 手牌
                var showRight = Poker.SHOW_TARGET.ALL;
                if (client.userID == userID) {
                    showRight = Poker.SHOW_TARGET.ME;
                }
                if (c.handPokers) {
                    for (var i = 0, size = c.handPokers.length; i < size; i++) {
                        if (showRight > c.handPokers[i].showTarget) {
                            client.handPokers.push({showTarget: c.handPokers[i].showTarget});
                            continue;
                        }
                        client.handPokers.push(
                            {
                                type: c.handPokers[i].type,
                                value: c.handPokers[i].value,
                                showTarget: c.handPokers[i].showTarget
                            }
                        );
                    }
                }
            }
            
            return info;
        }
    });
}(DejuPoker));

(function(root){
    var _super = root.Entity;

    var Code = root.Code;
    var ROUTE = root.ROUTE;
    var Game = root.Game;
    var Table = root.Table;

    var Utils = root.Utils;
    
    var Room = root.Room = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        // private members
        this._service           = opts.service;                      //房间服务
        this._queue             = [];                                //消息队列
        this._timerID           = null;                              //定时器

        // public members
        this.id                 = opts.id;
        this.type               = opts.type;
        this.cost               = opts.cost || 1;
        this.settings           = {};
        this.state              = opts.state || Room.STATE_READY;

        this.host               = opts.host;                        //房主
        this.members            = opts.members || [];               //玩家 [ userID, userID, ... ]
        this.locked             = opts.locked || false;

        this.banker             = opts.banker || this.host;         //庄家 (0 - 无庄家 userID)

        this.table              = null;                             //桌子

        this.chairs             = opts.chairs || new Array(8);      //椅子 [ userID, userID, ... ]
        this.maxChairs          = opts.maxChairs || 8;

        this.round              = opts.round || 0;                  //局数
        this.maxRound           = opts.maxRound || 10;

        this.roomLog            = opts.roomLog;
        this.forbidden          = opts.forbidden || [];             //禁言列表

        this.dismissStamp       = opts.dismissStamp || 0;           //申请解散的时间戳
        this.dismissNeedConfirm = opts.dismissNeedConfirm || false; //是否可以申请解散
        this.dismissConfirmList = opts.dismissConfirmList || {};    //解散确认列表

        this.firstPay           = opts.firstPay || false;           //是否有过结算 用于判断是否存盘和是否需要支付房卡

        this.init(opts);
    };

    root.inherits(Room, _super);

    Room.STATE_READY       = 0;             //等待准备状态
    Room.STATE_ROB         = 1;             //抢庄
    Room.STATE_START       = 2;             //准备好后发牌和返鬼牌
    Room.STATE_BID         = 3;             //等待下注状态
    Room.STATE_DRAW        = 4;             //下注完闲家要牌
    Room.STATE_BANKER      = 5;             //闲家要完牌庄家处理阶段
    Room.STATE_PAY         = 6;             //结算
    Room.STATE_END         = 7;             //牌局结束 请求下一局
    Room.STATE_CLOSED      = 8;             //所有牌局完成房间解散
    Room.STATE_DISMISS     = 9;             //申请解散房间

    root.extend(Room.prototype, {
        settingInit: function(settings) {
            settings = settings || {};
            this.settings.condition      = settings.condition || Game.BANKER_CONDITION.NORMAL;                //经典模式上庄条件
            this.settings.times          = settings.times || 10;                                              //局数
            this.settings.ghostCount     = settings.ghostCount || 0;                                          //鬼牌数
            this.settings.betType        = settings.betType || Game.BET_TYPE.ARBITRARILY;                     //下注类型
            this.settings.chaosBet       = settings.chaosBet || false;                                        //混战模式是否可以自由下注
            this.settings.universalGhost = settings.universalGhost || false;                                  //true的时候鬼牌万能/false的时候鬼牌成型
            this.settings.fancyGod       = settings.fancyGod || false;                                        //鬼牌成型的时候鬼9鬼8是否为花式天公
            this.settings.isDouble       = settings.isDouble || false;                                        //是否有翻倍牌
            this.settings.beatDBLGhost   = settings.beatDBLGhost || Game.BEAT_DBL_GHOST.ALL_BEAT;             //0点赢双鬼条件
            this.settings.beatThreeGhost = settings.beatThreeGhost || false;                                  //是否赢三鬼
            this.settings.fancyWin       = settings.fancyWin || false;                                        //比牌是否算牌型

            // 牌型倍数
            this.settings.pokerModels    = {};
            var mul;
            var pokerModels = settings.pokerModels || {};
            for (var i in Game.POKER_MODELS) {
                var modelKey = Game.POKER_MODELS[i];
                // 顺子将固定为4倍
                if (i == "STRAIGHT" && this.type != Game.ROOM_TYPE.CUSTOMIZED) {
                    this.settings.pokerModels[modelKey] = 4;
                    continue;
                }
                // 双鬼固定为10倍
                if (i == "DOUBLE_GHOST") {
                    this.settings.pokerModels[modelKey] = 10;
                    continue;
                }
                // 三鬼固定为30倍
                if (i == "THREE_GHOST") {
                    this.settings.pokerModels[modelKey] = 30;
                    continue;
                }

                var multiple = Game.POKER_FORMATION_MULTIPLE[i] || {};
                mul = multiple.min || 1;
                
                this.settings.pokerModels[modelKey] = pokerModels[modelKey] || mul;
            }

            this.settings.pokerPoint = [];
            mul = Game.CUSTOMIZED_SETTINGS.POINT_MULTIPLE.min || 1;

            var pokerPoint = settings.pokerPoint || [];
            this.settings.pokerPoint[0] = 0;
            for (var index = 1; index < 10; index++) {
                this.settings.pokerPoint[index] = pokerPoint[index] || mul;
            }

            this.maxRound = this.settings.times;
        },

        init: function(opts) {
            var self = this;
            var userID;
            var i;

            this.settingInit(opts.settings);

            // init table
            if (opts.table == null) {
                // 确保在这个状态下定制模式没有庄家 需要下一个状态来抢
                if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                    this.banker = 0;
                }

                this.table = new Table({banker: this.banker, settings: Utils.object_clone(this.settings), type: this.type});
            }
            else if (opts.table) {
                this.table = new Table(opts.table);
            }

            if (this.roomLog == null) {
                this.roomLog = {};
                this.roomLog.info = {
                    createTime: Number(root.moment().format('x')),
                    id: this.id,
                    type: this.type
                };

                this.roomLog.users = {};
                this.roomLog.rounds = [];
            }

            // start timer 一段时间检查一下房间游戏进程
            this._timerID = setInterval(function() {
                self.update();
            }, 100);
        },

        getMember: function(userID) {
            return (this.members.indexOf(userID) != -1);
        },

        getMembers: function() {
            return this.members;
        },

        isGotPos: function() {
            return this.members.length < this.maxChairs;
        },

        getChairs: function() {
            return this.chairs;
        },

        sitDown: function(userID, pos) {
            // 已经点击了准备 就不给换位置
            if (this.table.isClientReady(userID) == true) {
                return -1;
            }

            var nowChairID = this.chairs.indexOf(userID);

            // 已经坐下的要换位
            if (nowChairID != -1) {
                // 坑里有人
                if (this.chairs[pos] != null) {
                    return -1;
                }
                // 庄家不能换
                if (userID == this.banker) {
                    return -1;
                }
                
                this.chairs[nowChairID] = null;
                this.chairs[pos] = userID;
                this.table.changeChair(userID, pos);
                return pos;
            }

            if (pos >= 0 && pos < this.maxChairs) {
                if (this.chairs[pos] != null) {
                    return -1;
                }
                this.chairs[pos] = userID;
                
                if (this.state === Room.STATE_READY) {
                    this.table.enter(userID, pos);
                }
                return pos;
            }

            for (var i = 0, size = this.maxChairs; i < size; i++) {
                if (this.chairs[i] != null) {
                    continue;
                }

                this.chairs[i] = userID;

                if (this.state === Room.STATE_READY) {
                    this.table.enter(userID, i);
                }

                return i;
            }

            return -1;
        },

        standUp: function(userID) {
            //牌局期间不能操作
            if (this.state != Room.STATE_READY) {
                return false;
            }

            // 庄家不能站起
            if (userID == this.banker) {
                return false;
            }

            // 已经点击了准备 就不给换位置
            if (this.table.isClientReady(userID) == true) {
                return false;
            }

            for (var i = 0, size = this.chairs.length; i < size; i++) {
                if (this.chairs[i] === userID) {
                    this.chairs[i] = null;
                    this.table.leave(userID);
                    return true;
                }
            }

            return false;
        },

        letStandUp: function(userID, targetID) {
            //牌局期间不能操作
            if (this.state != Room.STATE_READY) {
                return false;
            }

            if (userID != this.host) {
                return false;
            }
            
            return this.standUp(targetID);
        },

        enter: function(player) {
            var userID = player.id;

            if (this.roomLog.users[userID] == null) {
                this.roomLog.users[userID] = {
                    name: player.name || "游客",
                    avatar: player.avatar,
                    gender: player.gender,
                    total: 0
                };
            }

            if (this.getMember(userID) === false) {
                this.members.push(userID);
            }

            if (this.table.getClient(userID) == null) {
                var pos = this.sitDown(userID);
                this.sendInfoToEveryOne(ROUTE.ROOM.ENTER, {userID: userID, pos: pos});
            }
            else {
                this.table.setAwk(userID, false);
                this.sendInfoToEveryOne(ROUTE.ROOM.AFK, {userID: userID, isAwk: false});
            }
        },

        leave: function(userID, isKick) {
            // 已经锁住房间就不能自由离开
            if (this.locked && !isKick) {
                return;
            }

            if (userID == this.host) {
                return;
            }

            // 发牌之后不能被踢出
            if (this.state >= Room.STATE_START) {
                return;
            }

            this.standUp(userID);

            var index = this.members.indexOf(userID);
            if (index != -1) {
                this.members.splice(index, 1);
            }

            this.sendInfoToEveryOne(ROUTE.ROOM.LEAVE, {userID: userID});
        },

        kick: function(userID, targetID) {
            if (userID != this.host) {
                return false;
            }

            this.leave(targetID, true);
            return true;
        },

        afk: function(userID) {
            this.table.setAwk(userID, true);
            this.sendInfoToEveryOne(ROUTE.ROOM.AFK, {userID: userID, isAwk: true});
        },

        ready: function() {
            var i;
            var size;

            // 这里主要是处理刚坐下的小朋友们
            for (i = 0, size = this.chairs.length; i < size; i++) {
                var userID = this.chairs[i];
                if (userID == null) {
                    continue;
                }

                this.table.enter(userID, i);
            }
        },

        destroy: function() {
            if (this._timerID) {
                clearInterval(this._timerID);
                this._timerID = null;
            }

            this._service.destroyRoom(this.id);
            this.table = null;
            this.members = null;
            this.chairs = null;
            this.forbidden = null;
            this.settings = null;
            this.dismissConfirmList = null;
        },

        save: function() {
            this._service && this._service.save(this.id);
        },

        send: function(userID, route, msg, opts, cb) {
            this._service && this._service.send(this.id, userID, route, msg, opts, cb);
        },

        broadcast: function(route, msg, opts, cb) {
            this._service && this._service.broadcast(this.id, route, msg, opts, cb);
        },

        sendEachMsg: function(route, opts) {
            if (!this._service) {
                return;
            }

            //转换状态的时候存盘
            this.save();

            for (var i in this.members) {
                var userID = this.members[i];
                this._service && this._service.send(this.id, userID, route, this.infoToPlayer(userID), opts, null);
            }
        },

        sendInfoToEveryOne: function(route, sendInfo) {
            for (var i in this.members) {
                var userID = this.members[i];
                sendInfo = sendInfo || {};
                // 添加每个人不同的room信息
                sendInfo.room = this.infoToPlayer(userID);
                this._service && this._service.send(this.id, userID, route, sendInfo, null, null);
            }
        },

        process: function() {
            var results = [];

            while (this._queue.length) {
                // 从操作队列中获取第一个操作
                var command = this._queue.shift();
                var userID = command.id;
                if (userID == null) {
                    continue;
                }

                command.msg = command.msg || {};
                var fn = command.msg.fn;
                if (fn && typeof this.table[fn] === "function") {
                    var result = this.table[fn](userID, command.msg.data);
                    if (result != null) {
                        result.fn = fn;
                        results.push(result);
                    }
                }
            }

            if (results.length > 0) {
                if (!this._service) {
                    return;
                }

                this.sendInfoToEveryOne(ROUTE.ROOM.COMMAND, {queue: results});
            }
        },

        queueFilter: function(fn) {
            if (fn == null || typeof this.table[fn] != "function") {
                return false;
            }

            if (fn == "rejectBanker") {
                return true;
            }

            switch (this.state) {
                case Room.STATE_READY:
                    if (fn == "ready") {
                        return true;
                    }
                    break;
                case Room.STATE_ROB:
                    if (fn == "rob") {
                        return true;
                    }
                    break;
                case Room.STATE_START:
                    break;
                case Room.STATE_BID:
                    if (fn == "bid") {
                        return true;
                    }
                    break;
                case Room.STATE_DRAW:
                    if (fn == "draw") {
                        if (this.table.whosRubbing == 0) {
                            return true;
                        }
                    }
                    if (fn == "rubDone") {
                        return true;
                    }
                    break;
                case Room.STATE_BANKER:
                    if (fn == "doBankerDraw") {
                        if (this.table.whosRubbing == 0) {
                            return true;
                        }
                    }
                    if (fn == "rubDone") {
                        return true;
                    }
                    break;
                case Room.STATE_PAY:
                    break;
                case Room.STATE_END:
                    break;
                case Room.STATE_CLOSED:
                    break;
            }

            return false;
        },

        queue: function(userID, msg) {
            if (msg == null) {
                return;
            }
            if (this.queueFilter(msg.fn) == false) {
                return;
            }

            this._queue.push({
                id: userID,
                msg: msg
            });
        },

        update: function() {
            var i;

            if (this.dismissStamp > 0) {
                var agreeCnt = 0;
                var notSelect = 0;
                var memberCnt = this.members.length;
                var duration = 2*60;

                var nowTime = Number(root.moment().format('X'));
                for (i = 0; i < memberCnt; i++) {
                    var u = this.members[i];
                    if (this.dismissConfirmList[u] == null) {
                        notSelect++;
                        continue;
                    }
                    if (this.dismissConfirmList[u] == true) {
                        agreeCnt++;
                        continue;
                    }

                    if (this.dismissConfirmList[u] == false) {
                        // 发现有人拒绝就关房失败
                        this.dismissStamp = 0;
                        this.dismissConfirmList = {};
                        this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: false}, null, null);
                        return;
                    }
                }

                // 时间到了
                if (nowTime > this.dismissStamp + duration) {
                    // 所有人要么同意 要么还没选择默认同意
                    if (notSelect + agreeCnt >= memberCnt) {
                        this.dismissStamp = 0;
                        this.state = Room.STATE_CLOSED;
                        this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: true}, null, null);
                        return;
                    }
                    else {
                        this.dismissStamp = 0;
                        this.dismissConfirmList = {};
                        this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: false}, null, null);
                        return;
                    }
                }
                // 时间没到
                else {
                    // 所有人都操作了
                    if (notSelect == 0) {
                        // 所有人都同意
                        if (agreeCnt >= memberCnt) {
                            this.dismissStamp = 0;
                            this.state = Room.STATE_CLOSED;
                            this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: true}, null, null);
                            return;
                        }
                        // 如果不是就取消
                        else {
                            this.dismissStamp = 0;
                            this.dismissConfirmList = {};
                            this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: false}, null, null);
                            return;
                        }
                    }
                }

                return;
            }
            //更新前完成积压的所有工作
            this.process();

            switch (this.state) {
                case Room.STATE_READY:
                    if (this.table.getClientReady()) {
                        this.state++;
                        this.locked = true;

                        // 开始了就不是说解散就解散了
                        if (this.dismissNeedConfirm == false) {
                            this.dismissNeedConfirm = true;
                        }

                        this.sendEachMsg(ROUTE.ROOM.READY, null);
                    }
                    break;
                case Room.STATE_ROB:
                    // 只有定制模式需要抢庄
                    if (this.type != Game.ROOM_TYPE.CUSTOMIZED) {
                        this.state++;
                    }
                    else {
                        // 抢庄成功
                        if (this.table.banker != 0) {
                            this.banker = this.table.banker;
                            this.state++;
                            this.sendEachMsg(ROUTE.ROOM.ROB, null);
                        }
                    }
                    break;
                case Room.STATE_START:
                    // 开始-洗牌-发牌
                    this.table.start(this.type);
                    this.table.shuffle();
                    // 暂时按座位顺序发牌 这里要做个规则传入发牌顺序的userID数组
                    this.table.clearDraw();
                    this.table.genDealSequence();
                    for (i = 0; i < this.table.dealSequence.length; i++) {
                        var userID = this.table.dealSequence[i];
                        if (userID && this.table.getClient(userID)) {
                            //要牌行列
                            // 长庄模式 经典模式 庄家不进入行列
                            if (userID == this.banker) {
                                if (this.type == Game.ROOM_TYPE.STATIC || this.type == Game.ROOM_TYPE.CLASSICAL) {
                                    continue;
                                }
                            }

                            this.table.insertDraw(userID);
                        }
                    }
                    this.table.deal();
                    // 翻鬼牌
                    // 非定制模式才需要翻鬼牌
                    if (this.type != Game.ROOM_TYPE.CUSTOMIZED) {
                        this.table.ghost();
                    }

                    this.state++;

                    this.sendEachMsg(ROUTE.ROOM.DEAL, null);
                    break;
                case Room.STATE_BID:
                    if (this.table.getClientBid()) {
                        this.state++;
                        this.sendEachMsg(ROUTE.ROOM.BID, null);
                    }
                    break;
                case Room.STATE_DRAW:
                    if (this.table.getClientDraw()) {
                        this.state++;
                        this.sendEachMsg(ROUTE.ROOM.DRAW, null);
                    }
                    break;
                case Room.STATE_BANKER:
                    // 混战模式 定制模式 直接跳过
                    if (this.type == Game.ROOM_TYPE.CHAOS || this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                        if (this.table.whosRubbing == 0) {
                            this.state++;
                            this.sendEachMsg(ROUTE.ROOM.BANKER_DRAW, null);
                        }
                    }
                    // 非混战模式 需要庄家操作
                    else {
                        if (this.table.bankerDraw == 2 && this.table.whosRubbing == 0) {
                            this.state++;
                            this.sendEachMsg(ROUTE.ROOM.BANKER_DRAW, null);
                        }
                    }
                    break;
                case Room.STATE_PAY:
                    if (this.table.getClientFight()) {
                        var roundLog = this.table.roundLog || {};
                        var userLog = roundLog.clients || {};

                        this.roomLog.rounds.push(roundLog);
                        for (var uid in userLog) {
                            var log = userLog[uid];
                            var user = this.roomLog.users[uid] = this.roomLog.users[uid] || {};

                            user.fightTimes  = user.fightTimes || 0;
                            user.winTimes    = user.winTimes || 0;
                            user.playTimes   = user.playTimes || 0;
                            user.total       = user.total || 0;
                            user.ghostTimes  = user.ghostTimes || 0;
                            user.godTimes    = user.godTimes || 0;

                            user.fightTimes += log.fightTimes;
                            user.winTimes   += log.winTimes;
                            user.playTimes  += 1;
                            user.total      += log.gold;
                            if (log.type == Game.POKER_MODELS.GOD_NINE
                            ||  log.type == Game.POKER_MODELS.GOD_EIGHT) {
                                user.godTimes++;
                            }

                            if (log.type == Game.POKER_MODELS.DOUBLE_GHOST) {
                                user.ghostTimes++;
                            }
                        }

                        //记录是否有进行过第一次结算
                        if (this.firstPay == false) {
                            this.firstPay = true;
                        }
                        this.round++;

                        //重整牌局 更换庄家等
                        this.table.reset();
                        this.banker = this.table.banker;

                        if (this.round >= this.settings.times) {
                            this.state = Room.STATE_CLOSED;
                        } else {
                            this.state = Room.STATE_READY;
                            // 房间自身的准备工作
                            this.ready();
                        }
                        
                        this.sendEachMsg(ROUTE.ROOM.PAY, null);
                    }
                    break;
                case Room.STATE_END:
                    if (this.table.getClientEnd()) {
                        this.round++;

                        //重整牌局 更换庄家等
                        this.table.reset();
                        this.banker = this.table.banker;
                        
                        if (this.round >= this.settings.times) {
                            this.state = Room.STATE_CLOSED;
                        } else {
                            this.state = Room.STATE_READY;
                            // 房间自身的准备工作
                            this.ready();
                        }
                        this.sendEachMsg(ROUTE.ROOM.END, null);
                    }
                    break;
                case Room.STATE_CLOSED:
                    this.sendEachMsg(ROUTE.ROOM.CLOSE, null);
                    this.destroy();
                    break;
                case Room.STATE_DISMISS:
                    break;
            }
        },
        
        makeDestroy: function(userID) {
            if (this.members.indexOf(userID) == -1) {
                return null;
            }

            if (this.dismissNeedConfirm) {
                if (this.dismissStamp > 0) {
                    return null;
                }

                this.dismissStamp = Number(root.moment().format('X'));
                this.dismissConfirmList[userID] = true;
                var name = this.roomLog[userID] == null ? "游客" : this.roomLog[userID].name;
                this.broadcast(ROUTE.ROOM.DISMISS_APPLY, {userID: userID, name: name}, null, null);
            }
            else {
                if (userID != this.host) {
                    return null;
                }

                this.state = Room.STATE_CLOSED;
            }
        },

        dismissConfirm: function(userID, confirm) {
            if (this.members.indexOf(userID) == -1) {
                return null;
            }

            confirm = confirm || false;
            this.dismissConfirmList[userID] = confirm;
            this.sendEachMsg(ROUTE.ROOM.DISMISS_CONFIRM, null);
            this.broadcast(ROUTE.ROOM.DISMISS_CONFIRM, {userID: userID, confirm: confirm}, null, null);
        },

        getForbidden: function() {
            return this.forbidden;
        },

        //如果在禁言列表中 则返回true
        isForbidden: function(userID) {
            if (this.forbidden == null) {
                this.forbidden = [];
            }

            return this.forbidden.indexOf(userID) != -1;
        },

        addForbidden: function(userID, targetID) {
            if (this.forbidden == null) {
                this.forbidden = [];
            }

            if (userID != this.host) {
                return null;
            }
            
            if (this.forbidden.indexOf(targetID) != -1) {
                return null;
            }

            this.forbidden.push(targetID);

            return this.forbidden;
        },

        delForbidden: function(userID, targetID) {
            if (this.forbidden == null) {
                this.forbidden = [];
            }

            if (userID != this.host) {
                return;
            }

            var index = this.forbidden.indexOf(targetID);
            if (index == -1) {
                return null;
            }

            this.forbidden.splice(index, 1);
            return this.forbidden;
        },

        //拷贝一份房间信息给玩家 针对这个玩家能看到的部分
        infoToPlayer: function(userID) {
            var info = {};
            info.id                     = this.id;
            info.type                   = this.type;
            info.state                  = this.state;
            info.host                   = this.host;
            info.banker                 = this.banker;
            info.locked                 = this.locked;
            info.firstPay               = this.firstPay;
            info.dismissStamp           = this.dismissStamp || 0;
            info.dismissNeedConfirm     = this.dismissNeedConfirm || false;
            info.maxChairs              = this.maxChairs;
            info.round                  = this.round;
            info.maxRound               = this.maxRound;

            info.dismissConfirmList     = Utils.object_clone(this.dismissConfirmList);
            info.settings               = Utils.object_clone(this.settings);
            info.members                = Utils.object_clone(this.members);
            info.chairs                 = Utils.object_clone(this.chairs);
            info.roomLog                = Utils.object_clone(this.roomLog);

            info.table = this.table.infoToPlayer(userID);

            return info;
        }
    });
}(DejuPoker));
