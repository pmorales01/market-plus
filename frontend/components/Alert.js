"use client"

// displays a message (an alert box)
export default  function Alert({message, color}) {
    const errors = message.map((error, index) => (
        <p key={index} className="py-1.5">{error}</p>
    ))

    return (
        <div className={`p-4 border-solid border-2 border-slate-400 ${color}`}>
            {errors}
        </div>
    )
}