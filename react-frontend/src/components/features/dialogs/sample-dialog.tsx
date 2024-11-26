import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFormContext } from "react-hook-form";
import { Storage, Type } from "../../../types/enums";


const SampleDialog = () => {
    const { control } = useFormContext();

    return (
        <>
            <Controller
                name="numberOfSamples"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl>
                        <InputLabel>Number of Samples</InputLabel>
                        <Select
                            label="Number of Samples"
                            {...field}
                            error={!!fieldState.error}
                            size="small"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                )}
            />
            <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl>
                        <InputLabel>Type</InputLabel>
                        <Select
                            label="Type"
                            {...field}
                            error={!!fieldState.error}
                            size="small"
                        >
                            {Object.values(Type).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    </FormControl>
                )}
            />
            <Controller
                name="storage"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl>
                        <InputLabel>Storage</InputLabel>
                        <Select
                            label="Storage"
                            {...field}
                            error={!!fieldState.error}
                            size="small"
                        >
                            {Object.values(Storage).map((storage) => (
                                <MenuItem key={storage} value={storage}>
                                    {storage}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    </FormControl>
                )}
            />
            <Controller
                name="comments"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        label="Comments"
                        multiline
                        rows={5}
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(e);
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        size="small"
                    />
                )}
            />
        </>
    );
};

export default SampleDialog;