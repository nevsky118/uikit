import './Button.css';

import { IconComponent, IconPropSize } from '@consta/icons/Icon';
import React, { HTMLProps, useRef } from 'react';

import { Loader } from '##/components/Loader';

import { useForkRef } from '../../hooks/useForkRef/useForkRef';
import { cnMixFocus } from '../../mixs/MixFocus/MixFocus';
import { cn } from '../../utils/bem';
import { getByMap } from '../../utils/getByMap';
import { forwardRefWithAs } from '../../utils/types/PropsWithAsAttributes';
import { usePropsHandler } from '../EventInterceptor/usePropsHandler';

export const buttonPropSize = ['m', 'xs', 's', 'l'] as const;
export type ButtonPropSize = typeof buttonPropSize[number];
export const buttonPropSizeDefault: ButtonPropSize = buttonPropSize[0];

export const buttonPropView = [
  'primary',
  'clear',
  'ghost',
  'secondary',
] as const;
export type ButtonPropView = typeof buttonPropView[number];
export const buttonPropViewDefault: ButtonPropView = buttonPropView[0];

export const buttonPropWidth = ['default', 'full'] as const;
export type ButtonPropWidth = typeof buttonPropWidth[number];
export const buttonPropWidthDefault: ButtonPropWidth = buttonPropWidth[0];

export const buttonPropForm = [
  'default',
  'brick',
  'round',
  'brickRound',
  'roundBrick',
  'brickDefault',
  'defaultBrick',
] as const;

export type ButtonPropForm = typeof buttonPropForm[number];

type GlobalForm =
  | 'default'
  | 'brick'
  | 'round'
  | 'brickRound'
  | 'roundBrick'
  | 'brickDefault'
  | 'defaultBrick'
  | 'defaultClear'
  | 'brickClear'
  | 'roundClear'
  | 'clearRound'
  | 'clearDefault'
  | 'clearBrick'
  | 'clearClear';

const mapStableForm: Record<GlobalForm, ButtonPropForm> = {
  default: 'default',
  defaultClear: 'defaultBrick',
  defaultBrick: 'defaultBrick',
  brick: 'brick',
  brickDefault: 'brickDefault',
  brickClear: 'brick',
  brickRound: 'brickRound',
  round: 'round',
  roundClear: 'roundBrick',
  roundBrick: 'roundBrick',
  clearRound: 'brickRound',
  clearDefault: 'brickDefault',
  clearBrick: 'brick',
  clearClear: 'brick',
};

export const buttonPropFormDefault = buttonPropForm[0];

export type Props = {
  size?: ButtonPropSize;
  view?: ButtonPropView;
  width?: ButtonPropWidth;
  form?: ButtonPropForm;
  tabIndex?: number;
  disabled?: boolean;
  loading?: boolean;
  label?: string | number;
  onClick?: React.EventHandler<React.MouseEvent>;
  iconLeft?: IconComponent;
  iconRight?: IconComponent;
  onlyIcon?: boolean;
  iconSize?: IconPropSize;
  title?: string;
  children?: never;
  type?: 'button' | 'reset' | 'submit';
  formId?: HTMLProps<HTMLButtonElement>['form'];
};

export const COMPONENT_NAME = 'Button' as const;
export const cnButton = cn(COMPONENT_NAME);

const sizeMap: Record<ButtonPropSize, IconPropSize> = {
  xs: 'xs',
  s: 'xs',
  m: 's',
  l: 'm',
};

const sizeMapOnlyIcon: Record<ButtonPropSize, IconPropSize> = {
  xs: 'xs',
  s: 's',
  m: 'm',
  l: 'm',
};

export const Button = forwardRefWithAs<Props, 'button'>((props, ref) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const {
    size = buttonPropSizeDefault,
    view = buttonPropViewDefault,
    width = buttonPropWidthDefault,
    form = buttonPropFormDefault,
    iconLeft,
    iconRight,
    label,
    className,
    onClick,
    disabled,
    loading,
    type = 'button',
    tabIndex,
    as = 'button',
    onlyIcon,
    iconSize: iconSizeProp,
    formId,
    ...otherProps
  } = usePropsHandler(COMPONENT_NAME, props, buttonRef);

  const Tag = as as string;
  const IconOnly = (!label || onlyIcon) && (iconLeft || iconRight);
  const IconLeft = iconLeft;
  const IconRight = iconRight;
  const withIcon = !!iconLeft || !!iconRight;
  const title = props.title || (!!IconOnly && label) || undefined;
  const iconSize = IconOnly
    ? getByMap(sizeMapOnlyIcon, size, iconSizeProp)
    : getByMap(sizeMap, size, iconSizeProp);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <Tag
      {...otherProps}
      onClick={onClick ? handleClick : undefined}
      form={formId}
      type={type}
      className={cnButton(
        {
          size,
          view,
          width,
          form: mapStableForm[form],
          loading,
          disabled,
          withIcon,
          onlyIcon: !!IconOnly,
        },
        [!(disabled || loading) ? cnMixFocus() : undefined, className],
      )}
      disabled={disabled}
      tabIndex={tabIndex}
      title={title}
      ref={useForkRef([ref, buttonRef])}
    >
      {IconOnly && <IconOnly className={cnButton('Icon')} size={iconSize} />}
      {!IconOnly &&
        ((IconLeft || IconRight) && label ? (
          <>
            {IconLeft && (
              <IconLeft
                className={cnButton('Icon', { position: 'left' })}
                size={iconSize}
              />
            )}
            <span className={cnButton('Label')}>{label}</span>
            {IconRight && (
              <IconRight
                className={cnButton('Icon', { position: 'right' })}
                size={iconSize}
              />
            )}
          </>
        ) : (
          label
        ))}
      {loading && (
        <div className={cnButton('Loader')}>
          <Loader size="s" />
        </div>
      )}
    </Tag>
  );
});
