<?php

namespace RcmJavaSciptLib\View\Helper;

use Zend\View\Helper\AbstractHelper;

/**
 * Class IncludeCoreJs
 *
 * Include standard JS libraries
 *
 * PHP version 5
 *
 * @category  Reliv
 * @package   RcmTinyMce\View\Helper
 * @author    James Jervis <jjervis@relivinc.com>
 * @copyright ${YEAR} Reliv International
 * @license   License.txt New BSD License
 * @version   Release: <package_version>
 * @link      https://github.com/reliv
 */
class IncludeCoreJs extends AbstractHelper
{
    /**
     * __invoke
     *
     * @return void
     */
    public function __invoke()
    {
        $this->inject();

        return;
    }

    /**
     * inject
     *
     * @return void
     */
    protected function inject()
    {
        $view = $this->getView();

        /** @var \Zend\View\Helper\HeadScript $headScript */
        $headScript = $view->headScript();

        /* <CORE_JS_FILES> */
        $headScript()->prependFile(
            $view->basePath() . '/modules/rcm-angular-js/ocLazyLoad/dist/ocLazyLoad.js'
        );
        $headScript()->prependFile(
            $view->basePath() . '/modules/rcm-js-lib/rcm-core/rcm-core.js'
        );
        $headScript()->prependFile(
            $view->basePath() . '/modules/rcm-angular-js/angular/angular-sanitize.min.js'
        );
        $headScript()->prependFile(
            $view->basePath() . '/modules/rcm-angular-js/angular/angular.js'
        );
        $headScript()->prependFile(
            $view->basePath() . '/modules/rcm-jquery/jquery-ui-1.10.4.custom/js/jquery-1.10.2.js'
        );
        $headScript()->prependFile(
            $view->basePath() . '/modules/rcm-js-lib/es5-shim-master/es5-shim-min.js'
        );
        /* </CORE_JS_FILES> */
    }
}
