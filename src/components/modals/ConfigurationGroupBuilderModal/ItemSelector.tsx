import React, { useEffect, useState } from 'react'
import { themeColors } from '../../../config';
import CardButton from '../../buttons/CardButton/CardButton';

import Loader from '../../Loader/Loader';
import { securedHttpClient } from '../../../httpClient';
import { toKebabCase } from '../../../utils/toKebabCase';
interface ItemSelectorProps {
    containerStyle?: React.CSSProperties;
    apiBaseUrl?: string;
    onItemSelect: (item: any) => void;
    configurationGroup: 'fields' | 'slots' | 'filters' | 'headerActions' | 'listActions' | 'dividerGroups' | 'importCols' | 'exportCols';
}
const ItemSelector: React.FC<ItemSelectorProps> = ({
    containerStyle,
    onItemSelect,
    configurationGroup,
    apiBaseUrl
}) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchData = async () => {
        if (!configurationGroup) return;
        setLoading(true);

        try {
            const client = securedHttpClient;
            if (apiBaseUrl) client.setBaseURL(apiBaseUrl);

            const response = await client.get(`/configuration-types/${toKebabCase(configurationGroup)}`);
            setItems(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div style={{
            padding: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,

            ...containerStyle
        }}>
            {
                loading ? <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40
                }}>
                    <Loader color='primary' />
                </div> : <>
                    {items.map((item, index) => (

                        <CardButton
                            title={item.label}
                            onClick={() => {
                                onItemSelect(item);
                            }}
                            icon={item.icon}
                            iconColor={themeColors.primary}
                            key={index}
                            footerIcon='add'
                            backgroundColor={"#ffffff"}
                            containerStyle={{

                            }}

                        />
                    ))}
                </>
            }


        </div>
    )
}

export default ItemSelector