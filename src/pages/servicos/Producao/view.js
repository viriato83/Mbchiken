import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Conteinner from "../../../components/Container";
import Slider from "../../../components/Sider";
import Content from "../../../components/Content";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/modal";
import Mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";
import Loading from "../../../components/loading";
import * as XLSX from "xlsx";  // Import the xlsx library

import { repositorioProdcao } from "./producaoRepository";
import { repositorioMortalidade } from "../Mortalidades/mortalidadeRepository";
import repositorioLote from "../Lotes/Repositorio";


export default function ProducaoView() {
    const repositorio = new repositorioProdcao();
    const repositorioMort = new repositorioMortalidade();
    const repositorioLot = new repositorioLote();
    const [modelo, setModelo] = useState([]);
    const [id, setId] = useState(""); // Estado para o ID digitado
    const navigate = useNavigate();
    const [Mortalidades, setMortalidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const msg = new Mensagem();
    const moda = new Modal();

    const [editInputs, setEditInputs] = useState({});
    const [statusLotes, setStatusLotes] = useState({}); // Estado para armazenar status dos lotes

    
    useEffect(() => {
        async function carregarDados() {
            setLoading(true);
            
            try {
                const dadosModelo = await repositorio.leitura();
                setModelo(dadosModelo);
                const dadosMortalidade = await repositorioMort.total();
                setMortalidades(dadosMortalidade);

                const initialInputs = {};
                const initialStatus = {};

                dadosModelo.forEach((el) => {
                    initialInputs[el.idproducao] = { peso: el.peso, consumo_racao: el.consumo_racao };
                    initialStatus[el.idproducao] = el.status || "Ativo"; // Se não houver status, assume "Ativo"
                });

            
                setEditInputs(initialInputs);
                setStatusLotes(initialStatus);
            } catch (erro) {
                console.error("Erro ao carregar dados:", erro);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    const handleEdit = (id) => {
        const { peso, consumo_racao } = editInputs[id];
        repositorio.editar2(id, peso, consumo_racao);
    };
    const Inativar=async(id,status)=>{
      await  repositorioLot.editar2(id,status,)
    }

    const handleInputChange = (id, field, value) => {
        setEditInputs((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    // Função para terminar a produção
    const handleTerminarProducao = (id) => {
        moda.Abrir(`Tem certeza que deseja terminar a produção do lote ${id}?`);
        document.querySelector(".sim").addEventListener("click", async () => {
             Inativar(id,"Inativo")
            moda.fechar();
        });
        document.querySelector(".nao").addEventListener("click", () => {
            moda.fechar();
        });
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(modelo);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "producao");
        XLSX.writeFile(wb, "producao.xlsx");
    };

    return (
        <>
            {loading && <Loading />}
            <Header />
            <Conteinner>
                <Slider />
                <Content>
                    <h1 className="t1 m-4">Producao</h1>
                    <div className="table">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Data</th>
                                    <th>Dias</th>
                                    <th>Quantidade Atual</th>
                                    <th>Peso</th>
                                    <th>Consumo De Ração</th>
                                    <th>Mortalidades</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {modelo.map((elemento, i) => {
                                   var status="";

                                    if(elemento.lotes.status=="Ativo"){
                                      status="Ativo";
                                    }else{
                                        status="Inativo"
                                    }
{}                                  
                            
                                    const dataAtual = new Date();
                                    const dataProducao = new Date(elemento.data);
                                    const diferencaDias = Math.floor((dataAtual - dataProducao) / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <tr key={i}>
                                            <td>{elemento.idproducao}</td>
                                            <td>{elemento.nome}</td>
                                            <td>{elemento.data}</td>
                                            <td>   <span className={`badge ${diferencaDias>=32 ? "bg-danger" : "bg-success"}`}>
                                                    {diferencaDias}
                                                </span> Dias</td>
                                            <td>{elemento.quantidade_atual}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={editInputs[elemento.idproducao]?.peso || ""}
                                                    onChange={(e) => handleInputChange(elemento.idproducao, "peso", e.target.value)}
                                                    className="form-control edit2"
                                                    disabled={status === "Inativo"}
                                                    />g
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={editInputs[elemento.idproducao]?.consumo_racao || ""}
                                                    onChange={(e) => handleInputChange(elemento.idproducao, "consumo_racao", e.target.value)}
                                                    className="form-control edit2"
                                                    disabled={status === "Inativo"}
                                                />kg
                                            </td>
                                            <td>{elemento.mortalidad.reduce((total, e) => total + e.quantidade, 0)}</td>
                                            <td>
                                                <span className={`badge ${status === "Inativo" ? "bg-danger" : "bg-success"}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        moda.Abrir(`Deseja editar o ${elemento.idproducao}?`);
                                                        document.querySelector(".sim").addEventListener("click", () => {
                                                            handleEdit(elemento.idproducao);
                                                            moda.fechar();
                                                        });
                                                        document.querySelector(".nao").addEventListener("click", () => {
                                                            moda.fechar();
                                                        });
                                                    }}
                                                    className="btn btn-warning"
                                                    disabled={status === "Inativo"}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleTerminarProducao(elemento.lotes.idlotes)}
                                                    className="btn btn-danger mx-2 w-50"
                                                    disabled={status === "Inativo"}
                                                >
                                                    Terminar Produção
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                                  
                        <div className="crud input-group d-flex flex-column">
                            <div className="form d-flex"> 
                            <button
                                className="btn bg-warning btn-btn-outline-warning editar"
                                onClick={() => {
                                if (id) {
                                    moda.Abrir("Deseja editar o " + id);
                                    document.querySelector(".sim").addEventListener("click", () => {
                                    navigate(`/registar-producao/${id}`);
                                    });
                                    document.querySelector(".nao").addEventListener("click", () => {
                                    moda.fechar();
                                    });
                                } else {
                                    msg.Erro("Por favor, digite um ID válido!");
                                }
                                }}
                            >
                                Editar
                            </button>
                            <input
                                type="number"
                                className="crudid form-control mx-2"
                                placeholder="Digite o ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)} 
                            />
                            <button
                                onClick={() => {
                                if (id) {
                                    moda.Abrir("Deseja apagar o " + id);
                                    document.querySelector(".sim").addEventListener("click", () => {
                                    repositorio.deletar(id);
                                    moda.fechar();
                                    });
                                    document.querySelector(".nao").addEventListener("click", () => {
                                    moda.fechar();
                                    });
                                } else {
                                    msg.Erro("Por favor, digite um ID válido!");
                                }
                                }}
                                className="apagar btn bg-danger btn-outline-danger"
                            >
                                Apagar
                            </button>
                            </div>
                            {/* Botão de exportar para Excel */}
                            <button onClick={exportToExcel} className="btn btn-export btn-primary mt-4">
                            Exportar para Excel
                            </button>
                        </div>
                        </div>
                </Content>
            </Conteinner>
            <Footer />
        </>
    );
}
