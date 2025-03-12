import { useEffect, useState } from "react";
import ClienteRepository from "./ClienteRepository";
import Header from "../../../components/Header";
import Container from "../../../components/Container";
import Sider from "../../../components/Sider";
import Content from "../../../components/Content";
import RegistarClientes from "./Clientes";

import { useNavigate } from "react-router-dom";
// import Modal from "../../../components/modal";
// import modal from "../../../components/modal";
import mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";
import Loading from "../../../components/loading";

import * as XLSX from 'xlsx'; // Importar o XLSX
import Modal from "../../../components/modal";

export default function ClientesView() {
  const repositorio = new ClienteRepository();
  
  const [loading, setLoading] = useState(false);
  const [modelo, setModelo] = useState([]);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  let moda = new Modal();
  let msg = new mensagem();
  
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const dadosModelo = await repositorio.leitura();
        // const dadosTotal = await repositorio.total();
        setModelo(dadosModelo);
        // setTotal(dadosTotal);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Função para exportar os dados para Excel
  const exportarParaExcel = () => {
    const ws = XLSX.utils.json_to_sheet(modelo); // Convertendo os dados para planilha
    const wb = XLSX.utils.book_new(); // Criando o livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Clientes"); // Adicionando a planilha ao livro
    XLSX.writeFile(wb, "clientes.xlsx"); // Gerando o arquivo
  };

  return (
    <>
      {loading && <Loading></Loading>}
      <Header />
      <Container>
        <Sider />
        <Content>
             <h1 className=" t1 m-4">Clientes </h1>
        
          <div className="table">
            <table className="table table-striped table-hover">
              <thead>
                <tr className="tab">
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Localização</th>
                  <th>Telefone</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {modelo.map((elemento, i) => (
                  <tr key={i} className="tr">
                    <td>{elemento.idclientes}</td>
                    <td>{elemento.nome}</td>
                    <td>{elemento.localizacao}</td>
                    <td>{elemento.telefone}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Total</td>
                  <td>{total}</td>
                </tr>
              </tfoot>
            </table>
            <div className="crud input-group d-flex flex-column">
                 <div className="form d-flex"> 
                      <button
                      className="btn bg-warning btn-btn-outline-warning  editar"
                      onClick={() => {
                        if (id) {
                          moda.Abrir("Deseja editar o " + id);
                          document.querySelector(".sim").addEventListener("click", () => {
                            navigate(`/registar-clientes/${id}`);
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
                      className="crudid  form-control mx-2  "
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
              <button onClick={exportarParaExcel} className="btn btn-export btn-primary mt-4">
                Exportar para Excel
              </button>
            </div>
          </div>
        </Content>
      </Container>
      <Footer />
    </>
  );
}
