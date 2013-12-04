<?php
/**
 * Created by PhpStorm.
 * User: rmcnew
 * Date: 12/4/13
 * Time: 2:14 PM
 */

namespace RcmDoctrineJsonPluginStorageTest\Mock;

use RcmDoctrineJsonPluginStorage\Service\PluginStorageMgr;

class PluginStorageMock implements PluginStorageMgr
{

    protected $instanceConfigs = array();

    public function readInstance($instanceId)
    {
        return $this->instanceConfigs[$instanceId];
    }

    public function saveInstance($instanceId, $configData)
    {
        $this->instanceConfigs[$instanceId] = $configData;
    }

    public function deleteInstance($instanceId)
    {
        unset($this->instanceConfigs[$instanceId]);
    }
} 