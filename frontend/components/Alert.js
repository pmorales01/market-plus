"use client"

export default function Alert(props) {
    return (
        <div className={`p-4 border-solid border-2 border-slate-400 bg-${props.color}`}>
            <p>{props.msg}</p>
        </div>
    )
}