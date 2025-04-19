import React from "react";
import { themeColors } from "../../../config";

import Text from "../../Text/Text";
import Icon from "../../Icon/Icon";
import Touchable from "../../Touchable/Touchable";

interface CardButtonProps {
  title: string;
  titleStyle?: React.CSSProperties;
  titleColor?: string;
  icon?: string;
  footerIcon?: string;
  iconColor?: string;
  iconSize?: number;
  footerIconColor?: string;
  disabled?: boolean;
  backgroundColor?: string;
  size?: 'lg' | 'md' | 'sm';
  containerStyle?: React.CSSProperties;
  onClick: () => void;
}
const sizeStyle = {
  sm: {
    containerWidth: 60,
    containerHeight: 60,
    titleSize: 11,
    titleHeight: 45,
    titleWidth: 50,
    footerIconWrapperSize: 20,
    footerIconSize: 18,
    iconSize: 25,
  },
  md: {
    containerWidth: 90,
    containerHeight: 90,
    titleSize: 13,
    titleHeight: 50,
    titleWidth: 70,
    footerIconWrapperSize: 28,
    footerIconSize: 25,
    iconSize: 30,
  },
  lg: {
    containerWidth: 105,
    containerHeight: 105,
    titleSize: 15,
    titleHeight: 52,
    titleWidth: 90,
    footerIconWrapperSize: 36,
    footerIconSize: 32,
    iconSize: 40,
  },
};

const CardButton: React.FC<CardButtonProps> = ({
  title,
  titleStyle,
  icon,
  footerIcon,
  iconColor,
  iconSize,
  footerIconColor,
  titleColor = themeColors.text,
  disabled = false,
  backgroundColor = themeColors.light,
  size = 'md',
  containerStyle,
  onClick,
}) => {

  return (
    <div style={{
      position: "relative",
      width: sizeStyle[size].containerWidth,
      //height: footerIcon ? sizeStyle[size].containerHeight + sizeStyle[size].footerIconWrapperSize / 2 : sizeStyle[size].containerHeight,
      height: footerIcon ? sizeStyle[size].containerHeight + 5 : sizeStyle[size].containerHeight,
      marginBottom: footerIcon ? 25 : 'auto',
      filter: "drop-shadow(0 2px 0 #ccc)",
    }}>
      <Touchable
        style={{
          backgroundColor: backgroundColor,
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          position: "relative",
          width: sizeStyle[size].containerWidth,
          //height: footerIcon ? sizeStyle[size].containerHeight + sizeStyle[size].footerIconWrapperSize / 2 : sizeStyle[size].containerHeight,
          height: footerIcon ? sizeStyle[size].containerHeight + 5 : sizeStyle[size].containerHeight,
          cursor: disabled ? "not-allowed" : "pointer",
          borderRadius: 10,
          ...containerStyle
        }}
        disabled={disabled}
      >

        <a className={`card-button-container`} style={{
          opacity: disabled ? 0.6 : 1,
        }} onClick={() =>
          !disabled && onClick()
        }>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: 5
            }}
          >
            {
              icon && <Icon
                name={icon}
                color={iconColor}
                size={iconSize || sizeStyle[size].iconSize}

              />
            }

            <Text
              style={{
                color: titleColor,
                fontSize: sizeStyle[size].titleSize,
                display: 'block',
                textAlign: 'center',
                lineHeight: 1,
                paddingTop: 5,
                height: sizeStyle[size].titleHeight,
                width: sizeStyle[size].titleWidth,
                //backgroundColor: 'red',
                ...titleStyle
              }}
              content={title}
              maxLines={3}
            />
          </div>



        </a>
      </Touchable>
      {
        footerIcon &&
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          height: sizeStyle[size].footerIconWrapperSize,
          //background: 'red',
          position: 'absolute',
          width: sizeStyle[size].containerWidth,
          bottom: - sizeStyle[size].footerIconWrapperSize / 2
        }}>
          <div style={{
            width: sizeStyle[size].footerIconWrapperSize,
            height: sizeStyle[size].footerIconWrapperSize,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Icon
              name={`${footerIcon}Wrapper`}
              color={backgroundColor}
              size={sizeStyle[size].footerIconWrapperSize}
              style={{
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <Icon
              name={footerIcon}
              color={footerIconColor}
              size={sizeStyle[size].footerIconSize}
              style={{
                position: 'absolute',
                left: (sizeStyle[size].footerIconWrapperSize - sizeStyle[size].footerIconSize) / 2
              }}
            />
          </div>

        </div>
      }
    </div>


  );
};

export default CardButton;
