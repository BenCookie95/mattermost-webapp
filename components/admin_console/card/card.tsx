// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './card.scss';

type Props = {
    title: string | JSX.Element;
    subtitle: string | JSX.Element;
    body: string | JSX.Element;
    buttonText?: string| JSX.Element;
    onClick?: () => void;
};

const Card: React.FC<Props> = (props) => {
    
    return (
        <div className='Card__card'>
            <div className='Card__cardHeader'>
                <div className='Card__cardHeaderText'>
                    <div className='Card__cardHeaderText-top'>
                        {props.title}
                    </div>
                    <div className='Card__cardHeaderText-bottom'>
                        {props.subtitle}
                    </div>
                </div>
                {
                    props.buttonText && props.onClick ? 
                    <button
                        className='Card__cardHeaderButton primary'
                        onClick={props.onClick}
                    >
                        {props.buttonText}
                    </button>
                    :
                    ''
                }
                
            </div>
            <div className='Card__cardBody'>
                {props.body}
            </div>
        </div>
    );
};

export default Card;
