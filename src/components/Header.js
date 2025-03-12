import { Link } from "react-router-dom";


export default function Header(){
    function Sair(){
        sessionStorage.clear()
        window.location.reload()
    }
    return (
        <header className="container-fluid  d-flex align-items-center justify-content-center border-bottom ">
             <div className="usuario">
            {sessionStorage.getItem("login")}
        </div>
            <div className="container col  logo">
                <img src="lo" alt="Logotipo"></img>
            </div>
            <div className="container header_title col">
                <h1>MB Chicken </h1>
            </div>
            <button className="sair" onClick={(Sair)}>Sair</button>
        </header>
    )
}