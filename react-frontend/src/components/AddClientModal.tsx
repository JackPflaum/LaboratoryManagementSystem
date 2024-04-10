import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Label, TextInput } from 'flowbite-react';


interface AddClientModalProps {
    showModal: boolean;
    closeModal: () => void;
}

interface ClientFormState {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    purchaseOrderNumber: string;
}


const AddClientModal: React.FC<AddClientModalProps> = ({showModal, closeModal}) => {
    // formData holds client information from form
    const [ formData, setFormData ] = useState<ClientFormState>({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        purchaseOrderNumber: '',
    });

    // error messages for form validation
    const [ localError, setLocalError ] = useState('');

    // handle page navigation after successful form submission
    const navigate = useNavigate();
    

    // handle submission of form data to backend database
    const handleFormSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        // avoid automatic page refresh
        event.preventDefault;

        //perform form validation. i.e. check required fields are not empty
        if (!formData.name) {
            setLocalError('Client name is required.');
            return;
        };

        if (!formData.email) {
            setLocalError('Client email is required.');
            return;
        };

        // confirm client doesn't already exist in database
        // const clientExists = confirmClientExists();
        // if (clientExists) {
        //     setLocalError('Client already exists in the database with that name or email.');
        //     return;
        // }
        
        // handle post request to database
        try {
            const response = await axios.post('http://localhost:8000/api/add-new-client/', {formData: formData});

            closeModal();

            navigate('/clients');
        } catch (error) {
            console.log('handleFormSubmission Error:', error);
            setLocalError('An error occured whilst submitting data.');
        }
    };


    // check client database doesn't already have client name or email
    const confirmClientExists = async () = {
        try {
            const response = await axios.get(`http://localhost:8000/api/confirm-client-exists/?name=${formData.name}&email${formData.email}`);

            // true means name or email already exists in database
            if (response.data.result === true) {
                return true;
            } else {
                return false;
            };
        } catch (error) {
            console.log('confirmClientExists Error:', error);
            setLocalError('Something went wrong.');
        };
    };
    

    // update formData when user inputs data in form
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => {
            ...prevFormData,
            event.target.name: event.target.value,
        })
    };
    
    
    return (
        <>
            <Modal dismissible size="xl" show={showModal} onClose={CloseModal} >
                <Modal.Header />
                <Modal.Body>
                    <div>
                        <h3>Add New Client</h3>
                        <div>
                            <div>
                                <Label htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    name="name"
                                    onChange={handleInputChange} 
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlfor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="text"
                                    value={formData.email}
                                    name="email"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber" value="Phone Number" />
                                <TextInput
                                    id="phoneNumber"
                                    type="text"
                                    value={formData.phoneNumber}
                                    name="phoneNumber"                            
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="address" value="Address" />
                                <TextInput
                                    id="address"
                                    type="text"
                                    value={formData.address}
                                    name="address"
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="purchaseOrderNumber" value="Purchase Order Number" />
                                <TextInput
                                    id="purchaseOrderNumber"
                                    type="text"
                                    value={formData.purchaseOrderNumber}
                                    name="purchaseOrderNumber"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Button type="submit" onClick={handleFormSubmission}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
};


export default AddClientModal;
