import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Conteinner from "../../../components/Container";
import Slider from "../../../components/Sider";
import Content from "../../../components/Content";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/modal";
import mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";
import repositorioStock from "./Repositorio";
import Loading from "../../../components/loading";
import * as XLSX from "xlsx"; // Importing the xlsx library

export default function StockView() {
  const repositorio = new repositorioStock();
  const [modelo, setModelo] = useState([]);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState(""); // State for the entered ID
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false); // Loading state
  let moda = new Modal();
  let msg = new mensagem();

  useEffect(() => {
    async function carregarDados() {
      setLoading(true); // Activate loading
      try {
        const dadosModelo = await repositorio.leitura();
        const dadosTotal = await repositorio.total();
        setModelo(dadosModelo);
        setTotal(dadosTotal);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
      } finally {
        setLoading(false); // Deactivate loading
      }
    }
    carregarDados();
  }, []);

  // Function to export data to Excel
  const exportToExcel = () => {
    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(
      modelo.map((item) => ({
        ID: item.idstock,
        Quantidade: item.quantidade,
        Tipo: item.tipo,
        Data: item.data,
        Valor_un: item.valor_un, // Assuming `item.valor_un` exists in your data
        Valor_tot: item.valor_tot, // Assuming `item.valor_tot` exists in your data
        Total: item.total, // Assuming `item.total` exists in your data
      }))
    );
    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    
    // Export the workbook to an Excel file
    XLSX.writeFile(wb, "StockData.xlsx");
  };

  return (
    <>
      {loading && <Loading />}
      <Header />
      <Conteinner>
        <Slider />
        <Content>
        <h1 className=" t1 m-4">Stock </h1>
        <div className="tabela">
           <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Data</th>
                  <th>Valor unitário</th>
                  <th>Valor Total</th>
                  <th>Lote</th>
                </tr>
              </thead>
              <tbody>
                {modelo.map((elemento, i) => (
                  <tr key={i}>
                    <td>{elemento.idstock}</td>
                    <td>{elemento.tipo}</td>
                    <td>{elemento.quantidade}</td>
                    <td>{elemento.data}</td>
                    <td>{elemento.valor_un } MT</td>
                    <td>{elemento.valor_tot.toLocaleString("pt-PT",{minimumFractionDigits:3})} MT</td>
                    <td>{elemento.lotes.nome} </td>
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
                          navigate(`/registar-stock/${id}`);
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
