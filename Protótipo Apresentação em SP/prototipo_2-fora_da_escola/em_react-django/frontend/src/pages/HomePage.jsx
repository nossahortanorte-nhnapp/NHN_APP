// NHN_APP — Conectando Produtores e Consumidores de Orgânicos In-Natura
// Copyright (C) 2023–2026 Enio Alves Borges & Colaboradores do Projeto NHN_APP
//
// Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo
// sob os termos da Licença Pública Geral GNU Affero (GNU AGPLv3) conforme publicada
// pela Free Software Foundation, versão 3 da Licença.
//
// Este programa é distribuído na expectativa de ser útil, mas SEM QUALQUER
// GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO ou ADEQUAÇÃO A UM
// PROPÓSITO EM PARTICULAR. Veja a Licença Pública Geral GNU Affero para mais detalhes.
//
// Você deve ter recebido uma cópia da Licença Pública Geral GNU Affero junto com
// este programa. Se não, veja <https://www.gnu.org/licenses/>.

import { Link } from "react-router-dom"

function App() {
  return (
    <>
      <div className="container home-page__container">
        <h1 className="main__title">NHN- Nossa Horta Norte</h1>
        <div className="home__buttons">
          <Link to="/login" className="btn btn-secondary">Entrar</Link>
          <Link to="/register" className="btn btn-primary">Inscrever-se</Link>
        </div>
      </div>
    </>
  )
}

export default App
