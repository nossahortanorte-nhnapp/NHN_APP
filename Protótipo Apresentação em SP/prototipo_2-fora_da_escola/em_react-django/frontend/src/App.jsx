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

import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/navigation/Nav"
import HomePage from "./pages/HomePage"
import Profile from "./pages/Profile"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ResetPasswordPageConfirm from "./pages/ResetPasswordPageConfirm";
import ActivatePage from "./pages/ActivatePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfileList from "./pages/ProfileList"
import Alimentos from "./pages/PostList";
import PostUpdate from "./pages/PostUpdate";
import PostDetail from "./pages/PostDetail";
import ProfileDetails from "./pages/ProfileDetails";
import CreatePost from "./pages/PostCreate";
import ResetEmailPageConfirm from "./pages/ResetEmailPageConfirm";
import About from "./pages/About";




function App() {
  return (
    <>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/alterar-email/:uid/:token" element={<ResetEmailPageConfirm />} />
          <Route path="/alterar-senha/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="/minhahorta" element={<Profile />} />
          <Route path="/nossashortas" element={<ProfileList />} />
          <Route path="/nossashortas/:id" element={<ProfileDetails />} />
          <Route path="/alimentos" element={<Alimentos />} />
          <Route path="/alimentos/:id" element={<PostDetail />} />
          <Route path="/alimentos/atualizar/:id" element={<PostUpdate />} />
          <Route path="/alimentos/postar/" element={<CreatePost />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      <ToastContainer />
    </>
  )
}

export default App
