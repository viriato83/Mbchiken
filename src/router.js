import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RegistarClientes from "./pages/servicos/Clientes/Clientes";
import Dashboard from "./pages/Dashboard";
import ClientesView from "./pages/servicos/Clientes/ClientesView";
import RegistarMercadoria from "./pages/servicos/Lotes/RegistarLotes";
import RegistarLotes from "./pages/servicos/Lotes/RegistarLotes";
import LoteView from "./pages/servicos/Lotes/lotesView";
import RegistarMortalidade from "./pages/servicos/Mortalidades/registMortalidade";
import MortalidadeView from "./pages/servicos/Mortalidades/mortalidadeView";
import RegistarStock from "./pages/servicos/Stock.js/registarStock";
import StockView from "./pages/servicos/Stock.js/StockView";
import ProducaoView from "./pages/servicos/Producao/view";
import RegistaProducao from "./pages/servicos/Producao/RegistarProfucao";
import VendasView from "./pages/servicos/vendas/VendasView";
import RegistarVenda from "./pages/servicos/vendas/RegistarVendas";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Dashboard/>}>
        </Route>
        <Route path="/registarclientes" element={<RegistarClientes />} />
        <Route path="/clientesview" element={<ClientesView/>}></Route>
        <Route path="/registar-clientes/:id" element={<RegistarClientes />} />

        <Route path="/registarlotes" element={<RegistarLotes />} />
        <Route path="/lotesview" element={<LoteView/>}></Route>
         <Route path="/registar-lotes/:id" element={<RegistarLotes />} />

        <Route path="/registarmordalidade" element={<RegistarMortalidade />} />
        <Route path="/mordalidadeview" element={<MortalidadeView/>}></Route>
         <Route path="/registar-mortalidade/:id" element={<RegistarMortalidade />} />

        <Route path="/registarstock" element={<RegistarStock />} />
        <Route path="/stockview" element={<StockView/>}></Route>
         <Route path="/registar-stock/:id" element={<RegistarStock />} />

        <Route path="/registarproducao" element={<RegistaProducao />} /> 
        <Route path="/producaoview" element={<ProducaoView/>}></Route>
          <Route path="/registar-producao/:id" element={<RegistaProducao />} />

        <Route path="/registarvendas" element={<RegistarVenda />} /> 
        <Route path="/vendasview" element={<VendasView/>}></Route>
          <Route path="/registar-venda/:id" element={<RegistarVenda />} />



      </Routes>
    </Router>
  );
}
