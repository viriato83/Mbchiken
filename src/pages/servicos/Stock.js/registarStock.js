import { useEffect, useState } from "react";
import Conteinner from "../../../components/Container";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Slider from "../../../components/Sider";
import Footer from "../../../components/Footer";
import { useParams } from "react-router-dom";
import mensagem from "../../../components/mensagem";
import repositorioStock from "./Repositorio";

import stock from "./Stock";
import repositorioLote from "../Lotes/Repositorio";

export default function RegistarStock() {
  const [inputs, setInputs] = useState({
    quantidade: "",
    data: "",
    tipo: "",
    valor_un: "",
    lote: "",
  });
  const [mercadorias, setMercadorias] = useState([]);
  const { id } = useParams();
  const msg = new mensagem();
  const repositorio = new repositorioStock();
  const repositorioLot= new repositorioLote();

  const [ativo, setAtivo] = useState("Cadastrar");
  const [desativado, setDesativado] = useState(false);
  const [lotes, setLote] = useState([])

  const criaStock = () => {
    return new stock(inputs.quantidade, inputs.tipo,inputs.valor_un, inputs.data,inputs.lote);
  };

  const validarCampos = () => {
    if (!inputs.quantidade || !inputs.tipo || !inputs.data || !inputs.valor_un ) {
      msg.Erro("Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function carregados(){
      const dados = await repositorioLot.leitura();
      setLote(dados);
    }
    carregados();
  },[])
  const cadastrar = () => {
    try {
      setAtivo("Cadastrando...");
      setDesativado(true);    
        if (id) {
          repositorio.editar(id, criaStock());
          msg.sucesso("Stock editado com sucesso.");
        } else {
          if (!validarCampos()) return;
          repositorio.cadastrar(criaStock());
          msg.sucesso("Stock cadastrado com sucesso.");
          setInputs({ quantidade: "", tipo: "", data: "",valor_un:"" }); // Limpar formulário
          };
        } catch (e) {
          console.error("Erro: " + e.message);
        } finally {
          setDesativado(false); //
    
            setAtivo("Cadastrar");
        }
    }

  return (
    <>
      <Header />
      <Conteinner>
        <Slider />
        <Content>
        <div className="Cadastro">
            <h1>Registo de Estoque</h1>
            <div className="form m-4 was-validated">
              <div className="form-floating m-3">
                <input
                  type="number"
                  value={id ? id : 0}
                  disabled
                  className="id form-control"
                />
                <label className="form-label">ID:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  className="tipo form-control"
                  type="text"
                  required
                  placeholder=""
                  value={inputs.tipo}
                  onChange={(e) =>
                    setInputs({ ...inputs, tipo: e.target.value })
                  }
                />
                <label className="form-label">Tipo:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  type="number"
                  required
                  className="quantidade form-control"
                  placeholder="Quantidade"
                  value={inputs.quantidade}
                  onChange={(e) =>
                    setInputs({ ...inputs, quantidade: e.target.value })
                  }
                />
                <label className="form-label">Quantidade:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  type="date"
                  className="data form-control"
                  placeholder="Data"
                  value={inputs.data}
                  onChange={(e) =>
                    setInputs({ ...inputs, data: e.target.value })
                  }
                />
                <label className="form-label">Data:</label>
              </div>
             
              <div className="form-floating m-3">
                <input
                  type="number"
                  className="data form-control"
                  placeholder="Valor unitario"
                  value={inputs.valor_un}
                  onChange={(e) =>
                    setInputs({ ...inputs, valor_un: e.target.value })
                  }
                />
                <label className="form-label">valor unitário:</label>
              </div>
              <div className="form-floating m-3">
                <select
                  className="form-select"
                  value={inputs.lote}
                  onChange={(e) =>
                    setInputs({ ...inputs, lote: e.target.value })
              
                  }
                >
                  <option value="">Selecione um lote</option>
                  {lotes.map((lote) =>(
                    <option key={lote.idlotes} value={lote.idlotes}>
                      {lote.idlotes}. {lote.nome}
                    </option>
                 ))}
                </select>
                <label className="form-label">Lote:</label>
              </div>
             
              <div className="bt input-group">
                <button
                  onClick={cadastrar}
                  className="btn cadastrar"
                  disabled={desativado}
                >
                  {ativo}
                </button>
              </div>
            </div>
          </div>
        </Content>
      </Conteinner>
      <Footer />
    </>
  );
}
