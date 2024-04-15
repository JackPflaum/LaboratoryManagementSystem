import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Label, TextInput, Textarea, Select, Radio, FileInput } from 'flowbite-react';


interface EditSampleModalProps {
    editedDetails: {};
    setEditedDetails: {};
    showModal: boolean;
    closeModal: () => void;
    closeModalSave: () => void;
    sampleId: string;
}

const EditSampleDetailsModal: React.FC<EditSampleModalProps> = ({ editedDetails, setEditedDetails, showModal, closeModal, closeModalSave, sampleId}) => {

    const [ localError, setLocalError ] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/api/sample-details/${sampleId}/update-sample-details`, { editedDetails });

            if (response.status === 200) {
                // upon successful update, close modal and save editedDetails to sampleDetails in Sample page.
                closeModalSave();
            }
        } catch (error) {
            console.log('handleSubmit() Error:', error);
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedDetails((prev) => ({
            ...prev,
            [name] : value,
        }));
    }

    // handles checking file size is within limit and adds file to editedDetails state
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPhoto = e.target.file[0];

        // check file size
        const maxSizeBytes = 5 * 1024 * 1024;    // 5MB
        if (selectedPhoto.size > maxSizeBytes ) {
            setLocalError('Image size exceeds the allowable limit of 5MB');
            return;
        }

        setEditedDetails((prev) => {
            ...prev,
            e.target.name: selectedPhoto,
        });
        setLocalError('');
    }


    return (
            <Modal size="xl" show={showModal} onClose={closeModal} >
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <h3>Edit Sample Details</h3>
                        <div>
                            <div>
                                <Label htmlFor="jobNumber" value="Job Number" />
                                <TextInput
                                    id="jobNumber"
                                    type="text"
                                    value={editedDetails.jobNumber}
                                    name="jobNumber"
                                    // onChange={}
                                    required
                                    disabled-readonly
                                />
                            </div>
                            <div>
                                <Label htmlFor="sampleNumber" value="Sample Number" />
                                <TextInput
                                    id="sampleNumber"
                                    type="text"
                                    value={editedDetails.sampleNumber}
                                    name="sampleNumber"
                                    // onChange={}
                                    required
                                    disabled-readonly
                                />
                            </div>
                            <div>
                                <div>
                                    <Label htmlFor="type" value="Select sample type" />
                                </div>
                                <Select id="type" name="type" defaultValue={editedDetails.type} onChange={handleInputChange} required>
                                    <option value="solid">Solid</option>
                                    <option value="liquid">Liquid</option>
                                    <option value="gas">Gas</option>
                                </Select>
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Storage Area</legend>
                                    <div>
                                        <Radio
                                            id="fridge"
                                            name="storage"
                                            value="fridge"
                                            checked={editedSampleDetails.storage === "fridge"}
                                            onChange={handleInputChange} />
                                        <Label htmlFor="fridge" value="Fridge" />
                                    </div>
                                    <div>
                                        <Radio
                                            id="shelf"
                                            name="storage"
                                            value="shelf"
                                            checked={editedSampleDetails.storage === "shelf"}
                                            onChange={handleInputChange} />
                                        <Label htmlFor="shelf" value="Shelf" />
                                    </div>
                                </fieldset>
                            </div>
                            <div>
                                <Label htmlFor="photo" value="Upload Photo" />
                                <FileInput
                                    id="photo"
                                    value={}
                                    name="photo"
                                    accept="image/png image/jpg, image/jpeg"
                                    onChange={handleFileChange}
                                    placeholder="A sample photo may be useful for future reference"
                                />
                            </div>
                            <div>
                                <Label htmlFor="comments" value="Comments" />
                                <Textarea
                                    id="comments"
                                    value={editedDetails.comments}
                                    name="comments"
                                    rows={5}
                                    placeholder="Add any helpful comments..."
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Button type="submit">Save</Button>
                                <Button type="button" onClick={closeModal}>Cancel</Button>
                            </div>
                            { localError && <p>{localError}</p> }
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
    );
}


export default EditSampleDetailsModal;
