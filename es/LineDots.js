var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';
import { motionPropTypes } from '@nivo/core';
import { getLabelGenerator } from '@nivo/core';
import { DotsItem } from '@nivo/core';

const LineDots = ({
    lines,

    symbol,
    size,
    color,
    borderWidth,
    borderColor,

    // labels
    enableLabel,
    label,
    labelFormat,
    labelYOffset,

    // theming
    theme,

    // motion
    animate,
    motionStiffness,
    motionDamping
}) => {
    const getLabel = getLabelGenerator(label, labelFormat);

    const points = lines.reduce((acc, line) => {
        const { id, points } = line;

        return [...acc, ...points.filter(point => point.value !== null).map(point => {
            const pointData = {
                serie: { id },
                x: point.key,
                y: point.value
            };

            return {
                key: `${id}.${point.x}`,
                x: point.x,
                y: point.y,
                fill: color(line),
                stroke: borderColor(line),
                label: enableLabel ? getLabel(pointData) : null
            };
        })];
    }, []);

    if (animate !== true) {
        return React.createElement(
            'g',
            null,
            points.map(point => React.createElement(DotsItem, {
                key: point.key,
                x: point.x,
                y: point.y,
                symbol: symbol,
                size: size,
                color: point.fill,
                borderWidth: borderWidth,
                borderColor: point.stroke,
                label: point.label,
                labelYOffset: labelYOffset,
                theme: theme
            }))
        );
    }
    const springConfig = {
        motionDamping,
        motionStiffness
    };

    return React.createElement(
        TransitionMotion,
        {
            styles: points.map(point => {
                return {
                    key: point.key,
                    data: point,
                    style: {
                        x: spring(point.x, springConfig),
                        y: spring(point.y, springConfig),
                        size: spring(size, springConfig)
                    }
                };
            })
        },
        interpolatedStyles => React.createElement(
            'g',
            null,
            interpolatedStyles.map(({ key, style, data: point }) => React.createElement(DotsItem, _extends({
                key: key
            }, style, {
                symbol: symbol,
                color: point.fill,
                borderWidth: borderWidth,
                borderColor: point.stroke,
                label: point.label,
                labelYOffset: labelYOffset,
                theme: theme
            })))
        )
    );
};

LineDots.propTypes = _extends({
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired
    })),

    symbol: PropTypes.func,
    size: PropTypes.number.isRequired,
    color: PropTypes.func.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.func.isRequired,

    // labels
    enableLabel: PropTypes.bool.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    labelFormat: PropTypes.string,
    labelYOffset: PropTypes.number,

    // theming
    theme: PropTypes.shape({
        dots: PropTypes.shape({
            textColor: PropTypes.string.isRequired,
            fontSize: PropTypes.string.isRequired
        }).isRequired
    }).isRequired

}, motionPropTypes);

LineDots.defaultProps = {
    // labels
    enableLabel: false,
    label: 'y'
};

export default LineDots;