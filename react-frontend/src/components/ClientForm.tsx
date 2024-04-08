import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface ClientFormState {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    purchaseOrderNumber: string;
}


const ClientForm: React.FC = () => {
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
            setLocalError('Client email is requiered.');
            return;
        };

        // confirm client doesn't already exist in database
        // const clientExists = confirmClientExists();
        // if (!clientExists) {
        //     setLocalError('Client already exists in the database with that name or email.');
        //     return;
        // }
        
        // handle post request to database
        try {
            const response = await axios.post('http://localhost:8000/api/add-new-client/', {formData: formData});
            
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
            <form>
                <div>
                    <label>Name</label>
                    <input type="text" value={formData.name} name="name" onChange={handleInputChange} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" value={formData.email} name="email" onChange={handleInputChange} />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="text" value={formData.phoneNumber} name="phoneNumber" onChange={handleInputChange} />
                </div>
                <div>
                    <label>Address</label>
                    <input type="text" value={formData.address} name="address" onChange={handleInputChange} />
                </div>
                <div>
                    <label>Purchase Order Number</label>
                    <input type="text" value={formData.purchaseOrderNumber} name="purchaseOrderNumber" onChange={handleInputChange} />
                </div>
                <button type="submit" onClick={handleFormSubmission}>Submit</button>
            </form>
        </>
    )
};

export default ClientForm;