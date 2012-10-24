<?php
    /**
     * Index Controller for the entire application
     *
     * This file contains the main controller used for the application.  This
     * should extend from the base class and should need no further modification.
     *
     * PHP version 5.3
     *
     * LICENSE: No License yet
     *
     * @category  Reliv
     * @package   Main\Application\Controllers\Index
     * @author    Unkown <unknown@relivinc.com>
     * @copyright 2012 Reliv International
     * @license   License.txt New BSD License
     * @version   GIT: <git_id>
     * @link      http://ci.reliv.com/confluence
     */
namespace RcmLogin\Controller;

use \Rcm\Controller\BaseController;

/**
 * Login Controller for the login Plugin
 *
 * This is main controller used for the application.  This should extend from
 * the base class located in Rcm and should need no further
 * modification.
 *
 * @category  Reliv
 * @package   Main\Application\Controllers\Index
 * @author    Westin Shafer <wshafer@relivinc.com>
 * @copyright 2012 Reliv International
 * @license   License.txt New BSD License
 * @version   Release: 1.0
 * @link      http://ci.reliv.com/confluence
 *
 */
class LoginController extends BaseController
{
    public function loginAuthAction()
    {
        /** @var \Zend\Stdlib\Parameters $posted  */
        $username = $this->getRequest()->getPost()->get('userName');
        $password = $this->getRequest()->getPost()->get('loginPass');

        if (empty($username) || empty($password)) {
            return $this->redirectInvalid();
        }

        /** @var \Rcm\Model\UserManagement\DoctrineUserManager $userManager  */
        $userManager = $this->getServiceLocator()->get('rcmUserManager');

        //try {
            if (!$userManager->login($username, $password)) {
                return $this->redirectInvalid();
            }

            return $this->redirect()->toRoute(
                'contentManager',
                array(
                    'page' => 'index',
                    'language' => $this->siteInfo->getLanguage()->getLanguage()
                )
            )->setStatusCode(301);
        //} catch (\Exception $e) {
        return     $this->redirectApiFailure();
        //}
    }

    private function redirectInvalid()
    {
        $url = $this->url()->fromRoute('contentManager', array(
                'page' => 'login',
                'language' => $this->siteInfo->getLanguage()->getLanguage(),
            )
        );

        $url .= '?rcmLoginError=invalid';

        return $this->redirect()->toUrl($url)->setStatusCode(301);
    }

    private function redirectApiFailure() {
        $url = $this->url()->fromRoute('contentManager', array(
                'page' => 'login',
                'language' => $this->siteInfo->getLanguage()->getLanguage(),
            )
        );

        $url .= '?rcmLogapiFailure=invalid';

        return $this->redirect()->toUrl($url)->setStatusCode(301);
    }
}