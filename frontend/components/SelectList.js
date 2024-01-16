"use client"

export default function SelectList (props) {
    return (
        <select id={props.name} name={props.name} className="w-5/6 border-solid border-2 select-sm m-5" style={{'height': '42px'}} required>
            <option value="" className="text-center">--Select {props.name.charAt(0).toUpperCase() + props.name.slice(1)}--</option>
            {props.items.map((item, index) => (
                <option value={item} className="text-center" key={index}>{item}</option>
            ))}
        </select>
    )
}