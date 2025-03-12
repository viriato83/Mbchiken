import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Sider() {
    const [fixOpne, setfixOpne] = useState(window.innerWidth <= 480);
    const [ativo, setAtivo] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setfixOpne(window.innerWidth <= 480);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleDropdown = (menu) => {
        setAtivo(ativo === menu ? null : menu);
    };

    return (
        <>
            <button className={`navbar-toggler ${!fixOpne ? "open" : "close"}`} onClick={() => setfixOpne(!fixOpne)}>
                {fixOpne ? <FiMenu /> : <FiX />}
            </button>
            <nav id="nav" className={`navbar ${fixOpne ? "close" : "open"}`}>
                <ul className="nav-fill">
                    <li id="dashboard" className="nav-item">
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li id="li_lotes" className="nav-item dropdown-toggle" onClick={() => toggleDropdown("lotes")}>Lotes
                        <ul className={`dropdown-menu ${ativo === "lotes" ? "show" : ""}`}>
                            <li className="dropdown-item">
                                <Link to="/lotesview">Lista de Lotes</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/registarlotes">Gerenciar Lotes</Link>
                                </li>
                        </ul>
                    </li>
                    <li id="li_clientes" className="nav-item dropdown-toggle" onClick={() => toggleDropdown("clientes")}>Clientes
                        <ul className={`dropdown-menu ${ativo === "clientes" ? "show" : ""}`}>
                            <li className="dropdown-item"><Link to="/clientesview">Lista de Clientes</Link></li>
                            <li className="dropdown-item">
                                <Link to="/registarclientes">Novo Cliente</Link>
                                </li>
                        </ul>
                    </li>
                    <li id="li_stock" className="nav-item dropdown-toggle" onClick={() => toggleDropdown("stock")}>Stock
                        <ul className={`dropdown-menu ${ativo === "stock" ? "show" : ""}`}>
                            <li className="dropdown-item"><Link to="/stockview">Visualizar Estoque</Link></li>
                            <li className="dropdown-item"><Link to="/registarstock">Adicionar Stock</Link></li>
                        </ul>
                    </li>
                    <li id="li_producao" className="nav-item dropdown-toggle" onClick={() => toggleDropdown("producao")}>Produção
                        <ul className={`dropdown-menu ${ativo === "producao" ? "show" : ""}`}>
                            <li className="dropdown-item"><Link to="/producaoview">Monitorar Producao</Link></li>
                            <li className="dropdown-item"><Link to="/registarProducao">Adicionar novo registo</Link></li>
                        </ul>
                    </li>
                    <li id="li_vendas" className="nav-item dropdown-toggle" onClick={() => toggleDropdown("vendas")}>Vendas
                        <ul className={`dropdown-menu ${ativo === "vendas" ? "show" : ""}`}>
                            <li className="dropdown-item"><Link to="/vendasview">Histórico de Vendas</Link></li>
                            <li className="dropdown-item"><Link to="/registarvendas">Nova Venda</Link></li>
                        </ul>
                    </li>
                    <li id="li_mortalidades" className="nav-item dropdown-toggle" onClick={() => toggleDropdown("mortalidades")}>Mortalidades
                        <ul className={`dropdown-menu ${ativo === "mortalidades" ? "show" : ""}`}>
                            <li className="dropdown-item"><Link to="/registarmordalidade">Registrar Mortalidade</Link></li>
                            <li className="dropdown-item"><Link to="/mordalidadeview">Relatório de Mortalidades</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </>
    );
}
