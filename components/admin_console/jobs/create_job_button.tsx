// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';

type Props = {
    disabled: boolean;
    createJobButtonText: string;
};

const CreateJobButton: React.FC<Props> = (props) => {
    const handleCreateJob = useCallback((e) => {
        e.preventDefault();
        const job = {
            type: this.props.jobType,
        };

        await this.props.actions.createJob(job);
        this.reload();
      }, []);
    
    return (
        <div>
            <button
                type='button'
                className='btn btn-default'
                onClick={handleCreateJob}
                disabled={props.disabled}
            >
                {props.createJobButtonText}
            </button>
        </div>
    );
};

export default CreateJobButton;
