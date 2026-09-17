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

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import '../css/post_create.css';

const mediaRoot = 'http://127.0.0.1:8000/media/';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [doacao, setDoacao] = useState(false);
  const [troca, setTroca] = useState(false);
  const [venda, setVenda] = useState(false);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const cropperRef = useRef(null);

  const navigate = useNavigate();

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.access : null;
    console.log('Token:', token); // Verifique o token
    return token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doacao && !troca && !venda) {
      setErrorMessage('Por favor, marque pelo menos uma opção (Doação, Troca ou Venda).');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('doacao', doacao);
    formData.append('troca', troca);
    formData.append('venda', venda);
    if (croppedImage) formData.append('image', croppedImage, title + '.jpg'); // Forneça um nome de arquivo

    const token = getToken();
    console.log('Token usado na requisição:', token); // Verifique o token sendo usado

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/alimentos/postar/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Não defina manualmente o 'Content-Type'
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Postagem criada com sucesso!');
        setErrorMessage('');
        setTimeout(() => {
          navigate('/minhahorta/');
        }, 1000);
      } else {
        setErrorMessage('Ocorreu um erro ao criar a postagem.');
      }
    } catch (error) {
      console.error('Error response:', error.response); // Log da resposta de erro
      setErrorMessage('Erro ao criar a postagem: ' + (error.response?.data?.detail || error.message));
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas({
      width: 1080,
      height: 1080,
    }).toBlob((blob) => {
      setCroppedImage(blob);
    });
  };

  const rotateImage = () => {
    const cropper = cropperRef.current.cropper;
    cropper.rotate(90);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Postar Alimento</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            required
          />
          <br/><br/>
          <textarea
            className="textarea-description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Descrição"
            required
          />
          <br/><br/>
          <div className="checkbox-container">
            <label>
              <img src={`${mediaRoot}doacao.png`} alt="Doação" style={{ width: '50px', height: '50px' }} />
              Doação <input type="checkbox" checked={doacao} onChange={(e) => setDoacao(e.target.checked)} />
            </label>
            <label>
              <img src={`${mediaRoot}troca.png`} alt="Troca" style={{ width: '50px', height: '50px' }} />
              Troca <input type="checkbox" checked={troca} onChange={(e) => setTroca(e.target.checked)} />
            </label>
            <label>
              <img src={`${mediaRoot}compra.png`} alt="Venda" style={{ width: '50px', height: '50px' }} />
              Venda <input type="checkbox" checked={venda} onChange={(e) => setVenda(e.target.checked)} />
            </label>
          </div>
          <br/>
          <input type="file" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
          {image && (
            <>
              <Cropper
                src={image}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                crop={onCrop}
                ref={cropperRef}
              />
              <button className="btn btn-lg btn-dark" type="button" onClick={rotateImage}>Girar ⤵️</button>
            </>
          )}
          <br/><br/>
          <button className="btn btn-primary" type="submit">Enviar</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
};

export default PostCreate;
