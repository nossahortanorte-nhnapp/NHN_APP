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

import React from 'react';
import { Link } from "react-router-dom"
import '../css/about.css';

const About = () => {
    return (
        <div>
            <div className="about-container">
                <h1>Sobre Nós</h1>
                <p>
                A Rede Social "NHN – Nossa Horta Norte" nasceu da necessidade de conectar produtores e consumidores de alimentos orgânicos in natura em comunidades locais. Desenvolvido como parte de uma iniciativa acadêmica no curso de Tecnologia em Ciência de Dados, o objetivo principal desta rede social é facilitar o acesso a alimentos frescos e saudáveis, promovendo a doação, troca e venda desses alimentos entre os usuários.
                </p><br/><p>
                A Rede NHN oferece uma plataforma intuitiva e acessível, onde qualquer pessoa com acesso à internet pode buscar e encontrar alimentos orgânicos disponíveis em sua região. A rede social utiliza tecnologias avançadas, como o framework Django e React, e as linguagens Python e JavaScript, para garantir uma experiência de usuário eficiente e segura. Com a implementação de recursos como localização GPS e integração futura com aplicativos móveis, a NHN se posiciona como uma ferramenta essencial para fortalecer a agricultura sustentável e combater os desertos alimentares.
                </p><br/><p>
                Estamos comprometidos em promover a saúde e o bem-estar das comunidades, incentivando a produção e o consumo de alimentos orgânicos. Além disso, a Rede NHN visa contribuir para vários Objetivos de Desenvolvimento Sustentável da ONU, incluindo Fome Zero, Boa Saúde e Bem-Estar, e Vida Terrestre.
                </p><br/><p>
                Nosso trabalho está em constante evolução, e estamos empolgados com as possibilidades que a Rede NHN pode oferecer tanto para nossa comunidade local quanto para outras comunidades ao redor do mundo.
                </p>
            </div>
            <div className="home_about_buttons">
                <Link to="/login" className="btn btn-secondary">Entrar</Link>
                <Link to="/register" className="btn btn-primary">Inscrever-se</Link>
            </div>
            <br/><br/><br/>
        </div>
    );
};

export default About;
