import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from 'flowbite-react';
import SamplesTests from './SampleTests';
import EditSampleDetailsModal from '../components/EditSampleDetailsModal';


interface SampleDetailsState {
    jobNumber: string;
    sampleNumber: string;
    dueDate: string;
    type: string;
    storage: string;
    completed: boolean;
    updated: string;
    photos: string;
    comments: string;
}


const SampleDetails: React.FC = () => {

    // get url parameters i.e. the sample ID
    const urlParams = useParams();
    const sampleId = urlParams.sampleId;

    const [ sampleDetails, setSampleDetails ] = useState<SampleDetailsState>({
        jobNumber: '',
        sampleNumber: '',
        dueDate: '',
        type: '',
        storage: '',
        completed: false,
        updated: '',
        photos: '',
        comments: '',
    });


    useEffect(() => {
        // get sample detail information from backend when page loads
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/sample-details/${sampleId}`);

                // set backend response data to sampleDetails state
                setSampleDetails(response.data);
            } catch (error) {
                console.log('SampleDetails useEffect() Error:', error);
            }            
        }

        fetchData();
    }, []);

    // ------------------------------------------------ Edit Sample Details Modal Functionality -------------------------------------------->

    // handling opening and closing modal to edit sample details
    const [ showModal, setShowModal ] =useState<boolean>(false);

    // create a copy of sampleDetails into editDetails state. Can now edit sample details without overwriting original state.
    const [ editedDetails, setEditedDetails ] = useState<SampleDetailsState>({ ...sampleDetails });

    const handleOpenModal = () => {
        setShowModal(true);
    }

    // close modal and set editedDetails back to original sampleDetails state so any changes aren't saved.
    const handleCloseModal = () => {
        setShowModal(false);
        setEditedDetails({ ...sampleDetails });
    }

    // close modal upon form submission and set sampleDetails to newly edited details.
    const handleCloseModalSave = () => {
        setShowModal(false);
        setSampleDetails({ ...editedDetails });
    }

    return (
        <>
            <h3>Sample Number: {sampleDetails.sampleNumber}</h3>
            <p>Job Number: {sampleDetails.jobNumber}</p>
            <p>Due Date: {sampleDetails.dueDate}</p>
            <p>Type: {sampleDetails.type}</p>
            <p>Storage: {sampleDetails.storage}</p>
            <p>Status: {sampleDetails.completed}</p>
            <p>Updated: {sampleDetails.updated}</p>
            <p>Photos: </p>
            <p>Comments: {sampleDetails.comments}</p>

            <Button type="button" onClick={handleOpenModal}>Edit Details</Button>
            { showModal && 
                <EditSampleDetailsModal
                    editedDetails={editedDetails}
                    setEditedDetails={setEditedDetails}
                    showModal={showModal}
                    closeModal={handleCloseModal}
                    closeModalSave={handleCloseModalSave}
                    sampleId={sampleId} />
            }
            
            <SamplesTests />
        </>
    );
}


export default SampleDetails;

