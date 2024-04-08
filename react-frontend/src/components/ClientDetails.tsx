import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface ClientDetailsState {
    clientName: string;
    email: string;
    phoneNumber: string;
    address: string;
    purchaseOrderNumber: string;
};


const ClientDetails: React.FC = () => {

    const [ clientDetails, setClientDetails ] = useState<ClientDetailsState>('');


    useEffect( async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/clients/${clientId}`);

            setClientDetails(response.data);
        } catch (error) {
            console.log('Client Details useEffect() Error:', error);
        };
    }, []
    );


    return (
        <div>
            <h2>{clientDetails.clientName}</h2>
            <p>Email: {clientDetails.email}</p>
            <p>Phone number: {clientDetails.phoneNumber}</p>
            <p>Address: {clientDetails.address}</p>
            <p>Purchase Order Number: {clientDetails.purchaseOrderNumber}</p>
            <div>
                <label>Search</label>
                <input type="text"/>
            </div>
            <button>Edit Details</button>
        </div>
    );
};


export default ClientDetails;
