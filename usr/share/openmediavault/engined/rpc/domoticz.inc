<?php
/**
 * Copyright (C) 2015-2017 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
class OMVRpcServiceDomoticz extends \OMV\Rpc\ServiceAbstract
{
    public function getName()
    {
        return 'Domoticz';
    }

    public function initialize()
    {
        $this->registerMethod('getSettings');
        $this->registerMethod('setSettings');
    }

    public function getSettings($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.domoticz');
        return $object->getAssoc();
    }

    public function setSettings($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.domoticz.setsettings');
        // Get the existing configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.domoticz');
        $object->setAssoc($params);
        // Check for validity
        if (($object->get('httpenable') !== TRUE) && ($object->get('httpsenable') !== TRUE)){
            throw new \OMV\ConstraintException('Neither HTTP nor HTTPS service is enabled');
        }
        // Check if ports are identical
        if ($object->get('httpport') === $object->get('httpsport')) {
            throw new \OMV\ConstraintException('HTTP and HTTPS ports are identical');
        }
        // Generate new daemon paramter
        $daemon = 'ExecStart=/opt/domoticz/domoticz -daemon';
        $daemon .= ' -www ' . ($object->get('httpenable') === TRUE ? $object->get('httpport') : '0');
        $daemon .= ' -sslwww ' . ($object->get('httpsenable') === TRUE ? $object->get('httpsport') : '0');
        $daemon .= PHP_EOL;
        $data = file('/lib/systemd/system/domoticz.service');
        $data = array_map(function($data) use ($daemon) {
            return stristr($data,'ExecStart') ? $daemon : $data;
        }, $data);
        file_put_contents('/lib/systemd/system/domoticz.service', implode('', $data));
        $db->set($object);
        // Return the configuration object.
        return $object->getAssoc();
    }
}
