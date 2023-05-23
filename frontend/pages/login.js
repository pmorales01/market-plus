"use client"

import NavBar from '../components/NavBar'

export default function Login () {
    return (
        <>
            <NavBar />
            <form method='post' autoComplete='on' className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Username</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="text" name="username" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label">
                    <span className="label-text">Email</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="email" name="email" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <label className="label">
                    <span className="label-text">Password</span>
                    <span className="label-text-alt text-red-500">Required * </span>
                </label>
                <input type="password" name="password" className="input input-bordered input-sm w-full max-w-xs" required></input>
                <button className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    )
}