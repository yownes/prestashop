<?php
/**
  * 2019 (c) VueFront
 * 2020 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    VueFront, Yownes
 * @copyright Copyright (c) permanent, VueFront
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 *
 * @version   0.1.0
 */

class ResolverCommonHome extends Resolver
{
    public function get()
    {
        $meta_info = Meta::getMetaByPage('index', $this->context->language->id);

        return array(
            'meta' => array(
                'title' => $meta_info['title'],
                'description' => $meta_info['description'],
                'keyword' => $meta_info['keywords'],
            ),
        );
    }
}
