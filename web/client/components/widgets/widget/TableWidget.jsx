/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import Message from '../../I18N/Message';
import BorderLayout from '../../layout/BorderLayout';
import LoadingSpinner from '../../misc/LoadingSpinner';
import EmptyRowsView from '../../data/featuregrid/EmptyRowsView';
import loadingState from '../../misc/enhancers/loadingState';
import errorChartState from '../enhancers/errorChartState';
import { getWidgetFilterRenderers } from '../../../plugins/widgets/getWidgetFilterRenderers';

const FeatureGrid = errorChartState(loadingState(({ describeFeatureType }) => !describeFeatureType)(require('../../data/featuregrid/FeatureGrid')));

import WidgetContainer from './WidgetContainer';

export default getWidgetFilterRenderers(({
    id,
    title,
    loading,
    confirmDelete = false,
    enableColumnFilters = false,
    headerStyle,
    icons,
    topRightItems,
    toggleDeleteConfirm = () => { },
    onDelete = () => { },
    gridEvents = () => {},
    pageEvents = {
        moreFeatures: () => {}
    },
    describeFeatureType,
    filterRenderers,
    columnSettings,
    features,
    size,
    pages,
    error,
    pagination = {},
    virtualScroll = true
}) =>
    (<WidgetContainer
        id={`widget-chart-${id}`}
        title={title}
        headerStyle={headerStyle}
        icons={icons}
        confirmDelete={confirmDelete}
        onDelete={onDelete}
        toggleDeleteConfirm={toggleDeleteConfirm}
        topRightItems={topRightItems}>
        <BorderLayout
            footer={pagination.totalFeatures ? (
                <div style={{ height: "30px", overflow: "hidden"}}>
                    {loading ? <span style={{ "float": "right"}}><LoadingSpinner /></span> : null}
                    {error === undefined &&
                    <span style={{ "float": "left", margin: "5px" }} ><Message
                        msgId={"featuregrid.resultInfoVirtual"}
                        msgParams={{ total: pagination.totalFeatures }} /></span>}
                </div>) : null}
        >
            <FeatureGrid
                emptyRowsView={() => <EmptyRowsView loading={loading} />}
                gridEvents={gridEvents}
                sortable
                defaultSize={false}
                columnSettings={columnSettings}
                pageEvents={pageEvents}
                virtualScroll={virtualScroll}
                enableColumnFilters={enableColumnFilters}
                filterRenderers={filterRenderers}
                features={features}
                pages={pages}
                error={error}
                size={size}
                rowKey="id"
                describeFeatureType={describeFeatureType}
                pagination={pagination} />
        </BorderLayout>
    </WidgetContainer>

    ));
