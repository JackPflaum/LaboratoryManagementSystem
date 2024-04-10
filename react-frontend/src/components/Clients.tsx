import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import ClientsTable from '../components/ClientsTable';
import AddClientModal from './AddClientModal';
import { Button } from 'flowbite-react';


const Clients: React.FC = () => {
    const  [ search, setSearch ] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // handles AddClientModal appearing on screen
    const  [ showModal, setShowModal] = useState<boolean>(false);

    const closeModal: () => void = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h2>Clients</h2>
            <div>
                <input type="text" value={search} name="search" onChange={handleSearchChange} placeholder="search" />
                <NavLink to="#">Add Client</NavLink>
                <Button type="button" onClick={() => setShowModal(true)}>Add Client</Button>

                { showModal && <AddClientModal showModal={showModal} closeModal={closeModal} /> }
            </div>
            <ClientsTable />
        </div>
    );
};

export default Clients;
