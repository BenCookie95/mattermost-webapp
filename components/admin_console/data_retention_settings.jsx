// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {JobTypes} from 'utils/constants';
import * as Utils from 'utils/utils.jsx';
import ConfirmModal from 'components/confirm_modal';
import 'components/next_steps_view/next_steps_view.scss';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';
import Menu from 'components/widgets/menu/menu';

import AdminSettings from './admin_settings';
import Card from './card/card.tsx';
import JobsTable from './jobs';
import SettingsGroup from './settings_group.jsx';
import DataTable, {Row, Column} from './data_table/data_table';
import TextSetting from './text_setting';

import './billing/billing_history.scss';

export default class DataRetentionSettings extends AdminSettings {
    getConfigFromState = (config) => {
        config.DataRetentionSettings.EnableMessageDeletion = this.state.enableMessageDeletion === 'true';
        config.DataRetentionSettings.EnableFileDeletion = this.state.enableFileDeletion === 'true';
        config.DataRetentionSettings.MessageRetentionDays = parseInt(this.state.messageRetentionDays, 10);
        config.DataRetentionSettings.FileRetentionDays = parseInt(this.state.fileRetentionDays, 10);
        config.DataRetentionSettings.DeletionJobStartTime = this.state.deletionJobStartTime;

        return config;
    }

    getStateFromConfig(config) {
        return {
            enableMessageDeletion: String(config.DataRetentionSettings.EnableMessageDeletion),
            enableFileDeletion: String(config.DataRetentionSettings.EnableFileDeletion),
            messageRetentionDays: config.DataRetentionSettings.MessageRetentionDays,
            fileRetentionDays: config.DataRetentionSettings.FileRetentionDays,
            deletionJobStartTime: config.DataRetentionSettings.DeletionJobStartTime,
            showConfirmModal: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({showConfirmModal: true});
    };

    handleSaveConfirmed = () => {
        this.setState({showConfirmModal: false});

        this.doSubmit();
    };

    handleSaveCanceled = () => {
        this.setState({showConfirmModal: false});
    };

    renderConfirmModal = () => {
        const title = (
            <FormattedMessage
                id='admin.data_retention.confirmChangesModal.title'
                defaultMessage='Confirm data retention policy'
            />
        );

        const messageList = [];

        if (this.state.enableMessageDeletion === 'true') {
            messageList.push(
                <FormattedMessage
                    id='admin.data_retention.confirmChangesModal.description.itemMessageDeletion'
                    defaultMessage='All messages will be permanently deleted after {days} days.'
                    values={{
                        days: (
                            <strong>
                                {this.state.messageRetentionDays}
                            </strong>
                        ),
                    }}
                />,
            );
        } else {
            messageList.push(
                <FormattedMessage
                    id='admin.data_retention.confirmChangesModal.description.itemMessageIndefinite'
                    defaultMessage='All messages will be retained indefinitely.'
                />,
            );
        }

        if (this.state.enableFileDeletion === 'true') {
            messageList.push(
                <FormattedMessage
                    id='admin.data_retention.confirmChangesModal.description.itemFileDeletion'
                    defaultMessage='All files will be permanently deleted after {days} days.'
                    values={{
                        days: (
                            <strong>
                                {this.state.fileRetentionDays}
                            </strong>
                        ),
                    }}
                />,
            );
        } else {
            messageList.push(
                <FormattedMessage
                    id='admin.data_retention.confirmChangesModal.description.itemFileIndefinite'
                    defaultMessage='All files will be retained indefinitely.'
                />,
            );
        }

        const message = (
            <div>
                <p>
                    <FormattedMessage
                        id='admin.data_retention.confirmChangesModal.description'
                        defaultMessage='Are you sure you want to apply the following data retention policy:'
                    />
                </p>
                <ul>
                    {messageList.map((item, index) => {
                        return <li key={index}>{item}</li>;
                    })}
                </ul>
                <p>
                    <FormattedMessage
                        id='admin.data_retention.confirmChangesModal.clarification'
                        defaultMessage='Once deleted, messages and files cannot be retrieved.'
                    />
                </p>
            </div>
        );

        const confirmButton = (
            <FormattedMessage
                id='admin.data_retention.confirmChangesModal.confirm'
                defaultMessage='Confirm Settings'
            />
        );

        return (
            <ConfirmModal
                show={this.state.showConfirmModal}
                title={title}
                message={message}
                confirmButtonText={confirmButton}
                onConfirm={this.handleSaveConfirmed}
                onCancel={this.handleSaveCanceled}
            />
        );
    }

    renderTitle() {
        return (
            <FormattedMessage
                id='admin.data_retention.title'
                defaultMessage='Data Retention Policy'
            />
        );
    }
    getGlobalPolicyColumns = () => {
        return [
            {
                name: (
                    <FormattedMessage
                        id='admin.data_retention.globalPoliciesTable.description'
                        defaultMessage='Description'
                    />
                ),
                field: 'description',
            },
            {
                name: (
                    <FormattedMessage
                        id='admin.data_retention.globalPoliciesTable.channelMessages'
                        defaultMessage='Channel messages'
                    />
                ),
                field: 'channel_messages',
            },
            {
                name: (
                    <FormattedMessage
                        id='admin.data_retention.globalPoliciesTable.files'
                        defaultMessage='Files'
                    />
                ),
                field: 'files',
            },
            {
                name: '',
                field: 'actions',
                customClass: 'Table__table-icon'
            },
        ];
    }
    getGlobalPolicyRows = () => {
        // Global policy data
        const data = [
            {
                description: "Applies to all teams and channels, but does not apply to custom retention policies.",
                channel_messages: "Keep forever",
                files: "Keep forever",
            },
        ]

        return data.map((policy) => {
            return {
                cells: {
                    description: policy.description,
                    channel_messages: policy.channel_messages,
                    files: policy.files,
                    actions: (
                        <MenuWrapper
                            isDisabled={false}
                        >
                            <div className='text-right'>
                                <a>
                                    <i className='icon icon-dots-vertical'/>
                                </a>
                            </div>
                            <Menu
                                openLeft={false}
                                openUp={false}
                                ariaLabel={'User Actions Menu'}
                            >
                                <Menu.ItemAction
                                    show={true}
                                    onClick={() => {}}
                                    text={'Edit'}
                                    disabled={false}
                                />
                            </Menu>
                        </MenuWrapper>
                    ),
                },
            };
        });
    }
    getCustomPolicyColumns = () => {
        return [
            {
                name: (
                    <FormattedMessage
                        id='admin.data_retention.customPoliciesTable.description'
                        defaultMessage='Description'
                    />
                ),
                field: 'description',
            },
            {
                name: (
                    <FormattedMessage
                        id='admin.data_retention.customPoliciesTable.channelMessages'
                        defaultMessage='Channel messages'
                    />
                ),
                field: 'channel_messages',
            },
            {
                name: (
                    <FormattedMessage
                        id='admin.data_retention.customPoliciesTable.appliedTo'
                        defaultMessage='Applied to'
                    />
                ),
                field: 'applied_to',
            },
            {
                name: '',
                field: 'actions',
                customClass: 'Table__table-icon'
            },
        ];
    }
    getCustomPolicyRows = () => {
        // Custom policy data
        const data = [
            {
                description: "60 day policy",
                channel_messages: "60 days",
                applied_to: "2 teams, 4 channels",
            },
            {
                description: "Yearly policy",
                channel_messages: "1 year",
                applied_to: "17 teams",
            },
        ]

        return data.map((policy, i) => {
            return {
                cells: {
                    description: policy.description,
                    channel_messages: policy.channel_messages,
                    applied_to: policy.applied_to,
                    actions: (
                        <MenuWrapper
                            isDisabled={false}
                        >
                            <div className='text-right'>
                                <a>
                                    <i className='icon icon-dots-vertical'/>
                                </a>
                            </div>
                            <Menu
                                openLeft={false}
                                openUp={false}
                                ariaLabel={'User Actions Menu'}
                            >
                                <Menu.ItemAction
                                    show={true}
                                    onClick={() => {}}
                                    text={'Edit'}
                                    disabled={false}
                                />
                                <Menu.ItemAction
                                    show={true}
                                    onClick={() => {}}
                                    text={'Delete'}
                                    disabled={false}
                                />
                            </Menu>
                        </MenuWrapper>
                    ),
                },
            };
        });
    }

    renderSettings = () => {
        const enableMessageDeletionOptions = [
            {value: 'false', text: Utils.localizeMessage('admin.data_retention.keepMessagesIndefinitely', 'Keep all messages indefinitely')},
            {value: 'true', text: Utils.localizeMessage('admin.data_retention.keepMessageForTime', 'Keep messages for a set amount of time')},
        ];

        const enableFileDeletionOptions = [
            {value: 'false', text: Utils.localizeMessage('admin.data_retention.keepFilesIndefinitely', 'Keep all files indefinitely')},
            {value: 'true', text: Utils.localizeMessage('admin.data_retention.keepFilesForTime', 'Keep files for a set amount of time')},
        ];

        let messageRetentionDaysSetting = '';
        if (this.state.enableMessageDeletion === 'true') {
            messageRetentionDaysSetting = (
                <TextSetting
                    id='messageRetentionDays'
                    label={<span/>}
                    placeholder={Utils.localizeMessage('admin.data_retention.messageRetentionDays.example', 'E.g.: "60"')}
                    helpText={
                        <FormattedMessage
                            id='admin.data_retention.messageRetentionDays.description'
                            defaultMessage='Set how many days messages are kept in Mattermost. Messages, including file attachments older than the duration you set will be deleted nightly. The minimum time is one day.'
                        />
                    }
                    value={this.state.messageRetentionDays}
                    onChange={this.handleChange}
                    setByEnv={this.isSetByEnv('DataRetentionSettings.MessageRetentionDays')}
                    disabled={this.props.isDisabled}
                />
            );
        }

        let fileRetentionDaysSetting = '';
        if (this.state.enableFileDeletion === 'true') {
            fileRetentionDaysSetting = (
                <TextSetting
                    id='fileRetentionDays'
                    label={<span/>}
                    placeholder={Utils.localizeMessage('admin.data_retention.fileRetentionDays.example', 'E.g.: "60"')}
                    helpText={
                        <FormattedMessage
                            id='admin.data_retention.fileRetentionDays.description'
                            defaultMessage='Set how many days file uploads are kept in Mattermost. Files older than the duration you set will be deleted nightly. The minimum time is one day.'
                        />
                    }
                    value={this.state.fileRetentionDays}
                    onChange={this.handleChange}
                    setByEnv={this.isSetByEnv('DataRetentionSettings.FileRetentionDays')}
                    disabled={this.props.isDisabled}
                />
            );
        }

        const confirmModal = this.renderConfirmModal();

        return (
            <SettingsGroup>
                <Card
                    title={
                        <FormattedMessage
                            id='admin.data_retention.globalPolicy.title'
                            defaultMessage='Global retention policy'
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id='admin.data_retention.globalPolicy.subTitle'
                            defaultMessage='Keep messages and files for a set amount of time.'
                        />
                    }
                    body={
                        <DataTable 
                            columns={this.getGlobalPolicyColumns()}
                            rows={this.getGlobalPolicyRows()}
                        />
                    }
                />
                <Card
                    title={
                        <FormattedMessage
                            id='admin.data_retention.customPolicies.title'
                            defaultMessage='Custom retention policies'
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id='admin.data_retention.customPolicies.subTitle'
                            defaultMessage='Customize how long specific teams and channels will keep messages.'
                        />
                    }
                    buttonText={
                        <FormattedMessage
                            id='admin.data_retention.customPolicies.addPolicy'
                            defaultMessage='Add policy'
                        />
                    }
                    body ={
                        <DataTable 
                            columns={this.getCustomPolicyColumns()}
                            rows={this.getCustomPolicyRows()}
                        />
                    }
                />

                <div className='BillingHistory__card'>
                    <div className='BillingHistory__cardHeader'>
                        <div className='BillingHistory__cardHeaderText'>
                            <div className='BillingHistory__cardHeaderText-top'>
                                <FormattedMessage
                                    id='admin.data_retention.jobCreation.title'
                                    defaultMessage='Policy log'
                                />
                            </div>
                            <div className='BillingHistory__cardHeaderText-bottom'>
                                <FormattedMessage
                                    id='admin.data_retention.jobCreation.subTitle'
                                    defaultMessage='Daily log of messages and files removed based on the policies defined above.'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='BillingHistory__cardBody'>
                        <JobsTable
                            jobType={JobTypes.DATA_RETENTION}
                            disabled={this.state.enableMessageDeletion !== 'true' && this.state.enableFileDeletion !== 'true'}
                            createJobButtonText={
                                <FormattedMessage
                                    id='admin.data_retention.createJob.title'
                                    defaultMessage='Run Deletion Job Now'
                                />
                            }
                            createJobHelpText={
                                <FormattedMessage
                                    id='admin.data_retention.createJob.help'
                                    defaultMessage='Initiates a Data Retention deletion job immediately.'
                                />
                            }
                        />
                    </div>
                </div>
                
            </SettingsGroup>
        );
    }
}
