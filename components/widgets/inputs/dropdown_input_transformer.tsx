// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState, CSSProperties, useEffect, useRef} from 'react';
import ReactSelect, {Props as SelectProps, ActionMeta, components} from 'react-select';
import classNames from 'classnames';

import 'components/input.css';
import './dropdown_input_transformer.scss';

type ValueType = {
    label: string;
    value: string;
}

type Props<T> = Omit<SelectProps<T>, 'onChange'> & {
    value?: T;
    legend?: string;
    error?: string;
    onDropdownChange: (value: T, action: ActionMeta<T>) => void;
    onInputChange: (value: T, action: ActionMeta<T>) => void;
};

const baseStyles = {
    input: (provided: CSSProperties) => ({
        ...provided,
        color: 'var(--center-channel-color)',
    }),
    control: (provided: CSSProperties) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none',
        padding: '0 2px',
        cursor: 'pointer',
    }),
    indicatorSeparator: (provided: CSSProperties) => ({
        ...provided,
        display: 'none',
    }),
};



const IndicatorsContainer = (props: any) => {
    return (
        <div className='DropdownInput__indicatorsContainer'>
            <components.IndicatorsContainer {...props}>
                <i className='icon icon-chevron-down'/>
            </components.IndicatorsContainer>
        </div>
    );
};

const Control = (props: any) => {
    return (
        <div className='DropdownInput__controlContainer'>
            <components.Control {...props}/>
        </div>
    );
};

const Option = (props: any) => {
    return (
        <div
            className={classNames('DropdownInput__option', {
                selected: props.isSelected,
                focused: props.isFocused,
            })}
        >
            <components.Option {...props}/>
        </div>
    );
};

const renderError = (error?: string) => {
    if (!error) {
        return null;
    }

    return (
        <div className='Input___error'>
            <i className='icon icon-alert-outline'/>
            <span>{error}</span>
        </div>
    );
};
const DropdownInputTransformer: React.FC<Props> = (props) => {
    const {value, placeholder, className, addon, name, textPrefix, legend, onDropdownChange, onInputChange, styles, options, error, exceptionToInput, width, inputValue, ...otherProps} = props;

    const [focused, setFocused] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const previousValue = usePrevious(showInput);

    useEffect(() => {
        if ((!previousValue && showInput)) {
            inputRef.current.focus();
        }
    });

    // Hook
    function usePrevious (val) {
        // The ref object is a generic container whose current property is mutable ...
        // ... and can hold any value, similar to an instance property on a class
        const ref = useRef();

        // Store current value in ref
        useEffect(() => {
            ref.current = val;
        }, [val]); // Only re-run if value changes

        // Return previous value (happens before update in useEffect above)
        return ref.current;
    }

    const inputRef: any = React.createRef();

    const menuStyles = {
        menu: (provided: CSSProperties) => ({
            ...provided,
            width: `${width}px`,
            left: `-${width - width/4}px`
        }),
    }

    const getMenuStyles = () => {
        if (showInput) {
            return menuStyles;
        }
        return {};
    }

    const onInputFocus = (event: React.FocusEvent<HTMLElement>) => {
        const {onFocus} = props;

        setFocused(true);

        if (onFocus) {
            onFocus(event);
        }
    };

    const onInputBlur = (event: React.FocusEvent<HTMLElement>) => {
        const {onBlur} = props;

        setFocused(false);

        if (onBlur) {
            onBlur(event);
        }
    };
    const onValueChange = async (event: React.FocusEvent<HTMLElement>) => {
        const {onDropdownChange, value} = props;
        if (event.value != value) {
            showTextInput(event.value);
        }

        if (onDropdownChange) {
            await onDropdownChange(event);
        }
    };
    
    // We want to show the text input when we have a dropdown value selected and 
    const showTextInput = (val) => {
        if (val === '' || exceptionToInput.includes(val)) {
            setShowInput(false);
        } else {
            setShowInput(true);
        }
    }

    const showLegend = Boolean(focused || value);
    return (
        <div 
            className='DropdownInput Input_container'
            style={{
                width: `${width}px`
            }}
        >
            <fieldset
                className={classNames('Input_fieldset', className, {
                    Input_fieldset___error: error,
                    Input_fieldset___legend: showLegend,
                    Input_fieldset___split: showInput,
                })}
            >
                <legend className={classNames('Input_legend', {Input_legend___focus: showLegend})}>
                    {showLegend ? (legend || placeholder) : null}
                </legend>
                <div
                    className='Input_wrapper'
                    style={{
                        display: showInput ? 'inline-block' : 'none',
                        width: `calc(100% - ${width/4}px)`
                    }}
                >
                    <input
                        name='channel_message_retention_input'
                        type='text'
                        value={inputValue}
                        onChange={onInputChange}
                        placeholder={placeholder}
                        required={false}
                        className={classNames('Input form-control')}
                        ref={inputRef}
                    />
                </div>
                <div
                    className='Input_wrapper'
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    style={{ 
                        display: 'inline-block',
                        width: showInput ? `${width/4}px` : '100%' ,
                    }}
                >
                    <ReactSelect
                        id={`DropdownInput_${name}`}
                        options={options}
                        placeholder={focused ? '' : placeholder}
                        components={{
                            IndicatorsContainer,
                            Option,
                            Control,
                        }}
                        className={classNames('Input', className, {Input__focus: showLegend})}
                        classNamePrefix={'DropDown'}
                        onChange={onValueChange}
                        styles={{...baseStyles, ...styles, ...getMenuStyles()}}
                        {...otherProps}
                    />
                </div>
                {addon}
            </fieldset>
            {renderError(error)}
        </div>
    );
};

export default DropdownInputTransformer;
