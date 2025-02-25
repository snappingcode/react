import React, { useState, useEffect } from 'react';
import { RingBinder } from '../RingBinder/RingBinder';
import { httpClient, securedHttpClient } from '../../httpClient';
import Loader from '../Loader/Loader';


interface DigitalArchiveProps {
    apiBaseUrl?: string; // Base URL for the API
    useSecureConnection?: boolean; // Use secure client or not
    endpoint: string; // Endpoint to fetch the list of digital binders
}

const DigitalArchive: React.FC<DigitalArchiveProps> = ({
    apiBaseUrl,
    useSecureConnection = false,
    endpoint,
}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const client = useSecureConnection ? securedHttpClient : httpClient;

                if (apiBaseUrl) {
                    client.setBaseURL(apiBaseUrl);
                }

                const response = await client.get(endpoint);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching digital archive data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiBaseUrl, useSecureConnection, endpoint]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="digital-archive">
            {data.length > 0 ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    {data.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                margin: 5
                            }}
                        >
                            <RingBinder

                                label={item.label || `Binder ${index + 1}`}
                                color={item.color}
                                onClick={() => { }}
                            />
                        </div>

                    ))}
                </div>
            ) : (
                <div>No digital binders found.</div>
            )}
        </div>
    );
};

export default DigitalArchive;
