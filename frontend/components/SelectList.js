"use client"

export default function SelectList (props) {
    return (
        <select id={props.name} name={props.name} className="w-2/3 border-solid border-2 rounded-md select-sm">
            <option value="" className="text-center">--Select an Option--</option>
            {props.items.map((item, index) => (
                <option value={item} className="text-center" key={index}>{item}</option>
            ))}
        </select>
    )
}