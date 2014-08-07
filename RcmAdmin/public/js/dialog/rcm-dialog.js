/**
 * <RcmDialog>
 */
angular.module(
        'RcmDialog',
        []
    )
    .factory(
        'rcmDialogService',
        [
            function () {

                var defaultStrategy = 'rcmBlankDialog';

                var Service = function () {

                    var self = this;
                    self.loading = false;
                    self.openState = 'closed'; // open, opening, opened, close, closing, closed
                    // @todo self.dialogElm = null; // set by watcher instead of requiring dialog to trigger
                    self.strategy = {
                        loading: true,
                        name: defaultStrategy,
                        title: '',
                        url: ''
                    };

                    /**
                     *
                     * @param strategy
                     * @param scope
                     */
                    self.openDialog = function (strategy, scope) {

                        self.openState = 'open';
                        self.loading = true;
                        self.strategy = strategy;

                        //console.log('openDialog' + self.strategy.name);

                        if (!strategy.name) {
                            strategy.name = defaultStrategy;
                        }

                        scope.$apply();
                    }

                    /**
                     *
                     * @param scope
                     * @param elm
                     * @param attrs
                     * @param ctrl
                     */
                    self.onOpenDialog = function (scope, elm, attrs, ctrl) {

                        //console.log('onOpenDialog' + self.strategy.name);

                        self.openState = 'opening';

                        /* jQuery IU Modal */
                        self.syncEvents(scope, elm);
                        elm.modal('show');

                        scope.$broadcast('rcmDialogOpen');
                    }

                    /**
                     *
                     * @param scope
                     */
                    self.closeDialog = function (scope) {

                        //console.log('closeDialog: ' + self.strategy.name);

                        self.openState = 'close';
                    }

                    /**
                     *
                     * @param scope
                     * @param elm
                     * @param attrs
                     * @param ctrl
                     */
                    self.onCloseDialog = function (scope, elm, attrs, ctrl) {

                        //console.log('onCloseDialog: ' + self.strategy.name);
                        self.openState = 'closing';

                        /* jQuery IU Modal */
                        //self.syncEvents(scope, elm);
                        elm.modal('hide');

                        scope.$broadcast('rcmDialogClose');
                    }

                    self.syncEvents = function (scope, elm) {

                        if (elm.modal) {

                            elm.on(
                                'show.bs.modal',
                                function (event) {
                                    self.openState = 'opening';
                                    //console.log('openState: opening');
                                }
                            );

                            elm.on(
                                'shown.bs.modal',
                                function (event) {
                                    self.openState = 'opened';
                                    //console.log('openState: opened');
                                }
                            );

                            elm.on(
                                'hide.bs.modal',
                                function (event) {
                                    self.openState = 'closing';

                                    //console.log('openState: closing');
                                }
                            );

                            elm.on(
                                'hidden.bs.modal',
                                function (event) {
                                    self.openState = 'closed';
                                    elm.remove(); // prevent multiple instances of modal
                                    scope.$destroy()// prevent multiple instances of modal
                                    //console.log('openState: closed');
                                }
                            );
                        }
                    }
                }

                var service = new Service();

                return service;
            }
        ]
    )
/**
 * RcmDialog.rcmDialog
 */
    .directive(
        'rcmDialog',
        [
            '$compile',
            'rcmDialogService',
            function ($compile, rcmDialogService) {

                var thisCompile = function (tElement, tAttrs) {

                    var thisLink = function (scope, elm, attrs, ctrl) {

                        self = this;

                        scope.rcmDialogService = rcmDialogService;
                        var strategyName = rcmDialogService.strategy.name;

                        scope.directive = strategyName;

                        if (strategyName) {
                            var directiveName = strategyName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                            elm.find(':first-child').attr(directiveName, 'rcmDialogService');
                        }

                        scope.$watch(
                            'rcmDialogService.openState',
                            function (newValue, oldValue) {

                                if (newValue == 'open') {

                                    rcmDialogService.onOpenDialog(scope, elm, attrs, ctrl);

                                    $compile(elm)(scope);
                                    $compile(elm.contents())(scope);
                                }
                            }
                        );
                    };

                    return thisLink;
                }

                return {
                    restrict: 'A',
                    compile: thisCompile,
                    controller: function ($scope) {
                        this.scope = $scope;
                    },
                    template: '<div>-{{directive}}-</div>'
                }
            }
        ]
    )
/**
 * RcmDialog.rcmBlankDialog
 */
    .directive(
        'rcmBlankDialog',
        [
            '$compile',
            'rcmDialogService',
            function ($compile, rcmDialogService) {

                var thisCompile = function (tElement, tAttrs, transclude) {

                    var thisLink = function (scope, elm, attrs, ctrl) {

                        scope.dialogTemplate = rcmDialogService.strategy.url;
                        scope.loading = false;
                    };

                    return thisLink;
                }

                return {
                    restrict: 'A',
                    compile: thisCompile,
                    template: '<div ng-include="dialogTemplate">--{{dialogTemplate}}--</div>'
                }
            }
        ]
    )
/**
 * RcmDialog.rcmStandardDialog
 */
    .directive(
        'rcmStandardDialog',
        [
            '$compile',
            '$http',
            'rcmDialogService',
            function ($compile, $http, rcmDialogService) {

                var thisCompile = function (tElement, tAttrs, transclude) {


                    var thisLink = function (scope, elm, attrs, ctrl) {

                        //console.log('rcmFormDialog: LINK');
                        $http({method: 'GET', url: rcmDialogService.strategy.url}).
                            success(function (data, status, headers, config) {
                                        //console.log('http');
                                        var contentBody = elm.find(".modal-body");
                                        contentBody.html(data);
                                        $compile(contentBody)(scope);
                                    }).
                            error(function (data, status, headers, config) {

                                  });

                        scope.dialogTemplate = 'RcmStandardDialogTemplate';
                        scope.title = rcmDialogService.strategy.title;
                        scope.loading = false;
                    };

                    return thisLink;
                }

                return {
                    restrict: 'A',
                    compile: thisCompile,
                    template: '<div ng-include="dialogTemplate">--{{dialogTemplate}}--</div>'
                }
            }
        ]
    )
/**
 * RcmDialog.rcmFormDialog
 */
    .directive(
        'rcmFormDialog',
        [
            '$compile',
            '$http',
            'rcmDialogService',
            function ($compile, $http, rcmDialogService) {

                var thisCompile = function (tElement, tAttrs, transclude) {


                    var thisLink = function (scope, elm, attrs, ctrl) {

                        //console.log('rcmFormDialog: LINK');
                        $http({method: 'GET', url: rcmDialogService.strategy.url}).
                            success(function (data, status, headers, config) {
                                        //console.log('http');
                                        var contentBody = elm.find(".modal-body");
                                        contentBody.html(data);
                                        $compile(contentBody)(scope);

                                        elm.find(".saveBtn").click(function (event) {
                                            var form = elm.find('form');
                                            var data = form.serializeArray();
                                            var actionUrl = form.attr('action');
                                            contentBody.load(actionUrl, data);
                                        })
                                    }).
                            error(function (data, status, headers, config) {

                                  });


                        scope.dialogTemplate = 'RcmStandardDialogTemplate';
                        scope.title = rcmDialogService.strategy.title;
                        scope.loading = false;
                    };

                    return thisLink;
                }

                return {
                    restrict: 'A',
                    compile: thisCompile,
                    template: '<div ng-include="dialogTemplate">--{{dialogTemplate}}--</div>'
                }
            }
        ]
    );

/** </RcmDialog> */
rcm.addAngularModule('RcmDialog');