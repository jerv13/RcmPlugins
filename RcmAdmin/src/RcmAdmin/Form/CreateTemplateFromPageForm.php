<?php
/**
 * Create Template from Page Zend Form Definition
 *
 * This file contains the Create Template from Page Zend Form Definition
 *
 * PHP version 5.3
 *
 * LICENSE: BSD
 *
 * @category  Reliv
 * @package   RcmAdmin
 * @author    Westin Shafer <wshafer@relivinc.com>
 * @copyright 2014 Reliv International
 * @license   License.txt New BSD License
 * @version   GIT: <git_id>
 * @link      https://github.com/reliv
 */
namespace RcmAdmin\Form;

use Rcm\Repository\Page;
use Rcm\Validator\Page as PageValidator;
use Zend\Form\ElementInterface;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

/**
 * Create Template from Page Zend Form Definition
 *
 * Create Template from Page Zend Form Definition
 *
 * @category  Reliv
 * @package   RcmAdmin
 * @author    Westin Shafer <wshafer@relivinc.com>
 * @copyright 2012 Reliv International
 * @license   License.txt New BSD License
 * @version   Release: 1.0
 * @link      https://github.com/reliv
 */
class CreateTemplateFromPageForm extends Form implements ElementInterface
{

    /** @var \Rcm\Repository\Page */
    protected $pageRepo;

    /** @var \Rcm\Validator\Page */
    protected $pageValidator;

    /**
     * Constructor
     *
     * @param Page $pageRepo Rcm Page Repository
     * @param PageValidator $pageValidator     Zend Page Validator
     */
    public function __construct(
        Page $pageRepo,
        PageValidator $pageValidator
    ) {
        $this->pageRepo      = $pageRepo;
        $this->pageValidator = $pageValidator;

        parent::__construct();
    }

    /**
     * Initialize the form
     *
     * @return void
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function init()
    {
        $filter = new InputFilter();

        $this->add(
            array(
                'name' => 'template-name',
                'options' => array(
                    'label' => 'Template Name',
                ),
                'type' => 'text',

            )
        );

        $filter->add(
            array(
                'name' => 'template-name',
                'required' => true,
                'filters' => array(
                    array('name' => 'StripTags'),
                    array(
                        'name' => 'StringTrim',
                        'options' => array(
                            'charlist' => '-_',
                        )
                    ),
                ),
                'validators' => array(
                    $this->pageValidator,
                ),
            )
        );
    }

    /**
     * Is Valid method for the new page form.  Adds a validation group
     * depending on if it's a new page or a copy of a template.
     *
     * @return bool
     */
    public function isValid()
    {

        $this->setValidationGroup(
            array(
                'template-name'
            )
        );

        return parent::isValid();
    }
}