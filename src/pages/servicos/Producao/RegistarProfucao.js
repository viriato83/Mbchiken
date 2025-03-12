import { useEffect, useState, useRef } from "react";
import Container from "../../../components/Container";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Sider from "../../../components/Sider";
import { useParams } from "react-router-dom";
import mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";
import { repositorioProdcao }  from "../Producao/producaoRepository";
import { Producao } from "./Producao";
import repositorioLote from "../Lotes/Repositorio"
export default function RegistaProducao() {
  const { id } = useParams();
  const [inputs, setInputs] = useState({
    nome:"",
    peso: "",
    consumo_racao: "",
    data: "",
    lote: ""
  });
  const [ativo, setAtivo] = useState("Cadastrar");
  const [desativado, setDesativado] = useState(false);
  const [lotes, setLotes] = useState([]);
   var quantidade_atual=0;
  // Armazena as instâncias de mensagem e repositório de mortalidade de forma estável
  const msgRef = new mensagem();
  const repositorioRef = new repositorioProdcao();

  const reposi = new repositorioLote();
  
  // Executa fetchLotes uma única vez ao montar o componente
  useEffect(() => {
    
      // Função para buscar os lotes
      const fetchLotes = async () => {
        try {
          const data = await reposi.leitura(); // Assumindo que leitura() retorna os lotes
          setLotes(data);
        } catch (error) {
          console.error("Erro ao fazer a leitura:", error);
        }
      };
    fetchLotes();
  }, []);

  useEffect(() => {
    if (inputs.lote) {
      const loteSelecionado = lotes.find((lote) => lote.idlotes == inputs.lote);
      if (loteSelecionado) {
        setInputs((prev) => ({ ...prev, nome: "Produção " + loteSelecionado.nome }));
      }
    }
  }, [inputs.lote, lotes]); // Dependências: executa quando `inputs.lote` ou `lotes` mudam
  
  const criaProducao = () => {
 
    return new Producao(
        inputs.nome,
        inputs.data,
        quantidade_atual,
      inputs.peso,
      inputs.consumo_racao?inputs.consumo_racao:0,
      inputs.lote
    );
  };
  const limparFormulario = () => {
    setInputs({
      quantidade: "",
      peso: "",
      data: "",
      lote: "",
      consumo_racao: ""
    });
  };


  const cadastrar = () => {
      try {
        setAtivo("Cadastrando...");
        setDesativado(true);
        if (id) {
            try{
                repositorioRef.editar(id, criaProducao());
                msgRef.sucesso("Editado com sucesso"); 
                 
            } catch(e){
            }
            } else {
            if (!inputs.peso || !inputs.data || !inputs.lote) {
                msgRef.Erro("Prencha correctamente todos campos");
            } else {
                repositorioRef.cadastrar(criaProducao());
                limparFormulario();
            }
            }
          } catch (e) {
            console.error("Erro: " + e.message);
          } finally {
            setDesativado(false); //
         
            
              setAtivo("Cadastrar");
          }
  };

  return (
    <>
      <Header />
      <Container>
        <Sider />
        <Content>
          <div className="Cadastro">
            <h1>Registo de Producao</h1>
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
                  className="Peso form-control"
                  type="number"
                  required
                  placeholder=""
                  value={inputs.peso}
                  onChange={(e) =>
                    setInputs({ ...inputs, peso: e.target.value })
                  }
                />
                <label className="form-label">Peso em gramas:</label>
              </div>
              <div className="form-floating m-3">
                <input
                  type="number"
                  required
                  className="consumo form-control"
                  placeholder="Consumo de racao"
                  value={inputs.quantidade}
                  onChange={(e) =>
                    setInputs({ ...inputs, consumo_racao: e.target.value })
                  }
                />
                <label className="form-label">Consumo de ração Kg</label>
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
      </Container>
      <Footer />
    </>
  );
}
