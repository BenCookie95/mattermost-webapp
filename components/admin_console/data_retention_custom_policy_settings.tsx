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

import AdminSettings, {BaseProps, BaseState} from './admin_settings';
import Card from './card/card.tsx';
import ChannelsList from 'components/admin_console/team_channel_settings/channel/list';
import TeamList from 'components/admin_console/team_channel_settings/team/list';
import SettingsGroup from './settings_group.jsx';
import TeamSelectorModal from 'components/team_selector_modal';
import ChannelSelectorModal from 'components/channel_selector_modal';
import TextSetting from './text_setting';


type Props = BaseProps & {
    
};

type State = BaseState & {
    addTeamOpen: boolean;
    addChannelOpen: boolean;
    saveNeeded: boolean;
    saving: boolean;
    serverError: JSX.Element | string | null;
    errorTooltip: boolean;
}

export default class DataRetentionCustomPolicySettings extends AdminSettings<Props, State>  {
    constructor(props: Props) {
        super(props);
        this.state = {
            addTeamOpen: false,
            addChannelOpen: false,
            saveNeeded: false,
            saving: false,
            serverError: null,
            errorTooltip: false,
        };
    }

    getConfigFromState = (config: Props['config']) => {
        return config;
    }

    getStateFromConfig(config: Props['config']) {
        return {};
    }

    renderTitle() {
        return (
            <FormattedMessage
                id='admin.data_retention.title'
                defaultMessage='Data Retention Policy'
            />
        );
    }
    openAddChannel = () => {
        this.setState({addChannelOpen: true});
    }

    closeAddChannel = () => {
        this.setState({addChannelOpen: false});
    }

    openAddTeam = () => {
        this.setState({addTeamOpen: true});
    }

    closeAddTeam = () => {
        this.setState({addTeamOpen: false});
    }

    renderSettings = () => {
        return (
            <SettingsGroup>
                <Card
                    title={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.form.title'
                            defaultMessage='Name and retention'
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.form.subTitle'
                            defaultMessage='Give your policy a name and configure retention settings.'
                        />
                    }
                    body={
                        ''
                    }
                />
                {this.state.addTeamOpen &&
                    <TeamSelectorModal
                        onModalDismissed={this.closeAddTeam}
                        onTeamsSelected={() => {}}
                    />
                }
                <Card
                    title={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.team_selector.title'
                            defaultMessage='Assigned teams'
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.team_selector.subTitle'
                            defaultMessage='Add teams that will follow this retention policy.'
                        />
                    }
                    buttonText={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.team_selector.addTeams'
                            defaultMessage='Add teams'
                        />
                    }
                    body ={
                        <TeamList />
                    }
                    onClick={this.openAddTeam}
                />
                {this.state.addChannelOpen &&
                    <ChannelSelectorModal
                        onModalDismissed={this.closeAddChannel}
                        onChannelsSelected={() => {}}
                        groupID={''}
                    />
                }
                <Card
                    title={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.channel_selector.title'
                            defaultMessage='Assigned channels'
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.channel_selector.subTitle'
                            defaultMessage='Add channels that will follow this retention policy.'
                        />
                    }
                    buttonText={
                        <FormattedMessage
                            id='admin.data_retention.custom_policy.channel_selector.addChannels'
                            defaultMessage='Add channels'
                        />
                    }
                    body ={
                        <ChannelsList />
                    }
                    onClick={this.openAddChannel}
                /> 
                
            </SettingsGroup>
        );
    }
}
