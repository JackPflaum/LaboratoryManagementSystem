import React from 'react';
import { Modal, Button, Label, TextInput, Textarea, Select, Radio, FileInput } from 'flowbite-react';


interface EditSampleModalProps {
    sampleDetails: {};
    showModal: boolean;
    closeModal: () => void;
}

const EditSampleDetailsModal: React.FC<EditSampleModalProps> = ({ sampleDetails, showModal, closeModal}) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        closeModal();
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
                                    value={}
                                    name="jobNumber"
                                    onChange={}
                                    required
                                    disabled-readonly
                                />
                            </div>
                            <div>
                                <Label htmlFor="sampleNumber" value="Sample Number" />
                                <TextInput
                                    id="sampleNumber"
                                    type="text"
                                    value={}
                                    name="sampleNumber"
                                    onChange={}
                                    required
                                    disabled-readonly
                                />
                            </div>
                            <div>
                                <div>
                                    <Label htmlFor="type" value="Select sample type" />
                                </div>
                                <Select id="type" name="type" required>
                                    <option value="solid">Solid</option>
                                    <option value="liquid">Liquid</option>
                                    <option value="gas">Gas</option>
                                </Select>
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Storage Area</legend>
                                    <div>
                                        <Radio id="fridge" name="storage" value="fridge" />
                                        <Label htmlFor="fridge" value="Fridge" />
                                    </div>
                                    <div>
                                        <Radio id="shelf" name="storage" value="shelf" />
                                        <Label htmlFor="shelf" value="Shelf" />
                                    </div>
                                </fieldset>
                            </div>
                            <div>
                                <Label htmlFor="status" value="Status" />
                                <TextInput
                                    id="status"
                                    type="text"
                                    value={}
                                    name="status"
                                    onChange={}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="photo" value="Upload Photo" />
                                <FileInput
                                    id="photo"
                                    value={}
                                    name="photo"
                                    onChange={}
                                    placeholder="A sample photo may be useful for future reference"
                                />
                            </div>
                            <div>
                                <Label htmlFor="comments" value="Comments" />
                                <Textarea
                                    id="comments"
                                    value={}
                                    name="comments"
                                    rows={5}
                                    placeholder=""
                                    onChange={}
                                />
                            </div>
                            <div>
                                <Button type="submit">Save</Button>
                                <Button type="button" onClick={closeModal}>Cancel</Button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
    );
}


export default EditSampleDetailsModal;
