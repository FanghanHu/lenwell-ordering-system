import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

export default function ControlledTextInput({value, setValue, children}) {
    return (
        <InputGroup>
            <InputGroup.Text>{children}</InputGroup.Text>
            <FormControl
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </InputGroup>
    )
}