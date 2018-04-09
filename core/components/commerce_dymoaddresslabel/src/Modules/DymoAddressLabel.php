<?php
namespace modmore\Commerce\DymoAddressLabel\Modules;
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

        $generator->addJavaScript($baseUrl . 'dist/dymo.label.framework.20170108.js');
        $generator->addJavaScript($baseUrl . 'dist/dymo.js');

        $generator->addHTMLFragment('<script type="text/template" id="commerce-address-label">' . $this->commerce->twig->render('dymo/address.label') . '</script>');
    }
}
