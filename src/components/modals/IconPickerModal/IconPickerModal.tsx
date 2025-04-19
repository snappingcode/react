
import React, { useState } from 'react'
import Modal from '../../Modal/Modal';
import { themeColors } from '../../../config';
import Header from '../../Header/Header';
import CardButton from '../../buttons/CardButton/CardButton';
import icons from '../../../data/icons';
import SearchBar from '../../SearchBar/SearchBar';
//import FloatingActionButton from '../../buttons/FloatingActionButton/FloatingActionButton';

interface IconPickerModalProps {
    isOpen: boolean;
    onClose: (icon?: any) => void;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconPaths?: any[];
    closeIconSize?: number;
    zIndex?: number;
    id?: string;
    fullScreen?: boolean;
    title?: string;
    subtitle?: string;
    searchBarWidth?: number | string;
    onlyTypes?: string[];
    onlyWith?: string[];
}

const IconPickerModal: React.FC<IconPickerModalProps> = ({
    // Props de Modal
    title = "Seleccionar ícono",
    //subtitle,
    isOpen,
    onClose,
    backdropStyle,
    windowStyle,
    closeButtonStyle,
    closeIcon,
    closeIconPaths,
    closeIconSize,
    zIndex = 99999,
    id,
    fullScreen,
    // onlyTypes = [],
    // onlyWith = [],

}) => {
    const [showIconGrid, setShowIconGrid] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(true);
    // const [items, setItems] = useState(null as any);
    // const itemsRef = useRef(null as any);

    // useEffect(() => {

    // }, [isOpen]);
    // useEffect(() => {
    //     if (JSON.stringify(itemsRef.current) !== JSON.stringify(items)) {
    //         setIsDisabled(false);
    //     } else {
    //         setIsDisabled(true);
    //     }
    // }, [items]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdropStyle={backdropStyle}
            windowStyle={{
                backgroundColor: themeColors.light,
                ...windowStyle
            }}
            closeButtonStyle={closeButtonStyle}
            closeIcon={closeIcon}
            closeIconPaths={closeIconPaths}
            closeIconSize={closeIconSize}
            zIndex={zIndex}
            id={id}
            fullScreen={fullScreen}
            showCloseButton={false}
            onAnimationComplete={() => {
                console.log('Animation complete')
                setShowIconGrid(true);
            }}
        >
            <div
                style={{
                    //overflowY: "auto",
                    width: '100%',
                    height: '100%',
                    paddingTop: 50
                }}
            >
                <Header
                    startSlots={[
                        {
                            type: "title",
                            config: {
                                text: title,
                                style: {

                                    paddingLeft: 10
                                },
                            },
                        },
                    ]}
                    centerSlots={[

                    ]}
                    endSlots={[
                        {
                            type: "iconButton",
                            config: {
                                onClick: onClose,
                                icon: "close",
                                style: {},
                                color: themeColors.text,
                                size: 'md'
                            },
                        },
                    ]}
                    containerStyle={{
                        position: 'fixed',
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        background: '#fff',
                        padding: 0,
                        backgroundColor: themeColors.light
                    }}
                    className="app-header"
                />
                <main style={{
                    padding: "0 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    overflowY: "auto",
                    width: '100%',
                    height: '100%',
                }}>

                    {
                        (isOpen && showIconGrid) ?

                            <>

                                <SearchBar
                                    onChange={(searchValue) => {
                                        console.log(searchValue);
                                    }}
                                    containerStyle={{
                                        width: '100%',
                                        maxWidth: 600,
                                        border: 'none',
                                        backgroundColor: "#fff",
                                        filter: "drop-shadow(0 1.5px 0 #ccc)",
                                        marginTop: 20,
                                        marginBottom: 20,
                                    }}
                                    placeholder='Buscar iconos...'
                                />

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "center",
                                        padding: "10px",
                                        flexWrap: "wrap",
                                        gap: 8,
                                        width: '100%',
                                        // maxWidth: 800
                                        // overflowY: "auto",
                                        // width: '100%',
                                        // height: '100%',
                                    }}
                                >
                                    {
                                        icons.map((item: any, index) => (
                                            <CardButton
                                                key={index}
                                                icon={item.name}
                                                title={item.label}
                                                onClick={() => {
                                                    onClose(item);
                                                }}
                                                size={"lg"}
                                                containerStyle={{
                                                    backgroundColor: "#fff"
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                            </>



                            : <></>
                    }
                </main>
                {/* {
                    !readonly ?
                        <FloatingActionButton
                            disabled={isDisabled}
                            icon='check'
                            size='lg'
                            borderRadius={99}
                            onClick={() => {

                            }}
                        /> : null} */}
            </div >
        </Modal >
    );
};

export default IconPickerModal;