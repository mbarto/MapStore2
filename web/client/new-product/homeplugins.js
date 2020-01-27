/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
  * Please, keep them sorted alphabetically
 */

import MapsPlugin from "../plugins/Maps";
import HomeDescriptionPlugin from "../product/plugins/HomeDescription";
import ForkPlugin from "../product/plugins/Fork";
import MapSearchPlugin from "../plugins/MapSearch";
import CreateNewMapPlugin from "../plugins/CreateNewMap";
import FeaturedMapsPlugin from "../plugins/FeaturedMaps";
import ContentTabsPlugin from "../plugins/ContentTabs";
import MalinigListsPlugin from "../product/plugins/MailingLists";
import {FooterPlugin} from "../product/plugins/Footer";
import DashboardsPlugin from "../plugins/Dashboards";
import GeoStoriesPlugin from "../plugins/GeoStories";
import ContextsPlugin from "../plugins/Context";
import CookiePlugin from "../plugins/Cookie";
import OmniBarPlugin from "../plugins/OmniBar";
import ManagerMenuPlugin from "../plugins/manager/ManagerMenu";
import LoginPlugin from "../plugins/Login";
import LanguagePlugin from "../plugins/Language";
import NavMenuPlugin from "../product/plugins/NavMenu";
import AttributionPlugin from "../product/plugins/Attribution";
import ScrollTopPlugin from "../plugins/ScrollTop";
import NotificationsPlugin from "../plugins/Notifications";

export default {
    plugins: {
        MapsPlugin,
        HomeDescriptionPlugin,
        ForkPlugin,
        MapSearchPlugin,
        CreateNewMapPlugin,
        FeaturedMapsPlugin,
        ContentTabsPlugin,
        MalinigListsPlugin,
        FooterPlugin,
        DashboardsPlugin,
        GeoStoriesPlugin,
        ContextsPlugin,
        CookiePlugin,
        OmniBarPlugin,
        ManagerMenuPlugin,
        LoginPlugin,
        LanguagePlugin,
        NavMenuPlugin,
        AttributionPlugin,
        ScrollTopPlugin,
        NotificationsPlugin
    },
    requires: {}
};

