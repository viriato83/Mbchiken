import { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header";
import Conteinner from "../../../components/Container";
import Slider from "../../../components/Sider";
import Content from "../../../components/Content";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/modal";
import Mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";
import { repositorioVenda } from "./vendasRepositorio";
import Loading from "../../../components/loading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function VendasView() {
  const repositorio = new repositorioVenda();
  const [modelo, setModelo] = useState([]);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false); // Estado para exibir o loading
  const navigate = useNavigate();

  const msg = useRef(null);
  const moda = useRef(null);

  useEffect(() => {
    msg.current = new Mensagem();
    moda.current = new Modal();

    async function carregarDados() {
      setLoading(true); // Ativa o Loading
      try {
        const dadosModelo = await repositorio.leitura();
        const dadosTotal = await repositorio.total();
        setModelo(dadosModelo);
        setTotal(dadosTotal);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        msg.current.Erro("Erro ao carregar dados.");
      } finally {
        setLoading(false); // Desativa o Loading
      }
    }

    carregarDados();
  }, []);

  const exportarParaExcel = () => {
    const dados = modelo.map((venda) => ({
      ID: venda.idvendas,
      Quantidade: venda.quantidade,
      "Valor Unitário": venda.valor_uni,
      Data: venda.data,
      "Valor Total": venda.valor_total,
      Cliente: venda.cliente.nome,
      "Producao": venda.producao.idproducao
    }));

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendas");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "relatorio_vendas.xlsx");
  };

  return (
    <>
      {loading && <Loading />} {/* Exibe o componente de loading */}
      <Header />
      <Conteinner>
        <Slider />
        <Content>
        <h1 className=" t1 m-4">Vendas </h1>
          <div className="tabela">
          <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Data</th>
                  <th>Valor Total</th>
                  <th>Cliente</th>
                  <th> ID Producao</th>
                </tr>
              </thead>
              <tbody>
                {modelo.map((elemento, i) => (
                  <tr key={i}>
                    <td>{elemento.idvendas}</td>
                    <td>{elemento.quantidade}</td>
                    <td>{elemento.valor_uni.toLocaleString("pt-PT",{minimumFractionDigits:3})} Mt</td>
                    <td>{elemento.data}</td>
                    <td>
                      {elemento.valor_total.toLocaleString("pt-PT", {
                        minimumFractionDigits: 3,
                      })}{" "}
                      Mt
                    </td>
                    <td>{elemento.cliente.nome}</td>
                    <td>
                      {elemento.producao.idproducao}- {elemento.producao.nome}
                    </td>
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
                          navigate(`/registar-venda/${id}`);
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
      </Conteinner>
      <Footer />
    </>
  );
}
