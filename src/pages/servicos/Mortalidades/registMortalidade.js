import { useEffect, useState, useRef } from "react";
import Container from "../../../components/Container";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Sider from "../../../components/Sider";
import { useParams } from "react-router-dom";
import mensagem from "../../../components/mensagem";
import Footer from "../../../components/Footer";
import { repositorioMortalidade } from "./mortalidadeRepository";
import Mortalidade from "./Mortalidade";
// import repositorioLote from "../Lotes/Repositorio";
import { repositorioProdcao } from "../Producao/producaoRepository";
import { Producao } from "../Producao/Producao";

export default function RegistarMortalidade() {
  const { id } = useParams();
  const [inputs, setInputs] = useState({
    descricao: "",
    quantidade: "",
    data: "",
    idade: "",
    producao: ""
  });
  const [ativo, setAtivo] = useState("Cadastrar");
  const [desativado, setDesativado] = useState(false);
  const [Uproducao, setProducao] = useState([]);

  // Armazena as instâncias de mensagem e repositório de mortalidade de forma estável
  const msgRef = new mensagem();
  const repositorioRef = new repositorioMortalidade();

  const reposi = new repositorioProdcao();
  
  // Executa fetchLotes uma única vez ao montar o componente
  useEffect(() => {
    
      // Função para buscar os producao
      const fetchproducao = async () => {
        try {
          const data = await reposi.leitura(); // Assumindo que leitura() retorna os lotes
          setProducao(data);
        } catch (error) {
          console.error("Erro ao fazer a leitura:", error);
        }
      };
      fetchproducao();

  }, []);
  
  const limparFormulario = () => {
    setInputs({
      quantidade: "",
      descricao: "",
      data: "",
      idade: "",
      producao: "",
    });
  };

  const criaMortalidade = () => {
    return new Mortalidade(
      inputs.descricao,
      inputs.quantidade,
      inputs.data,
      inputs.idade,
      inputs.producao
    );
  };
  let Cadastro =true; //
  const cadastrar =async ()  => {
    try {
        setAtivo("Cadastrando...");
        setDesativado(true);
          if (id) {
            repositorioRef.editar(id, criaMortalidade());
          } else {
            if (!inputs.descricao || !inputs.quantidade || !inputs.data || !inputs.producao) {
              msgRef.current.Erro("Prencha correctamente todos campos");
            } else {
                        // Verificar estoque antes do cadastro
                  const novaProducao = criaProducao();
              
                  if (!Cadastro) {
                    msgRef.current.Erro("Estoque insuficiente.");
                    return;
                  }
        
                try {
                  // Cadastrar venda
                  repositorioRef.cadastrar(criaMortalidade());
            
                  // Atualizar mercadoria com estoque atualizado
                  await reposi.editar(inputs.producao, novaProducao);
            
                    // msg.sucesso("Venda cadastrada com sucesso.");
                  } catch (error) {
                    msgRef.current.Erro(`Erro ao cadastrar venda.`);
                  }finally{
                    limparFormulario();
                  }
                        
            }
          }
      } catch (e) {
      console.error("Erro: " + e.message);
      } finally {
      setDesativado(false); //
      
            setAtivo("Cadastrar");
      }
  };

  const criaProducao = () => {
    let Total = 0; // Inicializa o total
  
    Uproducao.map((prod) => {
    
      if (prod.idproducao == inputs.producao) {
            Total = prod.quantidade_atual - Number(inputs.quantidade);
        // Valida se a quantidade restante é válida
        if (Total <= 0) {
          // window.alert("Quantidade insuficiente em estoque.");
          // Total = 0; // Garante que não seja negativo
            Cadastro=false
      
        }if(Total>0){
          Cadastro=true
        }
      }
      console.log(Total)
    });
  
    // Retorna uma nova instância da mercadoria com o valor correto
    return new Producao(
      "", 
      "",
      Total, 
      0,
      0, // A
      0
    );
  };


  return (
    <>
      <Header />
      <Container>
        <Sider />
        <Content>
          <div className="Cadastro">
            <h1>Registo de Mortalidade</h1>
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
                  className="descricao form-control"
                  type="text"
                  required
                  placeholder=""
                  value={inputs.descricao}
                  onChange={(e) =>
                    setInputs({ ...inputs, descricao: e.target.value })
                  }
                />
                <label className="form-label">Descrição:</label>
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
                  type="number"
                  required
                  className="quantidade form-control"
                  placeholder="Idade"
                  value={inputs.idade}
                  onChange={(e) =>
                    setInputs({ ...inputs, idade: e.target.value })
                  }
                />
                <label className="form-label">Idade Em dias:</label>
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
                  value={inputs.producao}
                  onChange={(e) =>
                    setInputs({ ...inputs, producao: e.target.value })
                  }
                >
                  <option value="">Selecione uma Producao</option>
                  {Uproducao.map((produca) => (
                    <option key={produca.idproducao} value={produca.idproducao}>
                      {produca.idproducao}. {produca.nome}
                    </option>
                  ))}
                </select>
                <label className="form-label">Producao:</label>
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
