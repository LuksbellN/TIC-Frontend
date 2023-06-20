import React, { Component } from "react";
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
  icon: 'exclamation-circle',
  title: 'Ocorrências',
  subtitle: 'Cadastro de ocorrências: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/api';

const initialState = {
  ocorrencia: { nome: '', id_tipo_ocorrencia: '' },
  tiposOcorrencia: [],
  list: [],
  token: ''
}

export default class OcorrenciaCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: 'Bearer ' + token
    }
    axios(baseUrl + '/ocorrencia', {
      headers
    }).then(resp => {
      this.setState({ list: resp.data.data })
    })

    axios(baseUrl + '/ocorrenciatipo', {
      headers
    }).then(resp => {
      this.setState({ tiposOcorrencia: resp.data.data })
    });
  }

  clear() {
    this.setState({ ocorrencia: initialState.ocorrencia });
  }

  async save() {
    const token = localStorage.getItem("token");
    const ocorrencia = this.state.ocorrencia;
    const method = ocorrencia.id !== undefined ? 'patch' : 'post';
    const url = ocorrencia.id !== undefined ? `${baseUrl}/ocorrencia/${ocorrencia.id}` : baseUrl + '/ocorrencia';
    await axios[method](url, ocorrencia, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(async resp => {
        let list;
        if (method === 'post') {
          list = this.getUpdatedList(resp.data.data, true);
        } else {
          list = this.getUpdatedList({ ...ocorrencia, ...resp.data });
        }
        this.setState({ ocorrencia: initialState.ocorrencia, list });
      });
  }

  getUpdatedList(ocorrencia, add = true) {
    const list = this.state.list.filter(o => o.id !== ocorrencia.id);
    if (add) list.unshift(ocorrencia);
    return list;
  }

  updateField(event) {
    const ocorrencia = { ...this.state.ocorrencia };
    ocorrencia[event.target.name] = event.target.value;
    this.setState({ ocorrencia });
  }

  load(ocorrencia) {
    this.setState({ ocorrencia });
  }

  renderForm() {
    const { tiposOcorrencia, ocorrencia } = this.state;

    // Verifica se a lista de tipos de ocorrência está carregada
    if (!tiposOcorrencia) {
      return <div>Carregando...</div>;
    }

    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={ocorrencia.nome}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome..."
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="id_tipo_ocorrencia">Tipo de Ocorrência</label>
              <select
                className="form-control"
                name="id_tipo_ocorrencia"
                value={ocorrencia.id_tipo_ocorrencia}
                onChange={e => this.updateField(e)}
              >
                <option value="">Selecione o tipo de ocorrência</option>
                {tiposOcorrencia.map(tipoOcorrencia => (
                  <option
                    key={tipoOcorrencia.id}
                    value={tipoOcorrencia.id}
                  >
                    {tipoOcorrencia.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary btn-lg" onClick={async e => await this.save(e)}>
              Salvar
            </button>

            <button className="btn btn-secondary btn-lg ml-2" onClick={e => this.clear(e)} style={{ marginLeft: '8px' }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo de Ocorrência</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    if (this.state.list == null) return null;
    const { tiposOcorrencia } = this.state;
    return this.state.list.map(ocorrencia => {
      const tipoOcorrencia = tiposOcorrencia.find(t => t.id === ocorrencia.id_tipo_ocorrencia);
      return (
        <tr key={ocorrencia.id}>
          <td>{ocorrencia.id}</td>
          <td>{ocorrencia.nome}</td>
          <td>{tipoOcorrencia ? tipoOcorrencia.nome : ''}</td>
          <td>
            <button className="btn btn-warning" onClick={() => this.load(ocorrencia)}>
              <i className="fa fa-pencil"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
