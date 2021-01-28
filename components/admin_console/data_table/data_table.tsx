// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import DataTableHeader from './data_table_header';
import DataTableRow from './data_table_row';

import 'components/next_steps_view/next_steps_view.scss';

import './data_table.scss';

export type Column = {
    name: string | JSX.Element;
    field: string;
    customClass?: string;
}

export type Row = {
    cells: {
        [key: string]: JSX.Element | string;
    };
    onClick?: () => void;
}

type Props = {
    rows: Row[];
    columns: Column[];
};

const DataTable: React.FC<Props> = (props) => {
    
    return (
        <table className='Table__table'>
            <DataTableHeader
                columns={props.columns}
            />
            {
                props.rows.map((row: Row) => {
                    return (
                        <DataTableRow
                            row={row}
                            columns={props.columns}
                        />
                    )
                })
            }
        </table>
    );
};

export default DataTable;
