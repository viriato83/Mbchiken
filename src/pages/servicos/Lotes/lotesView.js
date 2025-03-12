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
import * as XLSX from "xlsx";
import repositorioLote from "./Repositorio";
import repositorioStock from "../Stock.js/Repositorio";

export default function LoteView() {
  const repoStok = new repositorioStock();
  const repositorio = new repositorioLote();
  const [modelo, setModelo] = useState([]);
  const [totalStock, setTotalStock] = useState([]); // Inicializando como array
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const msg = new Mensagem();
  const moda = new Modal();

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const dadosModelo = await repositorio.leitura();
        setModelo(dadosModelo);

        const dadosStok = await repoStok.leitura();

        // Calcular os gastos totais para cada lote
        const totalGastos = dadosModelo.map((elemento) => {
          let tot = 0;
          dadosStok.forEach((e) => {
            if (e.lotes?.idlotes === elemento.idlotes) {
              tot += e.valor_tot;
            }
          });
          return { idlotes: elemento.idlotes, gastoTotal: tot };
        });

        setTotalStock(totalGastos); // Atualiza corretamente como array
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Função para exportar os dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(modelo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lotes");
    XLSX.writeFile(wb, "Lotes.xlsx");
  };

  return (
    <>
      {loading && <Loading />}
      <Header />
      <Conteinner>
        <Slider />
        <Content>
          <h1 className="t1 m-4">Lotes </h1>
          <div className="table">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Data de Inicio</th>
                  <th>Valor unitário</th>
                  <th>Gasto total</th>
                  <th>Status</th>
                  <th>Data de Fim</th>
                </tr>
              </thead>
              <tbody>
                {modelo.map((elemento, i) => {
                  const gastoTotal =
                    totalStock.find((t) => t.idlotes === elemento.idlotes)?.gastoTotal || 0;

                  const gasto_total = elemento.gasto_total + gastoTotal;

                  return (
                    <tr key={i}>
                      <td>{elemento.idlotes}</td>
                      <td>{elemento.nome}</td>
                      <td>{elemento.tipo}</td>
                      <td>{elemento.quantidade}</td>
                      <td>{elemento.data_inicio}</td>
                      <td>{elemento.valor_un} Mt</td>
                      <td>{gasto_total.toLocaleString("pt-PT", { minimumFractionDigits: 3 })} Mt</td>
                      <td>
                        <span
                          className={`badge ${
                            elemento.status === "Inativo" ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {elemento.status}
                        </span>
                      </td>
                      <td>{elemento.data_fim}</td>
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
                        navigate(`/registar-lotes/${id}`);
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
