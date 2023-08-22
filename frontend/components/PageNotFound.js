import NavBar from "/components/NavBar"
export default function PageNotFound () {
    return (
        <div className="flex flex-col items-center space-y-14 w-full h-screen">
            <NavBar/>
            <h1>404 Page Not Found</h1>
            <img className="h-1/3 w-1/3" src="/svgs/face-frown-open.svg"/>
        </div>
    )
}