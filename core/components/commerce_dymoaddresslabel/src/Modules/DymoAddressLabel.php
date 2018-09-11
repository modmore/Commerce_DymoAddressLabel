<?php
namespace modmore\Commerce\DymoAddressLabel\Modules;

use modmore\Commerce\Admin\Widgets\Form\SelectField;
use modmore\Commerce\Events\Admin\GeneratorEvent;
use modmore\Commerce\Modules\BaseModule;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Twig\Loader\ChainLoader;
use Twig\Loader\FilesystemLoader;

require_once dirname(dirname(__DIR__)) . '/vendor/autoload.php';

class DymoAddressLabel extends BaseModule {

    public function getName()
    {
        $this->adapter->loadLexicon('commerce_dymoaddresslabel:default');
        return $this->adapter->lexicon('commerce_dymoaddresslabel');
    }

    public function getAuthor()
    {
        return 'modmore';
    }

    public function getDescription()
    {
        return $this->adapter->lexicon('commerce_dymoaddresslabel.description');
    }

    public function initialize(EventDispatcher $dispatcher)
    {
        // Load our lexicon
        $this->adapter->loadLexicon('commerce_dymoaddresslabel:default');

        // Add template path to twig
        /** @var ChainLoader $loader */
        $root = dirname(dirname(__DIR__));
        $loader = $this->commerce->twig->getLoader();
        $loader->addLoader(new FilesystemLoader($root . '/templates/'));

        $dispatcher->addListener(\Commerce::EVENT_DASHBOARD_INIT_GENERATOR, [$this, 'initGenerator']);
    }

    public function initGenerator(GeneratorEvent $event)
    {
        $generator = $event->getGenerator();

        $baseUrl = $this->adapter->getOption('commerce_dymoaddresslabel.assets_url', null,
            $this->adapter->getOption('assets_url') . 'components/commerce_dymoaddresslabel/');

        if ($this->getConfig('sdk_version') === '3.0') {
            $generator->addJavaScript($baseUrl . 'dist/dymo.label.framework.3.0.js');
        }
        else {
            $generator->addJavaScript($baseUrl . 'dist/dymo.label.framework.20170108.js');
        }
        $generator->addJavaScript($baseUrl . 'dist/dymo.js');

        $generator->addHTMLFragment('<script type="text/template" id="commerce-address-label">' . $this->commerce->twig->render('dymo/address.label') . '</script>');
    }

    public function getModuleConfiguration(\comModule $module)
    {
        $fields = [];

        $fields[] = new SelectField($this->commerce, [
            'name' => 'properties[sdk_version]',
            'label' => $this->adapter->lexicon('commerce_dymoaddresslabel.sdk_version'),
            'description' => $this->adapter->lexicon('commerce_dymoaddresslabel.sdk_version.desc'),
            'options' => [
                [
                    'label' => $this->adapter->lexicon('commerce_dymoaddresslabel.sdk_version.legacy'),
                    'value' => '',
                ],
                [
                    'label' => $this->adapter->lexicon('commerce_dymoaddresslabel.sdk_version.3.0'),
                    'value' => '3.0',
                ],
            ],
            'value' => $module->getProperty('sdk_version')
        ]);

        return $fields;
    }
}
