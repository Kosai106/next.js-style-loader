'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.flush = flush;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _addStyles = require('style-loader/addStyles');

var _addStyles2 = _interopRequireDefault(_addStyles);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 */

var ssrStyleElId = 'next-style-ssr';
var isServer = typeof window === 'undefined';

var serverStyles = !isServer ? null : [];

function applyStylesOnServer(styles) {
    styles = Array.isArray(styles) ? styles : [styles];

    return function (WrappedComponent) {
        var ApplyStyles = function (_Component) {
            _inherits(ApplyStyles, _Component);

            function ApplyStyles() {
                _classCallCheck(this, ApplyStyles);

                return _possibleConstructorReturn(this, (ApplyStyles.__proto__ || Object.getPrototypeOf(ApplyStyles)).apply(this, arguments));
            }

            _createClass(ApplyStyles, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var _serverStyles;

                    // Concatenate styles
                    (_serverStyles = serverStyles).push.apply(_serverStyles, _toConsumableArray(styles));
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(WrappedComponent, this.props);
                }
            }]);

            return ApplyStyles;
        }(_react.Component);

        var displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        ApplyStyles.displayName = 'ApplyStyles(' + displayName + ')';
        ApplyStyles.ComposedComponent = WrappedComponent;

        return (0, _hoistNonReactStatics2.default)(ApplyStyles, WrappedComponent);
    };
}

// ---------------------------------------------------

var removedSsrStyleEl = isServer ? null : false;
var removeSsrStyleElDelay = isServer ? null : 1000;

function applyStylesOnClient(styles) {
    styles = Array.isArray(styles) ? styles : [styles];

    return function (WrappedComponent) {
        var ApplyStyles = function (_Component2) {
            _inherits(ApplyStyles, _Component2);

            function ApplyStyles() {
                _classCallCheck(this, ApplyStyles);

                return _possibleConstructorReturn(this, (ApplyStyles.__proto__ || Object.getPrototypeOf(ApplyStyles)).apply(this, arguments));
            }

            _createClass(ApplyStyles, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    // Insert component styles
                    this._updateNextStyles = (0, _addStyles2.default)(styles.map(function (style) {
                        return [style.id, style.content, '', style.sourceMap];
                    }));
                }
            }, {
                key: 'componentDidMount',
                value: function componentDidMount() {
                    // Remove the server-rendered style tag
                    if (!removedSsrStyleEl) {
                        removedSsrStyleEl = true;

                        setTimeout(function () {
                            var headEl = document.head || document.getElementsByTagName('head')[0];
                            var styleEl = document.getElById(ssrStyleElId);

                            styleEl && headEl.removeChild(styleEl);
                        }, removeSsrStyleElDelay);
                    }
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    // Remove component styles
                    this._updateNextStyles([]);
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(WrappedComponent, this.props);
                }
            }]);

            return ApplyStyles;
        }(_react.Component);

        var displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        ApplyStyles.displayName = 'ApplyStyles(' + displayName + ')';
        ApplyStyles.ComposedComponent = WrappedComponent;

        return (0, _hoistNonReactStatics2.default)(ApplyStyles, WrappedComponent);
    };
}

// ---------------------------------------------------

exports.default = isServer ? applyStylesOnServer : applyStylesOnClient;
function flush() {
    if (!isServer) {
        throw new Error('flush() should only be called on the server');
    }

    var flushedStyles = serverStyles;

    serverStyles = [];

    return {
        tag: _react2.default.createElement(
            'style',
            { id: ssrStyleElId },
            flushedStyles.reduce(function (concatenated, style) {
                return concatenated + style.content;
            }, '')
        ),
        styles: flushedStyles
    };
}