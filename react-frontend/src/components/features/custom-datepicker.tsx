import { FormControl, FormHelperText, TextField } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { JobAttributes } from "../../types/interfaces";


interface CustomDatePickerProps {
    field: ControllerRenderProps<JobAttributes, "dueDate">;
    fieldState: ControllerFieldState;
    label: string;
};

const CustomDatePicker = ({ field, fieldState, label }: CustomDatePickerProps) => {
    const [click, setClick] = useState<boolean>(false);

    // need to ensure field.value is a valid type for Date(string, number or Date);
    let selectedDate: Date | null = null;

    if (field.value instanceof Date) {
        selectedDate = field.value;  // use directly if already a Date
    } else if (typeof field.value === "string" || typeof field.value === "number") {
        selectedDate = new Date(field.value);   // convert string or number to Date
    }

    return (
        <FormControl
            fullWidth
            variant="outlined"
            size="small"
        >
            <DatePicker
                selected={selectedDate}
                dateFormat="d MMMM, yyyy"
                onChange={(date) => field.onChange(date)}  // This will update the form value
                customInput={
                    <TextField
                        label={label}
                        value={field.value}
                        onClick={() => setClick(true)}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={!!fieldState.error}
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                }
                popperProps={{ strategy: "fixed" }}
            />
            <FormHelperText sx={{ color: "red" }}>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    );
};

export default CustomDatePicker;
