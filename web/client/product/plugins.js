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
export default {
    plugins: {
        // product plugins
        AboutPlugin: require('./plugins/About').default,
        AttributionPlugin: require('./plugins/Attribution').default,
        ExamplesPlugin: require('./plugins/Examples').default,
        FooterPlugin: require('./plugins/Footer').default,
        ForkPlugin: require('./plugins/Fork').default,
        HeaderPlugin: require('./plugins/Header').default,
        HomeDescriptionPlugin: require('./plugins/HomeDescription').default,
        MadeWithLovePlugin: require('./plugins/MadeWithLove').default,
        MailingListsPlugin: require('./plugins/MailingLists').default,
        MapTypePlugin: require('./plugins/MapType').default,
        NavMenu: require('./plugins/NavMenu').default,
        // framework plugins
        AddGroupPlugin: require('../plugins/AddGroup').default,
        AnnotationsPlugin: require('../plugins/Annotations').default,
        AutoMapUpdatePlugin: require('../plugins/AutoMapUpdate').default,
        BackgroundSelectorPlugin: require('../plugins/BackgroundSelector').default,
        BurgerMenuPlugin: require('../plugins/BurgerMenu').default,
        CRSSelectorPlugin: require('../plugins/CRSSelector').default,
        ContentTabs: require('../plugins/ContentTabs').default,
        ContextPlugin: require('../plugins/Context').default,
        ContextCreatorPlugin: require('../plugins/ContextCreator').default,
        ContextManagerPlugin: require('../plugins/contextmanager/ContextManager').default,
        CookiePlugin: require('../plugins/Cookie').default,
        CreateNewMapPlugin: require('../plugins/CreateNewMap').default,
        Dashboard: require('../plugins/Dashboard').default,
        DashboardEditor: require('../plugins/DashboardEditor').default,
        DashboardsPlugin: require('../plugins/Dashboards').default,
        DetailsPlugin: require('../plugins/Details').default,
        DrawerMenuPlugin: require('../plugins/DrawerMenu').default,
        ExpanderPlugin: require('../plugins/Expander').default,
        FeatureEditorPlugin: require('../plugins/FeatureEditor').default,
        FeaturedMaps: require('../plugins/FeaturedMaps').default,
        FeedbackMaskPlugin: require('../plugins/FeedbackMask').default,
        FilterLayerPlugin: require('../plugins/FilterLayer').default,
        FloatingLegendPlugin: require('../plugins/FloatingLegend').default,
        FullScreenPlugin: require('../plugins/FullScreen').default,
        GeoStoryPlugin: require('../plugins/GeoStory').default,
        GeoStoriesPlugin: require('../plugins/GeoStories').default,
        GeoStoryEditorPlugin: require('../plugins/GeoStoryEditor').default,
        GeoStorySavePlugin: require('../plugins/GeoStorySave').GeoStorySave,
        GeoStorySaveAsPlugin: require('../plugins/GeoStorySave').GeoStorySaveAs,
        DashboardSavePlugin: require('../plugins/DashboardSave').DashboardSave,
        DashboardSaveAsPlugin: require('../plugins/DashboardSave').DashboardSaveAs,
        GeoStoryNavigationPlugin: require('../plugins/GeoStoryNavigation').default,
        GlobeViewSwitcherPlugin: require('../plugins/GlobeViewSwitcher').default,
        GoFull: require('../plugins/GoFull').default,
        GridContainerPlugin: require('../plugins/GridContainer').default,
        GroupManagerPlugin: require('../plugins/manager/GroupManager').default,
        HelpLinkPlugin: require('../plugins/HelpLink').default,
        HelpPlugin: require('../plugins/Help').default,
        HomePlugin: require('../plugins/Home').default,
        IdentifyPlugin: require('../plugins/Identify').default,
        LanguagePlugin: require('../plugins/Language').default,
        LayerInfoPlugin: require('../plugins/LayerInfo').default,
        LocatePlugin: require('../plugins/Locate').default,
        LoginPlugin: require('../plugins/Login').default,
        ManagerMenuPlugin: require('../plugins/manager/ManagerMenu').default,
        ManagerPlugin: require('../plugins/manager/Manager').default,
        MapEditorPlugin: require('../plugins/MapEditor').default,
        MapExportPlugin: require('../plugins/MapExport').default,
        MapFooterPlugin: require('../plugins/MapFooter').default,
        MapImportPlugin: require('../plugins/MapImport').default,
        MapLoadingPlugin: require('../plugins/MapLoading').default,
        MapPlugin: require('../plugins/Map').default,
        MapSearchPlugin: require('../plugins/MapSearch').default,
        MapsPlugin: require('../plugins/Maps').default,
        MapCatalogPlugin: require('../plugins/MapCatalog').default,
        MapTemplatesPlugin: require('../plugins/MapTemplates').default,
        MeasurePlugin: require('../plugins/Measure').default,
        MediaEditorPlugin: require('../plugins/MediaEditor').default,
        MetadataExplorerPlugin: require('../plugins/MetadataExplorer').default,
        MousePositionPlugin: require('../plugins/MousePosition').default,
        NotificationsPlugin: require('../plugins/Notifications').default,
        OmniBarPlugin: require('../plugins/OmniBar').default,
        PlaybackPlugin: require('../plugins/Playback.jsx').default,
        PrintPlugin: require('../plugins/Print').default,
        QueryPanelPlugin: require('../plugins/QueryPanel').default,
        RedirectPlugin: require('../plugins/Redirect').default,
        RedoPlugin: require('../plugins/History').default,
        RulesDataGridPlugin: require('../plugins/RulesDataGrid').default,
        RulesEditorPlugin: require('../plugins/RulesEditor').default,
        RulesManagerFooter: require('../plugins/RulesManagerFooter').default,
        SavePlugin: require('../plugins/Save').default,
        SaveAsPlugin: require('../plugins/SaveAs').default,
        SaveStoryPlugin: require('../plugins/GeoStorySave').default,
        ScaleBoxPlugin: require('../plugins/ScaleBox').default,
        ScrollTopPlugin: require('../plugins/ScrollTop').default,
        SearchPlugin: require('../plugins/Search').default,
        SearchServicesConfigPlugin: require('../plugins/SearchServicesConfig').default,
        SearchByBookmarkPlugin: require('../plugins/SearchByBookmark').default,
        SettingsPlugin: require('../plugins/Settings').default,
        SharePlugin: require('../plugins/Share').default,
        SnapshotPlugin: require('../plugins/Snapshot').default,
        StyleEditorPlugin: require('../plugins/StyleEditor').default,
        SwipePlugin: require('../plugins/Swipe').default,
        TOCItemsSettingsPlugin: require('../plugins/TOCItemsSettings').default,
        TOCPlugin: require('../plugins/TOC').default,
        ThematicLayerPlugin: require('../plugins/ThematicLayer').default,
        ThemeSwitcherPlugin: require('../plugins/ThemeSwitcher').default,
        TimelinePlugin: require('../plugins/Timeline').default,
        ToolbarPlugin: require('../plugins/Toolbar').default,
        TutorialPlugin: require('../plugins/Tutorial').default,
        UndoPlugin: require('../plugins/History').default,
        UserManagerPlugin: require('../plugins/manager/UserManager').default,
        UserExtensionsPlugin: require('../plugins/UserExtensions').default,
        UserSessionPlugin: require('../plugins/UserSession').default,
        VersionPlugin: require('../plugins/Version').default,
        WFSDownloadPlugin: require('../plugins/WFSDownload').default,
        WidgetsBuilderPlugin: require('../plugins/WidgetsBuilder').default,
        WidgetsPlugin: require('../plugins/Widgets').default,
        WidgetsTrayPlugin: require('../plugins/WidgetsTray').default,
        ZoomAllPlugin: require('../plugins/ZoomAll').default,
        ZoomInPlugin: require('../plugins/ZoomIn').default,
        ZoomOutPlugin: require('../plugins/ZoomOut').default
    },
    requires: {
        ReactSwipe: require('react-swipeable-views').default,
        SwipeHeader: require('../components/data/identify/SwipeHeader').default
    }
};
